package com.example.xinmall.dto.search.request;

import lombok.Data;

import java.io.Serializable;
    import java.math.BigDecimal;

@Data
public class SearchRequest implements Serializable {

    private static final long serialVersionUID = 1L;

    private String keyword;

    private String type;

    private Long deviceTypeId;

    private Long brandId;

    private String condition;

    private BigDecimal priceMin;

    private BigDecimal priceMax;

    private String sellerType;

    private String sort;

    private String priceOrder;

    private Integer page = 1;

    private Integer pageSize = 10;
}
