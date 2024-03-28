package handletemporarycontents

import (
	"context"
	"log"

	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"

	"github.com/EchoSkorJjj/IS213-Education-Helper/handle-temporary-contents/internal/client"
	"github.com/EchoSkorJjj/IS213-Education-Helper/handle-temporary-contents/internal/utils"

	contentsPb "github.com/EchoSkorJjj/IS213-Education-Helper/handle-temporary-contents/pb/contents"
	htcPb "github.com/EchoSkorJjj/IS213-Education-Helper/handle-temporary-contents/pb/handle_temporary_contents"
)

type Server struct {
	htcPb.UnimplementedHandleTemporaryContentsServer
}

func NewServer() *Server {
	return &Server{}
}

func (s *Server) PollTemporaryContents(ctx context.Context, req *htcPb.PollTemporaryContentsRequest) (*htcPb.PollTemporaryContentsResponse, error) {
	contentsClient := client.GetContentClient()
	contentsStubReq := &contentsPb.GetAllTemporaryContentsRequest{NoteId: req.NoteId}
	contentsStubResp, err := contentsClient.Stub.GetAllTemporaryContents(ctx, contentsStubReq)
	if err != nil {
		log.Printf("Failed to poll temporary contents: %v", err)
		return nil, status.Errorf(codes.InvalidArgument, "error polling temporary contents: %v", err)
	}

	response := &htcPb.PollTemporaryContentsResponse{}
	if len(contentsStubResp.Mcqs) > 0 {
		for _, mcq := range contentsStubResp.Mcqs {
			response.Contents = append(response.Contents, &htcPb.OneOfContent{
				Content: &htcPb.OneOfContent_Mcq{
					Mcq: mcq,
				},
			})
		}
	} else {
		for _, flashcard := range contentsStubResp.Flashcards {
			response.Contents = append(response.Contents, &htcPb.OneOfContent{
				Content: &htcPb.OneOfContent_Flashcard{
					Flashcard: flashcard,
				},
			})
		}
	}

	return response, nil
}

func (s *Server) CreateTemporaryContent(ctx context.Context, req *htcPb.CreateTemporaryContentRequest) (*htcPb.CreateTemporaryContentResponse, error) {
	if err := utils.VerifyContentType(req.ContentType, *req.Content); err != nil {
		return nil, err
	}

	contentsClient := client.GetContentClient()
	response := &htcPb.CreateTemporaryContentResponse{}
	if req.ContentType == contentsPb.ContentType_MCQ {
		mcq := req.Content.GetMcq()
		contentsStubReq := &contentsPb.CreateTemporaryMultipleChoiceQuestionRequest{
			NoteId:   req.NoteId,
			Question: mcq.Question,
			Options:  mcq.Options,
		}

		contentsStubResp, err := contentsClient.Stub.CreateTemporaryMultipleChoiceQuestion(ctx, contentsStubReq)
		if err != nil {
			log.Printf("Failed to create temporary mcq: %v", err)
			return nil, status.Errorf(codes.Internal, "error creating temporary mcq: %v", err)
		}

		response.CreatedContent = &htcPb.OneOfContent{
			Content: &htcPb.OneOfContent_Mcq{
				Mcq: contentsStubResp.Mcq,
			},
		}
	} else {
		flashcard := req.Content.GetFlashcard()
		contentsStubReq := &contentsPb.CreateTemporaryFlashcardRequest{
			NoteId:   req.NoteId,
			Question: flashcard.Question,
			Answer:   flashcard.Answer,
		}

		contentsStubResp, err := contentsClient.Stub.CreateTemporaryFlashcard(ctx, contentsStubReq)
		if err != nil {
			log.Printf("Failed to create temporary flashcard: %v", err)
			return nil, status.Errorf(codes.Internal, "error creating temporary flashcard: %v", err)
		}

		response.CreatedContent = &htcPb.OneOfContent{
			Content: &htcPb.OneOfContent_Flashcard{
				Flashcard: contentsStubResp.Flashcard,
			},
		}
	}

	response.Success = true
	return response, nil
}

func (s *Server) DeleteTemporaryContent(ctx context.Context, req *htcPb.DeleteTemporaryContentRequest) (*htcPb.DeleteTemporaryContentResponse, error) {
	contentsClient := client.GetContentClient()
	response := &htcPb.DeleteTemporaryContentResponse{}
	if req.ContentType == contentsPb.ContentType_MCQ {
		contentsStubReq := &contentsPb.DeleteTemporaryMultipleChoiceQuestionRequest{NoteId: req.NoteId, Id: req.ContentId}
		contentsStubResp, err := contentsClient.Stub.DeleteTemporaryMultipleChoiceQuestion(ctx, contentsStubReq)
		if err != nil {
			log.Printf("Failed to delete temporary mcq: %v", err)
			return nil, status.Errorf(codes.Internal, "error deleting temporary mcq: %v", err)
		}

		response.DeletedContent = &htcPb.OneOfContent{
			Content: &htcPb.OneOfContent_Mcq{
				Mcq: contentsStubResp.Mcq,
			},
		}
	} else {
		contentsStubReq := &contentsPb.DeleteTemporaryFlashcardRequest{NoteId: req.NoteId, Id: req.ContentId}
		contentsStubResp, err := contentsClient.Stub.DeleteTemporaryFlashcard(ctx, contentsStubReq)
		if err != nil {
			log.Printf("Failed to delete temporary flashcard: %v", err)
			return nil, status.Errorf(codes.Internal, "error deleting temporary flashcard: %v", err)
		}

		response.DeletedContent = &htcPb.OneOfContent{
			Content: &htcPb.OneOfContent_Flashcard{
				Flashcard: contentsStubResp.Flashcard,
			},
		}
	}

	response.Success = true
	return response, nil
}

func (s *Server) DeleteAllTemporaryContents(ctx context.Context, req *htcPb.DeleteAllTemporaryContentsRequest) (*htcPb.DeleteAllTemporaryContentsResponse, error) {
	contentsClient := client.GetContentClient()
	contentsStubGetReq := &contentsPb.GetAllTemporaryContentsRequest{NoteId: req.NoteId}
	contentsStubResp, err := contentsClient.Stub.GetAllTemporaryContents(ctx, contentsStubGetReq)
	if err != nil {
		log.Printf("Failed to get all temporary contents: %v", err)
		return nil, status.Errorf(codes.Internal, "error getting all temporary contents: %v", err)
	}

	response := &htcPb.DeleteAllTemporaryContentsResponse{}
	for _, mcq := range contentsStubResp.Mcqs {
		contentsStubReq := &contentsPb.DeleteTemporaryMultipleChoiceQuestionRequest{NoteId: req.NoteId, Id: mcq.Id}
		_, err := contentsClient.Stub.DeleteTemporaryMultipleChoiceQuestion(ctx, contentsStubReq)
		if err != nil {
			log.Printf("Failed to delete temporary mcq: %v", err)
			return nil, status.Errorf(codes.Internal, "error deleting temporary mcq: %v", err)
		}

		response.DeletedContents = append(response.DeletedContents, &htcPb.OneOfContent{
			Content: &htcPb.OneOfContent_Mcq{
				Mcq: mcq,
			},
		})
	}

	for _, flashcard := range contentsStubResp.Flashcards {
		contentsStubReq := &contentsPb.DeleteTemporaryFlashcardRequest{NoteId: req.NoteId, Id: flashcard.Id}
		_, err := contentsClient.Stub.DeleteTemporaryFlashcard(ctx, contentsStubReq)
		if err != nil {
			log.Printf("Failed to delete temporary flashcard: %v", err)
			return nil, status.Errorf(codes.Internal, "error deleting temporary flashcard: %v", err)
		}

		response.DeletedContents = append(response.DeletedContents, &htcPb.OneOfContent{
			Content: &htcPb.OneOfContent_Flashcard{
				Flashcard: flashcard,
			},
		})
	}

	response.Success = true
	return response, nil
}

func (s *Server) UpdateTemporaryContent(ctx context.Context, req *htcPb.UpdateTemporaryContentRequest) (*htcPb.UpdateTemporaryContentResponse, error) {
	if err := utils.VerifyContentType(req.ContentType, *req.Content); err != nil {
		return nil, err
	}

	contentsClient := client.GetContentClient()
	response := &htcPb.UpdateTemporaryContentResponse{}
	if req.ContentType == contentsPb.ContentType_MCQ {
		mcq := req.Content.GetMcq()
		contentsStubReq := &contentsPb.UpdateTemporaryMultipleChoiceQuestionRequest{
			NoteId: req.NoteId,
			Id:     req.ContentId,
		}
		if mcq.Question != "" {
			contentsStubReq.Question = &mcq.Question
		}
		if len(mcq.Options) > 0 {
			contentsStubReq.Options = mcq.Options
		}

		contentsStubResp, err := contentsClient.Stub.UpdateTemporaryMultipleChoiceQuestion(ctx, contentsStubReq)
		if err != nil {
			log.Printf("Failed to update temporary mcq: %v", err)
			return nil, status.Errorf(codes.Internal, "error updating temporary mcq: %v", err)
		}

		response.UpdatedContent = &htcPb.OneOfContent{
			Content: &htcPb.OneOfContent_Mcq{
				Mcq: contentsStubResp.Mcq,
			},
		}
	} else {
		flashcard := req.Content.GetFlashcard()
		contentsStubReq := &contentsPb.UpdateTemporaryFlashcardRequest{
			NoteId: req.NoteId,
			Id:     req.ContentId,
		}
		if flashcard.Question != "" {
			contentsStubReq.Question = &flashcard.Question
		}
		if flashcard.Answer != "" {
			contentsStubReq.Answer = &flashcard.Answer
		}

		contentsStubResp, err := contentsClient.Stub.UpdateTemporaryFlashcard(ctx, contentsStubReq)
		if err != nil {
			log.Printf("Failed to update temporary flashcard: %v", err)
			return nil, status.Errorf(codes.Internal, "error updating temporary flashcard: %v", err)
		}

		response.UpdatedContent = &htcPb.OneOfContent{
			Content: &htcPb.OneOfContent_Flashcard{
				Flashcard: contentsStubResp.Flashcard,
			},
		}
	}

	response.Success = true
	return response, nil
}

func (s *Server) CommitTemporaryContents(ctx context.Context, req *htcPb.CommitTemporaryContentsRequest) (*htcPb.CommitTemporaryContentsResponse, error) {
	contentsClient := client.GetContentClient()
	contentsStubReq := &contentsPb.CommitTemporaryContentsRequest{NoteId: req.NoteId}
	_, err := contentsClient.Stub.CommitTemporaryContents(ctx, contentsStubReq)
	if err != nil {
		log.Printf("Failed to commit temporary contents: %v", err)
		return nil, status.Errorf(codes.Internal, "error committing temporary contents: %v", err)
	}

	response := &htcPb.CommitTemporaryContentsResponse{Success: true}
	return response, nil
}