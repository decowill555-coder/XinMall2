package com.example.xinmall.entity.system.enums;

import com.baomidou.mybatisplus.annotation.EnumValue;
import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;

@Getter
public enum CollectionType {

    GOODS(1, "商品"),
    POST(2, "帖子"),
    PRODUCT_MODEL(3, "产品型号"),
    SHOP(4, "店铺"),
    TOPIC(5, "话题");

    @EnumValue
    private final Integer code;

    @JsonValue
    private final String desc;

    CollectionType(Integer code, String desc) {
        this.code = code;
        this.desc = desc;
    }
}
