package com.example.xinmall.dto.spu.response;

import lombok.Data;

import java.io.Serializable;
import java.math.BigDecimal;

@Data
public class SpuPriceTrendVO implements Serializable {

    private static final long serialVersionUID = 1L;

    private String date;

    private BigDecimal avgPrice;

    private BigDecimal minPrice;

    private BigDecimal maxPrice;

    private Integer productCount;
}
