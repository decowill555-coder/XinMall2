package com.example.xinmall.entity.product.enums;

import com.baomidou.mybatisplus.annotation.EnumValue;
import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;

@Getter
public enum InputType {

    TEXT(1, "文本"),
    NUMBER(2, "数字"),
    SINGLE_SELECT(3, "单选"),
    MULTI_SELECT(4, "多选"),
    BOOLEAN(5, "布尔");

    @EnumValue
    private final Integer code;

    @JsonValue
    private final String desc;

    InputType(Integer code, String desc) {
        this.code = code;
        this.desc = desc;
    }
}
