from fastapi import FastAPI
import uvicorn
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv
from prompts import quiz_generator
from core.generate import LLM

# environment variables from .env file
load_dotenv()

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
        MODEL = "text-bison-001"
        api_key = os.getenv("API_KEY")
        URL = f"https://generativelanguage.googleapis.com/v1beta/models/{MODEL}:generateText?key={api_key}"
        quiz_llm = LLM(URL,quiz_generator.prompt_template)
        output = quiz_llm.generate_text(query.user_query)
        return output
    except Exception as e:
        return {"error": str(e)}

# run a http server on port 8000
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)