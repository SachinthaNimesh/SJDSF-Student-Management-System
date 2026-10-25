package routes

import (
	"server/controllers"

	"github.com/gorilla/mux"
)

func RegisterStudentRoutes(router *mux.Router) {
	router.HandleFunc("/get-students", controllers.GetStudents).Methods("GET")

	router.HandleFunc("/create-employee", controllers.CreateStudent).Methods("POST")
	router.HandleFunc("/update-employee", controllers.UpdateStudent).Methods("PUT")
	router.HandleFunc("/delete-employee", controllers.DeleteStudent).Methods("DELETE")

	router.HandleFunc("/get-student", controllers.GetStudent).Methods("GET")

	//supervisor routes
	router.HandleFunc("/get-supervisors", controllers.GetSupervisors).Methods("GET")
	router.HandleFunc("/get-supervisor", controllers.GetSupervisor).Methods("GET")
	router.HandleFunc("/create-supervisor", controllers.CreateSupervisor).Methods("POST")
	router.HandleFunc("/update-supervisor", controllers.UpdateSupervisor).Methods("PUT")
	router.HandleFunc("/delete-supervisor", controllers.DeleteSupervisor).Methods("DELETE")

	// employer routes
	router.HandleFunc("/get-employers", controllers.GetAllEmployerIDsAndNames).Methods("GET")
	router.HandleFunc("/create-employer", controllers.CreateEmployer).Methods("POST")
	router.HandleFunc("/get-employer", controllers.GetEmployer).Methods("GET")
	router.HandleFunc("/update-employer", controllers.UpdateEmployer).Methods("PUT")
	router.HandleFunc("/delete-employer", controllers.DeleteEmployer).Methods("DELETE")
	router.HandleFunc("/get-employer-ids", controllers.GetAllEmployerIDsAndNames).Methods("GET")

	// Add attendance routes
	router.HandleFunc("/attendance", controllers.PostAttendance).Methods("POST")

	// Add mood routes
	router.HandleFunc("/post-mood", controllers.CreateMood).Methods("POST")
	router.HandleFunc("/get-mood", controllers.GetMoods).Methods("GET")
	router.HandleFunc("/get-mood/{id}", controllers.GetMood).Methods("GET")

	// Add card routes
	router.HandleFunc("/dashboard", controllers.GetStudentDetails).Methods("GET")

	router.HandleFunc("/employees", controllers.GetEmployeeData).Methods("GET")
	router.HandleFunc("/management", controllers.GetManagementTable).Methods("GET")
	router.HandleFunc("/trainee-profile", controllers.GetTraineeProfile).Methods("GET")
	router.HandleFunc("/employee-summary", controllers.GetEmployeeSummary).Methods("GET")

	// Attendance & Location validation routes
	router.HandleFunc("/validate-attendance", controllers.ValidateAttendanceHandler()).Methods("POST")
	router.HandleFunc("/validate-location", controllers.ValidateLocationHandler()).Methods("POST")

	router.HandleFunc("/get-supervisor-ids", controllers.GetAllSupervisorIDsAndNames).Methods("GET")

	// Manager feedback route
	router.HandleFunc("/manager-feedback", controllers.FetchManagerFeedback).Methods("GET")

	// Emergency contact routes
	router.HandleFunc("/get-emergency-contact", controllers.GetEmergencyContact).Methods("GET")
	router.HandleFunc("/update-emergency-contact", controllers.UpdateEmergencyContact).Methods("POST")

	// Parent PIN and Arrived Home routes
	router.HandleFunc("/verify-parent-pin", controllers.VerifyParentPin).Methods("POST")
	router.HandleFunc("/arrived-home", controllers.PostArrivedHome).Methods("POST")
	router.HandleFunc("/attendance/today", controllers.GetTodayAttendance).Methods("GET")

	// Student Daily Feedback routes
	router.HandleFunc("/feedback", controllers.PostStudentFeedback).Methods("POST")
	router.HandleFunc("/student-feedbacks", controllers.GetStudentFeedbacks).Methods("GET")

	// 5-minute Location Tracking routes (30-day retention)
	router.HandleFunc("/location-track", controllers.PostLocation).Methods("POST")
	router.HandleFunc("/student/{id}/locations", controllers.GetStudentLocations).Methods("GET")
	router.HandleFunc("/student-locations", controllers.GetStudentLocations).Methods("GET")
}
