package com.example.xinmall.dto.product.response;

import lombok.Data;

import java.io.Serializable;

@Data
public class CategoryItemVO implements Serializable {

    private static final long serialVersionUID = 1L;

    private String id;

    private String name;

    private Integer productCount;

    private String letter;
}
