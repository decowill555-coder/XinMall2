package com.example.xinmall.dto.community.response;

import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class CommentVO implements Serializable {

    private static final long serialVersionUID = 1L;

    private Long id;

    private Long postId;

    private String content;

    private AuthorVO author;

    private Long parentId;

    private Long replyToId;

    private AuthorVO replyToUser;

    private List<String> images;

    private Integer likeCount;

    private Integer replyCount;

    private Boolean isLiked;

    private LocalDateTime createdAt;

    private List<CommentVO> replies;

    @Data
    public static class AuthorVO implements Serializable {
        private Long id;
        private String name;
        private String avatar;
        private Integer level;
        private String levelName;
    }
}
