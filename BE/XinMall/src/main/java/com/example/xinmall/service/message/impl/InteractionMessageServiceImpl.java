package com.example.xinmall.service.message.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.LambdaUpdateWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.example.xinmall.dto.message.response.InteractionMessageVO;
import com.example.xinmall.entity.community.Post;
import com.example.xinmall.entity.message.InteractionMessage;
import com.example.xinmall.entity.message.enums.InteractionType;
import com.example.xinmall.entity.user.User;
import com.example.xinmall.mapper.community.PostMapper;
import com.example.xinmall.mapper.message.InteractionMessageMapper;
import com.example.xinmall.mapper.user.UserMapper;
import com.example.xinmall.service.message.InteractionMessageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
public class InteractionMessageServiceImpl implements InteractionMessageService {

    private final InteractionMessageMapper interactionMapper;
    private final UserMapper userMapper;
    private final PostMapper postMapper;

    @Override
    public IPage<InteractionMessageVO> getInteractions(Integer page, Integer size) {
        Long userId = getCurrentUserId();
        if (userId == null) {
            throw new RuntimeException("请先登录");
        }

        Page<InteractionMessage> pageParam = new Page<>(page, size);
        LambdaQueryWrapper<InteractionMessage> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(InteractionMessage::getUserId, userId)
                .orderByDesc(InteractionMessage::getCreatedAt);

        IPage<InteractionMessage> interactionPage = interactionMapper.selectPage(pageParam, wrapper);

        return interactionPage.convert(this::convertToVO);
    }

    @Override
    public Long getUnreadCount() {
        Long userId = getCurrentUserId();
        if (userId == null) {
            return 0L;
        }

        LambdaQueryWrapper<InteractionMessage> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(InteractionMessage::getUserId, userId)
                .eq(InteractionMessage::getIsRead, false);

        return interactionMapper.selectCount(wrapper);
    }

    @Override
    @Transactional
    public void markAsRead(Long id) {
        Long userId = getCurrentUserId();
        if (userId == null) {
            throw new RuntimeException("请先登录");
        }

        interactionMapper.update(null, new LambdaUpdateWrapper<InteractionMessage>()
                .eq(InteractionMessage::getId, id)
                .eq(InteractionMessage::getUserId, userId)
                .set(InteractionMessage::getIsRead, true));
    }

    @Override
    @Transactional
    public void markAllAsRead() {
        Long userId = getCurrentUserId();
        if (userId == null) {
            return;
        }

        interactionMapper.update(null, new LambdaUpdateWrapper<InteractionMessage>()
                .eq(InteractionMessage::getUserId, userId)
                .eq(InteractionMessage::getIsRead, false)
                .set(InteractionMessage::getIsRead, true));
    }

    @Override
    @Transactional
    public void createPostLikeNotification(Long postAuthorId, Long actorId, Long postId, String postTitle) {
        // 不给自己发通知
        if (postAuthorId.equals(actorId)) {
            return;
        }

        InteractionMessage message = new InteractionMessage();
        message.setUserId(postAuthorId);
        message.setActorId(actorId);
        message.setType(InteractionType.POST_LIKE);
        message.setPostId(postId);
        message.setIsRead(false);
        message.setCreatedAt(LocalDateTime.now());

        interactionMapper.insert(message);
        log.info("创建点赞通知: postAuthorId={}, actorId={}, postId={}", postAuthorId, actorId, postId);
    }

    @Override
    @Transactional
    public void createPostCommentNotification(Long postAuthorId, Long actorId, Long postId, String postTitle,
                                              Long commentId, String commentContent) {
        // 不给自己发通知
        if (postAuthorId.equals(actorId)) {
            return;
        }

        InteractionMessage message = new InteractionMessage();
        message.setUserId(postAuthorId);
        message.setActorId(actorId);
        message.setType(InteractionType.POST_COMMENT);
        message.setPostId(postId);
        message.setCommentId(commentId);
        message.setContent(commentContent);
        message.setIsRead(false);
        message.setCreatedAt(LocalDateTime.now());

        interactionMapper.insert(message);
        log.info("创建评论通知: postAuthorId={}, actorId={}, postId={}", postAuthorId, actorId, postId);
    }

    @Override
    @Transactional
    public void createCommentReplyNotification(Long commentAuthorId, Long actorId, Long postId, String postTitle,
                                               Long commentId, String replyContent) {
        // 不给自己发通知
        if (commentAuthorId.equals(actorId)) {
            return;
        }

        InteractionMessage message = new InteractionMessage();
        message.setUserId(commentAuthorId);
        message.setActorId(actorId);
        message.setType(InteractionType.COMMENT_REPLY);
        message.setPostId(postId);
        message.setCommentId(commentId);
        message.setContent(replyContent);
        message.setIsRead(false);
        message.setCreatedAt(LocalDateTime.now());

        interactionMapper.insert(message);
        log.info("创建回复通知: commentAuthorId={}, actorId={}, postId={}", commentAuthorId, actorId, postId);
    }

    @Override
    @Transactional
    public void createFollowNotification(Long userId, Long actorId) {
        // 不给自己发通知
        if (userId.equals(actorId)) {
            return;
        }

        InteractionMessage message = new InteractionMessage();
        message.setUserId(userId);
        message.setActorId(actorId);
        message.setType(InteractionType.FOLLOW);
        message.setIsRead(false);
        message.setCreatedAt(LocalDateTime.now());

        interactionMapper.insert(message);
        log.info("创建关注通知: userId={}, actorId={}", userId, actorId);
    }

    @Override
    @Transactional
    public void createPostCollectNotification(Long postAuthorId, Long actorId, Long postId, String postTitle) {
        // 不给自己发通知
        if (postAuthorId.equals(actorId)) {
            return;
        }

        InteractionMessage message = new InteractionMessage();
        message.setUserId(postAuthorId);
        message.setActorId(actorId);
        message.setType(InteractionType.POST_COLLECT);
        message.setPostId(postId);
        message.setIsRead(false);
        message.setCreatedAt(LocalDateTime.now());

        interactionMapper.insert(message);
        log.info("创建收藏通知: postAuthorId={}, actorId={}, postId={}", postAuthorId, actorId, postId);
    }

    @Override
    @Transactional
    public void deleteInteraction(Long id) {
        Long userId = getCurrentUserId();
        if (userId == null) {
            throw new RuntimeException("请先登录");
        }

        interactionMapper.delete(new LambdaQueryWrapper<InteractionMessage>()
                .eq(InteractionMessage::getId, id)
                .eq(InteractionMessage::getUserId, userId));
    }

    private InteractionMessageVO convertToVO(InteractionMessage message) {
        InteractionMessageVO vo = new InteractionMessageVO();
        BeanUtils.copyProperties(message, vo);

        // 获取发起者信息
        User actor = userMapper.selectById(message.getActorId());
        if (actor != null) {
            vo.setActorName(actor.getNickname());
            vo.setActorAvatar(actor.getAvatar());
        }

        // 获取帖子标题
        if (message.getPostId() != null) {
            Post post = postMapper.selectById(message.getPostId());
            if (post != null) {
                vo.setPostTitle(post.getTitle());
            }
        }

        // 设置类型名称
        if (message.getType() != null) {
            vo.setTypeName(message.getType().getName());
        }

        vo.setTimeAgo(formatTimeAgo(message.getCreatedAt()));

        return vo;
    }

    private String formatTimeAgo(LocalDateTime dateTime) {
        if (dateTime == null) {
            return "";
        }

        Duration duration = Duration.between(dateTime, LocalDateTime.now());
        long minutes = duration.toMinutes();
        long hours = duration.toHours();
        long days = duration.toDays();

        if (minutes < 1) {
            return "刚刚";
        } else if (minutes < 60) {
            return minutes + "分钟前";
        } else if (hours < 24) {
            return hours + "小时前";
        } else if (days < 7) {
            return days + "天前";
        } else {
            return dateTime.toLocalDate().toString();
        }
    }

    private Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return null;
        }
        try {
            return Long.parseLong(authentication.getName());
        } catch (Exception e) {
            return null;
        }
    }
}
