package com.example.xinmall.entity.trade.enums;

import com.baomidou.mybatisplus.annotation.EnumValue;
import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;

@Getter
public enum AftersaleType {

    REFUND_ONLY(1, "refund_only", "仅退款"),
    REFUND_RETURN(2, "refund_return", "退货退款"),
    EXCHANGE(3, "exchange", "换货");

    private final Integer code;

    @EnumValue
    @JsonValue
    private final String value;

    private final String desc;

    AftersaleType(Integer code, String value, String desc) {
        this.code = code;
        this.value = value;
        this.desc = desc;
    }
}
