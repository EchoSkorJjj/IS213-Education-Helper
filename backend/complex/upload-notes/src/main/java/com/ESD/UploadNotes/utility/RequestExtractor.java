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
    public static String extractKongRequestId() {
        ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        HttpServletRequest request = attributes.getRequest();
        return request.getHeader("kong-request-id");
    }

    /**
     * Extracts the user ID from the current HTTP request.
     *
     * @return The user ID, or null if not present.
     */
    public static String extractUserId() {
        ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        HttpServletRequest request = attributes.getRequest();
        return request.getHeader("x-user-id");
    }
}
