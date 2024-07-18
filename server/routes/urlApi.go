package routes

import (
	mongoclient "Abhinavbhar/dub.sh/database"
	"Abhinavbhar/dub.sh/middleware"
	"Abhinavbhar/dub.sh/redis"
	"context"
	"encoding/json"
	"io"
	"log"
	"math/rand"
	"net/http"
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Data struct {
	Url string `json:"url"`
}

func Url(w http.ResponseWriter, r *http.Request) {
	Mongoclient := mongoclient.GetClient()
	urlCollection := Mongoclient.Database("dub").Collection("url")

	var id string
	if User, ok := r.Context().Value(middleware.UserKey).(middleware.User); ok {
		id = User.ID
	} else {
		http.Error(w, "login again missing credentials", http.StatusBadRequest)
		return
	}
	body, err := io.ReadAll(r.Body)
	if err != nil {
		http.Error(w, "Failed to read request body", http.StatusInternalServerError)
		return
	}
	var data Data
	if err := json.Unmarshal(body, &data); err != nil {
		http.Error(w, "Failed to parse JSON data", http.StatusBadRequest)
		return
	}
	uri := generateRandomString(3)
	finalUrl := "http://localhost:8080/url/" + uri

	client := redis.RedisDatabase()
	ctx := r.Context()
	if err := client.Set(ctx, uri, data.Url, 20*time.Hour).Err(); err != nil {
		http.Error(w, "Failed to store URL in Redis", http.StatusInternalServerError)
		return
	}
	response := map[string]string{"finalUrl": finalUrl, "id": id}
	jsonResponse, err := json.Marshal(response)
	if err != nil {
		http.Error(w, "Failed to serialize response", http.StatusInternalServerError)
		return
	}
	var newUrl mongoclient.ActiveLink
	newUrl.ShortCode = uri
	newUrl.URL = data.Url
	userID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		log.Fatal(err)
	}
	var url mongoclient.ActiveLink
	url.URL = data.Url
	url.ShortCode = uri
	url.UserId = userID
	_, error := urlCollection.InsertOne(context.TODO(), url)
	if error != nil {
		http.Error(w, "failed to store your url", http.StatusBadRequest)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.Write(jsonResponse)
}
func generateRandomString(length int) string {
	rand.Seed(time.Now().UnixNano())
	charset := "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
	result := make([]byte, length)
	for i := 0; i < length; i++ {
		result[i] = charset[rand.Intn(len(charset))]
	}
	return string(result)
}
