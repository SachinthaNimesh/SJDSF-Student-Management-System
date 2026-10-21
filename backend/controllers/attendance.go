package controllers

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
	"server/database"
	"server/models"
	"strconv"
	"time"
)

// getStartAndEndOfDay returns the UTC start and end time for the current day.
func getStartAndEndOfDay() (time.Time, time.Time) {
	now := time.Now().UTC()
	startOfDay := time.Date(now.Year(), now.Month(), now.Day(), 0, 0, 0, 0, time.UTC)
	endOfDay := startOfDay.Add(24 * time.Hour)
	return startOfDay, endOfDay
}

// findTodayAttendance tries to find today's attendance record for a student.
func findTodayAttendance(studentID int, startOfDay, endOfDay time.Time) (models.Attendance, error) {
	var attendance models.Attendance
	query := `SELECT id, student_id, check_in_lat, check_in_long, check_in_date_time, check_out_lat, check_out_long, check_out_date_time 
                  FROM attendance 
                  WHERE student_id = $1 AND check_in_date_time >= $2 AND check_in_date_time < $3 
                  ORDER BY check_in_date_time DESC LIMIT 1`
	log.Printf("Select Query: %s", query)
	log.Printf("Select Params: student_id=%d, start=%v, end=%v", studentID, startOfDay, endOfDay)
	row := database.DB.QueryRow(query, studentID, startOfDay, endOfDay)
	err := row.Scan(&attendance.ID, &attendance.StudentID, &attendance.CheckInLat, &attendance.CheckInLong, &attendance.CheckInDateTime, &attendance.CheckOutLat, &attendance.CheckOutLong, &attendance.CheckOutDateTime)
	return attendance, err
}

func PostAttendance(w http.ResponseWriter, r *http.Request) {
	log.Println("Received attendance request")

	StudentIDHeader := r.Header.Get("student-id")
	if StudentIDHeader == "" {
		log.Println("Missing student-id header")
		http.Error(w, "Missing student-id header", http.StatusBadRequest)
		return
	}

	studentID, err := strconv.Atoi(StudentIDHeader)
	if err != nil {
		log.Printf("Invalid student-id header: %v", err)
		http.Error(w, "Invalid student-id header", http.StatusBadRequest)
		return
	}

	log.Printf("Processing attendance for student ID: %d", studentID)

	var requestData struct {
		CheckIn   bool    `json:"check_in"`
		Latitude  float64 `json:"check_in_lat"`
		Longitude float64 `json:"check_in_long"`
		Timestamp string  `json:"timestamp"`
	}

	if err := json.NewDecoder(r.Body).Decode(&requestData); err != nil {
		log.Printf("Failed to decode request body: %v", err)
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	checkInTime, err := time.Parse(time.RFC3339, requestData.Timestamp)
	if err != nil {
		checkInTime = time.Now().UTC()
	}

	log.Printf("Request data: check_in=%v, lat=%f, long=%f",
		requestData.CheckIn, requestData.Latitude, requestData.Longitude)

	var attendance models.Attendance
	startOfDay, endOfDay := getStartAndEndOfDay()

	if requestData.CheckIn {
		// Check if a record already exists for today instead of blindly deleting
		existing, err := findTodayAttendance(studentID, startOfDay, endOfDay)
		if err == nil {
			log.Printf("Existing attendance record found for today (ID: %d), updating check-in data", existing.ID)
			updateQuery := `UPDATE attendance SET check_in_lat = $1, check_in_long = $2, check_in_date_time = $3 WHERE id = $4 RETURNING id, student_id, check_in_lat, check_in_long, check_in_date_time`
			row := database.DB.QueryRow(updateQuery, requestData.Latitude, requestData.Longitude, checkInTime, existing.ID)
			err = row.Scan(&attendance.ID, &attendance.StudentID, &attendance.CheckInLat, &attendance.CheckInLong, &attendance.CheckInDateTime)
			if err != nil {
				log.Printf("Database error on check-in update: %v", err)
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
			attendance.CheckOutLat = existing.CheckOutLat
			attendance.CheckOutLong = existing.CheckOutLong
			attendance.CheckOutDateTime = existing.CheckOutDateTime
			log.Printf("Check-in record updated: %+v", attendance)
		} else if err == sql.ErrNoRows {
			attendance.StudentID = studentID
			attendance.CheckInLat = requestData.Latitude
			attendance.CheckInLong = requestData.Longitude
			attendance.CheckInDateTime = checkInTime

			log.Println("Creating new check-in record")
			query := `INSERT INTO attendance (student_id, check_in_lat, check_in_long, check_in_date_time) VALUES ($1, $2, $3, $4) RETURNING id, student_id, check_in_lat, check_in_long, check_in_date_time`
			log.Printf("Insert Query: %s", query)
			log.Printf("Insert Params: student_id=%d, lat=%f, long=%f, datetime=%v", attendance.StudentID, attendance.CheckInLat, attendance.CheckInLong, attendance.CheckInDateTime)
			row := database.DB.QueryRow(query, attendance.StudentID, attendance.CheckInLat, attendance.CheckInLong, attendance.CheckInDateTime)
			err = row.Scan(&attendance.ID, &attendance.StudentID, &attendance.CheckInLat, &attendance.CheckInLong, &attendance.CheckInDateTime)
			if err != nil {
				log.Printf("Database error on insert: %v", err)
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
			log.Printf("Check-in record created: %+v", attendance)
		} else {
			log.Printf("Database error checking existing attendance: %v", err)
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	} else {
		// Try to find existing record for today
		attendance, err = findTodayAttendance(studentID, startOfDay, endOfDay)
		if err == sql.ErrNoRows {
			// No check-in record exists, create a new record with check-in matching check-out time and actual checkout data
			log.Println("No check-in record found, creating checkout record")
			attendance.StudentID = studentID
			attendance.CheckInLat = requestData.Latitude
			attendance.CheckInLong = requestData.Longitude
			attendance.CheckInDateTime = checkInTime
			attendance.CheckOutLat = sql.NullFloat64{Float64: requestData.Latitude, Valid: true}
			attendance.CheckOutLong = sql.NullFloat64{Float64: requestData.Longitude, Valid: true}
			attendance.CheckOutDateTime = sql.NullTime{Time: checkInTime, Valid: true}

			insertQuery := `INSERT INTO attendance (student_id, check_in_lat, check_in_long, check_in_date_time, check_out_lat, check_out_long, check_out_date_time) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`
			log.Printf("Insert Query: %s", insertQuery)
			row := database.DB.QueryRow(insertQuery, attendance.StudentID, attendance.CheckInLat, attendance.CheckInLong, attendance.CheckInDateTime, attendance.CheckOutLat, attendance.CheckOutLong, attendance.CheckOutDateTime)
			err := row.Scan(&attendance.ID)
			if err != nil {
				log.Printf("Database error on checkout insert: %v", err)
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
			log.Printf("Checkout record with zero check-in values created: %+v", attendance)
		} else if err != nil {
			log.Printf("Database error on select: %v", err)
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		} else {
			// Update existing record with checkout data (preserve existing check-in data)
			log.Printf("Found existing check-in record, updating with check-out data: %+v", attendance)

			attendance.CheckOutLat = sql.NullFloat64{Float64: requestData.Latitude, Valid: true}
			attendance.CheckOutLong = sql.NullFloat64{Float64: requestData.Longitude, Valid: true}
			attendance.CheckOutDateTime = sql.NullTime{Time: checkInTime, Valid: true}

			log.Println("Updating existing record with check-out data")
			updateQuery := `UPDATE attendance SET check_out_lat = $1, check_out_long = $2, check_out_date_time = $3 WHERE id = $4`
			log.Printf("Update Query: %s", updateQuery)
			log.Printf("Update Params: lat=%v, long=%v, datetime=%v, id=%d", attendance.CheckOutLat, attendance.CheckOutLong, attendance.CheckOutDateTime, attendance.ID)
			_, err = database.DB.Exec(updateQuery, attendance.CheckOutLat, attendance.CheckOutLong, attendance.CheckOutDateTime, attendance.ID)
			if err != nil {
				log.Printf("Failed to save record: %v", err)
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
			log.Printf("Check-out updated for record ID: %d", attendance.ID)
		}
	}

	log.Println("Successfully processed request, sending response")
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(attendance)
}
