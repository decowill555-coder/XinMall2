package com.example.xinmall.entity.system;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.example.xinmall.entity.system.enums.FileType;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("upload_file")
public class UploadFile {

    @TableId(type = IdType.AUTO)
    private Long id;

    private Long userId;

    private String fileKey;

    private String fileUrl;

    private String fileName;

    private Long fileSize;

    private FileType fileType;

    private String mimeType;

    private Integer width;

    private Integer height;

    private String scene;

    private LocalDateTime createdAt;
}
