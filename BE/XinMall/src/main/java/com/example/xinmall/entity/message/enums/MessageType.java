package com.example.xinmall.entity.message.enums;

import com.baomidou.mybatisplus.annotation.EnumValue;
import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;

@Getter
public enum MessageType {

    TEXT(1, "文本"),
    IMAGE(2, "图片"),
    GOODS_CARD(3, "商品卡片"),
    ORDER_CARD(4, "订单卡片");

    @EnumValue
    private final Integer code;

    @JsonValue
    private final String desc;

    MessageType(Integer code, String desc) {
        this.code = code;
        this.desc = desc;
    }
}
