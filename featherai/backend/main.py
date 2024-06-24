from fastapi import FastAPI
import uvicorn
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv
from prompts import quiz_generator
from core.generate import LLM
from core.rag import RAG
from fastapi import UploadFile,File

# environment variables from .env file
load_dotenv()

# constants
INDEX_NAME = "test"
LLM_MODEL = "text-bison-001"
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

# create fast api application instance
app = FastAPI()
app.add_middleware(CORSMiddleware,allow_origins=["*"],allow_methods=["*"],allow_headers=["*"],allow_credentials=True)

# request model
class Query(BaseModel):
    user_query: str

# route to generate text using user query as input
@app.post("/generate")
async def generate(query: Query):
    try:
        URL = f"https://generativelanguage.googleapis.com/v1beta/models/{LLM_MODEL}:generateText?key={GOOGLE_API_KEY}"
        rag = RAG(INDEX_NAME)
        knowledge = rag.search(query.user_query)
        quiz_llm = LLM(URL,quiz_generator.prompt_template)
        output = quiz_llm.generate_text(query.user_query,knowledge)
        return output
    except Exception as e:
        return {"error": str(e)}

# upload document to build knowledge base for LLM
@app.post("/upload")
async def upload_document(file:UploadFile = File(...)):
    try:
        # store docoment in local
        file_contents = await file.read()
        with open(file.filename, "wb") as local_file:
            local_file.write(file_contents)
        # split document in chunks , convert in vectors and store in vector db 
        rag = RAG(INDEX_NAME)
        docs = rag.load(file.filename)
        rag.store(docs)
        # delete docoment from local
        os.remove(file.filename)
        return {"message": "Document indexed successfully."}
    except Exception as e:
        return {"error": str(e)}
    

# run a http server on port 8000
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)