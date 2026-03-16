package com.example.xinmall.dto.spu.response;

import lombok.Data;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.List;

@Data
public class SpuDetailVO implements Serializable {

    private static final long serialVersionUID = 1L;

    private Long id;

    private String name;

    private Long brandId;

    private String brandName;

    private Long categoryId;

    private String categoryName;

    private Long deviceTypeId;

    private String deviceTypeName;

    private String cover;

    private List<String> images;

    private String description;

    private List<SpuSpecVO> specs;

    private Integer productCount;

    private BigDecimal priceMin;

    private BigDecimal priceMax;

    private PriceRangeVO priceRange;

    private BigDecimal avgRating;

    private Integer memberCount;

    private Integer postCount;

    private Boolean isFollowed;

    private List<String> tags;

    private String createdAt;

    @Data
    public static class SpuSpecVO implements Serializable {
        private String name;
        private List<String> options;
    }

    @Data
    public static class PriceRangeVO implements Serializable {
        private BigDecimal min;
        private BigDecimal max;
    }
}
