package com.example.xinmall.dto.community.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.io.Serializable;

@Data
public class CreateCommunityRequest implements Serializable {

    private static final long serialVersionUID = 1L;

    @NotBlank(message = "社区名称不能为空")
    private String name;

    private String description;

    private String cover;
}
