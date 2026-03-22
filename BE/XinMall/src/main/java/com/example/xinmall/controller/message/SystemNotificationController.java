package com.example.xinmall.controller.message;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.example.xinmall.common.result.Result;
import com.example.xinmall.dto.message.response.SystemNotificationVO;
import com.example.xinmall.service.message.SystemNotificationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@Tag(name = "系统通知接口", description = "系统通知查询、管理接口")
@RestController
@RequestMapping("/api/notification")
@RequiredArgsConstructor
public class SystemNotificationController {

    private final SystemNotificationService notificationService;

    @Operation(summary = "获取系统通知列表")
    @GetMapping("/list")
    public Result<IPage<SystemNotificationVO>> getNotifications(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "20") Integer size) {
        IPage<SystemNotificationVO> result = notificationService.getNotifications(page, size);
        return Result.success(result);
    }

    @Operation(summary = "获取未读通知数量")
    @GetMapping("/unread-count")
    public Result<Map<String, Object>> getUnreadCount() {
        Long count = notificationService.getUnreadCount();
        Map<String, Object> data = new HashMap<>();
        data.put("count", count);
        return Result.success(data);
    }

    @Operation(summary = "标记通知为已读")
    @PutMapping("/{id}/read")
    public Result<Void> markAsRead(@PathVariable Long id) {
        notificationService.markAsRead(id);
        return Result.success();
    }

    @Operation(summary = "标记所有通知为已读")
    @PutMapping("/read-all")
    public Result<Void> markAllAsRead() {
        notificationService.markAllAsRead();
        return Result.success();
    }

    @Operation(summary = "删除通知")
    @DeleteMapping("/{id}")
    public Result<Void> deleteNotification(@PathVariable Long id) {
        notificationService.deleteNotification(id);
        return Result.success();
    }
}
