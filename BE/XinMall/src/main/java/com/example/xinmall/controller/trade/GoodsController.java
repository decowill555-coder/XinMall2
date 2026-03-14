package com.example.xinmall.controller.trade;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.example.xinmall.common.result.Result;
import com.example.xinmall.dto.system.request.CollectionRequest;
import com.example.xinmall.dto.trade.request.GoodsPublishRequest;
import com.example.xinmall.dto.trade.request.GoodsQueryRequest;
import com.example.xinmall.dto.trade.response.GoodsDetailVO;
import com.example.xinmall.dto.trade.response.GoodsVO;
import com.example.xinmall.service.system.CollectionService;
import com.example.xinmall.service.trade.GoodsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@Tag(name = "商品接口", description = "商品发布、查询相关接口")
@RestController
@RequestMapping("/api/goods")
@RequiredArgsConstructor
public class GoodsController {

    private final GoodsService goodsService;
    private final CollectionService collectionService;

    private static final int COLLECTION_TYPE_GOODS = 1;

    @Operation(summary = "发布商品")
    @PostMapping
    public Result<Long> publish(@Valid @RequestBody GoodsPublishRequest request) {
        Long id = goodsService.publish(request);
        return Result.created(id);
    }

    @Operation(summary = "商品列表")
    @GetMapping
    public Result<IPage<GoodsVO>> search(GoodsQueryRequest request) {
        IPage<GoodsVO> result = goodsService.search(request);
        return Result.success(result);
    }

    @Operation(summary = "商品详情")
    @GetMapping("/{id}")
    public Result<GoodsDetailVO> getDetail(@PathVariable Long id) {
        GoodsDetailVO detail = goodsService.getDetailById(id);
        goodsService.incrementViewCount(id);
        return Result.success(detail);
    }

    @Operation(summary = "更新商品")
    @PutMapping("/{id}")
    public Result<Void> update(@PathVariable Long id, @Valid @RequestBody GoodsPublishRequest request) {
        goodsService.update(id, request);
        return Result.success();
    }

    @Operation(summary = "下架商品")
    @PutMapping("/{id}/off")
    public Result<Void> offShelf(@PathVariable Long id) {
        goodsService.offShelf(id);
        return Result.success();
    }

    @Operation(summary = "上架商品")
    @PutMapping("/{id}/on")
    public Result<Void> onShelf(@PathVariable Long id) {
        goodsService.onShelf(id);
        return Result.success();
    }

    @Operation(summary = "我的发布")
    @GetMapping("/my")
    public Result<IPage<GoodsVO>> getMyGoods(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size) {
        IPage<GoodsVO> result = goodsService.getMyGoods(page, size);
        return Result.success(result);
    }

    @Operation(summary = "收藏商品")
    @PostMapping("/{id}/collect")
    public Result<Map<String, Object>> collect(@PathVariable Long id) {
        CollectionRequest request = new CollectionRequest();
        request.setTargetId(id);
        request.setTargetType(COLLECTION_TYPE_GOODS);
        collectionService.add(request);
        Long count = collectionService.getCollectionCount(id, COLLECTION_TYPE_GOODS);
        Map<String, Object> result = new HashMap<>();
        result.put("success", true);
        result.put("likeCount", count);
        return Result.success(result);
    }

    @Operation(summary = "取消收藏")
    @PostMapping("/{id}/uncollect")
    public Result<Map<String, Object>> uncollect(@PathVariable Long id) {
        CollectionRequest request = new CollectionRequest();
        request.setTargetId(id);
        request.setTargetType(COLLECTION_TYPE_GOODS);
        collectionService.remove(request);
        Long count = collectionService.getCollectionCount(id, COLLECTION_TYPE_GOODS);
        Map<String, Object> result = new HashMap<>();
        result.put("success", true);
        result.put("likeCount", count);
        return Result.success(result);
    }
}
