package com.example.xinmall.service.message.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.LambdaUpdateWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.example.xinmall.common.exception.BusinessException;
import com.example.xinmall.dto.message.request.SendMessageRequest;
import com.example.xinmall.dto.message.response.MessageVO;
import com.example.xinmall.entity.message.Conversation;
import com.example.xinmall.entity.message.Message;
import com.example.xinmall.entity.message.enums.MessageStatus;
import com.example.xinmall.entity.message.enums.MessageType;
import com.example.xinmall.entity.user.User;
import com.example.xinmall.mapper.message.ConversationMapper;
import com.example.xinmall.mapper.message.MessageMapper;
import com.example.xinmall.service.message.MessageService;
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
public class MessageServiceImpl implements MessageService {

    private final MessageMapper messageMapper;
    private final ConversationMapper conversationMapper;
    private final UserService userService;

    @Override
    public Page<MessageVO> getMessages(Long conversationId, Integer page, Integer size) {
        Long userId = getCurrentUserId();
        Conversation conversation = conversationMapper.selectOne(
                new LambdaQueryWrapper<Conversation>()
                        .eq(Conversation::getId, conversationId)
                        .eq(Conversation::getUserId, userId)
        );
        if (conversation == null) {
            throw new BusinessException("会话不存在");
        }

        Page<Message> pageParam = new Page<>(page, size);
        Page<Message> result = messageMapper.selectPage(pageParam,
                new LambdaQueryWrapper<Message>()
                        .eq(Message::getConversationId, conversationId)
                        .orderByDesc(Message::getCreatedAt)
        );
        return result.convert(this::convertToVO);
    }

    @Override
    @Transactional
    public MessageVO sendMessage(SendMessageRequest request) {
        Long userId = getCurrentUserId();

        Conversation conversation = conversationMapper.selectOne(
                new LambdaQueryWrapper<Conversation>()
                        .eq(Conversation::getUserId, userId)
                        .eq(Conversation::getTargetId, request.getReceiverId())
        );
        if (conversation == null) {
            throw new BusinessException("会话不存在，请先创建会话");
        }

        Message message = new Message();
        message.setConversationId(conversation.getId());
        message.setSenderId(userId);
        message.setReceiverId(request.getReceiverId());
        message.setType(MessageType.values()[request.getType() - 1]);
        message.setContent(request.getContent());
        message.setStatus(MessageStatus.SENT);
        message.setCreatedAt(LocalDateTime.now());
        messageMapper.insert(message);

        updateConversationLastMessage(conversation.getId(), message);
        Conversation receiverConversation = conversationMapper.selectOne(
                new LambdaQueryWrapper<Conversation>()
                        .eq(Conversation::getUserId, request.getReceiverId())
                        .eq(Conversation::getTargetId, userId)
        );
        if (receiverConversation != null) {
            updateConversationLastMessage(receiverConversation.getId(), message);
            incrementUnreadCount(receiverConversation.getId());
        }

        return convertToVO(message);
    }

    @Override
    @Transactional
    public void markAsRead(Long messageId) {
        messageMapper.update(null,
                new LambdaUpdateWrapper<Message>()
                        .eq(Message::getId, messageId)
                        .set(Message::getStatus, MessageStatus.READ)
        );
    }

    @Override
    @Transactional
    public void markAllAsRead(Long conversationId) {
        Long userId = getCurrentUserId();
        messageMapper.update(null,
                new LambdaUpdateWrapper<Message>()
                        .eq(Message::getConversationId, conversationId)
                        .ne(Message::getSenderId, userId)
                        .set(Message::getStatus, MessageStatus.READ)
        );
    }

    private void updateConversationLastMessage(Long conversationId, Message message) {
        conversationMapper.update(null,
                new LambdaUpdateWrapper<Conversation>()
                        .eq(Conversation::getId, conversationId)
                        .set(Conversation::getLastMessage, message.getContent())
                        .set(Conversation::getLastMessageType, message.getType())
                        .set(Conversation::getLastMessageTime, message.getCreatedAt())
                        .set(Conversation::getUpdatedAt, LocalDateTime.now())
        );
    }

    private void incrementUnreadCount(Long conversationId) {
        conversationMapper.update(null,
                new LambdaUpdateWrapper<Conversation>()
                        .eq(Conversation::getId, conversationId)
                        .setSql("unread_count = unread_count + 1")
        );
    }

    private MessageVO convertToVO(Message message) {
        MessageVO vo = new MessageVO();
        BeanUtils.copyProperties(message, vo);

        User sender = userService.getById(message.getSenderId());
        if (sender != null) {
            vo.setSenderName(sender.getNickname());
            vo.setSenderAvatar(sender.getAvatar());
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
