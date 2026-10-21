# SJDSF Student Management System

This repository contains the source code for the Web App, Mobile App, AI Summarizer Tool, and Go Backend of the SJDSF Student Management Portal.

## 🏗️ Project Architecture & Documentation

The project consists of four main components. Each sub-project has its own dedicated, detailed documentation:

| Component | Description | Tech Stack | Documentation |
| :--- | :--- | :--- | :--- |
| **`backend`** | RESTful API Server & Database Access | Go 1.20+, Gorilla Mux, PostgreSQL | [Backend README](backend/README.md) |
| **`web-app`** | Administrative & Management Web Dashboard | React 18, Vite, TypeScript, Tailwind CSS | [Web App README](web-app/README.md) |
| **`mobile-app`** | Student Mobile Application (iOS & Android) | React Native, Expo (SDK 53), TypeScript | [Mobile App README](mobile-app/student-management-app/README.md) |
| **`ai-tool`** | Executive Summary Generator Microservice | Python 3.10+, Flask, pandas, Gemini API | [AI Tool README](ai-tool/README.md) |

---

## ⚡ Quick Start: Running All 3 Main Services

### 1. Backend (Go + PostgreSQL)
```bash
cd backend
cp .env.example .env    # Configure your DB credentials in .env

# Optional: Initialize database tables if not done yet
# psql -h localhost -U postgres -d student_management -f database/schema.sql

go mod tidy
go run main.go
```
* Runs on: `http://localhost:8080`
* Full guide: [backend/README.md](backend/README.md)

---

### 2. Web App (React + Vite)
```bash
cd web-app
cp .env.example .env    # Point VITE_API_URL to http://localhost:8080
npm install
npm run dev
```
* Runs on: `http://localhost:5173`
* Full guide: [web-app/README.md](web-app/README.md)

---

### 3. Mobile App (Expo + React Native)
```bash
cd mobile-app/student-management-app
npm install

# In config/config.ts, verify BASE_URL:
# - iOS Simulator: http://localhost:8080
# - Android Emulator: http://10.0.2.2:8080
# - Physical phone via Expo Go: http://<YOUR_MAC_LAN_IP>:8080

npx expo start
```
* Press `i` for iOS simulator, `a` for Android emulator, or scan the QR code with Expo Go on your phone.
* Full guide: [mobile-app/student-management-app/README.md](mobile-app/student-management-app/README.md)

---

### 4. AI Tool (Optional)
```bash
cd ai-tool
pip install -r requirements.txt
python summarizer.py
```
* Runs on: `http://localhost:8000`
* Full guide: [ai-tool/README.md](ai-tool/README.md)

---

## 🔒 Security & Best Practices

- Always store secrets in `.env` files and never commit `.env` to git.
- For local PostgreSQL testing, set `DB_SSLMODE=disable`. For cloud hosted databases, set `DB_SSLMODE=require`.
- When testing the mobile app on a physical device, always use your local Wi-Fi IP address for `BASE_URL` rather than `localhost`.
