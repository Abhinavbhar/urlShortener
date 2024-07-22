package routes

import (
	"context"
	"fmt"
	"net/http"
	"time"

	mongoClient "Abhinavbhar/dub.sh/database"
	"Abhinavbhar/dub.sh/redis"

	"go.mongodb.org/mongo-driver/bson"

	"github.com/gorilla/mux"
)

func RedirectUrl(w http.ResponseWriter, r *http.Request) {

	vars := mux.Vars(r)
	value := vars["value"]
	client := redis.RedisDatabase()
	url, err := client.Get(context.Background(), value).Result()
	if err != nil {
		mongo := mongoClient.GetClient()
		userCollection := mongo.Database("dub").Collection("url")
		filter := bson.M{"short_code": value}
		var found mongoClient.ActiveLink
		Url := userCollection.FindOne(context.TODO(), filter)
		error := Url.Decode(&found)
		if error != nil {
			http.Error(w, "link not found", http.StatusBadRequest)
			return
		}
		fmt.Println("from mongoDb")
		http.Redirect(w, r, found.URL, http.StatusFound)
		client := redis.RedisDatabase()
		ctx := r.Context()
		if err := client.Set(ctx, found.ShortCode, found.URL, 1*time.Hour).Err(); err != nil {
			http.Error(w, "Failed to store URL in Redis", http.StatusInternalServerError)
			return
		}
		return

	}
	fmt.Println("from redis")
	http.Redirect(w, r, url, http.StatusFound)
}
