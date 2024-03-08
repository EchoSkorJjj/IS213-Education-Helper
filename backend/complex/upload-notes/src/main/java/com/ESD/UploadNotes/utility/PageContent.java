package com.ESD.UploadNotes.utility;

import java.util.regex.Pattern;

public class PageContent {
    String fileId;
    long pageId;
    String content;

    public PageContent(long pageId, String content, String fileId) {
        this.fileId = fileId;
        this.pageId = pageId;
        this.content = cleanContent(content);
    }

    public String cleanContent(String content) {
        content = content.replaceAll("s{4,}", ""); 

        return content;
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
