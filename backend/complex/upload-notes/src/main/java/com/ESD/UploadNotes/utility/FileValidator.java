package com.ESD.UploadNotes.utility;

import java.util.stream.Stream;

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
    public boolean validate(MultipartFile file, String generateType) {
        return validateFile(file) && validateNoteData(generateType);
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
     * @param generateType The note data.
     * @return true if the note data meets the validation criteria, false otherwise.
     */
    public static boolean validateNoteData(String generateType) {
       return Stream.of(ContentType.values()).anyMatch(v -> v.name().equals(generateType));

    }
    public static String formatSize(long v) {
        if (v < 1024) return v + " B";
        int z = (63 - Long.numberOfLeadingZeros(v)) / 10;
        return String.format("%.1f %sB", (double)v / (1L << (z*10)), " KMGTPE".charAt(z));
    }
}
