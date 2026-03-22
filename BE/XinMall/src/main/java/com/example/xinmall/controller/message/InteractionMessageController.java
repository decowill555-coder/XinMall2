package com.example.xinmall.controller.message;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.example.xinmall.common.result.Result;
import com.example.xinmall.dto.message.response.InteractionMessageVO;
import com.example.xinmall.service.message.InteractionMessageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@Tag(name = "互动消息接口", description = "互动消息查询、管理接口")
@RestController
@RequestMapping("/api/interaction")
@RequiredArgsConstructor
public class InteractionMessageController {

    private final InteractionMessageService interactionService;

    @Operation(summary = "获取互动消息列表")
    @GetMapping("/list")
    public Result<IPage<InteractionMessageVO>> getInteractions(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "20") Integer size) {
        IPage<InteractionMessageVO> result = interactionService.getInteractions(page, size);
        return Result.success(result);
    }

    @Operation(summary = "获取未读互动消息数量")
    @GetMapping("/unread-count")
    public Result<Map<String, Object>> getUnreadCount() {
        Long count = interactionService.getUnreadCount();
        Map<String, Object> data = new HashMap<>();
        data.put("count", count);
        return Result.success(data);
    }

    @Operation(summary = "标记互动消息为已读")
    @PutMapping("/{id}/read")
    public Result<Void> markAsRead(@PathVariable Long id) {
        interactionService.markAsRead(id);
        return Result.success();
    }

    @Operation(summary = "标记所有互动消息为已读")
    @PutMapping("/read-all")
    public Result<Void> markAllAsRead() {
        interactionService.markAllAsRead();
        return Result.success();
    }

    @Operation(summary = "删除互动消息")
    @DeleteMapping("/{id}")
    public Result<Void> deleteInteraction(@PathVariable Long id) {
        interactionService.deleteInteraction(id);
        return Result.success();
    }
}
