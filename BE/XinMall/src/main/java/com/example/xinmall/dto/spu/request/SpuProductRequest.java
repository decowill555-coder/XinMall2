package com.example.xinmall.dto.spu.request;

import lombok.Data;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Map;

@Data
public class SpuProductRequest implements Serializable {

    private static final long serialVersionUID = 1L;

    private Long spuId;

    private Map<String, String> specFilters;

    private String condition;

    private BigDecimal priceMin;

    private BigDecimal priceMax;

    private String sellerType;

    private String sort;

    private String priceOrder;

    private Integer page = 1;

    private Integer pageSize = 10;
}
