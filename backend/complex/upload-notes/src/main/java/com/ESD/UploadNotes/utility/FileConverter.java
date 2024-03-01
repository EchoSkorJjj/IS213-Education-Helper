package com.ESD.UploadNotes.utility;

import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Optional;

@Component
public class FileConverter {

    /**
     * Converts the uploaded file to a byte array.
     *
     * @param file The file to convert.
     * @return An Optional containing the byte array if conversion is successful, or an empty Optional otherwise.
     */
    public Optional<byte[]> convert(MultipartFile file) {
        try (ByteArrayOutputStream bos = new ByteArrayOutputStream()) {
            bos.write(file.getBytes());
            return Optional.of(bos.toByteArray());
        } catch (IOException e) {
            // Log error or handle it based on your error handling strategy
            return Optional.empty();
        }
    }
}
