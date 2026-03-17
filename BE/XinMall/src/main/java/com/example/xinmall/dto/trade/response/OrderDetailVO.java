package com.example.xinmall.dto.trade.response;

import com.example.xinmall.entity.trade.enums.OrderStatus;
import lombok.Data;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class OrderDetailVO implements Serializable {

    private static final long serialVersionUID = 1L;

    private Long id;

    private String orderNo;

    private Long userId;

    private String userName;

    private OrderProductVO product;

    private OrderSellerVO seller;

    private OrderAddressVO address;

    private LogisticsVO logistics;

    private Integer quantity;

    private BigDecimal totalAmount;

    private BigDecimal freightAmount;

    private OrderStatus status;

    private String remark;

    private String paymentMethod;

    private LocalDateTime payTime;

    private LocalDateTime shipTime;

    private LocalDateTime receiveTime;

    private LocalDateTime finishTime;

    private LocalDateTime cancelTime;

    private String cancelReason;

    private LocalDateTime createdAt;
}
