package com.example.xinmall.dto.spu.response;

import lombok.Data;

import java.io.Serializable;
import java.util.List;

@Data
public class SpuPostVO implements Serializable {

    private static final long serialVersionUID = 1L;

    private Long id;

    private String title;

    private String content;

    private AuthorVO author;

    private List<String> images;

    private Integer likeCount;

    private Integer commentCount;

    private Boolean isLiked;

    private Boolean isPinned;

    private Boolean isEssence;

    private String createdAt;

    @Data
    public static class AuthorVO implements Serializable {
        private Long id;
        private String name;
        private String avatar;
        private Integer level;
        private String levelName;
    }
}
