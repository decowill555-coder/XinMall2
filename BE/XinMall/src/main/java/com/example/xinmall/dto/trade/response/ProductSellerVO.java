package com.example.xinmall.dto.trade.response;

import lombok.Data;

import java.io.Serializable;
import java.math.BigDecimal;

@Data
public class ProductSellerVO implements Serializable {

    private static final long serialVersionUID = 1L;

    private Long id;

    private String name;

    private String avatar;

    /**
     * 卖家类型：personal-个人，merchant-商家
     */
    private String type;

    /**
     * 等级名称
     */
    private String levelName;

    /**
     * 个人签名
     */
    private String signature;

    /**
     * 在售商品数量
     */
    private Integer sellingCount;

    /**
     * 粉丝数量
     */
    private Integer followerCount;

    /**
     * 评分
     */
    private BigDecimal rating;

    /**
     * 当前用户是否关注了该卖家
     */
    private Boolean isFollowed;
}
