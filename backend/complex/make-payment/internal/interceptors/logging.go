package interceptors

import (
	"context"
	"fmt"
	"strings"
	"time"

	"github.com/sirupsen/logrus"
	"google.golang.org/grpc"
)

type CustomFormatter struct {
	logrus.TextFormatter
}

func (f *CustomFormatter) Format(entry *logrus.Entry) ([]byte, error) {
	output := make([]string, 0, len(entry.Data))
	for key, value := range entry.Data {
		output = append(output, fmt.Sprintf("%s: %v", key, value))
	}
	entry.Message = strings.Join(output, " - ") + " - " + entry.Message
	return f.TextFormatter.Format(entry)
}

func LoggingInterceptor(logger *logrus.Logger) grpc.UnaryServerInterceptor {
	logger.Formatter = &CustomFormatter{}

	return func(
		ctx context.Context,
		req interface{},
		info *grpc.UnaryServerInfo,
		handler grpc.UnaryHandler,
	) (res interface{}, err error) {
		start := time.Now()

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
