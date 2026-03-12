package com.example.xinmall.service.message.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.LambdaUpdateWrapper;
import com.example.xinmall.common.exception.BusinessException;
import com.example.xinmall.dto.message.request.SendMessageRequest;
import com.example.xinmall.dto.message.response.ConversationVO;
import com.example.xinmall.entity.message.Conversation;
import com.example.xinmall.entity.message.enums.MessageType;
import com.example.xinmall.entity.user.User;
import com.example.xinmall.mapper.message.ConversationMapper;
import com.example.xinmall.service.message.ConversationService;
import com.example.xinmall.service.user.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ConversationServiceImpl implements ConversationService {

    private final ConversationMapper conversationMapper;
    private final UserService userService;

    @Override
    public List<ConversationVO> getConversationList() {
        Long userId = getCurrentUserId();
        List<Conversation> conversations = conversationMapper.selectList(
                new LambdaQueryWrapper<Conversation>()
                        .eq(Conversation::getUserId, userId)
                        .eq(Conversation::getIsDeleted, false)
                        .orderByDesc(Conversation::getIsPinned)
                        .orderByDesc(Conversation::getLastMessageTime)
        );
        return conversations.stream().map(this::convertToVO).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ConversationVO getOrCreateConversation(Long targetId) {
        Long userId = getCurrentUserId();
        if (targetId.equals(userId)) {
            throw new BusinessException("不能与自己创建会话");
        }

        User targetUser = userService.getById(targetId);
        if (targetUser == null) {
            throw new BusinessException("目标用户不存在");
        }

        Conversation conversation = conversationMapper.selectOne(
                new LambdaQueryWrapper<Conversation>()
                        .eq(Conversation::getUserId, userId)
                        .eq(Conversation::getTargetId, targetId)
        );

        if (conversation == null) {
            conversation = createConversation(userId, targetId);
            createConversation(targetId, userId);
        }

        return convertToVO(conversation);
    }

    @Override
    @Transactional
    public void pinConversation(Long id) {
        Long userId = getCurrentUserId();
        conversationMapper.update(null,
                new LambdaUpdateWrapper<Conversation>()
                        .eq(Conversation::getId, id)
                        .eq(Conversation::getUserId, userId)
                        .set(Conversation::getIsPinned, true)
                        .set(Conversation::getUpdatedAt, LocalDateTime.now())
        );
    }

    @Override
    @Transactional
    public void unpinConversation(Long id) {
        Long userId = getCurrentUserId();
        conversationMapper.update(null,
                new LambdaUpdateWrapper<Conversation>()
                        .eq(Conversation::getId, id)
                        .eq(Conversation::getUserId, userId)
                        .set(Conversation::getIsPinned, false)
                        .set(Conversation::getUpdatedAt, LocalDateTime.now())
        );
    }

    @Override
    @Transactional
    public void muteConversation(Long id) {
        Long userId = getCurrentUserId();
        conversationMapper.update(null,
                new LambdaUpdateWrapper<Conversation>()
                        .eq(Conversation::getId, id)
                        .eq(Conversation::getUserId, userId)
                        .set(Conversation::getIsMuted, true)
                        .set(Conversation::getUpdatedAt, LocalDateTime.now())
        );
    }

    @Override
    @Transactional
    public void unmuteConversation(Long id) {
        Long userId = getCurrentUserId();
        conversationMapper.update(null,
                new LambdaUpdateWrapper<Conversation>()
                        .eq(Conversation::getId, id)
                        .eq(Conversation::getUserId, userId)
                        .set(Conversation::getIsMuted, false)
                        .set(Conversation::getUpdatedAt, LocalDateTime.now())
        );
    }

    @Override
    @Transactional
    public void deleteConversation(Long id) {
        Long userId = getCurrentUserId();
        conversationMapper.update(null,
                new LambdaUpdateWrapper<Conversation>()
                        .eq(Conversation::getId, id)
                        .eq(Conversation::getUserId, userId)
                        .set(Conversation::getIsDeleted, true)
                        .set(Conversation::getUpdatedAt, LocalDateTime.now())
        );
    }

    @Override
    @Transactional
    public void clearUnreadCount(Long id) {
        Long userId = getCurrentUserId();
        conversationMapper.update(null,
                new LambdaUpdateWrapper<Conversation>()
                        .eq(Conversation::getId, id)
                        .eq(Conversation::getUserId, userId)
                        .set(Conversation::getUnreadCount, 0)
                        .set(Conversation::getUpdatedAt, LocalDateTime.now())
        );
    }

    private Conversation createConversation(Long userId, Long targetId) {
        Conversation conversation = new Conversation();
        conversation.setUserId(userId);
        conversation.setTargetId(targetId);
        conversation.setUnreadCount(0);
        conversation.setIsPinned(false);
        conversation.setIsMuted(false);
        conversation.setIsDeleted(false);
        conversation.setCreatedAt(LocalDateTime.now());
        conversation.setUpdatedAt(LocalDateTime.now());
        conversationMapper.insert(conversation);
        return conversation;
    }

    private ConversationVO convertToVO(Conversation conversation) {
        ConversationVO vo = new ConversationVO();
        BeanUtils.copyProperties(conversation, vo);

        User targetUser = userService.getById(conversation.getTargetId());
        if (targetUser != null) {
            vo.setTargetName(targetUser.getNickname());
            vo.setTargetAvatar(targetUser.getAvatar());
        }

        return vo;
    }

    private Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new BusinessException("用户未登录");
        }
        return Long.parseLong(authentication.getName());
    }
}
