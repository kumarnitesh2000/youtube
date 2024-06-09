# imports
import os
from prompts import quiz_generator
from core.generate import LLM

# secrets(api key to access LLM), mention your API key here
# WARN: best practice is to use this from env variable
api_key = "AIzaSyCwv50mSJZaxQKGj3PDjdBNFSWh0ywstUg"

# constants
MODEL = "text-bison-001"
URL = f"https://generativelanguage.googleapis.com/v1beta/models/{MODEL}:generateText?key={api_key}"

# Generate Text
quiz_llm = LLM(URL,quiz_generator.prompt_template)
output = quiz_llm.generate_text("Create a quiz on gemini AI")
print(output)