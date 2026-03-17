package com.example.xinmall.entity.trade.enums;

import com.baomidou.mybatisplus.annotation.EnumValue;
import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;

@Getter
public enum OrderStatus {

    PENDING_PAYMENT(1, "待付款"),
    PENDING_SHIPMENT(2, "待发货"),
    PENDING_RECEIPT(3, "待收货"),
    COMPLETED(4, "已完成"),
    CANCELLED(5, "已取消"),
    REFUNDED(6, "已退款");

    @EnumValue
    private final Integer code;

    private final String desc;

    OrderStatus(Integer code, String desc) {
        this.code = code;
        this.desc = desc;
    }

    @JsonValue
    public String getName() {
        return name().toLowerCase();
    }
}
