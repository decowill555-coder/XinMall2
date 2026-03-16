package com.example.xinmall.dto.community.response;

import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class PostVO implements Serializable {

    private static final long serialVersionUID = 1L;

    private Long id;

    private String title;

    private String content;

    private AuthorVO author;

    private Long forumId;

    private String forumName;

    private Long spuId;

    private String spuName;

    private List<String> images;

    private List<String> tags;

    private Integer viewCount;

    private Integer likeCount;

    private Integer commentCount;

    private Integer collectCount;

    private Boolean isLiked;

    private Boolean isCollected;

    private Boolean isPinned;

    private Boolean isEssence;

    private LocalDateTime createdAt;

    @Data
    public static class AuthorVO implements Serializable {
        private Long id;
        private String name;
        private String avatar;
        private Integer level;
        private String levelName;
    }
}
