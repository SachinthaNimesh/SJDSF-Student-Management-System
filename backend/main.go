package main

import (
	"log"
	"net/http"
	"os"
	"server/controllers"
	"server/database"
	"server/routes"

	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
	_ "github.com/lib/pq" // PostgreSQL driver
)

func main() {
	// Fetch port from environment (default to 8000 for Choreo)
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	// Connect to DB with environment variables
	database.ConnectDB()

	// Define router
	router := mux.NewRouter()

	// CORS Setup with proper configuration supporting credentials and all application headers
	corsMiddleware := handlers.CORS(
		handlers.AllowedHeaders([]string{
			"Content-Type",
			"Authorization",
			"Origin",
			"Accept",
			"X-Requested-With",
			"Test-Key",
			"testkey",
			"api-key",
			"student-id",
			"employer-id",
			"supervisor-id",
			"otp-code",
		}),
		handlers.AllowedMethods([]string{"GET", "POST", "PUT", "DELETE", "HEAD", "OPTIONS"}),
		handlers.AllowedOriginValidator(func(origin string) bool {
			return true // dynamically reflects origin so AllowCredentials works per CORS spec
		}),
		handlers.AllowCredentials(),
		handlers.ExposedHeaders([]string{
			"Content-Length",
		}),
		handlers.MaxAge(86400), // 24 hours
	)

	authService := controllers.NewAuthService()
	authService.RegisterRoutes(router)

	// Register API routes
	routes.RegisterStudentRoutes(router)

	// Start the server with CORS handler wrapping the router
	log.Println("Server started on port", port)
	log.Fatal(http.ListenAndServe(":"+port, corsMiddleware(router)))
}
