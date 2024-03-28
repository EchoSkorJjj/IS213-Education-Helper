package interceptors

import (
	"context"
	"os"

	"github.com/sirupsen/logrus"
	"google.golang.org/grpc"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/metadata"

	"github.com/EchoSkorJjj/IS213-Education-Helper/handle-temporary-contents/internal/utils"
)

func abort() (interface{}, error) {
	return nil, grpc.Errorf(codes.PermissionDenied, "Missing kong-request-id")
}

func ValidationInterceptor(logger *logrus.Logger) grpc.UnaryServerInterceptor {
	return func(
		ctx context.Context,
		req interface{},
		info *grpc.UnaryServerInfo,
		handler grpc.UnaryHandler,
	) (res interface{}, err error) {
		md, _ := metadata.FromIncomingContext(ctx)
		environment := os.Getenv("ENVIRONMENT_MODE")
		method := info.FullMethod
		if utils.KongRequestIDCriticallyMissing(md, environment, method) {
			return abort()
		}

		return handler(ctx, req)
	}
}
