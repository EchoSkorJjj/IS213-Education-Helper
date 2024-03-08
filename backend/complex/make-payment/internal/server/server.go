package payment

import (
	"context"
	"fmt"
	"log"
	"net/url"
	"os"
	"strings"

	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"

	"github.com/EchoSkorJjj/IS213-Education-Helper/make-payment/internal/utils"
	make_payment "github.com/EchoSkorJjj/IS213-Education-Helper/make-payment/pb"
)

type PaymentService interface {
	Checkout(ctx context.Context, req *make_payment.CheckoutRequest) (*make_payment.CheckoutResponse, error)
}

type Server struct {
	make_payment.UnimplementedPaymentServiceServer
}

func NewServer() *Server {
	return &Server{}
}

func (s *Server) Checkout(ctx context.Context, req *make_payment.CheckoutRequest) (*make_payment.CheckoutResponse, error) {
	paymentServiceHost := os.Getenv("PAYMENT_SERVICE_HOST")
	checkoutURL := fmt.Sprintf("http://%s:4567/checkout", paymentServiceHost)

	data := url.Values{}
	data.Set("email", req.Email)
	dataReader := strings.NewReader(data.Encode())

	httpResp, err := utils.SendHttpRequest(ctx, "GET", checkoutURL, dataReader) // Assuming SendHttpRequest supports context
	if err != nil {
		return nil, status.Errorf(codes.Internal, "error sending request: %v", err)
	}
	defer httpResp.Body.Close()

	stripeRedirectURL, err := httpResp.Location()
	if err != nil {
		log.Printf("Failed to extract Stripe Redirect URL from HTTP response: %v", err)
		return nil, status.Errorf(codes.Internal, "error getting Stripe Redirect URL: %v", err)
	}

	log.Printf("Successfully extracted Stripe Redirect URL: %v", stripeRedirectURL.String())
	return &make_payment.CheckoutResponse{Url: stripeRedirectURL.String()}, nil
}
