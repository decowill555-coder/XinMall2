package com.example.xinmall.dto.message.response;

import com.example.xinmall.entity.message.enums.NotificationType;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * 系统通知VO
 */
@Data
public class SystemNotificationVO implements Serializable {

    private static final long serialVersionUID = 1L;

    private Long id;

    /**
     * 通知类型
     */
    private NotificationType type;

    /**
     * 通知类型名称
     */
    private String typeName;

    /**
     * 图标名称
     */
    private String icon;

    /**
     * 图标颜色
     */
    private String iconColor;

    /**
     * 通知标题
     */
    private String title;

    /**
     * 通知内容
     */
    private String content;

    /**
     * 关联业务ID
     */
    private Long relatedId;

    /**
     * 关联业务类型
     */
    private String relatedType;

    /**
     * 是否已读
     */
    private Boolean isRead;

    /**
     * 创建时间
     */
    private LocalDateTime createdAt;

    /**
     * 相对时间描述
     */
    private String timeAgo;
}
