package com.example.xinmall.entity.user;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.example.xinmall.entity.user.enums.AuthStatus;
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

    private AuthStatus realNameStatus;

    private LocalDateTime realNameTime;

    private String realNameReason;

    private AuthStatus shopAuthStatus;

    private LocalDateTime shopAuthTime;

    private String shopAuthReason;

    private String province;

    private String city;

    private String district;

    @TableField(exist = false)
    private String cover;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
