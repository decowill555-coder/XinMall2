package com.example.xinmall.dto.system.response;

import lombok.Data;

@Data
public class SearchHistoryVO {

    private Long id;

    private String keyword;

    private Integer searchType;

    private Integer resultCount;

    private Long createdAt;
}
