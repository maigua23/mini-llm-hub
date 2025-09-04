from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # you can restrict later (e.g. your Expo URL)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Data model
class ChatRequest(BaseModel):
    prompt: str

# Get Groq API key from environment
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

def query_groq(prompt: str):
    """Query Groq LLM API"""
    if not GROQ_API_KEY:
        raise HTTPException(status_code=500, detail="Missing GROQ_API_KEY in environment")

    url = "https://api.groq.com/openai/v1/chat/completions"

    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }

    payload = {
        "model": "llama-3.1-8b-instant",  
        "messages": [
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": prompt}
        ],
        "max_tokens": 300,
        "temperature": 0.7
    }

    response = requests.post(url, headers=headers, json=payload, timeout=60)

    if response.status_code == 200:
        data = response.json()
        return {"response": data["choices"][0]["message"]["content"]}
    else:
        raise HTTPException(status_code=response.status_code, detail=f"Groq API error: {response.text}")

@app.post("/chat")
def chat(req: ChatRequest):
    try:
        return query_groq(req.prompt)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
def root():
    return {"message": "Groq LLM Backend is running!"}

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "provider": "groq",
        "model": "mixtral-8x7b-32768",
        "token_configured": bool(GROQ_API_KEY)
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
