# SJDSF Student Management System - Web App

Web dashboard built with **React 18**, **Vite**, **TypeScript**, **Tailwind CSS**, and **Shadcn UI**.

---

## 🚀 Prerequisites

* **Node.js**: `v18.0.0` or higher (`node -v`)
* **npm**: `v9.0.0` or higher

---

## ⚙️ Installation & Configuration

### 1. Install Dependencies

```bash
cd web-app
npm install
```

### 2. Configure Environment Variables

Create your `.env` file from the provided example:

```bash
cp .env.example .env
```

Edit `.env`:

```env
# Backend API Base URL
# For local Go backend running on port 8080:
VITE_API_URL=http://localhost:8080

# For production Azure App Service deployment:
# VITE_API_URL=https://worky-backend-ftc9fbeedke6eaey.southindia-01.azurewebsites.net

# Local Authentication Switch
# Set to 'true' to run locally without Azure AD auth redirects (uses mock Dev/Admin user)
# Set to 'false' when deployed to Azure Static Web Apps with Microsoft Entra ID (Azure AD) authentication
VITE_ENABLE_LOCAL_AUTH=true

# Optional API Key
VITE_API_KEY=

# Google Sheets API Key (Required for Manager Feedback page)
VITE_GOOGLE_SHEET_API_KEY=your_google_sheets_api_key
```

### 🔐 Local Authentication Switch vs Azure AD Mode

* **Local Development (`VITE_ENABLE_LOCAL_AUTH=true` or running on `localhost`)**:
  * Azure AD auth redirects (`/.auth/login/aad`, `/.auth/logout`) are bypassed.
  * The home page shows **"Sign in (Local Dev)"** and signs in immediately as `Local Admin` (`admin@sjdsf.local`).
  * Protected routes automatically grant access without locking developers out.
  * A Vite proxy forwards any `/auth` calls to the local backend.
* **Production Deployment (`VITE_ENABLE_LOCAL_AUTH=false`)**:
  * Uses Azure Static Web Apps native Microsoft Entra ID (Azure AD) authentication via `/.auth/login/aad`.

### 3. Runtime Deployment Configuration (Azure Static Web Apps)

For cloud deployments where environment variables can be injected at runtime without re-bundling, the web app loads [`public/config.js`](public/config.js). The app safely falls back to `import.meta.env` and defaults to the Azure App Service backend if `config.js` is not overridden.

---

## 🏃 Running the Application

### Development Server (with Hot Module Replacement)

```bash
npm run dev
```

* The application will start at:
  👉 **`http://localhost:5173`**

### Production Build

```bash
# Build optimized bundle into dist/
npm run build

# Preview production build locally
npm run preview
```

### Linting

```bash
npm run lint
```

---

## 🧭 Application Pages & Navigation

* **`/`** - Landing page
* **`/dashboard`** - Overview of trainee cards with real-time mood and check-in status
* **`/employee/:id`** - Detailed student profile, attendance history, and recent moods
* **`/student-management`** - CRUD management for students and OTP generation
* **`/supervisor-management`** - Supervisor directory and assignments
* **`/employer-management`** - Employer / company directory and location coordinates
* **`/emergency-contact`** - Emergency contact phone configuration
* **`/manager-feedback`** - Live manager ratings and feedback retrieved from Google Sheets

---

## 🔧 Troubleshooting

* **CORS Preflight Error**:
  * Ensure the Go backend is running and `corsMiddleware` in [`backend/main.go`](../backend/main.go) is active.
* **Network Error / Connection Refused**:
  * Verify that `VITE_API_URL` in `.env` matches the backend host and port (e.g., `http://localhost:8080`).
* **Blank Screen or Config Errors**:
  * Verify that [`public/config.js`](public/config.js) exists and does not throw syntax errors in browser DevTools.
