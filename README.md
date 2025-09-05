Mini LLM Hub (Development)

This project is a mobile + web app built with Expo (React Native) and a FastAPI backend.
Its goal is to serve as a hub for multiple LLMs (starting with Groq-hosted models, but extensible to others).

Getting Started
Backend
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
python main.py


Environment variables are required (.env file in backend/):

GROQ_API_KEY=your_api_key_here

Frontend
npm install
npx expo start 


Open with Expo Go, iOS Simulator, or Android Emulator.

Notes

Backend: FastAPI with CORS enabled for mobile/web.

Models: Currently using models from Groq.

Frontend communicates via REST to the backend.

App is designed to be extended with multiple LLMs under one hub.