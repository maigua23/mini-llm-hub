from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests

app = FastAPI()

# Enable CORS so frontend (web/phone) can reach backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # you can restrict to ["http://localhost:19006"] etc.
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Data model for requests
class ChatRequest(BaseModel):
    prompt: str

# URL of your local Ollama server
OLLAMA_API = "http://localhost:11434/api/generate"

@app.post("/chat")
def chat(req: ChatRequest):
    # Forward request to Ollama
    response = requests.post(
        OLLAMA_API,
        json={
            "model": "mistral",
            "prompt": req.prompt,
            "stream": False,
        }
    )

    return response.json()
