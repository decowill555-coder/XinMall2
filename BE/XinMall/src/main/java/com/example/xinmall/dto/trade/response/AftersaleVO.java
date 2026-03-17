package com.example.xinmall.dto.trade.response;

import com.example.xinmall.entity.trade.enums.AftersaleStatus;
import com.example.xinmall.entity.trade.enums.AftersaleType;
import lombok.Data;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class AftersaleVO implements Serializable {

    private static final long serialVersionUID = 1L;

    private Long id;

    private String orderNo;

    private Long orderId;

    private AftersaleType type;

    private String reason;

    private AftersaleStatus status;

    private String goodsCover;

    private String goodsTitle;

    private String goodsSpec;

    private BigDecimal goodsPrice;

    private Integer quantity;

    private BigDecimal refundAmount;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
