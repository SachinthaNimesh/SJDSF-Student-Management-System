package controllers

import (
	"encoding/json"
	"net/http"
	"server/database"
)

// EmployeeResponse represents the response structure for the query
type EmployeeResponse struct {
	StudentID       int     `json:"student_id"`
	StudentName     string  `json:"student_name"`
	StudentContact  string  `json:"student_contact"`
	EmployerID      *int    `json:"employer_id,omitempty"`
	EmployerName    *string `json:"employer_name,omitempty"`
	EmployerContact *string `json:"employer_contact,omitempty"`
	EmployerAddress *string `json:"employer_address,omitempty"`
	SupervisorID    *int    `json:"supervisor_id,omitempty"`
	SupervisorName  *string `json:"supervisor_name,omitempty"`
}

// GetEmployeeData handles the HTTP request to fetch employee data
func GetEmployeeData(w http.ResponseWriter, r *http.Request) {
	var results []EmployeeResponse

	query := `
		SELECT 
			s.id AS student_id,
			s.first_name || ' ' || s.last_name AS student_name,
			s.contact_number AS student_contact,
			e.id AS employer_id,
			e.name AS employer_name,
			e.contact_number AS employer_contact,
			CONCAT_WS(', ', e.address_line1, e.address_line2, e.address_line3) AS employer_address,
			sup.supervisor_id AS supervisor_id,
			sup.first_name || ' ' || sup.last_name AS supervisor_name
		FROM 
			student s
		LEFT JOIN employer e ON s.employer_id = e.id
		LEFT JOIN supervisor sup ON s.supervisor_id = sup.supervisor_id;
	`

	rows, err := database.DB.Query(query)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	for rows.Next() {
		var res EmployeeResponse
		if err := rows.Scan(
			&res.StudentID,
			&res.StudentName,
			&res.StudentContact,
			&res.EmployerID,
			&res.EmployerName,
			&res.EmployerContact,
			&res.EmployerAddress,
			&res.SupervisorID,
			&res.SupervisorName,
		); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		results = append(results, res)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(results)
}
