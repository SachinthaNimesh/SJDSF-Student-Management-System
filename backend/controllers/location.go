package controllers

import (
	"encoding/json"
	"log"
	"net/http"
	"server/database"
	"server/models"
	"strconv"
	"time"

	"github.com/gorilla/mux"
)

// PostLocation receives a periodic location ping (e.g. every 5 minutes)
func PostLocation(w http.ResponseWriter, r *http.Request) {
	studentIDHeader := r.Header.Get("student-id")
	if studentIDHeader == "" {
		http.Error(w, `{"error": "Missing student-id header"}`, http.StatusBadRequest)
		return
	}
	studentID, err := strconv.Atoi(studentIDHeader)
	if err != nil {
		http.Error(w, `{"error": "Invalid student-id header"}`, http.StatusBadRequest)
		return
	}

	var req models.LocationPingRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, `{"error": "Invalid request body"}`, http.StatusBadRequest)
		return
	}

	recordedAt, err := time.Parse(time.RFC3339, req.Timestamp)
	if err != nil {
		recordedAt = time.Now().UTC()
	}

	query := `INSERT INTO student_locations (student_id, latitude, longitude, accuracy, recorded_at) VALUES ($1, $2, $3, $4, $5)`
	_, err = database.DB.Exec(query, studentID, req.Latitude, req.Longitude, req.Accuracy, recordedAt)
	if err != nil {
		log.Printf("Error saving student location: %v", err)
		http.Error(w, `{"error": "Failed to save location"}`, http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success": true,
		"message": "Location recorded successfully",
	})
}

// GetStudentLocations fetches recent location history for a student (within 30 days)
func GetStudentLocations(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	studentIDStr := vars["id"]
	if studentIDStr == "" {
		studentIDStr = r.URL.Query().Get("student_id")
	}
	if studentIDStr == "" {
		studentIDStr = r.Header.Get("student-id")
	}

	studentID, err := strconv.Atoi(studentIDStr)
	if err != nil {
		http.Error(w, `{"error": "Invalid student ID"}`, http.StatusBadRequest)
		return
	}

	// Limit to the last 30 days
	query := `
		SELECT id, student_id, latitude, longitude, accuracy, recorded_at 
		FROM student_locations 
		WHERE student_id = $1 AND recorded_at >= NOW() - INTERVAL '30 days'
		ORDER BY recorded_at DESC 
		LIMIT 500
	`
	rows, err := database.DB.Query(query, studentID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var locations []models.StudentLocation
	for rows.Next() {
		var loc models.StudentLocation
		if err := rows.Scan(&loc.ID, &loc.StudentID, &loc.Latitude, &loc.Longitude, &loc.Accuracy, &loc.RecordedAt); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		locations = append(locations, loc)
	}

	if locations == nil {
		locations = []models.StudentLocation{}
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(locations)
}

// StartLocationCleanupWorker runs a background cleanup every 24 hours to enforce 30-day retention
func StartLocationCleanupWorker() {
	go func() {
		// Run initial cleanup on startup
		cleanOldLocations()

		ticker := time.NewTicker(24 * time.Hour)
		defer ticker.Stop()

		for range ticker.C {
			cleanOldLocations()
		}
	}()
}

func cleanOldLocations() {
	if database.DB == nil {
		return
	}
	res, err := database.DB.Exec("DELETE FROM student_locations WHERE recorded_at < NOW() - INTERVAL '30 days'")
	if err != nil {
		log.Printf("⚠️ Error during 30-day location cleanup: %v", err)
	} else {
		rowsDeleted, _ := res.RowsAffected()
		if rowsDeleted > 0 {
			log.Printf("🧹 Cleaned up %d expired student location records (>30 days old)", rowsDeleted)
		}
	}
}
