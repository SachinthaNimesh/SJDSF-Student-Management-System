-- PostgreSQL Schema for SJDSF Student Management System

-- 1. Supervisor table
CREATE TABLE IF NOT EXISTS supervisor (
    supervisor_id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email_address VARCHAR(255) UNIQUE NOT NULL,
    contact_number VARCHAR(50)
);

-- 2. Employer table
CREATE TABLE IF NOT EXISTS employer (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    contact_number VARCHAR(50),
    address_line1 VARCHAR(255),
    address_line2 VARCHAR(255),
    address_line3 VARCHAR(255),
    addr_long DOUBLE PRECISION DEFAULT 0.0,
    addr_lat DOUBLE PRECISION DEFAULT 0.0
);

-- 3. Student table
CREATE TABLE IF NOT EXISTS student (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    dob DATE,
    gender VARCHAR(20),
    address_line1 VARCHAR(255),
    address_line2 VARCHAR(255),
    city VARCHAR(100),
    contact_number VARCHAR(50),
    contact_number_guardian VARCHAR(50),
    supervisor_id INT REFERENCES supervisor(supervisor_id) ON DELETE SET NULL,
    remarks TEXT,
    home_long DOUBLE PRECISION DEFAULT 0.0,
    home_lat DOUBLE PRECISION DEFAULT 0.0,
    employer_id INT REFERENCES employer(id) ON DELETE SET NULL,
    check_in_time VARCHAR(20),
    check_out_time VARCHAR(20),
    parent_pin VARCHAR(4) DEFAULT '1234'
);

-- 4. Attendance table
CREATE TABLE IF NOT EXISTS attendance (
    id SERIAL PRIMARY KEY,
    student_id INT NOT NULL REFERENCES student(id) ON DELETE CASCADE,
    check_in_lat DOUBLE PRECISION DEFAULT 0.0,
    check_in_long DOUBLE PRECISION DEFAULT 0.0,
    check_in_date_time TIMESTAMPTZ NOT NULL,
    check_out_lat DOUBLE PRECISION,
    check_out_long DOUBLE PRECISION,
    check_out_date_time TIMESTAMPTZ,
    arrived_home_lat DOUBLE PRECISION,
    arrived_home_long DOUBLE PRECISION,
    arrived_home_date_time TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_attendance_student_time ON attendance(student_id, check_in_date_time);

-- 5. Mood table
CREATE TABLE IF NOT EXISTS mood (
    id SERIAL PRIMARY KEY,
    student_id INT NOT NULL REFERENCES student(id) ON DELETE CASCADE,
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    emotion VARCHAR(50) NOT NULL,
    is_daily BOOLEAN DEFAULT TRUE
);

CREATE INDEX IF NOT EXISTS idx_mood_student ON mood(student_id, recorded_at);

-- 6. OTPs table
CREATE TABLE IF NOT EXISTS otps (
    id SERIAL PRIMARY KEY,
    student_id INT NOT NULL REFERENCES student(id) ON DELETE CASCADE,
    otp_code VARCHAR(10) NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    is_used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_otps_code ON otps(otp_code);

-- 7. Authorized Devices table
CREATE TABLE IF NOT EXISTS authorized_devices (
    id SERIAL PRIMARY KEY,
    student_id INT NOT NULL REFERENCES student(id) ON DELETE CASCADE,
    secret_code VARCHAR(255) NOT NULL
);

-- 8. Emergency Contact table
CREATE TABLE IF NOT EXISTS emergency_contact (
    id SERIAL PRIMARY KEY,
    phone_number VARCHAR(50) NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 9. Student Daily Feedback table
CREATE TABLE IF NOT EXISTS student_feedback (
    id SERIAL PRIMARY KEY,
    student_id INT NOT NULL REFERENCES student(id) ON DELETE CASCADE,
    feedback_text TEXT NOT NULL,
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_student_feedback_student ON student_feedback(student_id, submitted_at);

-- 10. Student Location Tracking table (1-month retention)
CREATE TABLE IF NOT EXISTS student_locations (
    id BIGSERIAL PRIMARY KEY,
    student_id INT NOT NULL REFERENCES student(id) ON DELETE CASCADE,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    accuracy DOUBLE PRECISION,
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_student_locations_student_time ON student_locations(student_id, recorded_at);
