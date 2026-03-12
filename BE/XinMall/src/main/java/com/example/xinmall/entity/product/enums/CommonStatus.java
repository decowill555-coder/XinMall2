package com.example.xinmall.entity.product.enums;

import com.baomidou.mybatisplus.annotation.EnumValue;
import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;

@Getter
public enum CommonStatus {

    DISABLED(0, "禁用"),
    ENABLED(1, "启用");

    @EnumValue
    private final Integer code;

    @JsonValue
    private final String desc;

    CommonStatus(Integer code, String desc) {
        this.code = code;
        this.desc = desc;
    }
}
