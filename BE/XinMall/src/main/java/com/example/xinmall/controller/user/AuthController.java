package com.example.xinmall.controller.user;

import com.example.xinmall.common.result.Result;
import com.example.xinmall.dto.user.request.LoginRequest;
import com.example.xinmall.dto.user.request.RegisterRequest;
import com.example.xinmall.dto.user.request.ResetPasswordRequest;
import com.example.xinmall.dto.user.request.SendCodeRequest;
import com.example.xinmall.dto.user.response.LoginVO;
import com.example.xinmall.dto.user.response.TokenVO;
import com.example.xinmall.service.user.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;

@Tag(name = "认证接口", description = "用户注册、登录相关接口")
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;

    @Operation(summary = "用户注册")
    @PostMapping("/register")
    public Result<Void> register(@Valid @RequestBody RegisterRequest request) {
        userService.register(request);
        return Result.created();
    }

    @Operation(summary = "用户登录")
    @PostMapping("/login")
    public Result<LoginVO> login(@Valid @RequestBody LoginRequest request) {
        LoginVO loginVO = userService.login(request);
        return Result.success(loginVO);
    }

    @Operation(summary = "用户登出")
    @PostMapping("/logout")
    public Result<Void> logout() {
        return Result.success();
    }

    @Operation(summary = "发送验证码")
    @PostMapping("/sms/send")
    public Result<Map<String, Object>> sendCode(@Valid @RequestBody SendCodeRequest request) {
        String code = String.format("%06d", new Random().nextInt(1000000));
        System.out.println("验证码: " + code + ", 手机号: " + request.getPhone() + ", 类型: " + request.getType());
        Map<String, Object> result = new HashMap<>();
        result.put("success", true);
        result.put("expireIn", 300);
        return Result.success(result);
    }

    @Operation(summary = "重置密码")
    @PostMapping("/password/reset")
    public Result<Void> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        userService.resetPassword(request);
        return Result.success();
    }

    @Operation(summary = "刷新Token")
    @PostMapping("/token/refresh")
    public Result<TokenVO> refreshToken(@RequestBody Map<String, String> params) {
        String refreshToken = params.get("refreshToken");
        TokenVO tokenVO = userService.refreshToken(refreshToken);
        return Result.success(tokenVO);
    }

    @Operation(summary = "检查手机号是否注册")
    @GetMapping("/check/phone")
    public Result<Map<String, Object>> checkPhone(@RequestParam String phone) {
        boolean exists = userService.checkPhoneExists(phone);
        Map<String, Object> result = new HashMap<>();
        result.put("exists", exists);
        return Result.success(result);
    }
}
