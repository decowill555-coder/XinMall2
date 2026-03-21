package com.example.xinmall.dto.search.response;

import lombok.Data;

import java.io.Serializable;
import java.util.List;

@Data
public class SearchAggregationVO implements Serializable {

    private static final long serialVersionUID = 1L;

    private Long productCount;

    private Long modelCount;

    private Long communityCount;

    private List<BrandAggregation> brands;

    private List<ConditionAggregation> conditions;

    private PriceRange priceRange;

    private List<StorageAggregation> storages;

    public void setProductCount(Long productCount) {
        this.productCount = productCount;
    }

    public void setModelCount(Long modelCount) {
        this.modelCount = modelCount;
    }

    public void setCommunityCount(Long communityCount) {
        this.communityCount = communityCount;
    }

    @Data
    public static class BrandAggregation implements Serializable {
        private Long id;
        private String name;
        private Integer count;
    }

    @Data
    public static class ConditionAggregation implements Serializable {
        private String name;
        private String value;
        private Integer count;
    }

    @Data
    public static class PriceRange implements Serializable {
        private java.math.BigDecimal min;
        private java.math.BigDecimal max;
    }

    @Data
    public static class StorageAggregation implements Serializable {
        private String value;
        private String name;
        private Integer count;
    }
}
