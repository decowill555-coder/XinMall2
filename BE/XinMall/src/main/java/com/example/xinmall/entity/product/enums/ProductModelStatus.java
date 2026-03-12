package com.example.xinmall.entity.product.enums;

import com.baomidou.mybatisplus.annotation.EnumValue;
import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;

@Getter
public enum ProductModelStatus {

    DELETED(0, "已删除"),
    ON_SALE(1, "在售"),
    OFF_SALE(2, "停售");

    @EnumValue
    private final Integer code;

    @JsonValue
    private final String desc;

    ProductModelStatus(Integer code, String desc) {
        this.code = code;
        this.desc = desc;
    }
}
