# imports
import os
from prompts import quiz_generator
from core.generate import LLM
from core.rag import RAG

# secrets(api key to access LLM) Google AI
google_api_key = "GOOGLE_API_KEY_HERE"
pinecode_api_key = "PINECONE_API_KEY_HERE"

# load and store document in vector database
index_name = "test"
rag = RAG(index_name)
docs = rag.load("./entreprenuership.pdf")
rag.store(docs)

# define user query
USER_QUERY = "Create a quiz on entreprenuership."

# Extract relevant chunks from user_query
knowledge = rag.search(USER_QUERY)

# Generate Text
MODEL = "text-bison-001"
URL = f"https://generativelanguage.googleapis.com/v1beta/models/{MODEL}:generateText?key={google_api_key}"
quiz_llm = LLM(URL,quiz_generator.prompt_template)
output = quiz_llm.generate_text(user_query=USER_QUERY,knowledge=knowledge)
print(output)