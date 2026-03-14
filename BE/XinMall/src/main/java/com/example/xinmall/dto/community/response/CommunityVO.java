package com.example.xinmall.dto.community.response;

import lombok.Data;

import java.io.Serializable;
import java.util.List;

@Data
public class CommunityVO implements Serializable {

    private static final long serialVersionUID = 1L;

    private Long id;

    private String name;

    private String type;

    private String cover;

    private String description;

    private Integer memberCount;

    private Integer postCount;

    private Boolean isOfficial;

    private Boolean isJoined;
}
