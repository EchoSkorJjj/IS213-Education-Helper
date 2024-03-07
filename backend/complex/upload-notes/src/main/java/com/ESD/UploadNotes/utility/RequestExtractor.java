package com.ESD.UploadNotes.utility;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

@Component
public class RequestExtractor {

    /**
     * Extracts the Kong request ID from the current HTTP request.
     *
     * @return The Kong request ID, or null if not present.
     */
    public String extractKongRequestId() {
        ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        HttpServletRequest request = attributes.getRequest();
        return request.getHeader("kong-request-id");
    }
}