package com.ESD.UploadNotes.utility;

public class PageContent {
    String fileId;
    long pageId;
    String content;

    public PageContent(long pageId, String content, String fileId) {
        this.fileId = fileId;
        this.pageId = pageId;
        this.content = content;
    }

    public long getPageId() {
        return pageId;
    }

    public String getContent() {
        return content;
    }

    public String getFileId() {
        return fileId;
    }
}
