# 📘 Flashcards — Full‑Stack Spaced Repetition Learning App

A full‑stack flashcard learning platform built with **FastAPI**, **React**, and **PostgreSQL**, designed to help users study more effectively using spaced repetition. The project is fully containerized with **Docker Compose** and includes a complete backend API, a responsive frontend UI, and persistent database storage.

---

## 🚀 Features

### 🧠 Core Functionality
- Create, edit, and delete **decks**
- Add and manage **flashcards**
- Study cards using a spaced‑repetition flow
- Track review history and study progress
- Persistent user data stored in PostgreSQL

### 🛠 Backend (FastAPI)
- RESTful API endpoints for decks, cards, and study sessions
- SQLAlchemy ORM models
- Alembic migrations for schema versioning
- Dependency‑injected database sessions
- Clean modular architecture (`routers/`, `schemas/`, `models/`, `crud/`)

### 🎨 Frontend (React)
- Modern, responsive UI
- Deck and card management pages
- Study session interface
- API integration with Axios/fetch
- Component‑based architecture

### 🐳 Dockerized Infrastructure
- Backend, frontend, and database each run in isolated containers
- Docker Compose orchestrates the full stack
- Hot reload enabled for development
- Persistent Postgres volume

---

## 🧱 Tech Stack

### **Frontend**
- React  
- JavaScript  
- Vite or Create React App  
- Axios  

### **Backend**
- FastAPI  
- Python  
- SQLAlchemy  
- Alembic  

### **Database**
- PostgreSQL  
- pgAdmin (optional)

### **DevOps**
- Docker  
- Docker Compose  

---

## 📂 Project Structure

```code
flashcards/
│
├── backend/
│   ├── app/
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── crud/
│   │   ├── routers/
│   │   ├── db/
│   │   └── main.py
│   ├── migrations/
│   └── Dockerfile
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── Dockerfile
│
├── docker-compose.yml
└── README.md
```

---

## 🐳 Running the Project Locally

### **Prerequisites**
- Docker  
- Docker Compose  

### **Start the full stack**
```bash
docker compose up --build
```

This launches:
- `flashcards-backend` (FastAPI)
- `flashcards-frontend` (React)
- `flashcards-db` (PostgreSQL)

### **Access the app**
- **Frontend:** http://localhost:3000
- **Backend API docs:** http://localhost:8000/docs
- **Database:** localhost:5432 (Postgres)

---

## 🌐 Deployment
You can deploy the project using:

- Frontend: Vercel / Netlify
- Backend: Render / Railway / Fly.io
- Database: Neon / Supabase