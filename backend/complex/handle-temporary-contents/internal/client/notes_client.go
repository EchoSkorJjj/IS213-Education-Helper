package client

import (
	"fmt"
	"log"
	"os"
	"sync"

	"google.golang.org/grpc"

	"github.com/EchoSkorJjj/IS213-Education-Helper/handle-temporary-contents/pb/notes"
)

type NotesClient struct {
	Conn *grpc.ClientConn
	Stub notes.NoteServiceClient
}

var noteClient *NotesClient
var noteOnce sync.Once

func GetNoteClient() *NotesClient {
	noteOnce.Do(func() {
		noteServiceHost := os.Getenv("NOTES_SERVICE_HOST")
		noteServicePort := os.Getenv("NOTES_SERVICE_PORT")
		noteServiceConnString := fmt.Sprintf("%s:%s", noteServiceHost, noteServicePort)

		conn, err := grpc.Dial(noteServiceConnString, grpc.WithInsecure())
		if err != nil {
			log.Fatalf("Failed to dial notes server: %v", err)
		}
		noteClient = &NotesClient{
			Conn: conn,
			Stub: notes.NewNoteServiceClient(conn),
		}
	})

	return noteClient
}
