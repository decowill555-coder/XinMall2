package com.example.xinmall.dto.trade.response;

import lombok.Data;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class GoodsVO implements Serializable {

    private static final long serialVersionUID = 1L;

    private Long id;

    private String title;

    private Long sellerId;

    private String sellerName;

    private String sellerAvatar;

    private String cover;

    private BigDecimal price;

    private BigDecimal originalPrice;

    private Integer conditionLevel;

    private String location;

    private Integer viewCount;

    private Integer likeCount;

    private LocalDateTime createdAt;
}
