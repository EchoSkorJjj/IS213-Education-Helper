package utils

import (
	"context"

	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/metadata"
	"google.golang.org/grpc/status"

	contentsPb "github.com/EchoSkorJjj/IS213-Education-Helper/handle-temporary-contents/pb/contents"
	htcPb "github.com/EchoSkorJjj/IS213-Education-Helper/handle-temporary-contents/pb/handle_temporary_contents"
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

func VerifyContentType(contentType contentsPb.ContentType, content htcPb.OneOfContent) error {
	switch contentType {
	case contentsPb.ContentType_MCQ:
		if content.GetMcq() == nil {
			return status.Errorf(codes.InvalidArgument, "invalid content type")
		}
		return nil
	case contentsPb.ContentType_FLASHCARD:
		if content.GetFlashcard() == nil {
			return status.Errorf(codes.InvalidArgument, "invalid content type")
		}
		return nil
	default:
		return status.Errorf(codes.InvalidArgument, "unsupported content type")
	}
}