package com.example.xinmall.dto.trade.response;

import lombok.Data;

import java.io.Serializable;
import java.util.Map;

@Data
public class ProductModelVO implements Serializable {

    private static final long serialVersionUID = 1L;

    private Long id;

    private String name;

    /**
     * 品牌ID
     */
    private Long brandId;

    /**
     * 品牌名称
     */
    private String brandName;

    /**
     * 规格属性
     */
    private Map<String, String> specs;
}
