package com.example.xinmall.entity.user.enums;

import com.baomidou.mybatisplus.annotation.EnumValue;
import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;

@Getter
public enum Gender {

    UNKNOWN(0, "未知"),
    MALE(1, "男"),
    FEMALE(2, "女");

    @EnumValue
    private final Integer code;

    @JsonValue
    private final String desc;

    Gender(Integer code, String desc) {
        this.code = code;
        this.desc = desc;
    }

    public static Gender fromCode(Integer code) {
        if (code == null) return UNKNOWN;
        for (Gender gender : values()) {
            if (gender.getCode().equals(code)) {
                return gender;
            }
        }
        return UNKNOWN;
    }
}
