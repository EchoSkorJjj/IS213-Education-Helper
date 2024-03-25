package main

import (
	"log"
	"net"
	"os"

	"github.com/grpc-ecosystem/go-grpc-middleware"
	"github.com/joho/godotenv"
	"github.com/sirupsen/logrus"
	"google.golang.org/grpc"

	"github.com/EchoSkorJjj/IS213-Education-Helper/make-payment/internal/client"
	"github.com/EchoSkorJjj/IS213-Education-Helper/make-payment/internal/interceptors"
	"github.com/EchoSkorJjj/IS213-Education-Helper/make-payment/internal/server/health"
	"github.com/EchoSkorJjj/IS213-Education-Helper/make-payment/internal/server/makepayment"
	healthPb "github.com/EchoSkorJjj/IS213-Education-Helper/make-payment/pb/health"
	makepaymentPb "github.com/EchoSkorJjj/IS213-Education-Helper/make-payment/pb/make_payment"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Printf("Error loading .env file: %v. Defaulting to base configurations.", err)
	}

	logger := logrus.New()
	logger.SetFormatter(&logrus.JSONFormatter{})
	lis, err := net.Listen("tcp", os.Getenv("GRPC_SERVER_ADDRESS"))
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}

	var opts []grpc.ServerOption
	loggingInterceptor := interceptors.LoggingInterceptor(logger)
	vaidationInterceptor := interceptors.ValidationInterceptor(logger)
	opts = append(opts, grpc.UnaryInterceptor(
		grpc_middleware.ChainUnaryServer(
			loggingInterceptor,
			vaidationInterceptor,
		)))
	
	grpcServer := grpc.NewServer(opts...)

	makepaymentPb.RegisterMakePaymentServiceServer(grpcServer, makepayment.NewServer())
	healthPb.RegisterHealthServer(grpcServer, health.NewServer())

	client.InitClients()

	if err := grpcServer.Serve(lis); err != nil {
		log.Fatalf("failed to serve: %v", err)
	}
}
