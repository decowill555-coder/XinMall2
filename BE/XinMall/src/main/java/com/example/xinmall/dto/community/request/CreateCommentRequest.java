package com.example.xinmall.dto.community.request;

import lombok.Data;

import java.io.Serializable;
import java.util.List;

@Data
public class CreateCommentRequest implements Serializable {

    private static final long serialVersionUID = 1L;

    private Long postId;

    private String content;

    private Long parentId;

    private Long replyToId;

    private Long replyToUserId;

    private List<String> images;
}
