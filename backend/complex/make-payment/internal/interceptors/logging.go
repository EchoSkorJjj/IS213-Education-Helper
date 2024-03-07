package interceptors

import (
	"context"
	"time"

	"github.com/sirupsen/logrus"
	"google.golang.org/grpc"
)

func LoggingInterceptor(logger *logrus.Logger) grpc.UnaryServerInterceptor {
	return func(
		ctx context.Context,
		req interface{},
		info *grpc.UnaryServerInfo,
		handler grpc.UnaryHandler,
	) (res interface{}, err error) {
		start := time.Now()
		logger.WithFields(logrus.Fields{
			"method": info.FullMethod,
			"start":  start.Format(time.RFC3339),
		}).Info("request received")

		res, err = handler(ctx, req)

		logger.WithFields(logrus.Fields{
			"method": info.FullMethod,
			"took":   time.Since(start),
		}).Info("request processed")

		return res, err
	}
}
