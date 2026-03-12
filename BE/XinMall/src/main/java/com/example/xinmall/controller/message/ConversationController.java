package com.example.xinmall.controller.message;

import com.example.xinmall.common.result.Result;
import com.example.xinmall.dto.message.response.ConversationVO;
import com.example.xinmall.service.message.ConversationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "会话接口", description = "用户会话管理接口")
@RestController
@RequestMapping("/api/conversation")
@RequiredArgsConstructor
public class ConversationController {

    private final ConversationService conversationService;

    @Operation(summary = "获取会话列表")
    @GetMapping
    public Result<List<ConversationVO>> getConversationList() {
        List<ConversationVO> list = conversationService.getConversationList();
        return Result.success(list);
    }

    @Operation(summary = "获取或创建会话")
    @PostMapping("/create")
    public Result<ConversationVO> getOrCreateConversation(@RequestParam Long targetId) {
        ConversationVO conversation = conversationService.getOrCreateConversation(targetId);
        return Result.success(conversation);
    }

    @Operation(summary = "置顶会话")
    @PutMapping("/{id}/pin")
    public Result<Void> pinConversation(@PathVariable Long id) {
        conversationService.pinConversation(id);
        return Result.success();
    }

    @Operation(summary = "取消置顶")
    @PutMapping("/{id}/unpin")
    public Result<Void> unpinConversation(@PathVariable Long id) {
        conversationService.unpinConversation(id);
        return Result.success();
    }

    @Operation(summary = "消息免打扰")
    @PutMapping("/{id}/mute")
    public Result<Void> muteConversation(@PathVariable Long id) {
        conversationService.muteConversation(id);
        return Result.success();
    }

    @Operation(summary = "取消免打扰")
    @PutMapping("/{id}/unmute")
    public Result<Void> unmuteConversation(@PathVariable Long id) {
        conversationService.unmuteConversation(id);
        return Result.success();
    }

    @Operation(summary = "删除会话")
    @DeleteMapping("/{id}")
    public Result<Void> deleteConversation(@PathVariable Long id) {
        conversationService.deleteConversation(id);
        return Result.success();
    }

    @Operation(summary = "清空未读数")
    @PutMapping("/{id}/clear-unread")
    public Result<Void> clearUnreadCount(@PathVariable Long id) {
        conversationService.clearUnreadCount(id);
        return Result.success();
    }
}
