# Job Search Platform with AI Recommendation System

## Overview

This project is a full-stack job search platform integrated with an AI-based recommendation system. It allows users to explore jobs, apply, and receive intelligent recommendations based on their profile and preferences.

The system is divided into three main services:
- Frontend (React)
- Backend API (Node.js + Express)
- AI Service (Python + FastAPI)

---

## Tech Stack

### Frontend
- React.js
- Redux Toolkit
- Axios
- Vite

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication

### AI Service
- FastAPI
- Python
- NLP-based recommendation logic

---

## Project Structure


job-search-portal/
│
├── frontend/ # React frontend
├── backend/ # Node.js backend API
├── ai-service/ # Python FastAPI AI service
├── start-dev.ps1 # Script to run all services (Windows)
└── README.md



---

## Features

- User authentication (Register/Login)
- Job listing and filtering
- Apply for jobs
- Save jobs functionality
- AI-based job recommendations
- RESTful API architecture
- Modular and scalable backend design

---

## Environment Variables

### Backend (`backend/.env`)


PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
AI_SERVICE_URL=http://localhost:8000


### AI Service (`ai-service/.env`)

PORT=8000


---

## Installation and Setup

### 1. Clone the repository

git clone https://github.com/your-username/your-repo.git

cd job-search-portal


---

### 2. Setup Backend

cd backend
npm install
npm run dev


---

### 3. Setup Frontend

cd frontend
npm install
npm run dev


---

### 4. Setup AI Service

cd ai-service
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000


---

## Running the Application

- Frontend: http://localhost:5173  
- Backend: http://localhost:5000  
- AI Service: http://localhost:8000  

Ensure all three services are running simultaneously.

---

## API Overview

### Auth
- POST `/api/auth/register`
- POST `/api/auth/login`

### Jobs
- GET `/api/jobs`
