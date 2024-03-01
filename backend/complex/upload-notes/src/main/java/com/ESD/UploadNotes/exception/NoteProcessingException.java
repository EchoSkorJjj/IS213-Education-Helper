package com.ESD.UploadNotes.exception;

public class NoteProcessingException extends Exception{
    private String kongRequestId;

    public NoteProcessingException(String message, String kongRequestId) {
        super(message + " | Kong Request ID: " + kongRequestId);
        this.kongRequestId = kongRequestId;
    }

    public String getKongRequestId() {
        return kongRequestId;
    }
}
