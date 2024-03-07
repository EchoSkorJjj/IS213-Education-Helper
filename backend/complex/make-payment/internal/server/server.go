package payment

import (
	"context"
	"log"

	"github.com/EchoSkorJjj/IS213-Education-Helper/make-payment/pb"
)

type PaymentService interface {
	MakePayment(ctx context.Context, req *make_payment.PaymentRequest) (*make_payment.PaymentResponse, error)
}

type Server struct {
	make_payment.UnimplementedPaymentServiceServer
}

func NewServer() *Server {
	return &Server{}
}

func (s *Server) MakePayment(ctx context.Context, req *make_payment.PaymentRequest) (*make_payment.PaymentResponse, error) {
	log.Print("hit!")
	return &make_payment.PaymentResponse{Success: true}, nil
}
