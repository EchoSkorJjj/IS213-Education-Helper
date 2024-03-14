package client

import (
	"fmt"
	"log"
	"os"
	"sync"

	"google.golang.org/grpc"

	"github.com/EchoSkorJjj/IS213-Education-Helper/make-payment/pb/subscription"
)

type SubscriptionClient struct {
	Conn *grpc.ClientConn
	Stub subscription.SubscriptionClient
}

var instance *SubscriptionClient
var once sync.Once

func GetSubscriptionClient() *SubscriptionClient {
	once.Do(func() {
		subscriptionServiceHost := os.Getenv("SUBSCRIPTION_SERVICE_HOST")
		subscriptionServicePort := os.Getenv("SUBSCRIPTION_SERVICE_PORT")
		subscriptionServiceConnString := fmt.Sprintf("%s:%s", subscriptionServiceHost, subscriptionServicePort)

		conn, err := grpc.Dial(subscriptionServiceConnString, grpc.WithInsecure())
		if err != nil {
			log.Fatalf("Failed to dial subscription server: %v", err)
		}
		instance = &SubscriptionClient{
			Conn: conn,
			Stub: subscription.NewSubscriptionClient(conn),
		}
	})

	return instance
}
