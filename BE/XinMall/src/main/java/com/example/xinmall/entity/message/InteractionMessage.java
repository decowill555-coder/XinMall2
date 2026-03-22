package com.example.xinmall.entity.message;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.example.xinmall.entity.message.enums.InteractionType;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * 互动消息实体
 */
@Data
@TableName("interaction_message")
public class InteractionMessage implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(type = IdType.AUTO)
    private Long id;

    /**
     * 接收用户ID（被互动的用户）
     */
    private Long userId;

    /**
     * 发起互动的用户ID
     */
    private Long actorId;

    /**
     * 互动类型
     */
    private InteractionType type;

    /**
     * 关联的帖子ID（点赞、评论、收藏时）
     */
    private Long postId;

    /**
     * 关联的评论ID（回复时）
     */
    private Long commentId;

    /**
     * 互动内容（如评论内容）
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
}
