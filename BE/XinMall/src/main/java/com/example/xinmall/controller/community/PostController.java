package com.example.xinmall.controller.community;

import com.example.xinmall.common.result.PageResult;
import com.example.xinmall.common.result.Result;
import com.example.xinmall.dto.community.request.CreatePostRequest;
import com.example.xinmall.dto.community.request.PostQueryRequest;
import com.example.xinmall.dto.community.response.PostDetailVO;
import com.example.xinmall.dto.community.response.PostVO;
import com.example.xinmall.service.community.PostService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@Tag(name = "帖子管理", description = "帖子相关接口")
@RestController
@RequestMapping("/api/post")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;

    @Operation(summary = "帖子列表")
    @GetMapping("/list")
    public Result<PageResult<PostVO>> list(PostQueryRequest request) {
        return Result.success(PageResult.of(postService.getList(request)));
    }

    @Operation(summary = "帖子详情")
    @GetMapping("/{id}")
    public Result<PostDetailVO> detail(@PathVariable Long id) {
        return Result.success(postService.getDetailById(id));
    }

    @Operation(summary = "发布帖子")
    @PostMapping
    public Result<Long> create(@RequestBody CreatePostRequest request) {
        return Result.success(postService.create(request));
    }

    @Operation(summary = "删除帖子")
    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Long id) {
        postService.delete(id);
        return Result.success();
    }

    @Operation(summary = "点赞帖子")
    @PostMapping("/{id}/like")
    public Result<Void> like(@PathVariable Long id) {
        postService.like(id);
        return Result.success();
    }

    @Operation(summary = "取消点赞")
    @DeleteMapping("/{id}/like")
    public Result<Void> unlike(@PathVariable Long id) {
        postService.unlike(id);
        return Result.success();
    }

    @Operation(summary = "收藏帖子")
    @PostMapping("/{id}/collect")
    public Result<Void> collect(@PathVariable Long id) {
        postService.collect(id);
        return Result.success();
    }

    @Operation(summary = "取消收藏")
    @DeleteMapping("/{id}/collect")
    public Result<Void> uncollect(@PathVariable Long id) {
        postService.uncollect(id);
        return Result.success();
    }

    @Operation(summary = "置顶帖子")
    @PutMapping("/{id}/pin")
    public Result<Void> pin(@PathVariable Long id) {
        postService.pin(id);
        return Result.success();
    }

    @Operation(summary = "取消置顶")
    @PutMapping("/{id}/unpin")
    public Result<Void> unpin(@PathVariable Long id) {
        postService.unpin(id);
        return Result.success();
    }

    @Operation(summary = "设为精华")
    @PutMapping("/{id}/essence")
    public Result<Void> setEssence(@PathVariable Long id) {
        postService.setEssence(id);
        return Result.success();
    }

    @Operation(summary = "用户帖子列表")
    @GetMapping("/user/{userId}")
    public Result<PageResult<PostVO>> userPosts(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer pageSize) {
        return Result.success(PageResult.of(postService.getUserPosts(userId, page, pageSize)));
    }

    @Operation(summary = "我的帖子")
    @GetMapping("/my")
    public Result<PageResult<PostVO>> myPosts(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer pageSize) {
        return Result.success(PageResult.of(postService.getMyPosts(page, pageSize)));
    }

    @Operation(summary = "关注帖子列表")
    @GetMapping("/followed")
    public Result<PageResult<PostVO>> followedPosts(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer pageSize) {
        return Result.success(PageResult.of(postService.getFollowedPosts(page, pageSize)));
    }
}
