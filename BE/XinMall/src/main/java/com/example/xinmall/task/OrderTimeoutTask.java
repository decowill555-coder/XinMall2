package com.example.xinmall.task;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.example.xinmall.entity.trade.Order;
import com.example.xinmall.entity.trade.enums.OrderStatus;
import com.example.xinmall.mapper.trade.OrderMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 订单超时处理定时任务
 * <p>
 * 自动取消超过30分钟未支付的订单
 * </p>
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class OrderTimeoutTask {

    private final OrderMapper orderMapper;

    /**
     * 订单支付超时时间（分钟）
     */
    private static final int PAYMENT_TIMEOUT_MINUTES = 30;

    /**
     * 每5分钟检查一次超时订单
     */
    @Scheduled(fixedRate = 5 * 60 * 1000)
    @Transactional
    public void cancelTimeoutOrders() {
        log.info("开始检查超时未支付订单...");

        LocalDateTime timeoutThreshold = LocalDateTime.now().minusMinutes(PAYMENT_TIMEOUT_MINUTES);

        LambdaQueryWrapper<Order> wrapper = new LambdaQueryWrapper<Order>()
                .eq(Order::getStatus, OrderStatus.PENDING_PAYMENT)
                .lt(Order::getCreatedAt, timeoutThreshold);

        List<Order> timeoutOrders = orderMapper.selectList(wrapper);

        if (timeoutOrders.isEmpty()) {
            log.info("没有超时未支付的订单");
            return;
        }

        log.info("发现 {} 个超时未支付的订单，开始处理...", timeoutOrders.size());

        for (Order order : timeoutOrders) {
            try {
                cancelOrder(order);
                log.info("订单 {} 已超时自动取消", order.getOrderNo());
            } catch (Exception e) {
                log.error("取消订单 {} 失败: {}", order.getOrderNo(), e.getMessage());
            }
        }
    }

    private void cancelOrder(Order order) {
        // 更新订单状态为已取消
        order.setStatus(OrderStatus.CANCELLED);
        order.setCancelReason("支付超时，系统自动取消");
        order.setCancelTime(LocalDateTime.now());
        order.setUpdatedAt(LocalDateTime.now());
        orderMapper.updateById(order);

        // 超时取消订单时无需恢复库存（因为创建订单时并未扣减库存）
        // 商品状态仍为ON_SHELF，无需修改
    }
}
