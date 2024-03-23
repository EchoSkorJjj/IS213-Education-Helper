package makepayment

import (
	"context"
	"log"
	"time"

	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
	"google.golang.org/protobuf/types/known/timestamppb"

	"github.com/EchoSkorJjj/IS213-Education-Helper/make-payment/internal/client"
	"github.com/EchoSkorJjj/IS213-Education-Helper/make-payment/internal/utils"
	makepaymentPb "github.com/EchoSkorJjj/IS213-Education-Helper/make-payment/pb/make_payment"
	paymentPb "github.com/EchoSkorJjj/IS213-Education-Helper/make-payment/pb/payment"
	subscriptionPb "github.com/EchoSkorJjj/IS213-Education-Helper/make-payment/pb/subscription"
)

type Server struct {
	makepaymentPb.UnimplementedMakePaymentServiceServer
}

func NewServer() *Server {
	return &Server{}
}

func (s *Server) Checkout(ctx context.Context, req *makepaymentPb.CheckoutRequest) (*makepaymentPb.CheckoutResponse, error) {
	paymentClient := client.GetPaymentClient()
	paymentStubReq := &paymentPb.CheckoutRequest{Email: req.Email}
	paymentStubResp, err := paymentClient.Stub.Checkout(ctx, paymentStubReq)
	if err != nil {
		log.Printf("Failed to create stripe checkout session: %v", err)
		return nil, status.Errorf(codes.InvalidArgument, "error creating stripe checkout session: %v", err)
	}

	return &makepaymentPb.CheckoutResponse{Url: paymentStubResp.Url}, nil
}

func (s *Server) SuccessfulPayment(ctx context.Context, req *makepaymentPb.SuccessfulPaymentRequest) (*makepaymentPb.SuccessfulPaymentResponse, error) {
	stripeSignature, err := utils.GetMetadata(ctx, "stripe-signature")
	if err != nil {
		log.Printf("Stripe signature not found in metadata")
		return nil, status.Errorf(codes.InvalidArgument, err.Error())
	}

	newCtx, err := utils.CreateNewContext(ctx, "stripe-signature", stripeSignature)
	if err != nil {
		log.Printf("Failed to create new context: %v", err)
		return nil, status.Errorf(codes.InvalidArgument, "error creating new context: %v", err)
	}

	paymentClient := client.GetPaymentClient()
	paymentStubReq := &paymentPb.WebhookRequest{Raw: req.Raw}
	paymentStubResp, err := paymentClient.Stub.Webhook(newCtx, paymentStubReq)
	if err != nil {
		log.Printf("Failed to validate stripe webhook request: %v", err)
		return nil, status.Errorf(codes.InvalidArgument, "error validating stripe webhook request")
	}

	subscriptionClient := client.GetSubscriptionClient()
	oneMonthFromNow := time.Now().AddDate(0, 1, 0)
	timestamp := timestamppb.New(oneMonthFromNow)
	subscriptionStubReq := &subscriptionPb.CreateOrUpdateSubscriptionRequest{
		StripeSubscriptionId: paymentStubResp.SubscriptionId,
		Email:                paymentStubResp.Email,
		SubscribedUntil:      timestamp,
	}

	subscriptionStubResp, err := subscriptionClient.Stub.CreateOrUpdateSubscription(ctx, subscriptionStubReq)
	if err != nil {
		log.Printf("Failed to create or update subscription: %v", err)
		return nil, status.Errorf(codes.Internal, "error creating or updating subscription: %v", err)
	}

	return &makepaymentPb.SuccessfulPaymentResponse{SubscribedUntil: subscriptionStubResp.Details.SubscribedUntil}, nil
}

func (s *Server) CancelSubscription(ctx context.Context, req *makepaymentPb.CancelSubscriptionRequest) (*makepaymentPb.CancelSubscriptionResponse, error) {
	subscriptionClient := client.GetSubscriptionClient()

	getSubscriptionStubReq := &subscriptionPb.GetSubscriptionRequest{Email: req.Email}
	getSubscriptionStubResp, err := subscriptionClient.Stub.GetSubscription(ctx, getSubscriptionStubReq)
	if err != nil {
		log.Printf("Failed to get subscription record: %v", err)
		return nil, status.Errorf(codes.InvalidArgument, "error getting subscription: %v", err)
	}

	paymentClient := client.GetPaymentClient()
	paymentStubReq := &paymentPb.CancelSubscriptionRequest{SubscriptionId: getSubscriptionStubResp.Details.StripeSubscriptionId}
	_, err = paymentClient.Stub.CancelSubscription(ctx, paymentStubReq)
	if err != nil {
		log.Printf("Failed to cancel stripe subscription: %v", err)
		return nil, status.Errorf(codes.Internal, "error cancelling stripe subscription: %v", err)
	}

	cancelSubscriptionStubReq := &subscriptionPb.CancelSubscriptionRequest{Email: req.Email}
	cancelSubscriptionStubResp, err := subscriptionClient.Stub.CancelSubscription(ctx, cancelSubscriptionStubReq)
	if err != nil {
		log.Printf("Failed to cancel subscription record: %v", err)
		return nil, status.Errorf(codes.Internal, "error cancelling subscription: %v", err)
	}

	return &makepaymentPb.CancelSubscriptionResponse{CancelledAt: cancelSubscriptionStubResp.Details.CancelledAt}, nil
}
