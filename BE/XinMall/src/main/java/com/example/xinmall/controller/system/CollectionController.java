package com.example.xinmall.controller.system;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.example.xinmall.common.result.Result;
import com.example.xinmall.dto.system.request.CollectionRequest;
import com.example.xinmall.service.system.CollectionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@Tag(name = "收藏接口", description = "收藏管理相关接口")
@RestController
@RequestMapping("/api/collection")
@RequiredArgsConstructor
public class CollectionController {

    private final CollectionService collectionService;

    @Operation(summary = "添加收藏")
    @PostMapping
    public Result<Void> add(@Valid @RequestBody CollectionRequest request) {
        collectionService.add(request);
        return Result.created();
    }

    @Operation(summary = "取消收藏")
    @DeleteMapping
    public Result<Void> remove(@Valid @RequestBody CollectionRequest request) {
        collectionService.remove(request);
        return Result.success();
    }

    @Operation(summary = "是否已收藏")
    @GetMapping("/check")
    public Result<Boolean> isCollected(
            @RequestParam Long targetId,
            @RequestParam Integer targetType) {
        boolean collected = collectionService.isCollected(targetId, targetType);
        return Result.success(collected);
    }

    @Operation(summary = "我的收藏列表")
    @GetMapping("/my")
    public Result<IPage<?>> getMyCollections(
            @RequestParam(required = false) Integer targetType,
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size) {
        IPage<?> result = collectionService.getMyCollections(targetType, page, size);
        return Result.success(result);
    }

    @Operation(summary = "收藏数量")
    @GetMapping("/count")
    public Result<Long> getCollectionCount(
            @RequestParam Long targetId,
            @RequestParam Integer targetType) {
        Long count = collectionService.getCollectionCount(targetId, targetType);
        return Result.success(count);
    }
}
