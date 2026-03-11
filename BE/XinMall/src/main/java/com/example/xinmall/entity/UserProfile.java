package com.example.xinmall.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("user_profile")
public class UserProfile {

    @TableId(type = IdType.AUTO)
    private Long id;

    private Long userId;

    private String realName;

    private String idCard;

    private String idCardFront;

    private String idCardBack;

    private Integer realNameStatus;

    private LocalDateTime realNameTime;

    private String realNameReason;

    private Integer shopAuthStatus;

    private LocalDateTime shopAuthTime;

    private String shopAuthReason;

    private String province;

    private String city;

    private String district;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
