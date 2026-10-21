# SJDSF Student Management System

This repository contains the source code for the Web App, Mobile App, AI Summarizer Tool, and Go Backend of the SJDSF Student Management Portal.

## 🏗️ Project Structure

The project consists of four main components:

- **`backend`** - RESTful API server built with Go (Gorilla Mux + PostgreSQL)
- **`web-app`** - Web dashboard built with React 18, Vite, TypeScript, Tailwind CSS, and Shadcn UI
- **`mobile-app/student-management-app`** - Mobile application built with React Native and Expo (iOS & Android)
- **`ai-tool`** - Microservice built with Python (Flask, pandas, Google Sheets & Gemini API)

---

## 🔧 Backend Setup

### Prerequisites

- Go 1.20+
- PostgreSQL database

### Getting Started

```bash
cd backend
cp .env.example .env   # Update database credentials in .env
go mod download
go run main.go
```

The server will start on `http://localhost:8080` (or `PORT` configured in `.env`).

---

## 🌐 Web App Setup

### Prerequisites

- Node.js 18+ and npm

### Getting Started

```bash
cd web-app
cp .env.example .env   # Configure API URLs
npm install
npm run dev
```

The application will be available at `http://localhost:5173`.

### Production Build

```bash
npm run build
npm run preview
```

---

## 📱 Mobile App Setup

### Prerequisites

- Node.js 18+
- Expo CLI (`npm install -g @expo/cli`)

### Getting Started

```bash
cd mobile-app/student-management-app
npm install
npx expo start
```

### Health Check

```bash
npx expo-doctor
```

### Configuration

Update `mobile-app/student-management-app/config/config.ts` with your backend `BASE_URL`.

---

## 🤖 AI Tool Setup

### Prerequisites

- Python 3.10+

### Getting Started

```bash
cd ai-tool
pip install -r requirements.txt
python summarizer.py
```

---

## 🔒 Security & Best Practices

- Always store secrets in `.env` files and never commit them to git.
- Use environment variables for API keys, database credentials, and external service URLs.
- Ensure proper CORS configurations match your frontend origins in production.
