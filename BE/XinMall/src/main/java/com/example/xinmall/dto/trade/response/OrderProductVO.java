package com.example.xinmall.dto.trade.response;

import lombok.Data;

import java.io.Serializable;
import java.math.BigDecimal;

@Data
public class OrderProductVO implements Serializable {

    private static final long serialVersionUID = 1L;

    private Long id;

    private String title;

    private String cover;

    private BigDecimal price;

    private Integer quantity;

    private String condition;
}
