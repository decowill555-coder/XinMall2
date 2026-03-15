package com.example.xinmall.dto.user.response;

import com.example.xinmall.entity.user.enums.Gender;
import com.example.xinmall.entity.user.enums.UserStatus;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class UserVO implements Serializable {

    private static final long serialVersionUID = 1L;

    private Long id;

    private String phone;

    private String nickname;

    private String avatar;

    private Gender gender;

    private LocalDate birthday;

    private String signature;

    private UserStatus status;

    private LocalDateTime createdAt;

    private Integer followers;

    private Integer following;

    private Integer likes;

    private Boolean isSeller;

    private Long sellerId;
}
