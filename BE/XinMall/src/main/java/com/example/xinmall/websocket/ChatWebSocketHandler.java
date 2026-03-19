package com.example.xinmall.websocket;

import com.example.xinmall.service.message.MessageService;
import com.example.xinmall.websocket.dto.ChatMessage;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.*;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@Component
@RequiredArgsConstructor
public class ChatWebSocketHandler implements WebSocketHandler {

    private final OnlineUserService onlineUserService;
    private final ObjectMapper objectMapper;

    private static final Map<Long, WebSocketSession> sessions = new ConcurrentHashMap<>();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        Long userId = (Long) session.getAttributes().get("userId");
        String username = (String) session.getAttributes().get("username");
        
        sessions.put(userId, session);
        onlineUserService.online(userId, username);
        
        log.info("WebSocket connected: userId={}, sessionId={}", userId, session.getId());
        
        sendMessage(userId, createSystemMessage("连接成功"));
    }

    @Override
    public void handleMessage(WebSocketSession session, WebSocketMessage<?> message) throws Exception {
        if (message instanceof TextMessage textMessage) {
            String payload = textMessage.getPayload();
            log.debug("Received message: {}", payload);
            
            try {
                ChatMessage chatMessage = objectMapper.readValue(payload, ChatMessage.class);
                handleChatMessage(session, chatMessage);
            } catch (Exception e) {
                log.error("Failed to parse message", e);
                sendMessage(session, createSystemMessage("消息格式错误"));
            }
        }
    }

    @Override
    public void handleTransportError(WebSocketSession session, Throwable exception) throws Exception {
        log.error("WebSocket transport error: sessionId={}", session.getId(), exception);
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        Long userId = (Long) session.getAttributes().get("userId");
        
        sessions.remove(userId);
        onlineUserService.offline(userId);
        
        log.info("WebSocket disconnected: userId={}, status={}", userId, status);
    }

    @Override
    public boolean supportsPartialMessages() {
        return false;
    }

    private void handleChatMessage(WebSocketSession session, ChatMessage message) {
        Long senderId = (Long) session.getAttributes().get("userId");
        message.setSenderId(senderId);
        message.setTimestamp(System.currentTimeMillis());
        
        if (message.getReceiverId() != null) {
            sendToUser(message.getReceiverId(), message);
        }
    }

    public void sendToUser(Long userId, ChatMessage message) {
        WebSocketSession session = sessions.get(userId);
        if (session != null && session.isOpen()) {
            try {
                String json = objectMapper.writeValueAsString(message);
                session.sendMessage(new TextMessage(json));
                log.debug("Message sent to userId={}", userId);
            } catch (IOException e) {
                log.error("Failed to send message to userId={}", userId, e);
            }
        } else {
            log.debug("User {} is offline, message will be stored", userId);
        }
    }

    public void sendMessage(Long userId, ChatMessage message) {
        WebSocketSession session = sessions.get(userId);
        if (session != null && session.isOpen()) {
            try {
                String json = objectMapper.writeValueAsString(message);
                session.sendMessage(new TextMessage(json));
            } catch (IOException e) {
                log.error("Failed to send message to userId={}", userId, e);
            }
        }
    }

    private void sendMessage(WebSocketSession session, ChatMessage message) {
        try {
            String json = objectMapper.writeValueAsString(message);
            session.sendMessage(new TextMessage(json));
        } catch (IOException e) {
            log.error("Failed to send message", e);
        }
    }

    private ChatMessage createSystemMessage(String content) {
        ChatMessage message = new ChatMessage();
        message.setType("system");
        message.setContent(content);
        message.setTimestamp(System.currentTimeMillis());
        return message;
    }

    public boolean isOnline(Long userId) {
        return sessions.containsKey(userId);
    }

    public int getOnlineCount() {
        return sessions.size();
    }
}
