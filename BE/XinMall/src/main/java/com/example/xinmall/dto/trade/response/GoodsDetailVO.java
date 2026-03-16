package com.example.xinmall.dto.trade.response;

import lombok.Data;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class GoodsDetailVO implements Serializable {

    private static final long serialVersionUID = 1L;

    private Long id;

    private String title;

    private ProductSellerVO seller;

    private ProductModelVO model;

    private Long categoryId;

    private String categoryName;

    private String description;

    private List<String> images;

    private BigDecimal price;

    private BigDecimal originalPrice;

    private String condition;

    private Integer conditionLevel;

    private String conditionDesc;

    private Boolean warranty;

    private Boolean invoice;

    private Boolean canBargain;

    private String location;

    private Integer stock;

    private Integer viewCount;

    private Integer likeCount;

    private Boolean isCollected;

    private String status;

    private LocalDateTime createdAt;
}
