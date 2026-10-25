package database

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
)

var DB *sql.DB

func ConnectDB() {
	// Load environment variables from .env file
	err := godotenv.Load()
	if err != nil {
		_ = godotenv.Load("../.env")
	}

	// Fetching database credentials from environment variables or DATABASE_URL
	databaseURL := os.Getenv("DATABASE_URL")
	var dsn string

	if databaseURL != "" {
		dsn = databaseURL
	} else {
		host := os.Getenv("DB_HOST")
		user := os.Getenv("DB_USER")
		password := os.Getenv("DB_PASSWORD")
		dbname := os.Getenv("DB_NAME")
		port := os.Getenv("DB_PORT")
		sslmode := os.Getenv("DB_SSLMODE")
		if sslmode == "" {
			sslmode = "disable"
		}

		if host == "" || user == "" || password == "" || dbname == "" || port == "" {
			log.Fatal("❌ Database connection environment variables (DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT) or DATABASE_URL are not set properly")
		}

		dsn = fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=%s", host, user, password, dbname, port, sslmode)

		sslrootcert := os.Getenv("DB_SSLROOTCERT")
		if sslrootcert != "" {
			if _, err := os.Stat(sslrootcert); err == nil {
				dsn += fmt.Sprintf(" sslrootcert=%s", sslrootcert)
			} else {
				log.Printf("⚠️ Specified DB_SSLROOTCERT file %s not found: %v", sslrootcert, err)
			}
		}
	}

	log.Println("ℹ️ Attempting to connect to the database...")

	// Open a new database connection
	db, err := sql.Open("postgres", dsn)
	if err != nil {
		log.Fatalf("❌ Failed to connect to database: %v", err)
	}

	// Test the connection
	if err := db.Ping(); err != nil {
		log.Fatalf("❌ Failed to ping database: %v", err)
	}

	log.Println("✅ Database connection established successfully!")

	DB = db
	log.Println("✅ Database connected successfully!")

	RunMigrations()
}

// RunMigrations ensures new columns and tables exist without breaking existing data
func RunMigrations() {
	if DB == nil {
		return
	}

	migrations := []string{
		// 1. Add parent_pin to student
		`ALTER TABLE student ADD COLUMN IF NOT EXISTS parent_pin VARCHAR(4) DEFAULT '1234'`,
		// 2. Add arrived home columns to attendance
		`ALTER TABLE attendance ADD COLUMN IF NOT EXISTS arrived_home_date_time TIMESTAMPTZ`,
		`ALTER TABLE attendance ADD COLUMN IF NOT EXISTS arrived_home_lat DOUBLE PRECISION`,
		`ALTER TABLE attendance ADD COLUMN IF NOT EXISTS arrived_home_long DOUBLE PRECISION`,
		// 3. Create student_feedback table
		`CREATE TABLE IF NOT EXISTS student_feedback (
			id SERIAL PRIMARY KEY,
			student_id INT NOT NULL REFERENCES student(id) ON DELETE CASCADE,
			feedback_text TEXT NOT NULL,
			submitted_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
		)`,
		`CREATE INDEX IF NOT EXISTS idx_student_feedback_student ON student_feedback(student_id, submitted_at)`,
		// 4. Create student_locations table for 5-minute tracking (30-day retention)
		`CREATE TABLE IF NOT EXISTS student_locations (
			id BIGSERIAL PRIMARY KEY,
			student_id INT NOT NULL REFERENCES student(id) ON DELETE CASCADE,
			latitude DOUBLE PRECISION NOT NULL,
			longitude DOUBLE PRECISION NOT NULL,
			accuracy DOUBLE PRECISION,
			recorded_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
		)`,
		`CREATE INDEX IF NOT EXISTS idx_student_locations_student_time ON student_locations(student_id, recorded_at)`,
	}

	for _, stmt := range migrations {
		if _, err := DB.Exec(stmt); err != nil {
			log.Printf("⚠️ Migration warning: %v (statement: %s)", err, stmt)
		}
	}
	log.Println("✅ Database migrations applied successfully!")
}

// Initialize sets up the database connection
func Initialize(connectionString string) {
	var err error

	DB, err = sql.Open("postgres", connectionString)
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	log.Println("Database connection established")
}
