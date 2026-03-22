package com.example.xinmall.entity.message.enums;

import com.baomidou.mybatisplus.annotation.EnumValue;
import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;

/**
 * 互动消息类型枚举
 */
@Getter
public enum InteractionType {

    POST_LIKE(1, "点赞帖子"),
    POST_COMMENT(2, "评论帖子"),
    COMMENT_REPLY(3, "回复评论"),
    FOLLOW(4, "关注用户"),
    POST_COLLECT(5, "收藏帖子");

    @EnumValue
    private final Integer code;
    @JsonValue
    private final String name;

    InteractionType(Integer code, String name) {
        this.code = code;
        this.name = name;
    }

    public static InteractionType fromCode(Integer code) {
        for (InteractionType type : values()) {
            if (type.getCode().equals(code)) {
                return type;
            }
        }
        return null;
    }
}
