package com.example.xinmall.entity.user;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableLogic;
import com.baomidou.mybatisplus.annotation.TableName;
import com.example.xinmall.entity.user.enums.Gender;
import com.example.xinmall.entity.user.enums.UserStatus;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@TableName("user")
public class User {

    @TableId(type = IdType.AUTO)
    private Long id;

    private String phone;

    private String password;

    private String nickname;

    private String avatar;

    private Gender gender;

    private LocalDate birthday;

    private String signature;

    private UserStatus status;

    private LocalDateTime lastLoginTime;

    private String lastLoginIp;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @TableLogic
    private Integer deleted;
}
