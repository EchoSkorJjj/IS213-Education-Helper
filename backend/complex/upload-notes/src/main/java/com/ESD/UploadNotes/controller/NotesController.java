package com.ESD.UploadNotes.controller;

import com.ESD.UploadNotes.service.NotesService;
import com.ESD.UploadNotes.utility.ContentType;
import com.ESD.UploadNotes.utility.FileValidator;
import com.ESD.UploadNotes.exception.FileValidationException;
import com.ESD.UploadNotes.exception.NoteProcessingException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MaxUploadSizeExceededException;
import org.springframework.web.multipart.MultipartFile;
import java.util.HashMap;
import java.util.Map;


@RestController
@RequestMapping("/api/v1/notes")
public class NotesController {

    private static final Logger logger = LoggerFactory.getLogger(NotesController.class);

    @Autowired
    private NotesService notesService;

    @PostMapping("/upload")
    public ResponseEntity<Map<String, String>> uploadNote(@RequestParam("file") MultipartFile file,
                                                          @RequestParam("generateType") String generateType) {

        //  TODO: Bugs
        // 1. It throws 500 instead of 400 for ContentType not found
        Map<String, String> response = new HashMap<>();
        if (file.isEmpty()) {
            logger.error("Invalid request parameters. Null File. ");
            response.put("error", "Invalid file or generateType parameter");
            return ResponseEntity.badRequest().body(response);
        }
        if(!FileValidator.validateNoteData(generateType)) {
            logger.error("Invalid request parameters. Unknown generate type. ");
            response.put("error", "Invalid file or generateType parameter");
            return ResponseEntity.badRequest().body(response);
        }
       

        try {
            logger.debug("Received a request to process a note.");
            String fileId = notesService.processNote(file, generateType);
            
            if (fileId == null || fileId.trim().isEmpty()) {
                logger.error("Note processing failed with an empty fileId.");
                response.put("error", "Note processing failed");
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
            }

            logger.info("Note processed successfully.");
            response.put("message", "Note processed successfully");
            response.put("fileId", fileId);
            return ResponseEntity.ok(response);
        } catch (FileValidationException | NoteProcessingException e) {
            logger.error("Error during note processing: {}", e.getMessage());
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        } catch(MaxUploadSizeExceededException e) {
            logger.error("Max File size Exceeded. Actual file Size ("+FileValidator.formatSize(file.getSize())+"): {}", e.getMessage());
            response.put("error", "An unexpected error occurred");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        
        } catch (Exception e) {
            logger.error("An unexpected error occurred: {}", e.getMessage());
            response.put("error", "An unexpected error occurred");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}
