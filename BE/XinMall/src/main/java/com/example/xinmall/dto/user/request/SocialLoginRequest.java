package com.example.xinmall.dto.user.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.io.Serializable;

@Data
public class SocialLoginRequest implements Serializable {

    private static final long serialVersionUID = 1L;

    @NotBlank(message = "平台不能为空")
    private String platform;

    @NotBlank(message = "授权码不能为空")
    private String code;
}
