package com.ESD.UploadNotes.utility;

import com.ESD.UploadNotes.proto.UploadNotesProto;

import lombok.Getter;

import java.util.Map;
import java.util.HashMap;

@Getter
public class ProcessedContent {
    String userId;
    String fileId;
    Map<String, Object> metadata;

    public ProcessedContent(String userId, String fileId, UploadNotesProto.FileMetadata metadata) {
        this.userId = userId;
        this.fileId = fileId;
        this.metadata = convertMetadataToMap(metadata);
    }

    private Map<String, Object> convertMetadataToMap(UploadNotesProto.FileMetadata metadata) {
        Map<String, Object> map = new HashMap<>();
        map.put("title", metadata.getTitle());
        map.put("generateType", metadata.getGenerateType());
        map.put("pageCount", metadata.getPageCount());
        map.put("filesize", metadata.getFilesize());
        map.put("locale", metadata.getLocale());
        return map;
    }

}
