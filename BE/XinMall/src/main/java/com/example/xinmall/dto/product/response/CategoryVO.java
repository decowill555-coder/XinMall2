package com.example.xinmall.dto.product.response;

import lombok.Data;

import java.io.Serializable;
import java.util.List;

@Data
public class CategoryVO implements Serializable {

    private static final long serialVersionUID = 1L;

    private Long id;

    private String name;

    private Long parentId;

    private Integer level;

    private String icon;

    private String image;

    private Integer sort;

    private List<CategoryVO> children;
}
