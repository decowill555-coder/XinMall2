package com.example.xinmall.dto.system.response;

import lombok.Data;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class ShopVO implements Serializable {

    private static final long serialVersionUID = 1L;

    private Long id;

    private Long userId;

    private String name;

    private String avatar;

    private String cover;

    private String description;

    private BigDecimal rating;

    private Integer followerCount;

    private Integer goodsCount;

    private Integer soldCount;

    private String status;

    private LocalDateTime createdAt;
}
