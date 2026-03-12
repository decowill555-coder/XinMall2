package com.example.xinmall.dto.trade.request;

import com.example.xinmall.dto.common.PageRequest;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.io.Serializable;
import java.math.BigDecimal;

@EqualsAndHashCode(callSuper = true)
@Data
public class GoodsQueryRequest extends PageRequest implements Serializable {

    private static final long serialVersionUID = 1L;

    private String keyword;

    private Long categoryId;

    private Long brandId;

    private Long modelId;

    private Long sellerId;

    private Integer conditionMin;

    private Integer conditionMax;

    private BigDecimal minPrice;

    private BigDecimal maxPrice;

    private String location;

    private String sortBy;

    private String sortOrder;
}
