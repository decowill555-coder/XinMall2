package com.example.xinmall.entity.system;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.example.xinmall.entity.system.enums.ShopAuthStatus;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * 店铺认证实体
 */
@Data
@TableName("shop_auth")
public class ShopAuth {

    @TableId(type = IdType.AUTO)
    private Long id;

    /**
     * 用户ID
     */
    private Long userId;

    /**
     * 店铺名称
     */
    private String shopName;

    /**
     * 店铺描述
     */
    private String shopDesc;

    /**
     * 经营类目
     */
    private String category;

    /**
     * 营业执照图片
     */
    private String licenseImage;

    /**
     * 法人姓名
     */
    private String legalPerson;

    /**
     * 联系电话
     */
    private String phone;

    /**
     * 经营地址
     */
    private String address;

    /**
     * 认证状态
     */
    private ShopAuthStatus status;

    /**
     * 拒绝原因
     */
    private String rejectReason;

    /**
     * 创建时间
     */
    private LocalDateTime createdAt;

    /**
     * 更新时间
     */
    private LocalDateTime updatedAt;
}
