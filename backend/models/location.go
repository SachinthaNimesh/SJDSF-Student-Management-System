package models

import "time"

type StudentLocation struct {
	ID         int64     `json:"id"`
	StudentID  int       `json:"student_id"`
	Latitude   float64   `json:"latitude"`
	Longitude  float64   `json:"longitude"`
	Accuracy   float64   `json:"accuracy"`
	RecordedAt time.Time `json:"recorded_at"`
}

type LocationPingRequest struct {
	Latitude  float64 `json:"latitude"`
	Longitude float64 `json:"longitude"`
	Accuracy  float64 `json:"accuracy"`
	Timestamp string  `json:"timestamp"`
}
