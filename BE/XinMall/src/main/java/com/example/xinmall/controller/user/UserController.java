package com.example.xinmall.controller.user;

import com.example.xinmall.common.result.PageResult;
import com.example.xinmall.common.result.Result;
import com.example.xinmall.dto.user.request.RealNameRequest;
import com.example.xinmall.dto.user.request.UpdatePasswordRequest;
import com.example.xinmall.dto.user.request.UpdateUserRequest;
import com.example.xinmall.dto.user.response.FollowUserVO;
import com.example.xinmall.dto.user.response.UserProfileVO;
import com.example.xinmall.dto.user.response.UserPublicProfileVO;
import com.example.xinmall.dto.user.response.UserVO;
import com.example.xinmall.dto.user.response.UserGoodsVO;
import com.example.xinmall.dto.user.response.UserCollectionsVO;
import com.example.xinmall.dto.user.response.UserLikesVO;
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

    @Operation(summary = "关注用户")
    @PostMapping("/follow/{userId}")
    public Result<Void> followUser(@PathVariable Long userId) {
        Long currentUserId = getCurrentUserId();
        userService.followUser(currentUserId, userId);
        return Result.success();
    }

    @Operation(summary = "取消关注")
    @DeleteMapping("/follow/{userId}")
    public Result<Void> unfollowUser(@PathVariable Long userId) {
        Long currentUserId = getCurrentUserId();
        userService.unfollowUser(currentUserId, userId);
        return Result.success();
    }

    @Operation(summary = "检查是否关注")
    @GetMapping("/follow/check/{userId}")
    public Result<Boolean> checkFollow(@PathVariable Long userId) {
        Long currentUserId = getCurrentUserId();
        boolean following = userService.isFollowing(currentUserId, userId);
        return Result.success(following);
    }

    @Operation(summary = "获取关注列表")
    @GetMapping("/following/{userId}")
    public Result<PageResult<FollowUserVO>> getFollowingList(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "20") Integer size) {
        PageResult<FollowUserVO> result = userService.getFollowingList(userId, page, size);
        return Result.success(result);
    }

    @Operation(summary = "获取粉丝列表")
    @GetMapping("/followers/{userId}")
    public Result<PageResult<FollowUserVO>> getFollowersList(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "20") Integer size) {
        PageResult<FollowUserVO> result = userService.getFollowersList(userId, page, size);
        return Result.success(result);
    }

    @Operation(summary = "获取用户公开资料")
    @GetMapping("/profile/{userId}")
    public Result<UserPublicProfileVO> getUserPublicProfile(@PathVariable Long userId) {
        Long currentUserId = getCurrentUserIdOrNull();
        UserPublicProfileVO profile = userService.getUserPublicProfile(userId, currentUserId);
        return Result.success(profile);
    }

    @Operation(summary = "获取用户商品列表")
    @GetMapping("/goods/{userId}")
    public Result<PageResult<UserGoodsVO>> getUserGoods(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "all") String status,
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "20") Integer pageSize) {
        PageResult<UserGoodsVO> result = userService.getUserGoods(userId, status, page, pageSize);
        return Result.success(result);
    }

    @Operation(summary = "获取用户收藏列表")
    @GetMapping("/collections/{userId}")
    public Result<PageResult<UserCollectionsVO>> getUserCollections(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "20") Integer pageSize) {
        PageResult<UserCollectionsVO> result = userService.getUserCollections(userId, page, pageSize);
        return Result.success(result);
    }

    @Operation(summary = "获取用户点赞列表")
    @GetMapping("/likes/{userId}")
    public Result<PageResult<UserLikesVO>> getUserLikes(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "20") Integer pageSize) {
        PageResult<UserLikesVO> result = userService.getUserLikes(userId, page, pageSize);
        return Result.success(result);
    }

    private Long getCurrentUserId() {
        return Long.parseLong(org.springframework.security.core.context.SecurityContextHolder
                .getContext().getAuthentication().getName());
    }

    private Long getCurrentUserIdOrNull() {
        org.springframework.security.core.context.SecurityContext context =
                org.springframework.security.core.context.SecurityContextHolder.getContext();
        if (context == null || context.getAuthentication() == null) {
            return null;
        }
        if (!context.getAuthentication().isAuthenticated()) {
            return null;
        }
        try {
            return Long.parseLong(context.getAuthentication().getName());
        } catch (Exception e) {
            return null;
        }
    }
}
