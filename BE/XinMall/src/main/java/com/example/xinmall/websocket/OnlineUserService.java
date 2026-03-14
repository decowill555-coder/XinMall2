package com.example.xinmall.websocket;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@Service
public class OnlineUserService {

    private final Map<Long, OnlineUser> onlineUsers = new ConcurrentHashMap<>();

    public void online(Long userId, String username) {
        OnlineUser user = new OnlineUser();
        user.setUserId(userId);
        user.setUsername(username);
        user.setOnlineTime(System.currentTimeMillis());
        onlineUsers.put(userId, user);
        log.info("User online: userId={}, username={}", userId, username);
    }

    public void offline(Long userId) {
        OnlineUser user = onlineUsers.remove(userId);
        if (user != null) {
            log.info("User offline: userId={}, username={}", userId, user.getUsername());
        }
    }

    public boolean isOnline(Long userId) {
        return onlineUsers.containsKey(userId);
    }

    public OnlineUser getOnlineUser(Long userId) {
        return onlineUsers.get(userId);
    }

    public Set<Long> getOnlineUserIds() {
        return onlineUsers.keySet();
    }

    public int getOnlineCount() {
        return onlineUsers.size();
    }

    public static class OnlineUser {
        private Long userId;
        private String username;
        private Long onlineTime;

        public Long getUserId() {
            return userId;
        }

        public void setUserId(Long userId) {
            this.userId = userId;
        }

        public String getUsername() {
            return username;
        }

        public void setUsername(String username) {
            this.username = username;
        }

        public Long getOnlineTime() {
            return onlineTime;
        }

        public void setOnlineTime(Long onlineTime) {
            this.onlineTime = onlineTime;
        }
    }
}
