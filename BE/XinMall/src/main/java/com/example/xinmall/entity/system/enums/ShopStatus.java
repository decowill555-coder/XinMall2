package com.example.xinmall.entity.system.enums;

import com.baomidou.mybatisplus.annotation.EnumValue;
import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;

@Getter
public enum ShopStatus {

    CLOSED(0, "关闭"),
    NORMAL(1, "正常"),
    AUDITING(2, "审核中");

    @EnumValue
    private final Integer code;

    @JsonValue
    private final String desc;

    ShopStatus(Integer code, String desc) {
        this.code = code;
        this.desc = desc;
    }
}
