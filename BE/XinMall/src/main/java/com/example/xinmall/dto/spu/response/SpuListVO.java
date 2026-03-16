package com.example.xinmall.dto.spu.response;

import lombok.Data;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.List;

@Data
public class SpuListVO implements Serializable {

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

    private Integer productCount;

    private BigDecimal priceMin;

    private BigDecimal priceMax;

    private PriceRangeVO priceRange;

    private Integer memberCount;

    private Boolean isFollowed;

    private List<String> tags;

    @Data
    public static class PriceRangeVO implements Serializable {
        private BigDecimal min;
        private BigDecimal max;
    }
}
