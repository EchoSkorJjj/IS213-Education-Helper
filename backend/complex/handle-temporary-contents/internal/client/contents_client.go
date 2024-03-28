package client

import (
	"fmt"
	"log"
	"os"
	"sync"

	"google.golang.org/grpc"

	"github.com/EchoSkorJjj/IS213-Education-Helper/handle-temporary-contents/pb/contents"
)

type ContentClient struct {
	Conn *grpc.ClientConn
	Stub contents.ContentClient
}

var contentClient *ContentClient
var contentOnce sync.Once

func GetContentClient() *ContentClient {
	contentOnce.Do(func() {
		contentServiceHost := os.Getenv("CONTENT_SERVICE_HOST")
		contentServicePort := os.Getenv("CONTENT_SERVICE_PORT")
		contentServiceConnString := fmt.Sprintf("%s:%s", contentServiceHost, contentServicePort)

		conn, err := grpc.Dial(contentServiceConnString, grpc.WithInsecure())
		if err != nil {
			log.Fatalf("Failed to dial content server: %v", err)
		}
		contentClient = &ContentClient{
			Conn: conn,
			Stub: contents.NewContentClient(conn),
		}
	})

	return contentClient
}
