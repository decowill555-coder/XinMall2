package com.example.xinmall.controller.system;

import com.example.xinmall.common.result.Result;
import com.example.xinmall.dto.system.request.ShopAuthRequest;
import com.example.xinmall.dto.system.response.ShopAuthVO;
import com.example.xinmall.service.system.ShopAuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@Tag(name = "店铺认证接口", description = "店铺认证相关接口")
@RestController
@RequestMapping("/api/shop-auth")
@RequiredArgsConstructor
public class ShopAuthController {

    private final ShopAuthService shopAuthService;

    @Operation(summary = "提交店铺认证申请")
    @PostMapping
    public Result<Long> submitAuth(@Valid @RequestBody ShopAuthRequest request) {
        Long id = shopAuthService.submitAuth(request);
        return Result.created(id);
    }

    @Operation(summary = "获取认证状态")
    @GetMapping("/status")
    public Result<ShopAuthVO> getAuthStatus() {
        ShopAuthVO status = shopAuthService.getAuthStatus();
        return Result.success(status);
    }
}
