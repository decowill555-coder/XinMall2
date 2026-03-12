package com.example.xinmall.common.exception;

import com.example.xinmall.common.enums.ResultCode;
import lombok.Getter;

@Getter
public class BusinessException extends RuntimeException {

    private final Integer code;
    private final String message;

    public BusinessException() {
        super(ResultCode.INTERNAL_SERVER_ERROR.getMessage());
        this.code = ResultCode.INTERNAL_SERVER_ERROR.getCode();
        this.message = ResultCode.INTERNAL_SERVER_ERROR.getMessage();
    }

    public BusinessException(String message) {
        super(message);
        this.code = ResultCode.INTERNAL_SERVER_ERROR.getCode();
        this.message = message;
    }

    public BusinessException(Integer code, String message) {
        super(message);
        this.code = code;
        this.message = message;
    }

    public BusinessException(ResultCode resultCode) {
        super(resultCode.getMessage());
        this.code = resultCode.getCode();
        this.message = resultCode.getMessage();
    }

    public BusinessException(ResultCode resultCode, String message) {
        super(message);
        this.code = resultCode.getCode();
        this.message = message;
    }

    public static BusinessException of(String message) {
        return new BusinessException(message);
    }

    public static BusinessException of(ResultCode resultCode) {
        return new BusinessException(resultCode);
    }

    public static BusinessException of(ResultCode resultCode, String message) {
        return new BusinessException(resultCode, message);
    }

    public static BusinessException of(Integer code, String message) {
        return new BusinessException(code, message);
    }
}
