package com.example.xinmall.entity.message;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.example.xinmall.entity.message.enums.MessageType;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("conversation")
public class Conversation {

    @TableId(type = IdType.AUTO)
    private Long id;

    private Long userId;

    private Long targetId;

    private String lastMessage;

    private MessageType lastMessageType;

    private LocalDateTime lastMessageTime;

    private Integer unreadCount;

    private Boolean isPinned;

    private Boolean isMuted;

    private Boolean isDeleted;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
