package com.example.xinmall.dto.user.response;

import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * 关注用户信息VO
 */
@Data
public class FollowUserVO implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 用户ID
     */
    private Long userId;

    /**
     * 昵称
     */
    private String nickname;

    /**
     * 头像
     */
    private String avatar;

    /**
     * 签名
     */
    private String signature;

    /**
     * 性别 0-未知 1-男 2-女
     */
    private Integer gender;

    /**
     * 关注时间
     */
    private LocalDateTime createdAt;

    /**
     * 是否已关注（用于粉丝列表，判断是否回关）
     */
    private Boolean isFollowed;
}
