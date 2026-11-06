package controllers

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"server/database"
)

// TableNames lists the 10 system tables
var TableNames = []string{
	"supervisor",
	"employer",
	"student",
	"attendance",
	"mood",
	"otps",
	"authorized_devices",
	"emergency_contact",
	"student_feedback",
	"student_locations",
}

// GetTableCounts queries and returns the row count for all 10 tables
func GetTableCounts(db *sql.DB) (map[string]int, error) {
	counts := make(map[string]int)
	for _, table := range TableNames {
		var count int
		query := fmt.Sprintf("SELECT COUNT(*) FROM %s", table)
		if err := db.QueryRow(query).Scan(&count); err != nil {
			log.Printf("⚠️ Error counting rows in table %s: %v", table, err)
			counts[table] = -1
		} else {
			counts[table] = count
		}
	}
	return counts, nil
}

// ExecuteSeedData truncates and populates all 10 tables with 10 records each
func ExecuteSeedData(db *sql.DB) error {
	if db == nil {
		return fmt.Errorf("database connection is nil")
	}

	tx, err := db.Begin()
	if err != nil {
		return fmt.Errorf("failed to begin transaction: %w", err)
	}
	defer tx.Rollback()

	statements := []string{
		// Clean existing data
		`TRUNCATE TABLE student_locations, student_feedback, attendance, mood, otps, authorized_devices, student, employer, supervisor, emergency_contact RESTART IDENTITY CASCADE`,

		// 1. 10 Supervisors
		`INSERT INTO supervisor (supervisor_id, first_name, last_name, email_address, contact_number) VALUES
		(1, 'Nimal', 'Perera', 'nimal.perera@sjdsf.lk', '+94 77 123 4567'),
		(2, 'Kamal', 'Silva', 'kamal.silva@sjdsf.lk', '+94 71 234 5678'),
		(3, 'Sunil', 'Fernando', 'sunil.fernando@sjdsf.lk', '+94 76 345 6789'),
		(4, 'Anura', 'Jayawardena', 'anura.j@sjdsf.lk', '+94 75 456 7890'),
		(5, 'Dilani', 'Gunasekara', 'dilani.g@sjdsf.lk', '+94 78 567 8901'),
		(6, 'Mahesh', 'Bandara', 'mahesh.b@sjdsf.lk', '+94 72 678 9012'),
		(7, 'Chathuri', 'Ranasinghe', 'chathuri.r@sjdsf.lk', '+94 70 789 0123'),
		(8, 'Kasun', 'Dissanayake', 'kasun.d@sjdsf.lk', '+94 77 890 1234'),
		(9, 'Priyanka', 'Wijesinghe', 'priyanka.w@sjdsf.lk', '+94 71 901 2345'),
		(10, 'Nuwan', 'Kulasekara', 'nuwan.k@sjdsf.lk', '+94 76 012 3456')`,
		`SELECT setval('supervisor_supervisor_id_seq', (SELECT MAX(supervisor_id) FROM supervisor))`,

		// 2. 10 Employers
		`INSERT INTO employer (id, name, contact_number, address_line1, address_line2, address_line3, addr_long, addr_lat) VALUES
		(1, 'Dialog Axiata PLC', '+94 11 710 0100', '475 Union Place', 'Slave Island', 'Colombo 02', 79.8596, 6.9184),
		(2, 'WSO2 Lanka', '+94 11 214 5345', 'No. 20, Palm Grove', 'Colpetty', 'Colombo 03', 79.8529, 6.9015),
		(3, 'MAS Holdings', '+94 11 472 7222', '10th Floor, Aitken Spence Tower II', '315 Vauxhall St', 'Colombo 02', 79.8560, 6.9210),
		(4, 'Brandix Apparel', '+94 11 472 7000', '25 Rheinland Place', 'Kollupitiya', 'Colombo 03', 79.8517, 6.9056),
		(5, 'Virtusa Pvt Ltd', '+94 11 460 5500', '752 Dr Danister De Silva Mawatha', 'Dematagoda', 'Colombo 09', 79.8821, 6.9385),
		(6, 'IFS R&D International', '+94 11 236 4400', '501 Galle Road', 'Wellawatte', 'Colombo 06', 79.8601, 6.8772),
		(7, 'John Keells Holdings', '+94 11 230 6000', '117 Sir Chittampalam A Gardiner Mawatha', 'Fort', 'Colombo 02', 79.8504, 6.9319),
		(8, 'Commercial Bank of Ceylon', '+94 11 248 6000', 'Commercial House', '21 Sir Razik Fareed Mawatha', 'Colombo 01', 79.8450, 6.9360),
		(9, 'PickMe (Digital Mobility)', '+94 11 450 7500', 'No. 309, High Level Road', 'Nugegoda', 'Colombo', 79.8978, 6.8654),
		(10, 'Hayleys PLC', '+94 11 262 7000', 'No. 400, Deans Road', 'Maradana', 'Colombo 10', 79.8690, 6.9247)`,
		`SELECT setval('employer_id_seq', (SELECT MAX(id) FROM employer))`,

		// 3. 10 Students
		`INSERT INTO student (id, first_name, last_name, dob, gender, address_line1, address_line2, city, contact_number, contact_number_guardian, supervisor_id, remarks, home_long, home_lat, employer_id, check_in_time, check_out_time, parent_pin) VALUES
		(1, 'Avantha', 'Fernando', '2001-04-12', 'Male', '14/2 Temple Road', 'Maharagama', 'Colombo', '+94 77 111 2233', '+94 77 999 1122', 1, 'Punctual and keen to learn backend development', 79.9245, 6.8480, 1, '08:30', '17:00', '1234'),
		(2, 'Oshadi', 'Perera', '2002-08-25', 'Female', '45 Station Road', 'Dehiwala', 'Colombo', '+94 71 222 3344', '+94 71 888 2233', 2, 'Excels in UI/UX tasks; highly active in team discussions', 79.8672, 6.8510, 2, '09:00', '17:30', '2234'),
		(3, 'Sahan', 'Wickramasinghe', '2000-11-03', 'Male', '89 Kandy Road', 'Kelaniya', 'Gampaha', '+94 76 333 4455', '+94 76 777 3344', 3, 'Solid grasp of data structures and cloud platforms', 79.9180, 6.9740, 3, '08:30', '17:00', '1234'),
		(4, 'Tharushi', 'Jayakody', '2003-01-19', 'Female', '12 Lake Drive', 'Rajagiriya', 'Colombo', '+94 75 444 5566', '+94 75 666 4455', 4, 'Great communication; completed onboarding project ahead of schedule', 79.8940, 6.9110, 4, '08:45', '17:15', '4321'),
		(5, 'Dinuka', 'Mendis', '2001-06-30', 'Male', '67 Galle Road', 'Moratuwa', 'Colombo', '+94 78 555 6677', '+94 78 555 5566', 5, 'Consistently shows high initiative in customer support engineering', 79.8820, 6.7730, 5, '09:00', '17:30', '5678'),
		(6, 'Nadeesha', 'Alwis', '2002-03-14', 'Female', '23 School Lane', 'Nugegoda', 'Colombo', '+94 72 666 7788', '+94 72 444 6677', 6, 'Diligent worker with strong analytical capabilities', 79.8970, 6.8650, 6, '08:30', '17:00', '1111'),
		(7, 'Isuru', 'Rathnayake', '2000-09-08', 'Male', '101 Negombo Road', 'Ja-Ela', 'Gampaha', '+94 70 777 8899', '+94 70 333 7788', 7, 'Adapting well to modern mobile application stack', 79.8920, 7.0760, 7, '08:30', '17:00', '2222'),
		(8, 'Kavindi', 'Gamage', '2002-12-05', 'Female', '56 Beach Road', 'Mount Lavinia', 'Colombo', '+94 77 888 9900', '+94 77 222 8899', 8, 'Shows great interest in quality assurance and automated testing', 79.8630, 6.8380, 8, '09:00', '17:30', '3333'),
		(9, 'Bhanuka', 'Senanayake', '2001-07-22', 'Male', '34 Flower Road', 'Cinnamon Gardens', 'Colombo 07', '+94 71 999 0011', '+94 71 111 9900', 9, 'Demonstrates quick problem-solving skills in network administration', 79.8610, 6.9060, 9, '08:30', '17:00', '4444'),
		(10, 'Sachini', 'Herath', '2003-05-18', 'Female', '78 Hospital Road', 'Battaramulla', 'Colombo', '+94 76 000 1122', '+94 76 000 0011', 10, 'Dependable and dedicated; eager to improve software engineering skills', 79.9190, 6.8990, 10, '08:45', '17:15', '5555')`,
		`SELECT setval('student_id_seq', (SELECT MAX(id) FROM student))`,

		// 4. 10 Attendance records
		`INSERT INTO attendance (id, student_id, check_in_lat, check_in_long, check_in_date_time, check_out_lat, check_out_long, check_out_date_time, arrived_home_lat, arrived_home_long, arrived_home_date_time) VALUES
		(1, 1, 6.9184, 79.8596, CURRENT_TIMESTAMP - INTERVAL '7 hours', 6.9184, 79.8596, CURRENT_TIMESTAMP - INTERVAL '1 hour', 6.8480, 79.9245, CURRENT_TIMESTAMP - INTERVAL '30 minutes'),
		(2, 2, 6.9015, 79.8529, CURRENT_TIMESTAMP - INTERVAL '6 hours', 6.9015, 79.8529, CURRENT_TIMESTAMP - INTERVAL '30 minutes', 6.8510, 79.8672, CURRENT_TIMESTAMP - INTERVAL '10 minutes'),
		(3, 3, 6.9210, 79.8560, CURRENT_TIMESTAMP - INTERVAL '8 hours', 6.9210, 79.8560, CURRENT_TIMESTAMP - INTERVAL '2 hours', 6.9740, 79.9180, CURRENT_TIMESTAMP - INTERVAL '1 hour'),
		(4, 4, 6.9056, 79.8517, CURRENT_TIMESTAMP - INTERVAL '7 hours', 6.9056, 79.8517, NULL, NULL, NULL, NULL),
		(5, 5, 6.9385, 79.8821, CURRENT_TIMESTAMP - INTERVAL '6 hours', 6.9385, 79.8821, CURRENT_TIMESTAMP - INTERVAL '15 minutes', 6.7730, 79.8820, CURRENT_TIMESTAMP - INTERVAL '5 minutes'),
		(6, 6, 6.8772, 79.8601, CURRENT_TIMESTAMP - INTERVAL '7 hours 30 minutes', 6.8772, 79.8601, CURRENT_TIMESTAMP - INTERVAL '1 hour', 6.8650, 79.8970, CURRENT_TIMESTAMP - INTERVAL '20 minutes'),
		(7, 7, 6.9319, 79.8504, CURRENT_TIMESTAMP - INTERVAL '8 hours', 6.9319, 79.8504, NULL, NULL, NULL, NULL),
		(8, 8, 6.9360, 79.8450, CURRENT_TIMESTAMP - INTERVAL '6 hours', 6.9360, 79.8450, CURRENT_TIMESTAMP - INTERVAL '45 minutes', 6.8380, 79.8630, CURRENT_TIMESTAMP - INTERVAL '15 minutes'),
		(9, 9, 6.8654, 79.8978, CURRENT_TIMESTAMP - INTERVAL '7 hours', 6.8654, 79.8978, CURRENT_TIMESTAMP - INTERVAL '2 hours', 6.9060, 79.8610, CURRENT_TIMESTAMP - INTERVAL '1 hour 15 minutes'),
		(10, 10, 6.9247, 79.8690, CURRENT_TIMESTAMP - INTERVAL '7 hours 15 minutes', 6.9247, 79.8690, NULL, NULL, NULL, NULL)`,
		`SELECT setval('attendance_id_seq', (SELECT MAX(id) FROM attendance))`,

		// 5. 10 Mood records
		`INSERT INTO mood (id, student_id, recorded_at, emotion, is_daily) VALUES
		(1, 1, CURRENT_TIMESTAMP - INTERVAL '6 hours', 'Happy', true),
		(2, 2, CURRENT_TIMESTAMP - INTERVAL '5 hours', 'Happy', true),
		(3, 3, CURRENT_TIMESTAMP - INTERVAL '6 hours', 'Neutral', true),
		(4, 4, CURRENT_TIMESTAMP - INTERVAL '7 hours', 'Happy', true),
		(5, 5, CURRENT_TIMESTAMP - INTERVAL '4 hours', 'Neutral', true),
		(6, 6, CURRENT_TIMESTAMP - INTERVAL '6 hours', 'Sad', true),
		(7, 7, CURRENT_TIMESTAMP - INTERVAL '5 hours', 'Happy', true),
		(8, 8, CURRENT_TIMESTAMP - INTERVAL '4 hours', 'Neutral', true),
		(9, 9, CURRENT_TIMESTAMP - INTERVAL '5 hours', 'Happy', true),
		(10, 10, CURRENT_TIMESTAMP - INTERVAL '6 hours', 'Neutral', true)`,
		`SELECT setval('mood_id_seq', (SELECT MAX(id) FROM mood))`,

		// 6. 10 Active OTPs
		`INSERT INTO otps (id, student_id, otp_code, expires_at, is_used, created_at) VALUES
		(1, 1, '1001', CURRENT_TIMESTAMP + INTERVAL '30 days', false, CURRENT_TIMESTAMP),
		(2, 2, '1002', CURRENT_TIMESTAMP + INTERVAL '30 days', false, CURRENT_TIMESTAMP),
		(3, 3, '1003', CURRENT_TIMESTAMP + INTERVAL '30 days', false, CURRENT_TIMESTAMP),
		(4, 4, '1004', CURRENT_TIMESTAMP + INTERVAL '30 days', false, CURRENT_TIMESTAMP),
		(5, 5, '1005', CURRENT_TIMESTAMP + INTERVAL '30 days', false, CURRENT_TIMESTAMP),
		(6, 6, '1006', CURRENT_TIMESTAMP + INTERVAL '30 days', false, CURRENT_TIMESTAMP),
		(7, 7, '1007', CURRENT_TIMESTAMP + INTERVAL '30 days', false, CURRENT_TIMESTAMP),
		(8, 8, '1008', CURRENT_TIMESTAMP + INTERVAL '30 days', false, CURRENT_TIMESTAMP),
		(9, 9, '1009', CURRENT_TIMESTAMP + INTERVAL '30 days', false, CURRENT_TIMESTAMP),
		(10, 10, '1010', CURRENT_TIMESTAMP + INTERVAL '30 days', false, CURRENT_TIMESTAMP)`,
		`SELECT setval('otps_id_seq', (SELECT MAX(id) FROM otps))`,

		// 7. 10 Authorized Devices
		`INSERT INTO authorized_devices (id, student_id, secret_code) VALUES
		(1, 1, 'a1b2c3d4e5f60123456789abcdef0123456789abcdef0123456789abcdef0123'),
		(2, 2, 'b2c3d4e5f60123456789abcdef0123456789abcdef0123456789abcdef0123a1'),
		(3, 3, 'c3d4e5f60123456789abcdef0123456789abcdef0123456789abcdef0123a1b2'),
		(4, 4, 'd4e5f60123456789abcdef0123456789abcdef0123456789abcdef0123a1b2c3'),
		(5, 5, 'e5f60123456789abcdef0123456789abcdef0123456789abcdef0123a1b2c3d4'),
		(6, 6, 'f60123456789abcdef0123456789abcdef0123456789abcdef0123a1b2c3d4e5'),
		(7, 7, '0123456789abcdef0123456789abcdef0123456789abcdef0123a1b2c3d4e5f6'),
		(8, 8, '123456789abcdef0123456789abcdef0123456789abcdef0123a1b2c3d4e5f60'),
		(9, 9, '23456789abcdef0123456789abcdef0123456789abcdef0123a1b2c3d4e5f601'),
		(10, 10, '3456789abcdef0123456789abcdef0123456789abcdef0123a1b2c3d4e5f6012')`,
		`SELECT setval('authorized_devices_id_seq', (SELECT MAX(id) FROM authorized_devices))`,

		// 8. 10 Emergency Contacts
		`INSERT INTO emergency_contact (id, phone_number, updated_at) VALUES
		(1, '+94 11 234 5678', CURRENT_TIMESTAMP - INTERVAL '10 days'),
		(2, '+94 11 345 6789', CURRENT_TIMESTAMP - INTERVAL '9 days'),
		(3, '+94 11 456 7890', CURRENT_TIMESTAMP - INTERVAL '8 days'),
		(4, '+94 11 567 8901', CURRENT_TIMESTAMP - INTERVAL '7 days'),
		(5, '+94 11 678 9012', CURRENT_TIMESTAMP - INTERVAL '6 days'),
		(6, '+94 11 789 0123', CURRENT_TIMESTAMP - INTERVAL '5 days'),
		(7, '+94 11 890 1234', CURRENT_TIMESTAMP - INTERVAL '4 days'),
		(8, '+94 11 901 2345', CURRENT_TIMESTAMP - INTERVAL '3 days'),
		(9, '+94 11 012 3456', CURRENT_TIMESTAMP - INTERVAL '2 days'),
		(10, '+94 11 119 0000', CURRENT_TIMESTAMP)`,
		`SELECT setval('emergency_contact_id_seq', (SELECT MAX(id) FROM emergency_contact))`,

		// 9. 10 Student Feedbacks
		`INSERT INTO student_feedback (id, student_id, feedback_text, submitted_at) VALUES
		(1, 1, 'Avantha performed exceptionally well today, helping colleagues and following all safety guidelines.', CURRENT_TIMESTAMP - INTERVAL '1 hour'),
		(2, 2, 'Oshadi completed her daily tasks ahead of schedule with great attention to detail. Excellent team attitude.', CURRENT_TIMESTAMP - INTERVAL '45 minutes'),
		(3, 3, 'Sahan demonstrated solid problem-solving on the assigned modules. Showed great focus throughout the shift.', CURRENT_TIMESTAMP - INTERVAL '2 hours'),
		(4, 4, 'Tharushi was very communicative and cooperative with the entire team. Keep up the high energy!', CURRENT_TIMESTAMP - INTERVAL '3 hours'),
		(5, 5, 'Dinuka took great initiative in organizing the workstations and supporting customer inquiries.', CURRENT_TIMESTAMP - INTERVAL '30 minutes'),
		(6, 6, 'Nadeesha showed high dedication and precision. Worked smoothly through complex instructions.', CURRENT_TIMESTAMP - INTERVAL '1 hour 15 minutes'),
		(7, 7, 'Isuru adapted quickly to new guidelines today and showed notable improvement in speed and quality.', CURRENT_TIMESTAMP - INTERVAL '2 hours 30 minutes'),
		(8, 8, 'Kavindi was meticulous with testing steps and maintained a calm, positive work environment.', CURRENT_TIMESTAMP - INTERVAL '50 minutes'),
		(9, 9, 'Bhanuka handled the afternoon rush calmly and demonstrated good situational awareness.', CURRENT_TIMESTAMP - INTERVAL '1 hour 45 minutes'),
		(10, 10, 'Sachini was punctual, polite, and followed supervisor directions with thoroughness.', CURRENT_TIMESTAMP - INTERVAL '4 hours')`,
		`SELECT setval('student_feedback_id_seq', (SELECT MAX(id) FROM student_feedback))`,

		// 10. 10 Student Locations
		`INSERT INTO student_locations (id, student_id, latitude, longitude, accuracy, recorded_at) VALUES
		(1, 1, 6.9184, 79.8596, 5.2, CURRENT_TIMESTAMP - INTERVAL '50 minutes'),
		(2, 2, 6.9015, 79.8529, 6.1, CURRENT_TIMESTAMP - INTERVAL '40 minutes'),
		(3, 3, 6.9210, 79.8560, 4.8, CURRENT_TIMESTAMP - INTERVAL '1 hour 30 minutes'),
		(4, 4, 6.9056, 79.8517, 8.0, CURRENT_TIMESTAMP - INTERVAL '2 hours'),
		(5, 5, 6.9385, 79.8821, 5.0, CURRENT_TIMESTAMP - INTERVAL '25 minutes'),
		(6, 6, 6.8772, 79.8601, 7.3, CURRENT_TIMESTAMP - INTERVAL '1 hour'),
		(7, 7, 6.9319, 79.8504, 6.5, CURRENT_TIMESTAMP - INTERVAL '2 hours 15 minutes'),
		(8, 8, 6.9360, 79.8450, 4.2, CURRENT_TIMESTAMP - INTERVAL '35 minutes'),
		(9, 9, 6.8654, 79.8978, 5.9, CURRENT_TIMESTAMP - INTERVAL '1 hour 20 minutes'),
		(10, 10, 6.9247, 79.8690, 6.0, CURRENT_TIMESTAMP - INTERVAL '3 hours 45 minutes')`,
		`SELECT setval('student_locations_id_seq', (SELECT MAX(id) FROM student_locations))`,
	}

	for _, stmt := range statements {
		if _, err := tx.Exec(stmt); err != nil {
			return fmt.Errorf("failed executing statement (%s): %w", stmt, err)
		}
	}

	if err := tx.Commit(); err != nil {
		return fmt.Errorf("failed to commit seed transaction: %w", err)
	}

	log.Println("✅ All 10 database tables successfully seeded with 10 records each!")
	return nil
}

// SeedDatabaseHandler handles GET/POST requests to seed database and return table counts
func SeedDatabaseHandler(w http.ResponseWriter, r *http.Request) {
	if err := ExecuteSeedData(database.DB); err != nil {
		log.Printf("❌ Failed to seed database: %v", err)
		http.Error(w, fmt.Sprintf(`{"error": "%s"}`, err.Error()), http.StatusInternalServerError)
		return
	}

	counts, err := GetTableCounts(database.DB)
	if err != nil {
		log.Printf("⚠️ Error getting table counts: %v", err)
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success":      true,
		"message":      "Database successfully populated with 10 records per table",
		"table_counts": counts,
	})
}

// TableCountsHandler handles GET requests to check current record counts
func TableCountsHandler(w http.ResponseWriter, r *http.Request) {
	counts, err := GetTableCounts(database.DB)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"table_counts": counts,
	})
}

// CheckAndAutoSeed checks if tables are underpopulated and auto-seeds them if needed
func CheckAndAutoSeed() {
	if database.DB == nil {
		return
	}

	counts, err := GetTableCounts(database.DB)
	if err != nil {
		log.Printf("⚠️ Unable to check table counts on startup: %v", err)
		return
	}

	needsSeed := false
	for _, table := range TableNames {
		if counts[table] < 10 {
			needsSeed = true
			log.Printf("ℹ️ Table %s has %d records (< 10)", table, counts[table])
			break
		}
	}

	if needsSeed {
		log.Println("🔄 Database tables underpopulated. Seeding 10 records per table...")
		if err := ExecuteSeedData(database.DB); err != nil {
			log.Printf("⚠️ Auto-seed encountered an error: %v", err)
		} else {
			log.Println("✅ Database successfully auto-seeded with 10 records per table!")
		}
	} else {
		log.Println("✅ All 10 database tables already have 10+ records. Skipping auto-seed.")
	}
}
