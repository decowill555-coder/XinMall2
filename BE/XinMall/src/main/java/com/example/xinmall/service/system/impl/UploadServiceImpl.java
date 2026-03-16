package com.example.xinmall.service.system.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.example.xinmall.common.exception.BusinessException;
import com.example.xinmall.dto.system.response.UploadFileVO;
import com.example.xinmall.entity.system.UploadFile;
import com.example.xinmall.entity.system.enums.FileType;
import com.example.xinmall.mapper.system.UploadFileMapper;
import com.example.xinmall.service.system.UploadService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UploadServiceImpl implements UploadService {

    private final UploadFileMapper uploadFileMapper;

    @Value("${upload.path:./uploads}")
    private String uploadPath;

    @Value("${upload.url-prefix:/uploads}")
    private String urlPrefix;

    @Value("${server.base-url:http://localhost:8080}")
    private String serverBaseUrl;

    @Override
    @Transactional
    public UploadFileVO upload(MultipartFile file, String scene) {
        if (file.isEmpty()) {
            throw new BusinessException("上传文件不能为空");
        }

        Long userId = getCurrentUserId();

        String originalFilename = file.getOriginalFilename();
        String extension = originalFilename != null && originalFilename.contains(".")
                ? originalFilename.substring(originalFilename.lastIndexOf("."))
                : "";
        String newFilename = UUID.randomUUID().toString().replace("-", "") + extension;

        String datePath = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy/MM/dd"));
        String relativePath = datePath + "/" + newFilename;

        try {
            Path directory = Paths.get(uploadPath, datePath);
            Files.createDirectories(directory);

            Path filePath = Paths.get(uploadPath, relativePath);
            file.transferTo(filePath.toFile());
        } catch (IOException e) {
            throw new BusinessException("文件上传失败: " + e.getMessage());
        }

        UploadFile uploadFile = new UploadFile();
        uploadFile.setUserId(userId);
        uploadFile.setFileKey(relativePath);
        uploadFile.setFileUrl(serverBaseUrl + urlPrefix + "/" + relativePath);
        uploadFile.setFileName(originalFilename);
        uploadFile.setFileSize(file.getSize());
        uploadFile.setFileType(determineFileType(file.getContentType()));
        uploadFile.setMimeType(file.getContentType());
        uploadFile.setScene(scene);
        uploadFile.setCreatedAt(LocalDateTime.now());

        uploadFileMapper.insert(uploadFile);

        return convertToVO(uploadFile);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        Long userId = getCurrentUserId();
        UploadFile uploadFile = uploadFileMapper.selectById(id);
        if (uploadFile == null) {
            throw new BusinessException("文件不存在");
        }
        if (!uploadFile.getUserId().equals(userId)) {
            throw new BusinessException("无权删除此文件");
        }

        try {
            Path filePath = Paths.get(uploadPath, uploadFile.getFileKey());
            Files.deleteIfExists(filePath);
        } catch (IOException e) {
            throw new BusinessException("文件删除失败");
        }

        uploadFileMapper.deleteById(id);
    }

    @Override
    public UploadFileVO getById(Long id) {
        UploadFile uploadFile = uploadFileMapper.selectById(id);
        if (uploadFile == null) {
            throw new BusinessException("文件不存在");
        }
        return convertToVO(uploadFile);
    }

    private FileType determineFileType(String mimeType) {
        if (mimeType == null) return FileType.DOCUMENT;
        if (mimeType.startsWith("image/")) return FileType.IMAGE;
        if (mimeType.startsWith("video/")) return FileType.VIDEO;
        return FileType.DOCUMENT;
    }

    private UploadFileVO convertToVO(UploadFile uploadFile) {
        UploadFileVO vo = new UploadFileVO();
        BeanUtils.copyProperties(uploadFile, vo);
        vo.setFileType(uploadFile.getFileType().name());
        return vo;
    }

    private Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new BusinessException("用户未登录");
        }
        return Long.parseLong(authentication.getName());
    }
}
