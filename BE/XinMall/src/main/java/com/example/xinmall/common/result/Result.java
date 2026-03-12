package com.example.xinmall.common.result;

import com.example.xinmall.common.enums.ResultCode;
import lombok.Data;

import java.io.Serializable;

@Data
public class Result<T> implements Serializable {

    private static final long serialVersionUID = 1L;

    private Integer code;
    private String message;
    private T data;

    public Result() {
    }

    public Result(Integer code, String message, T data) {
        this.code = code;
        this.message = message;
        this.data = data;
    }

    public static <T> Result<T> success() {
        return new Result<>(ResultCode.SUCCESS.getCode(), ResultCode.SUCCESS.getMessage(), null);
    }

    public static <T> Result<T> success(T data) {
        return new Result<>(ResultCode.SUCCESS.getCode(), ResultCode.SUCCESS.getMessage(), data);
    }

    public static <T> Result<T> success(String message, T data) {
        return new Result<>(ResultCode.SUCCESS.getCode(), message, data);
    }

    public static <T> Result<T> created() {
        return new Result<>(ResultCode.CREATED.getCode(), ResultCode.CREATED.getMessage(), null);
    }

    public static <T> Result<T> created(T data) {
        return new Result<>(ResultCode.CREATED.getCode(), ResultCode.CREATED.getMessage(), data);
    }

    public static <T> Result<T> error() {
        return new Result<>(ResultCode.INTERNAL_SERVER_ERROR.getCode(), ResultCode.INTERNAL_SERVER_ERROR.getMessage(), null);
    }

    public static <T> Result<T> error(String message) {
        return new Result<>(ResultCode.INTERNAL_SERVER_ERROR.getCode(), message, null);
    }

    public static <T> Result<T> error(Integer code, String message) {
        return new Result<>(code, message, null);
    }

    public static <T> Result<T> error(ResultCode resultCode) {
        return new Result<>(resultCode.getCode(), resultCode.getMessage(), null);
    }

    public static <T> Result<T> error(ResultCode resultCode, String message) {
        return new Result<>(resultCode.getCode(), message, null);
    }

    public static <T> Result<T> badRequest(String message) {
        return new Result<>(ResultCode.BAD_REQUEST.getCode(), message, null);
    }

    public static <T> Result<T> unauthorized() {
        return new Result<>(ResultCode.UNAUTHORIZED.getCode(), ResultCode.UNAUTHORIZED.getMessage(), null);
    }

    public static <T> Result<T> unauthorized(String message) {
        return new Result<>(ResultCode.UNAUTHORIZED.getCode(), message, null);
    }

    public static <T> Result<T> forbidden() {
        return new Result<>(ResultCode.FORBIDDEN.getCode(), ResultCode.FORBIDDEN.getMessage(), null);
    }

    public static <T> Result<T> forbidden(String message) {
        return new Result<>(ResultCode.FORBIDDEN.getCode(), message, null);
    }

    public static <T> Result<T> notFound(String message) {
        return new Result<>(ResultCode.NOT_FOUND.getCode(), message, null);
    }

    public boolean isSuccess() {
        return ResultCode.SUCCESS.getCode().equals(this.code) || ResultCode.CREATED.getCode().equals(this.code);
    }
}
