package com.example.xinmall.dto.community.request;

import lombok.Data;

import java.io.Serializable;

@Data
public class CommunityQueryRequest implements Serializable {

    private static final long serialVersionUID = 1L;

    private String type;

    private String keyword;

    private String sort;

    private Integer page = 1;

    private Integer pageSize = 10;
}
