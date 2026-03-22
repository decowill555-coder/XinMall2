package com.example.xinmall.dto.message.response;

import com.example.xinmall.entity.message.enums.InteractionType;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * 互动消息VO
 */
@Data
public class InteractionMessageVO implements Serializable {

    private static final long serialVersionUID = 1L;

    private Long id;

    /**
     * 发起互动的用户ID
     */
    private Long actorId;

    /**
     * 发起互动的用户名
     */
    private String actorName;

    /**
     * 发起互动的用户头像
     */
    private String actorAvatar;

    /**
     * 互动类型
     */
    private InteractionType type;

    /**
     * 互动类型名称
     */
    private String typeName;

    /**
     * 关联的帖子ID
     */
    private Long postId;

    /**
     * 关联的帖子标题
     */
    private String postTitle;

    /**
     * 关联的评论ID
     */
    private Long commentId;

    /**
     * 互动内容
     */
    private String content;

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
