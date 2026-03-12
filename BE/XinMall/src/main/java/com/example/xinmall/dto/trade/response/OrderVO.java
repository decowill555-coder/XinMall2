package com.example.xinmall.dto.trade.response;

import com.example.xinmall.entity.trade.enums.OrderStatus;
import lombok.Data;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class OrderVO implements Serializable {

    private static final long serialVersionUID = 1L;

    private Long id;

    private String orderNo;

    private Long userId;

    private Long sellerId;

    private String sellerName;

    private Long goodsId;

    private String goodsTitle;

    private String goodsCover;

    private Integer quantity;

    private BigDecimal totalAmount;

    private OrderStatus status;

    private LocalDateTime createdAt;
}
