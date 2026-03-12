package com.example.xinmall.controller.user;

import com.example.xinmall.common.result.Result;
import com.example.xinmall.dto.user.request.RealNameRequest;
import com.example.xinmall.dto.user.request.UpdatePasswordRequest;
import com.example.xinmall.dto.user.request.UpdateUserRequest;
import com.example.xinmall.dto.user.response.UserProfileVO;
import com.example.xinmall.dto.user.response.UserVO;
import com.example.xinmall.service.user.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@Tag(name = "用户接口", description = "用户信息管理相关接口")
@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @Operation(summary = "获取当前用户信息")
    @GetMapping("/info")
    public Result<UserVO> getCurrentUser() {
        UserVO userVO = userService.getCurrentUser();
        return Result.success(userVO);
    }

    @Operation(summary = "更新用户信息")
    @PutMapping("/info")
    public Result<UserVO> updateUserInfo(@Valid @RequestBody UpdateUserRequest request) {
        UserVO userVO = userService.updateUserInfo(request);
        return Result.success(userVO);
    }

    @Operation(summary = "修改密码")
    @PutMapping("/password")
    public Result<Void> updatePassword(@Valid @RequestBody UpdatePasswordRequest request) {
        userService.updatePassword(request);
        return Result.success();
    }

    @Operation(summary = "获取用户资料")
    @GetMapping("/profile")
    public Result<UserProfileVO> getProfile() {
        UserProfileVO profileVO = userService.getProfile();
        return Result.success(profileVO);
    }

    @Operation(summary = "申请实名认证")
    @PostMapping("/real-name")
    public Result<Void> applyRealName(@Valid @RequestBody RealNameRequest request) {
        userService.applyRealName(request);
        return Result.success();
    }
}
