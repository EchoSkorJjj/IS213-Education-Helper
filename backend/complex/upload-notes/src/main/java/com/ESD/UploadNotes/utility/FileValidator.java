package com.ESD.UploadNotes.utility;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

@Component
public class FileValidator {

    /**
     * Validates the input file and note data.
     *
     * @param file The uploaded file to validate.
     * @param noteData The note data to validate.
     * @return true if both the file and note data are valid, false otherwise.
     */
    public boolean validate(MultipartFile file, String noteData) {
        return validateFile(file) && validateNoteData(noteData);
    }

    /**
     * Validates the uploaded file.
     *
     * @param file The uploaded file.
     * @return true if the file is not empty and is a PDF, false otherwise.
     */
    private boolean validateFile(MultipartFile file) {
        if (file.isEmpty()) {
            return false;
        }

        String contentType = file.getContentType();
        return "application/pdf".equals(contentType);
    }

    /**
     * Validates the note data.
     *
     * @param noteData The note data.
     * @return true if the note data meets the validation criteria, false otherwise.
     */
    private boolean validateNoteData(String noteData) {
        // Implement note data validation logic here (e.g., non-empty, specific format, length)
        return noteData != null && !noteData.trim().isEmpty(); // Example validation
    }
}
