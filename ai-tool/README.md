# SJDSF Student Management System - AI Summarizer Tool

Microservice built with **Python 3.10+**, **Flask**, **pandas**, and the **Google Gemini API** to generate automated executive summaries of student performance and attendance from Google Sheets data.

---

## 🚀 Prerequisites

* **Python**: `3.10` or higher (`python3 --version`)
* **pip**: Python package manager
* Google Service Account credentials with read access to Google Sheets
* Google Gemini API Key

---

## ⚙️ Installation & Configuration

### 1. Install Dependencies

```bash
cd ai-tool
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### 2. Environment Variables

Set the following environment variables:

```bash
export PORT=8000
export SPREADSHEET_ID="your_google_sheet_id"
export GOOGLE_CREDENTIALS='{"type": "service_account", ...}'  # JSON string of service account key
export GEMINI_API_KEY="your_gemini_api_key"
export LOG_LEVEL="INFO"
```

---

## 🏃 Running the Service

### Local Run

```bash
python summarizer.py
```

Server will start on `http://localhost:8000`.

### Run with Docker

```bash
docker build -t sjdsf-ai-tool .
docker run -p 8000:8000 \
  -e SPREADSHEET_ID="your_sheet_id" \
  -e GEMINI_API_KEY="your_gemini_key" \
  -e GOOGLE_CREDENTIALS='{...}' \
  sjdsf-ai-tool
```

---

## 📡 API Endpoints

* **`GET /health`** - Service health check
* **`GET /llm_status`** - Verify Google Gemini LLM API connectivity
* **`GET /student_summary?student_name=<name>`** - Retrieve AI-generated analytical summary for a given student
