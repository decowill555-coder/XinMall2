package com.example.xinmall.service.trade;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.example.xinmall.dto.trade.request.OrderCreateRequest;
import com.example.xinmall.dto.trade.response.OrderDetailVO;
import com.example.xinmall.dto.trade.response.OrderVO;
import com.example.xinmall.entity.trade.Order;
import com.example.xinmall.entity.trade.enums.OrderStatus;

public interface OrderService {

    Long create(OrderCreateRequest request);

    Page<OrderVO> getMyOrders(OrderStatus status, Integer page, Integer size);

    Page<OrderVO> getMySales(OrderStatus status, Integer page, Integer size);

    OrderDetailVO getDetailById(Long id);

    void cancel(Long id, String reason);

    void pay(Long id);

    void ship(Long id, String expressCompany, String expressNo);

    void receive(Long id);

    Order getById(Long id);
}
