package com.example.xinmall.dto.message.response;

import com.example.xinmall.entity.message.enums.MessageType;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;

@Data
public class ConversationVO implements Serializable {

    private static final long serialVersionUID = 1L;

    private Long id;

    private Long targetId;

    private String targetName;

    private String targetAvatar;

    private String lastMessage;

    private MessageType lastMessageType;

    private LocalDateTime lastMessageTime;

    private Integer unreadCount;

    private Boolean isPinned;

    private Boolean isMuted;
}
