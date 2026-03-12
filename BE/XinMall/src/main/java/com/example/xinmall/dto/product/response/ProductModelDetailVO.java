package com.example.xinmall.dto.product.response;

import lombok.Data;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
public class ProductModelDetailVO implements Serializable {

    private static final long serialVersionUID = 1L;

    private Long id;

    private String name;

    private Long brandId;

    private String brandName;

    private Long categoryId;

    private String categoryName;

    private String cover;

    private List<String> images;

    private String description;

    private LocalDate releaseDate;

    private BigDecimal referencePrice;

    private Integer viewCount;

    private Integer followCount;

    private Integer postCount;

    private Integer goodsCount;

    private List<AttributeValueVO> attributes;

    @Data
    public static class AttributeValueVO implements Serializable {
        private static final long serialVersionUID = 1L;
        private Long attributeId;
        private String attributeName;
        private String unit;
        private String value;
        private String displayValue;
    }
}
