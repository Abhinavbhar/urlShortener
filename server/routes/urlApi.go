package routes

import (
	mongoclient "Abhinavbhar/dub.sh/database"
	"Abhinavbhar/dub.sh/middleware"
	"Abhinavbhar/dub.sh/redis"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"math/rand"
	"net/http"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Data struct {
	Url string `json:"url"`
}

func Url(w http.ResponseWriter, r *http.Request) {
	Mongoclient := mongoclient.GetClient()
	urlCollection := Mongoclient.Database("dub").Collection("url")
	userCollection := Mongoclient.Database("dub").Collection("users")

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
	finalUrl := "http://localhost:8080/" + uri

	client := redis.RedisDatabase()
	ctx := r.Context()
	if err := client.Set(ctx, uri, data.Url, 1*time.Hour).Err(); err != nil {
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
	update := bson.M{
		"$push": bson.M{"active_links": url},
	}
	var user mongoclient.User
	filter := bson.M{
		"_id": userID}
	error12 := userCollection.FindOne(context.TODO(), filter).Decode(&user)
	if error12 != nil {
		fmt.Println(error12)
		http.Error(w, "url  already  exists go in the dashboard to see", http.StatusBadRequest)
		return
	}
	for _, link := range user.ActiveLinks {
		if link.URL == data.Url {
			http.Error(w, "url already exists", http.StatusBadRequest)
			return
		}
	}
	fmt.Println(user)
	if len(user.ActiveLinks) >= 10 {
		http.Error(w, "url limit exceed only 10 url are accepted", http.StatusBadRequest)
		return
	}
	_, error := urlCollection.InsertOne(context.TODO(), url)
	_, error1 := userCollection.UpdateByID(context.TODO(), userID, update)

	if error != nil {
		http.Error(w, "failed to store your url", http.StatusBadRequest)
		return
	}
	if error1 != nil {
		fmt.Println(error1)
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
