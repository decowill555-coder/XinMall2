package com.example.xinmall.dto.user.response;

import lombok.Data;

import java.io.Serializable;
import java.math.BigDecimal;

/**
 * 用户收藏VO - 用于展示用户的收藏列表
 */
@Data
public class UserCollectionsVO implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 收藏ID
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
     * 卖家ID
     */
    private Long sellerId;

    /**
     * 卖家名称
     */
    private String sellerName;

    /**
     * 创建时间
     */
    private String createdAt;
}
