package com.example.xinmall.dto.community.response;

import lombok.Data;

import java.io.Serializable;
import java.util.List;

@Data
public class CommunityDetailVO implements Serializable {

    private static final long serialVersionUID = 1L;

    private Long id;

    private String name;

    private String type;

    private String description;

    private String cover;

    private Long modelId;

    private String modelName;

    private Boolean isOfficial;

    private Long creatorId;

    private String creatorName;

    private Integer memberCount;

    private Integer postCount;

    private Boolean isJoined;

    private Boolean isAdmin;

    private String createdAt;

    private List<String> tags;
}
