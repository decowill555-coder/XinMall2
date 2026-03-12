package com.example.xinmall.entity.system.enums;

import com.baomidou.mybatisplus.annotation.EnumValue;
import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;

@Getter
public enum FileType {

    IMAGE(1, "图片"),
    VIDEO(2, "视频"),
    DOCUMENT(3, "文档");

    @EnumValue
    private final Integer code;

    @JsonValue
    private final String desc;

    FileType(Integer code, String desc) {
        this.code = code;
        this.desc = desc;
    }
}
