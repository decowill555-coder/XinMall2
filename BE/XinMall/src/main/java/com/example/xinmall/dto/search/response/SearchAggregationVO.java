package com.example.xinmall.dto.search.response;

import lombok.Data;

import java.io.Serializable;
import java.util.List;

@Data
public class SearchAggregationVO implements Serializable {

    private static final long serialVersionUID = 1L;

    private Integer productCount;

    private Integer modelCount;

    private Integer communityCount;

    private List<BrandAggregation> brands;

    private List<ConditionAggregation> conditions;

    private PriceRange priceRange;

    @Data
    public static class BrandAggregation implements Serializable {
        private Long id;
        private String name;
        private Integer count;
    }

    @Data
    public static class ConditionAggregation implements Serializable {
        private String name;
        private Integer count;
    }

    @Data
    public static class PriceRange implements Serializable {
        private java.math.BigDecimal min;
        private java.math.BigDecimal max;
    }
}
