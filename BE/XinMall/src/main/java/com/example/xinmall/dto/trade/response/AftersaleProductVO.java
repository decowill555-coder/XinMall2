package com.example.xinmall.dto.trade.response;

import lombok.Data;

import java.io.Serializable;
import java.math.BigDecimal;

@Data
public class AftersaleProductVO implements Serializable {

    private static final long serialVersionUID = 1L;

    private Long id;

    private String cover;

    private String title;

    private BigDecimal price;

    private String spec;
}
