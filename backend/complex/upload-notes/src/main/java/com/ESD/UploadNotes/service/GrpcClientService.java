package com.ESD.UploadNotes.service;

import com.ESD.UploadNotes.config.GrpcClientConfig;
import com.ESD.UploadNotes.proto.FileProcessorGrpc;
import com.ESD.UploadNotes.proto.UploadNotesProto.FileUploadRequest;
import com.ESD.UploadNotes.proto.UploadNotesProto.ServiceResponseWrapper;
import com.google.protobuf.ByteString;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class GrpcClientService {

    private final FileProcessorGrpc.FileProcessorBlockingStub fileProcessorStub;

    @Autowired
    public GrpcClientService(GrpcClientConfig grpcClientConfig) {
        // Directly obtain the ManagedChannel bean and use it to create the stub
        this.fileProcessorStub = FileProcessorGrpc.newBlockingStub(grpcClientConfig.managedChannel());
    }

    /**
     * Sends the file to the gRPC server.
     *
     * @param fileBytes The file bytes.
     * @param filename The name of the uploaded file.
     * @param kongRequestId The unique Kong request ID for this operation.
     */
    public void send(byte[] fileBytes, String filename, String kongRequestId) {
        // Generate UUIDs for userId and fileId
        String userId = UUID.randomUUID().toString();
        String fileId = UUID.randomUUID().toString();

        FileUploadRequest request = FileUploadRequest.newBuilder()
                .setUserId(userId)
                .setFileId(fileId)
                .setFilename(filename)
                .setFile(ByteString.copyFrom(fileBytes))
                .build();
        // TODO fwd req header kong
        // Assuming you manage Kong request ID separately, as it's not part of FileUploadRequest
        ServiceResponseWrapper response = fileProcessorStub.processFile(request);
        // Initialise RabbitMQ
    }
}
