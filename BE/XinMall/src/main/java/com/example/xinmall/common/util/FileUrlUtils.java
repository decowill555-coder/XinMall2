package com.example.xinmall.common.util;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class FileUrlUtils {

    private static String serverBaseUrl;
    private static String urlPrefix;

    @Value("${server.base-url:http://localhost:8080}")
    public void setServerBaseUrl(String serverBaseUrl) {
        FileUrlUtils.serverBaseUrl = serverBaseUrl;
    }

    @Value("${upload.url-prefix:/uploads}")
    public void setUrlPrefix(String urlPrefix) {
        FileUrlUtils.urlPrefix = urlPrefix;
    }

    public static String getFullUrl(String relativeUrl) {
        if (relativeUrl == null || relativeUrl.isEmpty()) {
            return null;
        }
        if (relativeUrl.startsWith("http://") || relativeUrl.startsWith("https://")) {
            return relativeUrl;
        }
        if (relativeUrl.startsWith(urlPrefix)) {
            return serverBaseUrl + relativeUrl;
        }
        if (relativeUrl.startsWith("/")) {
            return serverBaseUrl + relativeUrl;
        }
        return serverBaseUrl + urlPrefix + "/" + relativeUrl;
    }

    public static String getRelativeUrl(String fullUrl) {
        if (fullUrl == null || fullUrl.isEmpty()) {
            return null;
        }
        if (fullUrl.startsWith(serverBaseUrl)) {
            return fullUrl.substring(serverBaseUrl.length());
        }
        if (fullUrl.startsWith(urlPrefix)) {
            return fullUrl;
        }
        return fullUrl;
    }

    public static boolean isFullUrl(String url) {
        if (url == null) {
            return false;
        }
        return url.startsWith("http://") || url.startsWith("https://");
    }
}
