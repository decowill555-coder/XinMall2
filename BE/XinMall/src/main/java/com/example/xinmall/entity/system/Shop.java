package com.example.xinmall.entity.system;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableLogic;
import com.baomidou.mybatisplus.annotation.TableName;
import com.example.xinmall.entity.system.enums.ShopStatus;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@TableName("shop")
public class Shop {

    @TableId(type = IdType.AUTO)
    private Long id;

    private Long userId;

    private String name;

    private String avatar;

    private String cover;

    private String description;

    /**
     * 联系电话
     */
    private String phone;

    /**
     * 微信号
     */
    private String wechat;

    /**
     * 经营类目
     */
    private String category;

    /**
     * 发货地址
     */
    private String address;

    /**
     * 是否营业
     */
    private Boolean isOpen;

    /**
     * 是否自动接单
     */
    private Boolean autoAccept;

    private BigDecimal rating;

    private Integer followerCount;

    private Integer goodsCount;

    private Integer soldCount;

    private ShopStatus status;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @TableLogic
    private Integer deleted;
}
