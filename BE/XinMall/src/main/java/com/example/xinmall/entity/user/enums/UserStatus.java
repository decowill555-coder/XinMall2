package com.example.xinmall.entity.user.enums;

import com.baomidou.mybatisplus.annotation.EnumValue;
import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;

@Getter
public enum UserStatus {

    DISABLED(0, "禁用"),
    NORMAL(1, "正常"),
    PENDING(2, "待激活");

    private final Integer code;
    private final String desc;

    UserStatus(Integer code, String desc) {
        this.code = code;
        this.desc = desc;
    }

    @EnumValue
    public Integer getCode() {
        return code;
    }

    @JsonValue
    public String getDesc() {
        return desc;
    }
}
