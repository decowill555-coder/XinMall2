package com.example.xinmall.websocket;

import com.example.xinmall.common.security.JwtUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.http.server.ServletServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;

import java.util.Map;

@Slf4j
@Component
@RequiredArgsConstructor
public class WebSocketInterceptor implements HandshakeInterceptor {

    private final JwtUtils jwtUtils;

    @Override
    public boolean beforeHandshake(ServerHttpRequest request, ServerHttpResponse response, 
                                   WebSocketHandler wsHandler, Map<String, Object> attributes) {
        if (request instanceof ServletServerHttpRequest servletRequest) {
            String token = servletRequest.getServletRequest().getParameter("token");
            
            if (token == null || token.isEmpty()) {
                log.warn("WebSocket handshake failed: missing token");
                return false;
            }

            try {
                if (!jwtUtils.validateToken(token)) {
                    log.warn("WebSocket handshake failed: invalid token");
                    return false;
                }

                Long userId = jwtUtils.getUserId(token);
                String username = jwtUtils.getUsername(token);
                
                attributes.put("userId", userId);
                attributes.put("username", username);
                
                log.info("WebSocket handshake success: userId={}", userId);
                return true;
            } catch (Exception e) {
                log.error("WebSocket handshake error", e);
                return false;
            }
        }
        return false;
    }

    @Override
    public void afterHandshake(ServerHttpRequest request, ServerHttpResponse response, 
                               WebSocketHandler wsHandler, Exception exception) {
        if (exception != null) {
            log.error("WebSocket handshake exception", exception);
        }
    }
}
