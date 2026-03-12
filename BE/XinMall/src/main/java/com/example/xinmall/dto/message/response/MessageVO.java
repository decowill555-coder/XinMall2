package com.example.xinmall.dto.message.response;

import com.example.xinmall.entity.message.enums.MessageStatus;
import com.example.xinmall.entity.message.enums.MessageType;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;

@Data
public class MessageVO implements Serializable {

    private static final long serialVersionUID = 1L;

    private Long id;

    private Long conversationId;

    private Long senderId;

    private String senderName;

    private String senderAvatar;

    private Long receiverId;

    private MessageType type;

    private String content;

    private MessageStatus status;

    private LocalDateTime createdAt;
}
