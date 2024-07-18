package mongoClient

import "go.mongodb.org/mongo-driver/bson/primitive"

type ActiveLink struct {
	URL       string             `json:"url" bson:"url"`
	ShortCode string             `json:"short_code" bson:"short_code"`
	UserId    primitive.ObjectID `json:"userId" bson:"userId"`
}

type User struct {
	Password    string       `json:"password" bson:"password"`
	Username    string       `json:"username" bson:"username"`
	ActiveLinks []ActiveLink `json:"active_links,omitempty" bson:"active_links,omitempty"`
}
