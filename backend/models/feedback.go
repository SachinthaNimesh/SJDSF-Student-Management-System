package models

import "time"

type StudentFeedback struct {
	ID           int       `json:"id"`
	StudentID    int       `json:"student_id"`
	FeedbackText string    `json:"feedback_text"`
	SubmittedAt  time.Time `json:"submitted_at"`
}
