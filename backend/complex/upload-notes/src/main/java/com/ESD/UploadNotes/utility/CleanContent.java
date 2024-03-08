package com.ESD.UploadNotes.utility;

import com.ESD.UploadNotes.proto.UploadNotesProto;
import java.util.Map;
import java.util.HashMap;

public class CleanContent {
    String userId;
    String fileId;
    Map<String, Object> metadata;

    public CleanContent(String userId, String fileId, UploadNotesProto.FileMetadata metadata) {
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

    public String getUserId() {
        return userId;
    }

    public String getFileId() {
        return fileId;
    }

    public Map<String, Object> getMetadata() {
        return metadata;
    }
}
