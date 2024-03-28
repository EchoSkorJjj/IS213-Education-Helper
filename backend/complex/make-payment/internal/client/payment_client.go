package client

import (
	"fmt"
	"log"
	"os"
	"sync"

	"google.golang.org/grpc"

	"github.com/EchoSkorJjj/IS213-Education-Helper/make-payment/pb/payment"
)

type PaymentClient struct {
	Conn *grpc.ClientConn
	Stub payment.PaymentClient
}

var paymentClient *PaymentClient
var paymentOnce sync.Once

func GetPaymentClient() *PaymentClient {
	paymentOnce.Do(func() {
		paymentServiceHost := os.Getenv("PAYMENT_SERVICE_HOST")
		paymentServicePort := os.Getenv("PAYMENT_SERVICE_PORT")
		paymentServiceConnString := fmt.Sprintf("%s:%s", paymentServiceHost, paymentServicePort)

		conn, err := grpc.Dial(paymentServiceConnString, grpc.WithInsecure())
		if err != nil {
			log.Fatalf("Failed to dial payment server: %v", err)
		}
		paymentClient = &PaymentClient{
			Conn: conn,
			Stub: payment.NewPaymentClient(conn),
		}
	})

	return paymentClient
}
