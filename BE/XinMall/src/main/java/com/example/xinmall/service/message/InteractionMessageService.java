package com.example.xinmall.service.message;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.example.xinmall.dto.message.response.InteractionMessageVO;
import com.example.xinmall.entity.message.enums.InteractionType;

/**
 * 互动消息服务接口
 */
public interface InteractionMessageService {

    /**
     * 获取用户的互动消息列表
     */
    IPage<InteractionMessageVO> getInteractions(Integer page, Integer size);

    /**
     * 获取未读互动消息数量
     */
    Long getUnreadCount();

    /**
     * 标记互动消息为已读
     */
    void markAsRead(Long id);

    /**
     * 标记所有互动消息为已读
     */
    void markAllAsRead();

    /**
     * 创建互动消息（点赞帖子）
     */
    void createPostLikeNotification(Long postAuthorId, Long actorId, Long postId, String postTitle);

    /**
     * 创建互动消息（评论帖子）
     */
    void createPostCommentNotification(Long postAuthorId, Long actorId, Long postId, String postTitle,
                                       Long commentId, String commentContent);

    /**
     * 创建互动消息（回复评论）
     */
    void createCommentReplyNotification(Long commentAuthorId, Long actorId, Long postId, String postTitle,
                                        Long commentId, String replyContent);

    /**
     * 创建互动消息（关注用户）
     */
    void createFollowNotification(Long userId, Long actorId);

    /**
     * 创建互动消息（收藏帖子）
     */
    void createPostCollectNotification(Long postAuthorId, Long actorId, Long postId, String postTitle);

    /**
     * 删除互动消息
     */
    void deleteInteraction(Long id);
}
