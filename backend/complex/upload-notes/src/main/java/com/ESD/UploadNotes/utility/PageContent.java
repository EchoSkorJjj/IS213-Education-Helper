package com.ESD.UploadNotes.utility;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
public class PageContent {
    String fileId;
    long pageId;
    String content;

    public PageContent(long pageId, String content, String fileId) {
        this.fileId = fileId;
        this.pageId = pageId;
        this.content = content;
    }


}
