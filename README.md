# SmartExplorer

**SmartExplorer** is a React Native app with an Express backend that uses OpenAI to provide concise, friendly travel recommendations.  
The app can be accessed on web or mobile devices (Expo/React Native).  
The backend is exposed to the mobile app using **ngrok**.

## Features

- AI-based chatbot for travel and local recommendations.  
- Short, clear responses and follow-up questions.  
- Works on browser and mobile devices.

## Running on Mobile: Quick Start
Backend Setup

1. Install dependencies:

	cd backend
	npm install

2. Create a .env file in /backend with your OpenAI API key:

	OPENAI_API_KEY=sk-xxxxxxx....

3. Start your backend:
	
	node index.js

(Make sure it listens on port 3001.)

## Exposing Backend with ngrok
1. Install ngrok:

Follow the official instructions for your system.

2. Sign up at ngrok.com to get your auth token.

3. Configure the auth token (only once):

	ngrok config add-authtoken <your_auth_token>

4. Expose your backend:

	ngrok http 3001

You must copy your HTTPS forwarding URL from the ngrok output.

# Frontend Setup (Expo/React Native)

1. Edit your frontend code (askOpenAI function) to use your ngrok HTTPS URL:
	
	const backendURL = 'https://your-ngrok-url.ngrok-free.dev/api/openai';

2. Install frontend dependencies:

	cd frontend
	npm install

3. Start Expo with tunnel mode (for mobile connection):

	npx expo start --tunnel

4. Open the app using Expo Go on your physical device, or run on a simulator/emulator.


