package com.ESD.UploadNotes.exception;

public class FileValidationException extends Exception{

    private String kongRequestId;

    public FileValidationException(String message, String kongRequestId) {
        super(message + " | Kong Request ID: " + kongRequestId);
        this.kongRequestId = kongRequestId;
    }

    public String getKongRequestId() {
        return kongRequestId;
    }
}
