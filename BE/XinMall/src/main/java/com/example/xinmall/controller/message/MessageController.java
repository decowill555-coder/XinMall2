package com.example.xinmall.controller.message;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.example.xinmall.common.result.Result;
import com.example.xinmall.dto.message.request.SendMessageRequest;
import com.example.xinmall.dto.message.response.MessageVO;
import com.example.xinmall.service.message.MessageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@Tag(name = "消息接口", description = "消息发送、查询接口")
@RestController
@RequestMapping("/api/message")
@RequiredArgsConstructor
public class MessageController {

    private final MessageService messageService;

    @Operation(summary = "获取消息列表")
    @GetMapping
    public Result<Page<MessageVO>> getMessages(
            @RequestParam Long conversationId,
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "20") Integer size) {
        Page<MessageVO> result = messageService.getMessages(conversationId, page, size);
        return Result.success(result);
    }

    @Operation(summary = "发送消息")
    @PostMapping
    public Result<MessageVO> sendMessage(@Valid @RequestBody SendMessageRequest request) {
        MessageVO message = messageService.sendMessage(request);
        return Result.created(message);
    }

    @Operation(summary = "标记已读")
    @PutMapping("/{id}/read")
    public Result<Void> markAsRead(@PathVariable Long id) {
        messageService.markAsRead(id);
        return Result.success();
    }

    @Operation(summary = "全部标记已读")
    @PutMapping("/read-all")
    public Result<Void> markAllAsRead(@RequestParam Long conversationId) {
        messageService.markAllAsRead(conversationId);
        return Result.success();
    }
}
