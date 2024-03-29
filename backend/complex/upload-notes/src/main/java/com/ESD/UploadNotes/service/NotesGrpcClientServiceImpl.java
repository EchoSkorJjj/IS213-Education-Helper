package com.ESD.UploadNotes.service;

import com.ESD.Notes.proto.NoteServiceGrpc;
import com.ESD.Notes.proto.NoteServiceGrpc.NoteServiceBlockingStub;
import com.ESD.Notes.proto.NotesServiceProto.Note;
import com.ESD.Notes.proto.NotesServiceProto.UploadNoteRequest;
import com.ESD.Notes.proto.NotesServiceProto.UploadNoteResponse;
import com.ESD.UploadNotes.exception.GrpcServiceException;

import io.grpc.ManagedChannel;
import io.grpc.StatusRuntimeException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;

import org.springframework.stereotype.Service;


@Service
public class NotesGrpcClientServiceImpl implements NotesGrpcClientService {

  private static final Logger logger = LoggerFactory.getLogger(
    NotesGrpcClientServiceImpl.class
  );
  private final NoteServiceBlockingStub NotesStub;

  @Autowired
    public NotesGrpcClientServiceImpl(
            @Qualifier("grpcNotesChannel") ManagedChannel grpcNotesChannel
    ) {
        this.NotesStub = NoteServiceGrpc.newBlockingStub(grpcNotesChannel);
    }

@Override
public boolean uploadNotesToAws(String userId, String fileId, byte[] file, String fileName, String generateType) {
    try {
        Note note = Note.newBuilder()
        .setUserId(userId)
        .setFileId(fileId)
        .setFileName(fileName)
        .setTitle("Test title") // Until title is added to the request
        .setTopic("Test topic") // Until topic is added to the request
        .setGenerateType(generateType)
        .setFileContent(com.google.protobuf.ByteString.copyFrom(file))
        .build();

        UploadNoteRequest request = UploadNoteRequest
          .newBuilder()
          .setNote(note)
          .build();
        // UploadNoteRequest request = UploadNoteRequest
        //   .newBuilder()
        //   .setUserId(userId)
        //   .setFileId(fileId)
        //   .setFileName(fileName)
        //   .setFileContent(com.google.protobuf.ByteString.copyFrom(file))
        //   .build();
  
        UploadNoteResponse responseWrapper = NotesStub.uploadNote(
          request
        );
        if (
          responseWrapper.getFileId().isBlank()
        ) {
          logger.error("Payload is not of FileProcessResponse type.");
          return false;
        }
        String response = responseWrapper.getFileId();
  
        if (response.equals(fileId)) {
          return true;
        } else {
          logger.error("File processing failed or file ID mismatch.");
          return false;
        }
      }  catch (StatusRuntimeException e) {
        throw new GrpcServiceException(
          "Upstream GRPC server returned an error response.",null
        );
      } catch (Exception e) {
        logger.error("Failed to process file or send to RabbitMQ", e);
        return false;
      }
}

}
    
