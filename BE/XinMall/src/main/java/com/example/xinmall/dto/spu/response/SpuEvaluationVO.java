package com.example.xinmall.dto.spu.response;

import lombok.Data;

import java.io.Serializable;
import java.util.List;

@Data
public class SpuEvaluationVO implements Serializable {

    private static final long serialVersionUID = 1L;

    private Long id;

    private Long productId;

    private String productCover;

    private String productTitle;

    private AuthorVO author;

    private Integer rating;

    private String content;

    private List<String> images;

    private String createdAt;

    @Data
    public static class AuthorVO implements Serializable {
        private Long id;
        private String name;
        private String avatar;
    }
}
