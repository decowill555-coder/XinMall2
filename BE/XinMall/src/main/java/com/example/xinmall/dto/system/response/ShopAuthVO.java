package com.example.xinmall.dto.system.response;

import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * 店铺认证信息VO
 */
@Data
public class ShopAuthVO implements Serializable {

    private static final long serialVersionUID = 1L;

    private Long id;

    private Long userId;

    private String shopName;

    private String shopDesc;

    private String category;

    private String licenseImage;

    private String legalPerson;

    private String phone;

    private String address;

    private String status;

    private String rejectReason;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
