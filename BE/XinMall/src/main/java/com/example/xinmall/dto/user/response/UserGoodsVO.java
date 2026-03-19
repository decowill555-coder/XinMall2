package com.example.xinmall.dto.user.response;

import lombok.Data;

import java.io.Serializable;
import java.math.BigDecimal;

/**
 * 用户商品VO - 用于展示用户的商品列表
 */
@Data
public class UserGoodsVO implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 商品ID
     */
    private Long id;

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
     * 状态: on_sale-在售, sold-已售, off_sale-下架
     */
    private String status;

    /**
     * 浏览数
     */
    private Integer viewCount;

    /**
     * 点赞数
     */
    private Integer likeCount;

    /**
     * 创建时间
     */
    private String createdAt;
}
