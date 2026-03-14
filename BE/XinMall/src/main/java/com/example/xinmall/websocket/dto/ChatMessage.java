package com.example.xinmall.websocket.dto;

import lombok.Data;

@Data
public class ChatMessage {
    
    private String type;
    
    private Long senderId;
    
    private String senderName;
    
    private Long receiverId;
    
    private String receiverName;
    
    private Long conversationId;
    
    private String content;
    
    private Long timestamp;
}
