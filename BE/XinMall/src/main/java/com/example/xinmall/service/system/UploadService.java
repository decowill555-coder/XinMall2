package com.example.xinmall.service.system;

import com.example.xinmall.dto.system.response.UploadFileVO;
import org.springframework.web.multipart.MultipartFile;

public interface UploadService {

    UploadFileVO upload(MultipartFile file, String scene);

    void delete(Long id);

    UploadFileVO getById(Long id);
}
