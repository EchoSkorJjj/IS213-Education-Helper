package health

import (
	"context"

	healthPb "github.com/EchoSkorJjj/IS213-Education-Helper/handle-temporary-contents/pb/health"
)

type Server struct {
	healthPb.UnimplementedHealthServer
}

func NewServer() *Server {
	return &Server{}
}

func (s *Server) Check(ctx context.Context, req *healthPb.HealthCheckRequest) (*healthPb.HealthCheckResponse, error) {
	return &healthPb.HealthCheckResponse{
		Status: healthPb.HealthCheckResponse_SERVING,
	}, nil
}

func (s *Server) Watch(req *healthPb.HealthCheckRequest, srv healthPb.Health_WatchServer) error {
	var response *healthPb.HealthCheckResponse
	response.Status = healthPb.HealthCheckResponse_SERVING
	srv.Send(response)
	return nil
}
