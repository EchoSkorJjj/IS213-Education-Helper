package com.ESD.UploadNotes.service;

import com.ESD.UploadNotes.exception.GrpcServiceException;
import com.ESD.UploadNotes.proto.FileProcessorGrpc;
import com.ESD.UploadNotes.proto.UploadNotesProto;
import com.ESD.UploadNotes.utility.PageContent;
import com.ESD.UploadNotes.utility.ProcessedContent;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.protobuf.InvalidProtocolBufferException;
import io.grpc.ManagedChannel;
import io.grpc.StatusRuntimeException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class FileProcessorGrpcClientServiceImpl
  implements FileProcessorGrpcClientService {

  private final ObjectMapper objectMapper = new ObjectMapper();

  private static final Logger logger = LoggerFactory.getLogger(
    FileProcessorGrpcClientServiceImpl.class
  );
  private final FileProcessorGrpc.FileProcessorBlockingStub fileProcessorStub;
  private final RabbitTemplate rabbitTemplate;

  @Value("${app.rabbitmq.exchange}")
  private String exchange;

  @Value("${app.rabbitmq.routingkey}")
  private String routingKey;

  private final NotesGrpcClientService notesGrpcClientService;

  @Autowired
  public FileProcessorGrpcClientServiceImpl(
    @Qualifier(
      "grpcFileProcessorChannel"
    ) ManagedChannel grpcFileProcessorChannel,
    RabbitTemplate rabbitTemplate,
    NotesGrpcClientService notesGrpcClientService
  ) {
    this.fileProcessorStub =
      FileProcessorGrpc.newBlockingStub(grpcFileProcessorChannel);
    this.rabbitTemplate = rabbitTemplate;
    this.notesGrpcClientService = notesGrpcClientService;
  }

  @Override
  public String send(
    byte[] fileBytes,
    String generateType,
    String fileName,
    String kongRequestId,
    String userId
  ) {
    try {
      String fileId =
        generateFileSignature(fileBytes) + "-" + UUID.randomUUID().toString();

      UploadNotesProto.FileUploadRequest request = UploadNotesProto.FileUploadRequest
        .newBuilder()
        .setUserId(userId)
        .setFileId(fileId)
        .setGenerateType(generateType)
        .setFileName(fileName)
        .setFile(com.google.protobuf.ByteString.copyFrom(fileBytes))
        .build();

      UploadNotesProto.ServiceResponseWrapper responseWrapper = fileProcessorStub.processFile(
        request
      );
      if (
        !responseWrapper
          .getPayload()
          .is(UploadNotesProto.FileProcessResponse.class)
      ) {
        logger.error("Payload is not of FileProcessResponse type.");
        return null;
      }
      UploadNotesProto.FileProcessResponse response = responseWrapper
        .getPayload()
        .unpack(UploadNotesProto.FileProcessResponse.class);
      boolean awsResponse = false;

      if (response.getFileId().equals(fileId)) {
        awsResponse =
          notesGrpcClientService.uploadNotesToAws(userId, fileId, fileBytes);
      }
      else {
        logger.error("Preprocessing Failed.");
        return null;
      }

      if (awsResponse) {
        ProcessedContent processedContent = new ProcessedContent(
          userId,
          response.getFileId(),
          response.getMetadata()
        );

        publishToRabbitMQ(processedContent);

        for (UploadNotesProto.Page page : response.getPagesList()) {
          PageContent pageContent = new PageContent(
            page.getPageId(),
            page.getContent(),
            processedContent.getFileId()
          );
          publishToRabbitMQ(pageContent);
        }

        return fileId;
      }  else {
        logger.error("Upload to AWS failed.");
        return null;
      }
    } catch (InvalidProtocolBufferException e) {
      logger.error("Failed to unpack FileProcessResponse", e);
      return null;
    } catch (StatusRuntimeException e) {
      throw new GrpcServiceException(
        "Upstream GRPC server returned an error response.",
        null
      );
    } catch (Exception e) {
      logger.error("Failed to process file or send to RabbitMQ", e);
      return null;
    }
  }

  private <T> void publishToRabbitMQ(T response) {
    try {
      String jsonMessage = objectMapper.writeValueAsString(response);
      rabbitTemplate.convertAndSend(exchange, routingKey, jsonMessage);
      logger.info("Message published to RabbitMQ successfully");
    } catch (JsonProcessingException e) {
      logger.error("Error serializing object to JSON", e);
      throw new IllegalStateException("Error serializing object to JSON", e);
    }
  }

  private String generateFileSignature(byte[] fileBytes) {
    try {
      MessageDigest digest = MessageDigest.getInstance("SHA-256");
      byte[] encodedhash = digest.digest(fileBytes);
      return bytesToHex(encodedhash);
    } catch (NoSuchAlgorithmException e) {
      logger.error("SHA-256 algorithm not found", e);
      throw new RuntimeException("SHA-256 algorithm not found", e);
    }
  }

  private static String bytesToHex(byte[] hash) {
    StringBuilder hexString = new StringBuilder(2 * hash.length);
    for (byte b : hash) {
      String hex = Integer.toHexString(0xff & b);
      if (hex.length() == 1) {
        hexString.append('0');
      }
      hexString.append(hex);
    }
    return hexString.toString();
  }
}
