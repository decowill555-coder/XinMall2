package com.example.xinmall.dto.community.request;

import lombok.Data;

import java.io.Serializable;
import java.util.List;

@Data
public class PostQueryRequest implements Serializable {

    private static final long serialVersionUID = 1L;

    private Long forumId;

    private Long spuId;

    private Long authorId;

    private String keyword;

    private String type;

    private String sort;

    private Integer page = 1;

    private Integer pageSize = 10;
}
