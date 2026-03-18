package com.example.xinmall.controller.community;

import com.example.xinmall.common.result.PageResult;
import com.example.xinmall.common.result.Result;
import com.example.xinmall.dto.community.request.CreateCommentRequest;
import com.example.xinmall.dto.community.response.CommentVO;
import com.example.xinmall.service.community.CommentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@Tag(name = "评论管理", description = "评论相关接口")
@RestController
@RequestMapping("/api/comment")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    @Operation(summary = "评论列表")
    @GetMapping("/list/{postId}")
    public Result<PageResult<CommentVO>> list(
            @PathVariable Long postId,
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer pageSize) {
        return Result.success(PageResult.of(commentService.getList(postId, page, pageSize)));
    }

    @Operation(summary = "发表评论")
    @PostMapping
    public Result<Long> create(@RequestBody CreateCommentRequest request) {
        return Result.success(commentService.create(request));
    }

    @Operation(summary = "删除评论")
    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Long id) {
        commentService.delete(id);
        return Result.success();
    }

    @Operation(summary = "点赞评论")
    @PostMapping("/{id}/like")
    public Result<Void> like(@PathVariable Long id) {
        commentService.like(id);
        return Result.success();
    }

    @Operation(summary = "取消点赞")
    @DeleteMapping("/{id}/like")
    public Result<Void> unlike(@PathVariable Long id) {
        commentService.unlike(id);
        return Result.success();
    }

    @Operation(summary = "获取评论回复")
    @GetMapping("/replies/{parentId}")
    public Result<PageResult<CommentVO>> replies(
            @PathVariable Long parentId,
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer pageSize) {
        return Result.success(PageResult.of(commentService.getReplies(parentId, page, pageSize)));
    }
}
