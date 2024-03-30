package client

import (
	"fmt"
	"log"
	"os"
	"sync"

	"google.golang.org/grpc"

	userStoragePb "github.com/EchoSkorJjj/IS213-Education-Helper/verify-user/pb/user_storage"
)

type UserStorageClient struct {
	Conn *grpc.ClientConn
	Stub userStoragePb.UserStorageClient
}

var userStorageClient *UserStorageClient
var userStorageOnce sync.Once

func GetUserStorageClient() *UserStorageClient {
	userStorageOnce.Do(func() {
		userStorageServiceHost := os.Getenv("USER_STORAGE_SERVICE_HOST")
		userStorageServicePort := os.Getenv("USER_STORAGE_SERVICE_PORT")
		userStorageServiceConnString := fmt.Sprintf("%s:%s", userStorageServiceHost, userStorageServicePort)

		conn, err := grpc.Dial(userStorageServiceConnString, grpc.WithInsecure())
		if err != nil {
			log.Fatalf("Failed to dial user storage server: %v", err)
		}
		userStorageClient = &UserStorageClient{
			Conn: conn,
			Stub: userStoragePb.NewUserStorageClient(conn),
		}
	})

	return userStorageClient
}