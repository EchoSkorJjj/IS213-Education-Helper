package com.ESD.UploadNotes.service;

import com.ESD.UploadNotes.config.GrpcClientConfig;
import com.ESD.UploadNotes.proto.FileProcessorGrpc;
import com.ESD.UploadNotes.proto.UploadNotesProto.FileUploadRequest;
import com.ESD.UploadNotes.proto.UploadNotesProto.FileProcessResponse;
import com.ESD.UploadNotes.proto.UploadNotesProto.ServiceResponseWrapper;
import com.google.protobuf.ByteString;
import com.google.protobuf.InvalidProtocolBufferException;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.UUID;

@Service
public class GrpcClientService {

    private static final Logger logger = LoggerFactory.getLogger(GrpcClientService.class);
    private final FileProcessorGrpc.FileProcessorBlockingStub fileProcessorStub;
    private final RabbitTemplate rabbitTemplate;
    @Value("${app.rabbitmq.exchange}")
    private String exchange;

    @Value("${app.rabbitmq.routingkey}")
    private String routingKey;

    @Autowired
    public GrpcClientService(GrpcClientConfig grpcClientConfig, RabbitTemplate rabbitTemplate) {
        this.fileProcessorStub = FileProcessorGrpc.newBlockingStub(grpcClientConfig.managedChannel());
        this.rabbitTemplate = rabbitTemplate;
    }

    public void send(byte[] fileBytes, String filename, String kongRequestId) {
        try {
            String userId = UUID.randomUUID().toString();
            String fileId = generateFileSignature(fileBytes) + "-" + UUID.randomUUID().toString();

            FileUploadRequest request = FileUploadRequest.newBuilder()
                    .setUserId(userId)
                    .setFileId(fileId)
                    .setFilename(filename)
                    .setFile(ByteString.copyFrom(fileBytes))
                    .build();

            ServiceResponseWrapper responseWrapper = fileProcessorStub.processFile(request);
            FileProcessResponse response = responseWrapper.getPayload().unpack(FileProcessResponse.class);
            publishToRabbitMQ(response);
        } catch (InvalidProtocolBufferException e) {
            logger.error("Failed to unpack FileProcessResponse", e);
        } catch (Exception e) {
            logger.error("Failed to process file and send to RabbitMQ", e);
        }
    }

    private <T> void publishToRabbitMQ(T response) {
        rabbitTemplate.setConfirmCallback((correlationData, ack, cause) -> {
            if (ack) {
                logger.info("Message successfully delivered to the exchange");
            } else {
                logger.error("Failed to deliver message to the exchange: " + cause);
            }
        });
        rabbitTemplate.convertAndSend(exchange, routingKey, response);
        logger.info("Message published to RabbitMQ successfully");
    }

    private String generateFileSignature(byte[] fileBytes) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] encodedhash = digest.digest(fileBytes);
            return bytesToHex(encodedhash);
        } catch (NoSuchAlgorithmException e) {
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
