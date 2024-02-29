package com.ESD.UploadNotes.service;

import org.slf4j.LoggerFactory;
import org.slf4j.Logger;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.ESD.UploadNotes.exception.FileValidationException;
import com.ESD.UploadNotes.exception.NoteProcessingException;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Optional;

@Service
public class NotesService {
    private static final Logger logger = LoggerFactory.getLogger(NotesService.class);

    /**
     * Processes the note, validating the file and note data, and prepares it for gRPC transmission.
     *
     * @param file The PDF file to be processed.
     * @param noteData The data associated with the note.
     * @return true if the note is processed successfully, false otherwise.
     * @throws FileValidationException 
     */

    public boolean processNote(MultipartFile file, String noteData) throws NoteProcessingException, FileValidationException {
        if (!validateInput(file, noteData)) {
            logger.warn("Invalid input for note processing");
            throw new FileValidationException("Invalid file or note data");
        }

        Optional<byte[]> fileBytes = convertFileToBytes(file);
        if (!fileBytes.isPresent()) {
            logger.error("Failed to convert file to bytes");
            throw new NoteProcessingException("Error during file conversion");
        }

        // Additional logic goes here

        return true;
    }

    private boolean validateInput(MultipartFile file, String noteData) {
        return !file.isEmpty() && isPdfFile(file) && isValidNoteData(noteData);
    }

    private boolean isPdfFile(MultipartFile file) {
        String contentType = file.getContentType();
        return "application/pdf".equals(contentType);
    }

    private boolean isValidNoteData(String noteData) {
        // Implement validation logic here
        return true; // Placeholder for validation logic
    }

    private Optional<byte[]> convertFileToBytes(MultipartFile file) {
        try (ByteArrayOutputStream bos = new ByteArrayOutputStream()) {
            bos.write(file.getBytes());
            return Optional.of(bos.toByteArray());
        } catch (IOException e) {
            // Log error or handle exception
            return Optional.empty();
        }
    }
}
