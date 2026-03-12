package com.example.xinmall.controller.system;

import com.example.xinmall.common.result.Result;
import com.example.xinmall.dto.system.response.UploadFileVO;
import com.example.xinmall.service.system.UploadService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@Tag(name = "上传接口", description = "文件上传相关接口")
@RestController
@RequestMapping("/api/upload")
@RequiredArgsConstructor
public class UploadController {

    private final UploadService uploadService;

    @Operation(summary = "上传文件")
    @PostMapping
    public Result<UploadFileVO> upload(
            @RequestParam("file") MultipartFile file,
            @RequestParam(required = false) String scene) {
        UploadFileVO result = uploadService.upload(file, scene);
        return Result.success(result);
    }

    @Operation(summary = "删除文件")
    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Long id) {
        uploadService.delete(id);
        return Result.success();
    }

    @Operation(summary = "获取文件信息")
    @GetMapping("/{id}")
    public Result<UploadFileVO> getById(@PathVariable Long id) {
        UploadFileVO result = uploadService.getById(id);
        return Result.success(result);
    }
}
