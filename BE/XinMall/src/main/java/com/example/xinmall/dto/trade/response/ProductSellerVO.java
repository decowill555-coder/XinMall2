package com.example.xinmall.dto.trade.response;

import lombok.Data;

import java.io.Serializable;

@Data
public class ProductSellerVO implements Serializable {

    private static final long serialVersionUID = 1L;

    private Long id;

    private String name;

    private String avatar;
}
