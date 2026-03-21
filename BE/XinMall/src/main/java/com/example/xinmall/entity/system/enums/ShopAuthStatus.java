package com.example.xinmall.entity.system.enums;

import com.baomidou.mybatisplus.annotation.EnumValue;
import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;

/**
 * 店铺认证状态枚举
 */
@Getter
public enum ShopAuthStatus {

    PENDING("pending", "待审核"),
    APPROVED("approved", "已通过"),
    REJECTED("rejected", "已拒绝");

    @EnumValue
    private final String code;

    @JsonValue
    private final String desc;

    ShopAuthStatus(String code, String desc) {
        this.code = code;
        this.desc = desc;
    }
}
