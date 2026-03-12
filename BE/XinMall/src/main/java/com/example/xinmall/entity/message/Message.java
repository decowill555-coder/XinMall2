package com.example.xinmall.entity.message;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.example.xinmall.entity.message.enums.MessageStatus;
import com.example.xinmall.entity.message.enums.MessageType;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("message")
public class Message {

    @TableId(type = IdType.AUTO)
    private Long id;

    private Long conversationId;

    private Long senderId;

    private Long receiverId;

    private MessageType type;

    private String content;

    private MessageStatus status;

    private LocalDateTime createdAt;
}
