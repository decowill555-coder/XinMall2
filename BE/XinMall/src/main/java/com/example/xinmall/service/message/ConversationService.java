package com.example.xinmall.service.message;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.example.xinmall.dto.message.request.SendMessageRequest;
import com.example.xinmall.dto.message.response.ConversationVO;
import com.example.xinmall.dto.message.response.MessageVO;

import java.util.List;

public interface ConversationService {

    List<ConversationVO> getConversationList();

    ConversationVO getOrCreateConversation(Long targetId);

    void pinConversation(Long id);

    void unpinConversation(Long id);

    void muteConversation(Long id);

    void unmuteConversation(Long id);

    void deleteConversation(Long id);

    void clearUnreadCount(Long id);
}
