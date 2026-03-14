package com.example.xinmall.dto.search.response;

import lombok.Data;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.List;

@Data
public class SearchResultVO implements Serializable {

    private static final long serialVersionUID = 1L;

    private List<SearchItemVO> list;

    private Long total;

    private Boolean hasMore;

    private SearchAggregationVO aggregations;

    @Data
    public static class SearchItemVO implements Serializable {
        private static final long serialVersionUID = 1L;
        
        private Long id;
        private String type;
        private String title;
        private String cover;
        private BigDecimal price;
        private BigDecimal originalPrice;
        private String condition;
        private Integer viewCount;
        private Integer likeCount;
        private Integer memberCount;
        private Integer postCount;
        private Integer productCount;
    }
}
