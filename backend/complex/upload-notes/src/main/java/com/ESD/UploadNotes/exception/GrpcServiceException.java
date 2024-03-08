package com.ESD.UploadNotes.exception;

public class GrpcServiceException extends RuntimeException {
    private final String detailMessage;

    public GrpcServiceException(String message, String detailMessage) {
        super(message);
        this.detailMessage = detailMessage;
    }

    public String getDetailMessage() {
        return detailMessage;
    }
}
