package com.example.xinmall.entity.trade.enums;

import com.baomidou.mybatisplus.annotation.EnumValue;
import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;

@Getter
public enum AftersaleOperatorType {

    USER(1, "user", "用户"),
    SELLER(2, "seller", "卖家"),
    SYSTEM(3, "system", "系统");

    @EnumValue
    private final Integer code;

    @JsonValue
    private final String value;

    private final String desc;

    AftersaleOperatorType(Integer code, String value, String desc) {
        this.code = code;
        this.value = value;
        this.desc = desc;
    }
}
