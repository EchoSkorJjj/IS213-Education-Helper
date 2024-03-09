package payment

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/url"
	"os"
	"strings"
	"time"

	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
	"google.golang.org/protobuf/types/known/timestamppb"

	client "github.com/EchoSkorJjj/IS213-Education-Helper/make-payment/internal/client"
	utils "github.com/EchoSkorJjj/IS213-Education-Helper/make-payment/internal/utils"
	make_payment "github.com/EchoSkorJjj/IS213-Education-Helper/make-payment/pb/make_payment"
	subscription "github.com/EchoSkorJjj/IS213-Education-Helper/make-payment/pb/subscription"
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
	paymentServicePort := os.Getenv("PAYMENT_SERVICE_PORT")
	checkoutURL := fmt.Sprintf("http://%s:%s/checkout", paymentServiceHost, paymentServicePort)

	data := url.Values{}
	data.Set("email", req.Email)
	dataReader := strings.NewReader(data.Encode())

	httpResp, err := utils.SendHttpRequest(ctx, "GET", checkoutURL, dataReader)
	if err != nil {
		return nil, status.Errorf(codes.Internal, "error sending request: %v", err)
	}
	defer httpResp.Body.Close()

	bodyBytes, err := io.ReadAll(httpResp.Body)
	if err != nil {
		log.Printf("Failed to read HTTP response body: %v", err)
		return nil, status.Errorf(codes.Internal, "error reading HTTP response body: %v", err)
	}

	var respBody map[string]string
	err = json.Unmarshal(bodyBytes, &respBody)
	if err != nil {
		log.Printf("Failed to unmarshal HTTP response body: %v", err)
		return nil, status.Errorf(codes.Internal, "error unmarshalling HTTP response body: %v", err)
	}

	stripeRedirectURL, ok := respBody["url"]
	if !ok {
		log.Printf("URL not found in HTTP response body")
		return nil, status.Errorf(codes.Internal, "URL not found in HTTP response body")
	}

	return &make_payment.CheckoutResponse{Url: stripeRedirectURL}, nil
}

func (s *Server) SuccessfulPayment(ctx context.Context, req *make_payment.SuccessfulPaymentRequest) (*make_payment.SuccessfulPaymentResponse, error) {
	subscriptionClient := client.GetClient()

	oneMonthFromNow := time.Now().AddDate(0, 1, 0)
	timestamp := timestamppb.New(oneMonthFromNow)

	stubReq := &subscription.CreateOrUpdateSubscriptionRequest{
		Email:           req.Email,
		SubscribedUntil: timestamp,
	}

	stubResp, err := subscriptionClient.Stub.CreateOrUpdateSubscription(ctx, stubReq)
	if err != nil {
		log.Printf("Failed to create or update subscription: %v", err)
		return nil, status.Errorf(codes.Internal, "error creating or updating subscription: %v", err)
	}

	log.Printf("Subscription created or updated: %v", stubResp)
	return &make_payment.SuccessfulPaymentResponse{SubscribedUntil: stubResp.Details.SubscribedUntil}, nil
}
