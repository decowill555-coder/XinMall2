package com.example.xinmall.dto.spu.response;

import lombok.Data;

import java.io.Serializable;
import java.util.List;

@Data
public class SpuProductVO implements Serializable {

    private static final long serialVersionUID = 1L;

    private Long id;

    private String cover;

    private String title;

    private java.math.BigDecimal price;

    private java.math.BigDecimal originalPrice;

    private String condition;

    private java.util.Map<String, String> specValues;

    private String sellerType;

    private Long sellerId;

    private String sellerName;

    private String sellerAvatar;

    private List<String> tags;

    private Integer viewCount;

    private Integer likeCount;

    private String createdAt;
}
