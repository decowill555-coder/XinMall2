package com.example.xinmall.entity.message.enums;

import com.baomidou.mybatisplus.annotation.EnumValue;
import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;

/**
 * 系统通知类型枚举
 */
@Getter
public enum NotificationType {

    ORDER_SHIPPED(1, "订单发货通知", "check-circle", "var(--color-success)"),
    ORDER_RECEIVED(2, "订单签收通知", "check-circle", "var(--color-success)"),
    ORDER_CANCELLED(3, "订单取消通知", "close-circle", "var(--color-error)"),
    ORDER_REFUND(4, "退款通知", "info-circle", "var(--color-warning)"),
    REAL_NAME_SUCCESS(5, "实名认证成功", "check-circle", "var(--color-success)"),
    REAL_NAME_FAILED(6, "实名认证失败", "close-circle", "var(--color-error)"),
    PRODUCT_AUDIT_PASS(7, "商品审核通过", "check-circle", "var(--color-success)"),
    PRODUCT_AUDIT_FAIL(8, "商品审核未通过", "close-circle", "var(--color-error)"),
    TRADE_SUCCESS(9, "交易成功", "check-circle", "var(--color-success)"),
    SECURITY_ALERT(10, "账户安全提醒", "info-circle", "var(--color-info)"),
    SYSTEM_NOTICE(11, "系统公告", "info-circle", "var(--color-info)");

    @EnumValue
    private final Integer code;
    @JsonValue
    private final String name;
    private final String icon;
    private final String iconColor;

    NotificationType(Integer code, String name, String icon, String iconColor) {
        this.code = code;
        this.name = name;
        this.icon = icon;
        this.iconColor = iconColor;
    }

    public static NotificationType fromCode(Integer code) {
        for (NotificationType type : values()) {
            if (type.getCode().equals(code)) {
                return type;
            }
        }
        return null;
    }
}
