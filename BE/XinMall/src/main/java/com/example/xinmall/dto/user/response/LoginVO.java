package com.example.xinmall.dto.user.response;

import lombok.Data;

import java.io.Serializable;

@Data
public class LoginVO implements Serializable {

    private static final long serialVersionUID = 1L;

    private String token;

    private String refreshToken;

    private Long expiresIn;

    private UserVO user;
}
