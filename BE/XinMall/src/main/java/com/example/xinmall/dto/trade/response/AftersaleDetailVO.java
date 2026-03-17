package com.example.xinmall.dto.trade.response;

import com.example.xinmall.entity.trade.enums.AftersaleStatus;
import com.example.xinmall.entity.trade.enums.AftersaleType;
import lombok.Data;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class AftersaleDetailVO implements Serializable {

    private static final long serialVersionUID = 1L;

    private Long id;

    private String orderNo;

    private Long orderId;

    private AftersaleType type;

    private String reason;

    private AftersaleStatus status;

    private String description;

    private List<String> images;

    private BigDecimal refundAmount;

    private String rejectReason;

    private AftersaleLogisticsVO logistics;

    private List<AftersaleTimelineVO> timeline;

    private AftersaleOrderVO order;

    private AftersaleSellerVO seller;

    private String goodsCover;

    private String goodsTitle;

    private String goodsSpec;

    private BigDecimal goodsPrice;

    private Integer quantity;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
