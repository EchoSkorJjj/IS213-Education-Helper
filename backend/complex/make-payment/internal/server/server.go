package payment

import (
	"context"
	"github.com/EchoSkorJjj/IS213-Education-Helper/make-payment/pb"
	"log"
)

// PaymentService represents the interface for our payment service, following the principle of defining behavior through interfaces.
type PaymentService interface {
	MakePayment(ctx context.Context, req *make_payment.PaymentRequest) (*make_payment.PaymentResponse, error)
}

// Server implements the PaymentService interface, handling gRPC requests.
type Server struct {
	make_payment.UnimplementedPaymentServiceServer
}

// NewServer returns a new payment Server.
func NewServer() *Server {
	return &Server{}
}

// MakePayment handles the MakePayment gRPC call.
func (s *Server) MakePayment(ctx context.Context, req *make_payment.PaymentRequest) (*make_payment.PaymentResponse, error) {
	log.Print("hit!")
	return &make_payment.PaymentResponse{Success: true}, nil
}
