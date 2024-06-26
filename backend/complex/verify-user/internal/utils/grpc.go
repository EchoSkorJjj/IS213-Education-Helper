package utils

import (
	"context"

	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/metadata"
	"google.golang.org/grpc/status"
)

func GetMetadata(ctx context.Context, key string) (string, error) {
	md, ok := metadata.FromIncomingContext(ctx)
	if !ok {
		return "", status.Errorf(codes.InvalidArgument, "missing metadata in context")
	}

	value, ok := md[key]
	if !ok || len(value) == 0 {
		return "", status.Errorf(codes.InvalidArgument, "missing %s in metadata", key)
	}

	return value[0], nil
}

func CreateNewContext(ctx context.Context, kvp ...string) (context.Context, error) {
	if len(kvp)%2 != 0 {
		return nil, status.Errorf(codes.InvalidArgument, "metadata key-value pairs must be even")
	}

	md := metadata.Pairs(kvp...)
	return metadata.NewOutgoingContext(ctx, md), nil
}

func KongRequestIDCriticallyMissing(md metadata.MD, environment string, method string) bool {
	if _, ok := md["kong-request-id"]; !ok {
		return environment != "development" && method != "/grpc.health.v1.Health/Check"
	}
	return false
}

func GenerateOutgoingContext(ctx context.Context) (context.Context, error) {
	md, ok := metadata.FromIncomingContext(ctx)
	if !ok {
		return nil, status.Errorf(codes.InvalidArgument, "error getting metadata from context")
	}

	md = md.Copy()
	return metadata.NewOutgoingContext(ctx, md), nil
}