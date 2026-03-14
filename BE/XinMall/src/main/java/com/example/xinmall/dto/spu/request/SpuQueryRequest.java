package com.example.xinmall.dto.spu.request;

import lombok.Data;

import java.io.Serializable;
import java.math.BigDecimal;

@Data
public class SpuQueryRequest implements Serializable {

    private static final long serialVersionUID = 1L;

    private Long deviceTypeId;

    private Long brandId;

    private String keyword;

    private String sort;

    private Integer page = 1;

    private Integer pageSize = 10;
}
