package com.example.xinmall.dto.search.response;

import lombok.Data;

import java.io.Serializable;

@Data
public class HotSearchVO implements Serializable {

    private static final long serialVersionUID = 1L;

    private String keyword;

    private String type;

    private Integer heat;

    private String trend;

    private String cover;

    private Long id;

    private Integer count;
}
