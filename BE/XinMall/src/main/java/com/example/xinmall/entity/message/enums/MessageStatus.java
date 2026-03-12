package com.example.xinmall.entity.message.enums;

import com.baomidou.mybatisplus.annotation.EnumValue;
import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;

@Getter
public enum MessageStatus {

    SENT(1, "已发送"),
    DELIVERED(2, "已送达"),
    READ(3, "已读");

    @EnumValue
    private final Integer code;

    @JsonValue
    private final String desc;

    MessageStatus(Integer code, String desc) {
        this.code = code;
        this.desc = desc;
    }
}
