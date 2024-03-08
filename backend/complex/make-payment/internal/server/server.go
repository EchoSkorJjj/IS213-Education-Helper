package payment

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"net/url"
	"os"
	"strings"

	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"

	"github.com/EchoSkorJjj/IS213-Education-Helper/make-payment/pb"
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
	var returnedErr error

	email := req.Email

	data := url.Values{}
	data.Set("email", email)
	dataReader := strings.NewReader((data.Encode()))
	checkoutUrl := fmt.Sprintf("http://%s:4567/checkout", os.Getenv("PAYMENT_SERVICE_HOST"))
	httpReq, err := http.NewRequest("GET", checkoutUrl, dataReader)
	if err != nil {
		log.Printf("Failed to create new HTTP request: %v", err)
		returnedErr = status.Errorf(codes.InvalidArgument, "Error creating request: %v", err)
		return nil, returnedErr
	}

	httpReq.Header.Add("Content-Type", "application/x-www-form-urlencoded")
	client := &http.Client{
		CheckRedirect: func(req *http.Request, via []*http.Request) error {
			return http.ErrUseLastResponse
		},
	}

	httpResp, err := client.Do(httpReq)
	if err != nil {
		log.Printf("Failed to send HTTP request: %v", err)
		returnedErr = status.Errorf(codes.Internal, "Error sending request: %v", err)
		return nil, returnedErr
	}
	defer httpResp.Body.Close()

	stripeRedirectUrl, err := httpResp.Location()
	if err != nil {
		log.Printf("Failed to extract Stripe Redirect URL from HTTP response: %v", err)
		returnedErr = status.Errorf(codes.Internal, "Error getting Stripe Redirect URL: %v", err)
		return nil, err
	}

	log.Printf("Successfully extracted Stripe Redirect URL: %v", stripeRedirectUrl.String())
	return &make_payment.CheckoutResponse{Url: stripeRedirectUrl.String()}, nil
}
