package com.ESD.UploadNotes.service;

import com.ESD.Notes.proto.NoteServiceGrpc;
import com.ESD.Notes.proto.NoteServiceGrpc.NoteServiceBlockingStub;
import com.ESD.Notes.proto.NotesServiceProto.UploadNoteRequest;
import com.ESD.Notes.proto.NotesServiceProto.UploadNoteResponse;
import com.ESD.UploadNotes.exception.GrpcServiceException;

import io.grpc.ManagedChannel;
import io.grpc.StatusRuntimeException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;


@Service
public class NotesGrpcClientServiceImpl implements NotesGrpcClientService {

  private static final Logger logger = LoggerFactory.getLogger(
    NotesGrpcClientServiceImpl.class
  );
  private final NoteServiceBlockingStub NotesStub;

  @Value("${app.rabbitmq.exchange}")
  private String exchange;

  @Value("${app.rabbitmq.routingkey}")
  private String routingKey;

  @Autowired
    public NotesGrpcClientServiceImpl(
            @Qualifier("grpcNotesChannel") ManagedChannel grpcNotesChannel
    ) {
        this.NotesStub = NoteServiceGrpc.newBlockingStub(grpcNotesChannel);
    }

@Override
public boolean uploadNotesToAws(String userId, String fileId, byte[] file) {
    try {
 
        UploadNoteRequest request = UploadNoteRequest
          .newBuilder()
          .setUserId(userId)
          .setFileId(fileId)
          .setFileContent(com.google.protobuf.ByteString.copyFrom(file))
          .build();
  
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
    
