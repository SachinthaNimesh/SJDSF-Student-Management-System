# SJDSF Student Management System - Backend API

RESTful API backend for the SJDSF Student Management Portal built with **Go** and **PostgreSQL**.

---

## 🚀 Prerequisites

1. **Go**: Version `1.20` or higher (`go version`)
2. **PostgreSQL**: A running PostgreSQL instance (local, Docker container, or cloud database such as Aiven or Supabase).

---

## 🗄️ Database Setup

### Option A: Using Docker (Quickest Local Setup)

Run a local PostgreSQL container in your terminal:

```bash
docker run --name sjdsf-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=student_management \
  -p 5432:5432 -d postgres:16-alpine
```

### Option B: Using Local PostgreSQL (Homebrew / Native)

1. Start PostgreSQL:
   ```bash
   brew services start postgresql@16
   ```
2. Create the database:
   ```bash
   createdb student_management
   ```

### Option C: Using a Cloud PostgreSQL Instance (Aiven / Supabase / Neon)

Create a PostgreSQL service in your cloud provider, copy your connection URI or host credentials, and ensure the service status is **Running**.

---

### Initialize Database Tables

Run the included schema script [`database/schema.sql`](database/schema.sql) to create all required tables:

```bash
# If using local/docker psql:
psql -h localhost -U postgres -d student_management -f database/schema.sql
```

*(Or open [`database/schema.sql`](database/schema.sql) and execute the SQL statements in your favorite database GUI like DBeaver, pgAdmin, or your cloud provider's SQL console).*

### Populate Test Data (10 Rows per Table)

To populate 10 sample records for each table (supervisors, employers, students, attendance, moods, OTPs, devices, and emergency contacts), run [`database/seed.sql`](database/seed.sql):

```bash
# If using local/docker psql:
psql -h localhost -U postgres -d student_management -f database/seed.sql
```

*Note: The seeded students (IDs 1 through 10) have active test OTPs `1001` through `1010` configured so you can immediately test mobile app and dashboard OTP verification.*

---

## ⚙️ Environment Configuration

Copy the example environment file:

```bash
cd backend
cp .env.example .env
```

Open `.env` and fill in your connection details:

```env
PORT=8080

# Authentication Mode
# 'local': Bypasses Azure AD auth, provides mock /auth/userinfo & /auth/login for local dev
# 'azure': For production Choreo/Azure AD deployment
AUTH_MODE=local

# --- Option 1: Full Database URL ---
# DATABASE_URL=postgres://postgres:password@localhost:5432/student_management?sslmode=disable

# --- Option 2: Individual DB Parameters ---
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=student_management
DB_SSLMODE=disable

# Optional Keys
GOOGLE_MAPS_API_KEY=your_google_maps_key
GOOGLE_SHEET_API_KEY=your_google_sheets_key
GOOGLE_SHEET_ID=1LmvPIp-Ixdvur80OKFQ7Dm31QB1KpjOZDAstUWLkK-o
```

### Common Database Troubleshooting

* **`dial tcp: lookup <hostname>: no such host`**:
  * The database host in your `.env` cannot be resolved by DNS.
  * Check for typos in `DB_HOST`.
  * If using cloud providers (e.g. Aiven), verify that your project is not paused or terminated, or change `DB_HOST=localhost` to connect locally.
* **`sslmode` issues**:
  * For local PostgreSQL, always set `DB_SSLMODE=disable`.
  * For cloud providers requiring SSL without certificate pinning, set `DB_SSLMODE=require`.

---

## 🏃 Running the Backend

### Local Development

```bash
cd backend
go mod tidy
go run main.go
```

Output:
```text
ℹ️ Attempting to connect to the database...
✅ Database connection established successfully!
Server started on port 8080
```

### Build Binary

```bash
go build -o server .
./server
```

### Run with Docker

```bash
docker build -t sjdsf-backend .
docker run -p 8080:8080 --env-file .env sjdsf-backend
```

---

## 📡 API Endpoints Reference

| Method | Endpoint | Description | Headers / Params |
| :--- | :--- | :--- | :--- |
| `GET` | `/dashboard` | Fetch student cards with latest mood & attendance | None |
| `GET` | `/get-students` | List all students | None |
| `GET` | `/get-student` | Get single student details | `student-id: <id>` |
| `POST` | `/create-employee` | Create a new student | JSON Body |
| `PUT` | `/update-employee` | Update student profile | `student-id: <id>`, JSON Body |
| `DELETE` | `/delete-employee` | Delete student | `student-id: <id>` |
| `GET` | `/trainee-profile` | Get student profile, recent moods & attendance | `student-id: <id>` |
| `GET` | `/employee-summary` | Get student attendance history & moods | `student-id: <id>` |
| `POST` | `/attendance` | Record student check-in or check-out | `student-id: <id>`, JSON Body |
| `POST` | `/validate-attendance` | Calculate scheduled vs actual time difference | `student-id: <id>`, JSON Body |
| `POST` | `/validate-location` | Validate student coordinates vs employer location | `student-id: <id>` |
| `GET` | `/get-mood` | List all moods | None |
| `POST` | `/post-mood` | Record a mood entry | `student-id: <id>`, JSON Body |
| `POST` | `/generate-otp` | Generate a 4-digit OTP for student | `student-id: <id>` |
| `POST` | `/validate-otp` | Validate entered OTP code | `otp-code: <code>` |
| `GET` | `/get-supervisors` | List supervisors | None |
| `POST` | `/create-supervisor` | Create a supervisor | JSON Body |
| `GET` | `/get-employers` | List all employers | None |
| `POST` | `/create-employer` | Create an employer | JSON Body |
| `GET` | `/manager-feedback` | Fetch manager feedback responses from Google Sheets | None |
| `GET` | `/get-emergency-contact` | Fetch primary emergency contact number | None |
| `POST` | `/update-emergency-contact` | Update emergency contact number | JSON Body |
