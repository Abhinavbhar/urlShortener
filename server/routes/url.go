package routes

import (
	"context"
	"net/http"

	"Abhinavbhar/dub.sh/redis"

	"github.com/gorilla/mux"
)

func BaseUrl(w http.ResponseWriter, r *http.Request) {

	vars := mux.Vars(r)
	value := vars["value"]
	client := redis.RedisDatabase()
	url, _ := client.Get(context.Background(), value).Result()
	// if err != nil {
	// 	mongo := mongoClient.GetClient()
	// 	userCollection := mongo.Database("dub").Collection("url")
	// 	filter := bson.M{"short_code": value}
	// 	var found mongoClient.ActiveLink
	// 	Url := userCollection.FindOne(context.TODO(), filter)
	// 	error := Url.Decode(&found)
	// 	if error != nil {
	// 		http.Error(w, "link not found", http.StatusBadRequest)
	// 		return
	// 	}
	// 	fmt.Println("from mongoDb")
	// 	http.Redirect(w, r, found.URL, http.StatusFound)
	// 	client := redis.RedisDatabase()
	// 	ctx := r.Context()
	// 	if err := client.Set(ctx, found.ShortCode, found.URL, 20*time.Second).Err(); err != nil {
	// 		http.Error(w, "Failed to store URL in Redis", http.StatusInternalServerError)
	// 		return
	// 	}
	// 	return

	// }
	//fmt.Println("from redis")
	http.Redirect(w, r, url, http.StatusFound)
}
