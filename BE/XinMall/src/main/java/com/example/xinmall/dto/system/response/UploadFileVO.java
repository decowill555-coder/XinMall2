package com.example.xinmall.dto.system.response;

import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;

@Data
public class UploadFileVO implements Serializable {

    private static final long serialVersionUID = 1L;

    private Long id;

    private String fileKey;

    private String fileUrl;

    private String fileName;

    private Long fileSize;

    private String fileType;

    private String mimeType;

    private Integer width;

    private Integer height;

    private String scene;

    private LocalDateTime createdAt;
}
