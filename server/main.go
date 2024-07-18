package main

import (
	mongoClient "Abhinavbhar/dub.sh/database"
	"Abhinavbhar/dub.sh/middleware"
	"Abhinavbhar/dub.sh/redis"
	"Abhinavbhar/dub.sh/routes"

	"log"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/rs/cors"
)

func main() {
	// Configure CORS settings
	corsHandler := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:3000", "http://localhost:3001"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Content-Type", "Content-Length", "Accept-Encoding", "X-CSRF-Token", "Authorization"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: true,
		MaxAge:           300, // Maximum value not ignored by any of major browsers
	})

	// Initialize MongoDB and Redis
	mongoClient.InitMongoClient()
	redis.InitRedis()

	// Create a new router
	r := mux.NewRouter()

	// Define routes
	r.Handle("/", middleware.AuthMiddleware(http.HandlerFunc(routes.Url))).Methods("POST")
	r.Handle("/authcheck", middleware.AuthMiddleware(http.HandlerFunc(routes.AuthChecker))).Methods("GET")
	r.HandleFunc("/url/{value}", routes.BaseUrl).Methods("GET")
	r.HandleFunc("/login", routes.Login).Methods("POST")
	r.HandleFunc("/signup", routes.Signup).Methods("POST")
	handler := corsHandler.Handler(r)
	log.Println("starting server on port 8080")
	log.Fatal(http.ListenAndServe(":8080", handler))
}
