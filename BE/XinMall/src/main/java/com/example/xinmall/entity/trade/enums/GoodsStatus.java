package com.example.xinmall.entity.trade.enums;

import com.baomidou.mybatisplus.annotation.EnumValue;
import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;

@Getter
public enum GoodsStatus {

    OFF_SHELF(0, "下架"),
    ON_SHELF(1, "在售"),
    SOLD(2, "已售"),
    AUDITING(3, "审核中");

    @EnumValue
    private final Integer code;

    @JsonValue
    private final String desc;

    GoodsStatus(Integer code, String desc) {
        this.code = code;
        this.desc = desc;
    }
}
