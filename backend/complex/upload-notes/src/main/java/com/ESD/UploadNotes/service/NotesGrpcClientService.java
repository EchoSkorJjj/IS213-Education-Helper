package com.ESD.UploadNotes.service;

public interface NotesGrpcClientService {

    public boolean uploadNotesToAws(String userId, String fileId, byte[] file, String fileName, String generateType);
    
}
