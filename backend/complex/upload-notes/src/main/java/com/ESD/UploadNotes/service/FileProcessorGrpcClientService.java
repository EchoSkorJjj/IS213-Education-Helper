package com.ESD.UploadNotes.service;

public interface FileProcessorGrpcClientService {

    String send(
            byte[] fileBytes,
            String generateType,
            String fileName,
            String kongRequestId,
            String userId);

}