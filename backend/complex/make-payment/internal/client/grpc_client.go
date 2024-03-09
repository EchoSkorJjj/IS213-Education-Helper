package client

import (
	"fmt"
	"log"
	"os"
	"sync"

	"google.golang.org/grpc"

	subscription "github.com/EchoSkorJjj/IS213-Education-Helper/make-payment/pb/subscription"
)

type Client struct {
	Conn *grpc.ClientConn
	Stub subscription.SubscriptionClient
}

var instance *Client
var once sync.Once

func GetClient() *Client {
	once.Do(func() {
		subscriptionServiceHost := os.Getenv("SUBSCRIPTION_SERVICE_HOST")
		subscriptionServicePort := os.Getenv("SUBSCRIPTION_SERVICE_PORT")
		subscriptionServiceConnString := fmt.Sprintf("%s:%s", subscriptionServiceHost, subscriptionServicePort)

		conn, err := grpc.Dial(subscriptionServiceConnString, grpc.WithInsecure())
		if err != nil {
			log.Fatalf("Failed to dial server: %v", err)
		}
		instance = &Client{
			Conn: conn,
			Stub: subscription.NewSubscriptionClient(conn),
		}
	})

	return instance
}
