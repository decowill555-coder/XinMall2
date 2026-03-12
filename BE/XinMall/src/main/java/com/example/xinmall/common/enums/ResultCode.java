package com.example.xinmall.common.enums;

import lombok.Getter;

@Getter
public enum ResultCode {

    SUCCESS(200, "操作成功"),
    CREATED(201, "创建成功"),
    NO_CONTENT(204, "无内容"),

    BAD_REQUEST(400, "请求参数错误"),
    UNAUTHORIZED(401, "未授权，请先登录"),
    FORBIDDEN(403, "权限不足，拒绝访问"),
    NOT_FOUND(404, "资源不存在"),
    METHOD_NOT_ALLOWED(405, "请求方法不允许"),
    CONFLICT(409, "资源冲突"),
    UNPROCESSABLE_ENTITY(422, "参数校验失败"),

    INTERNAL_SERVER_ERROR(500, "服务器内部错误"),
    SERVICE_UNAVAILABLE(503, "服务暂不可用"),

    USER_NOT_FOUND(1001, "用户不存在"),
    USER_ALREADY_EXISTS(1002, "用户已存在"),
    PASSWORD_ERROR(1003, "密码错误"),
    PHONE_ALREADY_REGISTERED(1004, "手机号已注册"),
    ACCOUNT_DISABLED(1005, "账号已被禁用"),
    VERIFICATION_CODE_ERROR(1006, "验证码错误"),
    VERIFICATION_CODE_EXPIRED(1007, "验证码已过期"),

    GOODS_NOT_FOUND(2001, "商品不存在"),
    GOODS_OFF_SHELF(2002, "商品已下架"),
    GOODS_STOCK_INSUFFICIENT(2003, "商品库存不足"),
    CATEGORY_NOT_FOUND(2004, "分类不存在"),
    BRAND_NOT_FOUND(2005, "品牌不存在"),

    ORDER_NOT_FOUND(3001, "订单不存在"),
    ORDER_STATUS_ERROR(3002, "订单状态错误"),
    ORDER_ALREADY_PAID(3003, "订单已支付"),
    ORDER_ALREADY_CANCELLED(3004, "订单已取消"),
    ORDER_CANNOT_CANCEL(3005, "订单无法取消"),

    SHOP_NOT_FOUND(4001, "店铺不存在"),
    SHOP_DISABLED(4002, "店铺已被禁用"),

    FILE_UPLOAD_ERROR(5001, "文件上传失败"),
    FILE_TYPE_NOT_ALLOWED(5002, "文件类型不允许"),
    FILE_SIZE_EXCEEDED(5003, "文件大小超出限制"),

    ADDRESS_NOT_FOUND(6001, "地址不存在"),
    ADDRESS_LIMIT_EXCEEDED(6002, "地址数量已达上限");

    private final Integer code;
    private final String message;

    ResultCode(Integer code, String message) {
        this.code = code;
        this.message = message;
    }
}
