package com.example.xinmall.dto.product.request;

import com.example.xinmall.dto.common.PageRequest;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.io.Serializable;
import java.math.BigDecimal;

@EqualsAndHashCode(callSuper = true)
@Data
public class ProductModelQueryRequest extends PageRequest implements Serializable {

    private static final long serialVersionUID = 1L;

    private String keyword;

    private Long categoryId;

    private Long brandId;

    private BigDecimal minPrice;

    private BigDecimal maxPrice;

    private String sortBy;

    private String sortOrder;
}
