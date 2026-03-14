package com.example.xinmall.dto.community.response;

import lombok.Data;

import java.io.Serializable;

@Data
public class UserForumLevelVO implements Serializable {

    private static final long serialVersionUID = 1L;

    private Long forumId;

    private String forumName;

    private Integer level;

    private String levelName;

    private Integer exp;

    private Integer nextLevelExp;

    private Integer postCount;

    private Integer commentCount;

    private String joinTime;
}
