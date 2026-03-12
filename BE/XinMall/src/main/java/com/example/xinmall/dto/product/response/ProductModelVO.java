package com.example.xinmall.dto.product.response;

import lombok.Data;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class ProductModelVO implements Serializable {

    private static final long serialVersionUID = 1L;

    private Long id;

    private String name;

    private Long brandId;

    private String brandName;

    private Long categoryId;

    private String categoryName;

    private String cover;

    private BigDecimal referencePrice;

    private LocalDate releaseDate;

    private Integer viewCount;

    private Integer followCount;

    private Integer goodsCount;
}
