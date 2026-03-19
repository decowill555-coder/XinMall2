package com.example.xinmall.dto.user.response;

import lombok.Data;

import java.io.Serializable;
import java.util.List;

/**
 * 用户公开资料VO - 用于展示其他用户的主页
 */
@Data
public class UserPublicProfileVO implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 用户ID
     */
    private Long id;

    /**
     * 昵称
     */
    private String nickname;

    /**
     * 头像
     */
    private String avatar;

    /**
     * 封面图
     */
    private String cover;

    /**
     * 个性签名
     */
    private String signature;

    /**
     * 性别 0-未知 1-男 2-女
     */
    private Integer gender;

    /**
     * 用户等级
     */
    private Integer level;

    /**
     * 等级名称
     */
    private String levelName;

    /**
     * 是否已认证
     */
    private Boolean isVerified;

    /**
     * 当前用户是否已关注该用户
     */
    private Boolean isFollowed;

    /**
     * 粉丝数
     */
    private Integer followersCount;

    /**
     * 关注数
     */
    private Integer followingCount;

    /**
     * 获赞数
     */
    private Integer likesCount;

    /**
     * 帖子数
     */
    private Integer postsCount;

    /**
     * 商品数
     */
    private Integer goodsCount;

    /**
     * 标签
     */
    private List<String> tags;

    /**
     * 地区
     */
    private String location;
}
