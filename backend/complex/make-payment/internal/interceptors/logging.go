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
			"call_type": "Unary",
			"method":    info.FullMethod,
			"start":     start.Format(time.RFC3339),
		}).Info("request received")

		res, err = handler(ctx, req)

		fields := logrus.Fields{
			"call_type": "Unary",
			"method":    info.FullMethod,
			"took":      time.Since(start).String(),
		}

		if err != nil {
			fields["success"] = false
			logger.WithFields(fields).Error("request processed")
		} else {
			fields["success"] = true
			logger.WithFields(fields).Info("request processed")
		}

		return res, err
	}
}
