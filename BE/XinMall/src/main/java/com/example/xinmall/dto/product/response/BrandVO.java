package com.example.xinmall.dto.product.response;

import lombok.Data;

import java.io.Serializable;

@Data
public class BrandVO implements Serializable {

    private static final long serialVersionUID = 1L;

    private Long id;

    private String name;

    private String logo;

    private String description;

    private Integer sort;
}
