package com.example.xinmall.dto.user.response;

import lombok.Data;

import java.io.Serializable;
import java.math.BigDecimal;

/**
 * 用户点赞VO - 用于展示用户的点赞商品列表
 */
@Data
public class UserLikesVO implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 点赞ID
     */
    private Long id;

    /**
     * 商品ID
     */
    private Long productId;

    /**
     * 商品标题
     */
    private String title;

    /**
     * 封面图
     */
    private String cover;

    /**
     * 价格
     */
    private BigDecimal price;

    /**
     * 创建时间
     */
    private String createdAt;
}
