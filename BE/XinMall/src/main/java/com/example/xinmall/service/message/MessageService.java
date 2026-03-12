package com.example.xinmall.service.message;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.example.xinmall.dto.message.request.SendMessageRequest;
import com.example.xinmall.dto.message.response.MessageVO;

public interface MessageService {

    IPage<MessageVO> getMessages(Long conversationId, Integer page, Integer size);

    MessageVO sendMessage(SendMessageRequest request);

    void markAsRead(Long messageId);

    void markAllAsRead(Long conversationId);
}
