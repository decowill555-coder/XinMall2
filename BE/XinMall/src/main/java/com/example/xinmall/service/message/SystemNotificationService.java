package com.example.xinmall.service.message;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.example.xinmall.dto.message.response.SystemNotificationVO;
import com.example.xinmall.entity.message.enums.NotificationType;

/**
 * 系统通知服务接口
 */
public interface SystemNotificationService {

    /**
     * 获取用户的系统通知列表
     */
    IPage<SystemNotificationVO> getNotifications(Integer page, Integer size);

    /**
     * 获取未读通知数量
     */
    Long getUnreadCount();

    /**
     * 标记通知为已读
     */
    void markAsRead(Long id);

    /**
     * 标记所有通知为已读
     */
    void markAllAsRead();

    /**
     * 创建系统通知
     */
    void createNotification(Long userId, NotificationType type, String title, String content,
                           Long relatedId, String relatedType);

    /**
     * 删除通知
     */
    void deleteNotification(Long id);
}
