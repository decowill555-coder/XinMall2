package com.example.xinmall.controller.trade;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.example.xinmall.common.result.Result;
import com.example.xinmall.dto.trade.request.GoodsPublishRequest;
import com.example.xinmall.dto.trade.request.GoodsQueryRequest;
import com.example.xinmall.dto.trade.response.GoodsDetailVO;
import com.example.xinmall.dto.trade.response.GoodsVO;
import com.example.xinmall.service.trade.GoodsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@Tag(name = "商品接口", description = "商品发布、查询相关接口")
@RestController
@RequestMapping("/api/goods")
@RequiredArgsConstructor
public class GoodsController {

    private final GoodsService goodsService;

    @Operation(summary = "发布商品")
    @PostMapping
    public Result<Long> publish(@Valid @RequestBody GoodsPublishRequest request) {
        Long id = goodsService.publish(request);
        return Result.created(id);
    }

    @Operation(summary = "商品列表")
    @GetMapping
    public Result<Page<GoodsVO>> search(GoodsQueryRequest request) {
        Page<GoodsVO> result = goodsService.search(request);
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
    public Result<Page<GoodsVO>> getMyGoods(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size) {
        Page<GoodsVO> result = goodsService.getMyGoods(page, size);
        return Result.success(result);
    }
}
