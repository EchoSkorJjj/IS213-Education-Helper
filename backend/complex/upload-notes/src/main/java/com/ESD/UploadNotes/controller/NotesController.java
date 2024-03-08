package com.ESD.UploadNotes.controller;

import com.ESD.UploadNotes.service.NotesService;
import com.ESD.UploadNotes.utility.FileValidator;
import com.ESD.UploadNotes.utility.RequestExtractor;
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
                                                          @RequestParam("generateType") String generateType,
                                                          @RequestParam("fileName") String fileName) {

        Map<String, String> response = new HashMap<>();
        if (file.isEmpty()) {
            logger.error("Invalid request parameters. Null File. Kong Request ID : "+RequestExtractor.extractKongRequestId());
            response.put("error", "Invalid file or generateType parameter");
            return ResponseEntity.badRequest().body(response);
        }
        if(!FileValidator.validateNoteData(generateType)) {
            logger.error("Invalid request parameters. Unknown generate type.  Kong Request ID : "+RequestExtractor.extractKongRequestId());
            response.put("error", "Invalid file or generateType parameter");
            return ResponseEntity.badRequest().body(response);
        }
       

        try {
            logger.debug("Received a request to process a note.");
            String fileId = notesService.processNote(file, generateType, fileName);
            
            if (fileId == null || fileId.trim().isEmpty()) {
                logger.error("Note processing failed with an empty fileId. Kong Request ID : "+RequestExtractor.extractKongRequestId());
                response.put("error", "Note processing failed");
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
            }

            logger.info("Note processed successfully.");
            response.put("message", "Note processed successfully");
            response.put("fileId", fileId);
            return ResponseEntity.ok(response);
        }  catch (FileValidationException | NoteProcessingException e) {
            logger.error("Kong ID: "+RequestExtractor.extractKongRequestId()+"Error during note processing: {}", e.getMessage());
            response.put("error", e.getMessage());
            // Use HttpStatus.BAD_REQUEST for FileValidationException to indicate client error
            HttpStatus status = e instanceof FileValidationException ? HttpStatus.BAD_REQUEST : HttpStatus.INTERNAL_SERVER_ERROR;
            return ResponseEntity.status(status).body(response);
        } catch(MaxUploadSizeExceededException e) {
            String errorMessage = "Kong ID: "+RequestExtractor.extractKongRequestId()+"File size exceeds the maximum allowed limit of 15MB.";
            logger.error(errorMessage + " Actual file Size: " + FileValidator.formatSize(file.getSize()), e);
            response.put("error", errorMessage);
            return ResponseEntity.status(HttpStatus.PAYLOAD_TOO_LARGE).body(response); // 413 Payload Too Large
        } catch (Exception e) {
            logger.error("Kong ID: "+RequestExtractor.extractKongRequestId()+"An unexpected error occurred: {}", e.getMessage());
            response.put("error", "An unexpected error occurred. Please try again later.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}
