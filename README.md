Expo + Ollama Mobile LLM App

This project is a mobile app built with Expo
 that connects to a locally running Ollama
 server to run lightweight language models (e.g., Mistral). The goal is to make it possible to interact with an LLM directly from a mobile app, without relying on cloud services.

📦 Setup

Install dependencies

npm install


Start the Expo dev server

npx expo start


Open the app using:

Expo Go
 (quick testing)

Android Emulator / iOS Simulator

Development build

🧠 How it works

Backend: Ollama runs locally (e.g., ollama run mistral) or remotely if hosted online.

Frontend: React Native (via Expo) calls the Ollama API.

Goal: Deploy a simple LLM-powered mobile app for testing and learning.

🔗 Resources

Expo Docs

Ollama Docs
