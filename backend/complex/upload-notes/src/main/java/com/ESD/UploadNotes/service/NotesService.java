package com.ESD.UploadNotes.service;

import com.ESD.UploadNotes.exception.FileValidationException;
import com.ESD.UploadNotes.exception.NoteProcessingException;
import com.ESD.UploadNotes.utility.FileConverter;
import com.ESD.UploadNotes.utility.FileValidator;
import com.ESD.UploadNotes.utility.RequestExtractor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MaxUploadSizeExceededException;
import org.springframework.web.multipart.MultipartFile;

@Service
public class NotesService {

  private static final Logger logger = LoggerFactory.getLogger(
    NotesService.class
  );

  private final FileValidator fileValidator;
  private final FileConverter fileConverter;
  private final GrpcClientService grpcClientService;
  private final RequestExtractor requestExtractor;

  @Autowired
  public NotesService(
    FileValidator fileValidator,
    FileConverter fileConverter,
    GrpcClientService grpcClientService,
    RequestExtractor requestExtractor
  ) {
    this.fileValidator = fileValidator;
    this.fileConverter = fileConverter;
    this.grpcClientService = grpcClientService;
    this.requestExtractor = requestExtractor;
  }

  public String processNote(MultipartFile file, String generateType)
    throws NoteProcessingException, FileValidationException {
    try {
      String kongRequestId = requestExtractor.extractKongRequestId();
      String userId = requestExtractor.extractUserId();
      if (!fileValidator.validate(file, generateType)) {
        logger.error(
          "Invalid input for note processing, Kong Request ID: {}",
          kongRequestId
        );
        throw new FileValidationException(
          "Invalid file or note data",
          kongRequestId
        );
      }

      byte[] fileBytes = fileConverter
        .convert(file)
        .orElseThrow(() ->
          new NoteProcessingException(
            "Error during file conversion",
            kongRequestId
          )
        );

      String fileId = grpcClientService.send(
        fileBytes,
        generateType,
        kongRequestId,
        userId
      );
      if (fileId == null || fileId.isEmpty()) {
        logger.error("Failed to get fileId from GRPC server.");
        throw new NoteProcessingException(
          "Failed to process note due to GRPC server error",
          kongRequestId
        );
      }

      return fileId;
    } catch (NoteProcessingException | FileValidationException e) {
      logger.error("Error processing note: {}", e.getMessage());
      throw e;
    } catch (MaxUploadSizeExceededException e) {
      logger.error(
        "Max File size Exceeded. Actual file Size (" +
        FileValidator.formatSize(file.getSize()) +
        "): {}",
        e.getMessage()
      );
      throw new FileValidationException(
        "Max File size Exceeded. Actual file Size (\"+FileValidator.formatSize(file.getSize())+\"): {}\", e.getMessage()",
        generateType
      );
    } catch (Exception e) {
      logger.error("Unexpected error processing note", e);
      throw new NoteProcessingException(
        "Unexpected error processing note",
        e.getMessage()
      );
    }
  }
}
