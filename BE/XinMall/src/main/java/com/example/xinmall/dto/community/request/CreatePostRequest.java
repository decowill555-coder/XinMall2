package com.example.xinmall.dto.community.request;

import lombok.Data;

import java.io.Serializable;
import java.util.List;

@Data
public class CreatePostRequest implements Serializable {

    private static final long serialVersionUID = 1L;

    private String title;

    private String content;

    private Long forumId;

    private Long spuId;

    private List<String> images;

    private List<String> tags;
}
