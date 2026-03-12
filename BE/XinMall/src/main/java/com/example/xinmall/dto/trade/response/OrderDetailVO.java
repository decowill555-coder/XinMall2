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

    private Long sellerId;

    private String sellerName;

    private Long goodsId;

    private String goodsSnapshot;

    private Integer quantity;

    private BigDecimal totalAmount;

    private OrderStatus status;

    private String remark;

    private String addressSnapshot;

    private String expressCompany;

    private String expressNo;

    private LocalDateTime payTime;

    private LocalDateTime shipTime;

    private LocalDateTime receiveTime;

    private LocalDateTime finishTime;

    private LocalDateTime cancelTime;

    private String cancelReason;

    private LocalDateTime createdAt;
}
