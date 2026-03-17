package com.example.xinmall.entity.trade.enums;

import com.baomidou.mybatisplus.annotation.EnumValue;
import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;

@Getter
public enum AftersaleStatus {

    PENDING(1, "pending", "待处理"),
    PROCESSING(2, "processing", "处理中"),
    COMPLETED(3, "completed", "已完成"),
    REJECTED(4, "rejected", "已拒绝"),
    CANCELLED(5, "cancelled", "已取消");

    private final Integer code;

    @EnumValue
    @JsonValue
    private final String value;

    private final String desc;

    AftersaleStatus(Integer code, String value, String desc) {
        this.code = code;
        this.value = value;
        this.desc = desc;
    }

    public static AftersaleStatus fromValue(String value) {
        for (AftersaleStatus status : values()) {
            if (status.value.equals(value)) {
                return status;
            }
        }
        return null;
    }
}
