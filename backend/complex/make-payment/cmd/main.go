package main

import (
	"log"
	"net"
	"os"

	"github.com/joho/godotenv"
	"github.com/sirupsen/logrus"
	"google.golang.org/grpc"

	interceptors "github.com/EchoSkorJjj/IS213-Education-Helper/make-payment/internal/interceptors"
	payment "github.com/EchoSkorJjj/IS213-Education-Helper/make-payment/internal/server"
	make_payment "github.com/EchoSkorJjj/IS213-Education-Helper/make-payment/pb"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatalf("Error loading .env file: %v", err)
	}

	logger := logrus.New()
	logger.SetFormatter(&logrus.JSONFormatter{})
	lis, err := net.Listen("tcp", os.Getenv("GRPC_SERVER_ADDRESS"))
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}

	var opts []grpc.ServerOption
	opts = append(opts, grpc.UnaryInterceptor(interceptors.LoggingInterceptor(logger)))
	grpcServer := grpc.NewServer(opts...)
	make_payment.RegisterPaymentServiceServer(grpcServer, payment.NewServer())

	if err := grpcServer.Serve(lis); err != nil {
		log.Fatalf("failed to serve: %v", err)
	}
}
