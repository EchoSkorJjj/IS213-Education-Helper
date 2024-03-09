package com.ESD.UploadNotes.utility;


import lombok.Getter;

@Getter
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


}
