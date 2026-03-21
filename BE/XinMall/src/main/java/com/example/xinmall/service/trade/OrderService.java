package com.example.xinmall.service.trade;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.example.xinmall.dto.trade.request.OrderCreateRequest;
import com.example.xinmall.dto.trade.response.OrderDetailVO;
import com.example.xinmall.dto.trade.response.OrderVO;
import com.example.xinmall.entity.trade.Order;
import com.example.xinmall.entity.trade.enums.OrderStatus;

import java.util.Map;

public interface OrderService {

    Long create(OrderCreateRequest request);

    IPage<OrderVO> getMyOrders(OrderStatus status, Integer page, Integer size);

    IPage<OrderVO> getMySales(OrderStatus status, Integer page, Integer size);

    OrderDetailVO getDetailById(Long id);

    void cancel(Long id, String reason);

    void pay(Long id);

    void ship(Long id, String expressCompany, String expressNo);

    void receive(Long id);

    void refund(Long id, String reason);

    Order getById(Long id);

    /**
     * 获取用户各状态订单数量统计
     */
    Map<String, Long> getOrderCountByStatus();

    /**
     * 获取卖家各状态订单数量统计
     */
    Map<String, Long> getSellerOrderCountByStatus();
}
