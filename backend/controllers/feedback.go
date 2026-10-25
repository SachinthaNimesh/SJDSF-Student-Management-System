package controllers

import (
	"encoding/json"
	"log"
	"net/http"
	"server/database"
	"server/models"
	"strconv"
	"time"
)

// PostStudentFeedback saves feedback submitted after checkout
func PostStudentFeedback(w http.ResponseWriter, r *http.Request) {
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

	var req struct {
		FeedbackText string `json:"feedback"`
		Timestamp    string `json:"timestamp"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, `{"error": "Invalid request body"}`, http.StatusBadRequest)
		return
	}

	if req.FeedbackText == "" {
		http.Error(w, `{"error": "Feedback text cannot be empty"}`, http.StatusBadRequest)
		return
	}

	submittedAt, err := time.Parse(time.RFC3339, req.Timestamp)
	if err != nil {
		submittedAt = time.Now().UTC()
	}

	query := `INSERT INTO student_feedback (student_id, feedback_text, submitted_at) VALUES ($1, $2, $3) RETURNING id`
	var feedbackID int
	err = database.DB.QueryRow(query, studentID, req.FeedbackText, submittedAt).Scan(&feedbackID)
	if err != nil {
		log.Printf("Error inserting student feedback: %v", err)
		http.Error(w, `{"error": "Failed to save feedback"}`, http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success": true,
		"id":      feedbackID,
		"message": "Feedback submitted successfully",
	})
}

// GetStudentFeedbacks retrieves feedback history for a student or all students
func GetStudentFeedbacks(w http.ResponseWriter, r *http.Request) {
	studentIDParam := r.URL.Query().Get("student_id")
	if studentIDParam == "" {
		studentIDParam = r.Header.Get("student-id")
	}

	var feedbacks []models.StudentFeedback
	var err error

	if studentIDParam != "" {
		studentID, parseErr := strconv.Atoi(studentIDParam)
		if parseErr != nil {
			http.Error(w, `{"error": "Invalid student_id"}`, http.StatusBadRequest)
			return
		}
		query := `SELECT id, student_id, feedback_text, submitted_at FROM student_feedback WHERE student_id = $1 ORDER BY submitted_at DESC LIMIT 50`
		rows, qErr := database.DB.Query(query, studentID)
		if qErr != nil {
			http.Error(w, qErr.Error(), http.StatusInternalServerError)
			return
		}
		defer rows.Close()

		for rows.Next() {
			var f models.StudentFeedback
			if err := rows.Scan(&f.ID, &f.StudentID, &f.FeedbackText, &f.SubmittedAt); err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
			feedbacks = append(feedbacks, f)
		}
	} else {
		query := `SELECT id, student_id, feedback_text, submitted_at FROM student_feedback ORDER BY submitted_at DESC LIMIT 100`
		rows, qErr := database.DB.Query(query)
		if qErr != nil {
			http.Error(w, qErr.Error(), http.StatusInternalServerError)
			return
		}
		defer rows.Close()

		for rows.Next() {
			var f models.StudentFeedback
			if err := rows.Scan(&f.ID, &f.StudentID, &f.FeedbackText, &f.SubmittedAt); err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
			feedbacks = append(feedbacks, f)
		}
	}

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if feedbacks == nil {
		feedbacks = []models.StudentFeedback{}
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(feedbacks)
}
