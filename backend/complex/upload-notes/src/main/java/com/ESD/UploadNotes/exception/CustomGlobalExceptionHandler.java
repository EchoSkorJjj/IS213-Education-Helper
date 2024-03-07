package com.ESD.UploadNotes.exception;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class CustomGlobalExceptionHandler {

    private static final Logger logger = LoggerFactory.getLogger(CustomGlobalExceptionHandler.class);

    @ExceptionHandler(FileValidationException.class)
    public ResponseEntity<String> handleFileValidationException(FileValidationException ex) {
        String kongRequestId = ex.getKongRequestId();
        logger.error("File validation error: {}, Kong Request ID: {}", ex.getMessage(), kongRequestId);
        return new ResponseEntity<>(ex.getMessage() + " | Kong Request ID: " + kongRequestId, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(NoteProcessingException.class)
    public ResponseEntity<String> handleNoteProcessingException(NoteProcessingException ex) {
        String kongRequestId = ex.getKongRequestId();
        logger.error("Note processing error: {}, Kong Request ID: {}", ex.getMessage(), kongRequestId);
        return new ResponseEntity<>(ex.getMessage() + " | Kong Request ID: " + kongRequestId, HttpStatus.INTERNAL_SERVER_ERROR);
    }


}
