package com.example.xinmall.common.aspect;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.LambdaUpdateWrapper;
import com.example.xinmall.entity.message.Conversation;
import com.example.xinmall.entity.message.Message;
import com.example.xinmall.entity.message.enums.MessageStatus;
import com.example.xinmall.entity.message.enums.MessageType;
import com.example.xinmall.entity.trade.Order;
import com.example.xinmall.mapper.message.ConversationMapper;
import com.example.xinmall.mapper.message.MessageMapper;
import com.example.xinmall.mapper.trade.OrderMapper;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * 订单通知切面
 * 在订单状态变更时自动发送消息卡片给买卖双方
 */
@Aspect
@Component
@Slf4j
@RequiredArgsConstructor
public class OrderNotificationAspect {

    private final OrderMapper orderMapper;
    private final ConversationMapper conversationMapper;
    private final MessageMapper messageMapper;
    private final ObjectMapper objectMapper;

    /**
     * 切入点：OrderServiceImpl 的 create 方法
     */
    @Pointcut("execution(* com.example.xinmall.service.trade.impl.OrderServiceImpl.create(..))")
    public void orderCreatePointcut() {}

    /**
     * 切入点：OrderServiceImpl 的 pay 方法
     */
    @Pointcut("execution(* com.example.xinmall.service.trade.impl.OrderServiceImpl.pay(..))")
    public void orderPayPointcut() {}

    /**
     * 切入点：OrderServiceImpl 的 ship 方法
     */
    @Pointcut("execution(* com.example.xinmall.service.trade.impl.OrderServiceImpl.ship(..))")
    public void orderShipPointcut() {}

    /**
     * 切入点：OrderServiceImpl 的 receive 方法
     */
    @Pointcut("execution(* com.example.xinmall.service.trade.impl.OrderServiceImpl.receive(..))")
    public void orderReceivePointcut() {}

    /**
     * 切入点：OrderServiceImpl 的 cancel 方法
     */
    @Pointcut("execution(* com.example.xinmall.service.trade.impl.OrderServiceImpl.cancel(..))")
    public void orderCancelPointcut() {}

    /**
     * 切入点：OrderServiceImpl 的 refund 方法
     */
    @Pointcut("execution(* com.example.xinmall.service.trade.impl.OrderServiceImpl.refund(..))")
    public void orderRefundPointcut() {}

    /**
     * 订单创建后发送消息给卖家
     */
    @AfterReturning(pointcut = "orderCreatePointcut()", returning = "orderId")
    @Transactional
    public void afterOrderCreate(Long orderId) {
        try {
            Order order = orderMapper.selectById(orderId);
            if (order == null) {
                log.warn("订单不存在: {}", orderId);
                return;
            }

            Long buyerId = order.getUserId();
            Long sellerId = order.getSellerId();

            // 确保会话存在（买家到卖家）
            ensureConversationExists(buyerId, sellerId);

            // 构建订单卡片消息内容
            String content = buildOrderCardContent(order, "买家已下单，请等待付款");

            // 发送消息给卖家
            sendOrderNotificationMessage(buyerId, sellerId, content);

            log.info("订单创建通知已发送: orderId={}, sellerId={}", orderId, sellerId);
        } catch (Exception e) {
            log.error("发送订单创建通知失败: orderId={}", orderId, e);
        }
    }

    /**
     * 订单支付后发送消息给卖家
     */
    @AfterReturning("orderPayPointcut() && args(id)")
    @Transactional
    public void afterOrderPay(Long id) {
        try {
            Order order = orderMapper.selectById(id);
            if (order == null) {
                log.warn("订单不存在: {}", id);
                return;
            }

            Long buyerId = order.getUserId();
            Long sellerId = order.getSellerId();

            // 确保会话存在
            ensureConversationExists(buyerId, sellerId);

            // 构建订单卡片消息内容
            String content = buildOrderCardContent(order, "买家已付款，请尽快发货");

            // 发送消息给卖家
            sendOrderNotificationMessage(buyerId, sellerId, content);

            log.info("订单支付通知已发送: orderId={}, sellerId={}", id, sellerId);
        } catch (Exception e) {
            log.error("发送订单支付通知失败: orderId={}", id, e);
        }
    }

    /**
     * 订单发货后发送消息给买家
     */
    @AfterReturning("orderShipPointcut() && args(id, expressCompany, expressNo)")
    @Transactional
    public void afterOrderShip(Long id, String expressCompany, String expressNo) {
        try {
            Order order = orderMapper.selectById(id);
            if (order == null) {
                log.warn("订单不存在: {}", id);
                return;
            }

            Long buyerId = order.getUserId();
            Long sellerId = order.getSellerId();

            // 确保会话存在
            ensureConversationExists(sellerId, buyerId);

            // 构建订单卡片消息内容
            String content = buildOrderCardContent(order,
                "卖家已发货，快递公司：" + expressCompany + "，快递单号：" + expressNo);

            // 发送消息给买家
            sendOrderNotificationMessage(sellerId, buyerId, content);

            log.info("订单发货通知已发送: orderId={}, buyerId={}", id, buyerId);
        } catch (Exception e) {
            log.error("发送订单发货通知失败: orderId={}", id, e);
        }
    }

    /**
     * 订单确认收货后发送消息给卖家
     */
    @AfterReturning("orderReceivePointcut() && args(id)")
    @Transactional
    public void afterOrderReceive(Long id) {
        try {
            Order order = orderMapper.selectById(id);
            if (order == null) {
                log.warn("订单不存在: {}", id);
                return;
            }

            Long buyerId = order.getUserId();
            Long sellerId = order.getSellerId();

            // 确保会话存在
            ensureConversationExists(buyerId, sellerId);

            // 构建订单卡片消息内容
            String content = buildOrderCardContent(order, "买家已确认收货，交易完成");

            // 发送消息给卖家
            sendOrderNotificationMessage(buyerId, sellerId, content);

            log.info("订单收货通知已发送: orderId={}, sellerId={}", id, sellerId);
        } catch (Exception e) {
            log.error("发送订单收货通知失败: orderId={}", id, e);
        }
    }

    /**
     * 订单取消后发送消息给卖家
     */
    @AfterReturning("orderCancelPointcut() && args(id, reason)")
    @Transactional
    public void afterOrderCancel(Long id, String reason) {
        try {
            Order order = orderMapper.selectById(id);
            if (order == null) {
                log.warn("订单不存在: {}", id);
                return;
            }

            Long buyerId = order.getUserId();
            Long sellerId = order.getSellerId();

            // 确保会话存在
            ensureConversationExists(buyerId, sellerId);

            // 构建订单卡片消息内容
            String reasonText = reason != null && !reason.isEmpty() ? reason : "无原因";
            String content = buildOrderCardContent(order, "订单已取消，原因：" + reasonText);

            // 发送消息给卖家
            sendOrderNotificationMessage(buyerId, sellerId, content);

            log.info("订单取消通知已发送: orderId={}, sellerId={}", id, sellerId);
        } catch (Exception e) {
            log.error("发送订单取消通知失败: orderId={}", id, e);
        }
    }

    /**
     * 订单退款后发送消息给买卖双方
     */
    @AfterReturning("orderRefundPointcut() && args(id, reason)")
    @Transactional
    public void afterOrderRefund(Long id, String reason) {
        try {
            Order order = orderMapper.selectById(id);
            if (order == null) {
                log.warn("订单不存在: {}", id);
                return;
            }

            Long buyerId = order.getUserId();
            Long sellerId = order.getSellerId();

            // 确保会话存在
            ensureConversationExists(buyerId, sellerId);

            // 构建订单卡片消息内容
            String reasonText = reason != null && !reason.isEmpty() ? reason : "无原因";
            String content = buildOrderCardContent(order, "订单已申请退款，原因：" + reasonText);

            // 发送消息给卖家（通知卖家有人申请退款）
            sendOrderNotificationMessage(buyerId, sellerId, content);

            log.info("订单退款通知已发送: orderId={}, sellerId={}", id, sellerId);
        } catch (Exception e) {
            log.error("发送订单退款通知失败: orderId={}", id, e);
        }
    }

    /**
     * 确保会话存在（双向创建）
     */
    private void ensureConversationExists(Long userId, Long targetId) {
        // 检查 userId 到 targetId 的会话是否存在
        Conversation conversation = conversationMapper.selectOne(
            new LambdaQueryWrapper<Conversation>()
                .eq(Conversation::getUserId, userId)
                .eq(Conversation::getTargetId, targetId)
        );

        if (conversation == null) {
            // 创建双向会话
            createConversation(userId, targetId);
            createConversation(targetId, userId);
            log.info("创建会话: userId={}, targetId={}", userId, targetId);
        }
    }

    /**
     * 创建单个会话记录
     */
    private void createConversation(Long userId, Long targetId) {
        Conversation existingConversation = conversationMapper.selectOne(
            new LambdaQueryWrapper<Conversation>()
                .eq(Conversation::getUserId, userId)
                .eq(Conversation::getTargetId, targetId)
        );

        if (existingConversation != null) {
            return;
        }

        Conversation conversation = new Conversation();
        conversation.setUserId(userId);
        conversation.setTargetId(targetId);
        conversation.setUnreadCount(0);
        conversation.setIsPinned(false);
        conversation.setIsMuted(false);
        conversation.setIsDeleted(false);
        conversation.setCreatedAt(LocalDateTime.now());
        conversation.setUpdatedAt(LocalDateTime.now());
        conversationMapper.insert(conversation);
    }

    /**
     * 直接发送订单通知消息（绕过 SecurityContext 检查）
     */
    private void sendOrderNotificationMessage(Long senderId, Long receiverId, String content) {
        try {
            // 获取发送者的会话
            Conversation senderConversation = conversationMapper.selectOne(
                new LambdaQueryWrapper<Conversation>()
                    .eq(Conversation::getUserId, senderId)
                    .eq(Conversation::getTargetId, receiverId)
            );

            if (senderConversation == null) {
                log.warn("发送者会话不存在: senderId={}, receiverId={}", senderId, receiverId);
                return;
            }

            // 创建消息记录
            Message message = new Message();
            message.setConversationId(senderConversation.getId());
            message.setSenderId(senderId);
            message.setReceiverId(receiverId);
            message.setType(MessageType.ORDER_CARD);
            message.setContent(content);
            message.setStatus(MessageStatus.SENT);
            message.setCreatedAt(LocalDateTime.now());

            messageMapper.insert(message);

            // 更新发送者的会话最后消息
            conversationMapper.update(null,
                new LambdaUpdateWrapper<Conversation>()
                    .eq(Conversation::getId, senderConversation.getId())
                    .set(Conversation::getLastMessage, content)
                    .set(Conversation::getLastMessageType, MessageType.ORDER_CARD)
                    .set(Conversation::getLastMessageTime, message.getCreatedAt())
                    .set(Conversation::getUpdatedAt, LocalDateTime.now())
            );

            // 更新接收者的会话
            Conversation receiverConversation = conversationMapper.selectOne(
                new LambdaQueryWrapper<Conversation>()
                    .eq(Conversation::getUserId, receiverId)
                    .eq(Conversation::getTargetId, senderId)
            );

            if (receiverConversation != null) {
                conversationMapper.update(null,
                    new LambdaUpdateWrapper<Conversation>()
                        .eq(Conversation::getId, receiverConversation.getId())
                        .set(Conversation::getLastMessage, content)
                        .set(Conversation::getLastMessageType, MessageType.ORDER_CARD)
                        .set(Conversation::getLastMessageTime, message.getCreatedAt())
                        .set(Conversation::getUpdatedAt, LocalDateTime.now())
                        .setSql("unread_count = unread_count + 1")
                );
            }

            log.info("订单通知消息已发送: senderId={}, receiverId={}", senderId, receiverId);
        } catch (Exception e) {
            log.error("发送订单通知消息失败: senderId={}, receiverId={}", senderId, receiverId, e);
        }
    }

    /**
     * 构建订单卡片消息内容（JSON格式）
     */
    private String buildOrderCardContent(Order order, String statusMessage) {
        Map<String, Object> cardData = new HashMap<>();
        cardData.put("orderId", order.getId());
        cardData.put("orderNo", order.getOrderNo());
        cardData.put("status", order.getStatus() != null ? order.getStatus().name() : "UNKNOWN");
        cardData.put("totalAmount", order.getTotalAmount());
        cardData.put("quantity", order.getQuantity());
        cardData.put("message", statusMessage);
        cardData.put("timestamp", System.currentTimeMillis());

        try {
            return objectMapper.writeValueAsString(cardData);
        } catch (JsonProcessingException e) {
            log.error("序列化订单卡片失败", e);
            return "{\"orderId\":" + order.getId() + ",\"message\":\"" + statusMessage + "\"}";
        }
    }
}
