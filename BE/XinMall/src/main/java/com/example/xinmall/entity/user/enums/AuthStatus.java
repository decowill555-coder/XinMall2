package com.example.xinmall.entity.user.enums;

import com.baomidou.mybatisplus.annotation.EnumValue;
import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;

@Getter
public enum AuthStatus {

    NOT_AUTHENTICATED(0, "未认证"),
    PENDING(1, "认证中"),
    AUTHENTICATED(2, "已认证"),
    FAILED(3, "认证失败");

    @EnumValue
    private final Integer code;

    @JsonValue
    private final String desc;

    AuthStatus(Integer code, String desc) {
        this.code = code;
        this.desc = desc;
    }
}
