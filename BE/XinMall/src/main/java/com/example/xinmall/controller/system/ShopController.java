package com.example.xinmall.controller.system;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.example.xinmall.common.result.Result;
import com.example.xinmall.dto.system.request.ShopCreateRequest;
import com.example.xinmall.dto.system.response.ShopVO;
import com.example.xinmall.service.system.ShopService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@Tag(name = "店铺接口", description = "店铺管理相关接口")
@RestController
@RequestMapping("/api/shop")
@RequiredArgsConstructor
public class ShopController {

    private final ShopService shopService;

    @Operation(summary = "创建店铺")
    @PostMapping
    public Result<Long> createShop(@Valid @RequestBody ShopCreateRequest request) {
        Long id = shopService.createShop(request);
        return Result.created(id);
    }

    @Operation(summary = "获取我的店铺")
    @GetMapping("/my")
    public Result<ShopVO> getMyShop() {
        ShopVO shop = shopService.getMyShop();
        return Result.success(shop);
    }

    @Operation(summary = "获取店铺详情")
    @GetMapping("/{id}")
    public Result<ShopVO> getShopById(@PathVariable Long id) {
        ShopVO shop = shopService.getById(id);
        return Result.success(shop);
    }

    @Operation(summary = "更新店铺")
    @PutMapping("/{id}")
    public Result<Void> updateShop(@PathVariable Long id, @Valid @RequestBody ShopCreateRequest request) {
        shopService.updateShop(id, request);
        return Result.success();
    }

    @Operation(summary = "关闭店铺")
    @PutMapping("/{id}/close")
    public Result<Void> closeShop(@PathVariable Long id) {
        shopService.closeShop(id);
        return Result.success();
    }

    @Operation(summary = "重新开店")
    @PutMapping("/{id}/reopen")
    public Result<Void> reopenShop(@PathVariable Long id) {
        shopService.reopenShop(id);
        return Result.success();
    }

    @Operation(summary = "店铺列表")
    @GetMapping("/list")
    public Result<Page<ShopVO>> getShopList(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size) {
        Page<ShopVO> result = shopService.getShopList(page, size);
        return Result.success(result);
    }
}
