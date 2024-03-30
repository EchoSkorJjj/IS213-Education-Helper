package verifyuser

import (
	"bytes"
	"context"
	"log"
	"time"

	"github.com/golang/protobuf/jsonpb"
	"github.com/golang/protobuf/ptypes/any"
	"google.golang.org/grpc"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/metadata"
	"google.golang.org/grpc/status"

	"github.com/EchoSkorJjj/IS213-Education-Helper/verify-user/internal/client"
	"github.com/EchoSkorJjj/IS213-Education-Helper/verify-user/internal/utils"
	subscriptionPb "github.com/EchoSkorJjj/IS213-Education-Helper/verify-user/pb/subscription"
	userstoragePb "github.com/EchoSkorJjj/IS213-Education-Helper/verify-user/pb/user_storage"
	verifyuserPb "github.com/EchoSkorJjj/IS213-Education-Helper/verify-user/pb/verify_user"
)

type Server struct {
	verifyuserPb.UnimplementedVerifyUserServer
}

func NewServer() *Server {
	return &Server{}
}

func (s *Server) GoogleAuth(ctx context.Context, req *userstoragePb.AuthRequest) (*userstoragePb.ServiceResponseWrapper, error) {
	userStorageClient := client.GetUserStorageClient()
	subscriptionClient := client.GetSubscriptionClient()

	outgoingCtx, err := utils.GenerateOutgoingContext(ctx)
	if err != nil {
		log.Printf("Failed to generate outgoing context: %v", err)
		return nil, err
	}

	md := metadata.MD{}
	userStorageStubReq := &userstoragePb.AuthRequest{Code: req.Code}
	userStorageStubResp, err := userStorageClient.Stub.GoogleAuth(
		outgoingCtx,
		userStorageStubReq,
		grpc.Header(&md),
	)

	if err != nil {
		log.Printf("Failed to authenticate user: %v", err)
		return nil, status.Errorf(codes.InvalidArgument, "error authenticating user: %v", err)
	}

	if err = grpc.SendHeader(ctx, md); err != nil {
		log.Printf("Failed to send header: %v", err)
		return nil, status.Errorf(codes.Internal, "error sending header: %v", err)
	}

	payload := &userstoragePb.GoogleAuthPayload{}
	if err := jsonpb.Unmarshal(bytes.NewReader(userStorageStubResp.Payload.Value), payload); err != nil {
		log.Printf("Failed to unmarshal payload into GoogleAuthPayload: %v", err)
		return nil, status.Errorf(codes.Internal, "error unmarshalling payload: %v", err)
	}

	subscriptionStubReq := &subscriptionPb.GetSubscriptionRequest{Email: payload.Email}
	subscriptionStubResp, err := subscriptionClient.Stub.GetSubscription(ctx, subscriptionStubReq)
	if err != nil || subscriptionStubResp == nil {
		return userStorageStubResp, nil
	}

	subscribedUntil := subscriptionStubResp.Details.SubscribedUntil.AsTime()
	payload.IsPaid = subscribedUntil.After(time.Now())
	m := jsonpb.Marshaler{
		EmitDefaults: true,
		OrigName:     true,
	}

	jsonStr, err := m.MarshalToString(payload)
	if err != nil {
		log.Printf("Failed to marshal payload into JSON: %v", err)
		return nil, status.Errorf(codes.Internal, "error marshalling payload: %v", err)
	}

	anyMsg := &any.Any{
		TypeUrl: userStorageStubResp.Payload.TypeUrl,
		Value:   []byte(jsonStr),
	}

	userStorageStubResp.Payload = anyMsg
	return userStorageStubResp, nil
}

func (s *Server) MyInfoCode(ctx context.Context, req *userstoragePb.MyInfoCodeRequest) (*userstoragePb.MyInfoCodeResponse, error) {
	userStorageClient := client.GetUserStorageClient()
	outgoingCtx, err := utils.GenerateOutgoingContext(ctx)
	if err != nil {
		log.Printf("Failed to generate outgoing context: %v", err)
		return nil, err
	}

	md := metadata.MD{}
	userStorageStubReq := &userstoragePb.MyInfoCodeRequest{}
	userStorageStubResp, err := userStorageClient.Stub.MyInfoCode(
		outgoingCtx,
		userStorageStubReq,
		grpc.Header(&md),
	)
	if err != nil {
		log.Printf("Failed to get MyInfo code: %v", err)
		return nil, err
	}

	return userStorageStubResp, nil
}

func (s *Server) MyInfoAuth(ctx context.Context, req *userstoragePb.AuthRequest) (*userstoragePb.ServiceResponseWrapper, error) {
	userStorageClient := client.GetUserStorageClient()
	outgoingCtx, err := utils.GenerateOutgoingContext(ctx)
	if err != nil {
		log.Printf("Failed to generate outgoing context: %v", err)
		return nil, err
	}

	userStorageStubReq := &userstoragePb.AuthRequest{Code: req.Code}
	userStorageStubResp, err := userStorageClient.Stub.MyInfoAuth(outgoingCtx, userStorageStubReq)
	if err != nil {
		log.Printf("Failed to authenticate user: %v", err)
		return nil, err
	}

	return userStorageStubResp, nil
}

func (s *Server) SgIdAuthUrl(ctx context.Context, req *userstoragePb.SgIdAuthUrlRequest) (*userstoragePb.SgIdAuthUrlResponse, error) {
	userStorageClient := client.GetUserStorageClient()
	outgoingCtx, err := utils.GenerateOutgoingContext(ctx)
	if err != nil {
		log.Printf("Failed to generate outgoing context: %v", err)
		return nil, err
	}

	userStorageStubReq := &userstoragePb.SgIdAuthUrlRequest{}
	userStorageStubResp, err := userStorageClient.Stub.SgIdAuthUrl(outgoingCtx, userStorageStubReq)
	if err != nil {
		log.Printf("Failed to get SGID auth URL: %v", err)
		return nil, err
	}

	return userStorageStubResp, nil
}

func (s *Server) SgIdAuth(ctx context.Context, req *userstoragePb.AuthRequest) (*userstoragePb.ServiceResponseWrapper, error) {
	userStorageClient := client.GetUserStorageClient()
	outgoingCtx, err := utils.GenerateOutgoingContext(ctx)
	if err != nil {
		log.Printf("Failed to generate outgoing context: %v", err)
		return nil, err
	}

	userStorageStubReq := &userstoragePb.AuthRequest{Code: req.Code}
	userStorageStubResp, err := userStorageClient.Stub.SgIdAuth(outgoingCtx, userStorageStubReq)
	if err != nil {
		log.Printf("Failed to authenticate user: %v", err)
		return nil, err
	}

	return userStorageStubResp, nil
}

func (s *Server) Logout(ctx context.Context, req *userstoragePb.LogoutRequest) (*userstoragePb.ServiceResponseWrapper, error) {
	userStorageClient := client.GetUserStorageClient()
	outgoingCtx, err := utils.GenerateOutgoingContext(ctx)
	if err != nil {
		log.Printf("Failed to generate outgoing context: %v", err)
		return nil, err
	}

	userStorageStubReq := &userstoragePb.LogoutRequest{}
	userStorageStubResp, err := userStorageClient.Stub.Logout(outgoingCtx, userStorageStubReq)
	if err != nil {
		log.Printf("Failed to logout user: %v", err)
		return nil, err
	}

	return userStorageStubResp, nil
}
