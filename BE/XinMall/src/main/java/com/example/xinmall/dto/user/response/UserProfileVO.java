package com.example.xinmall.dto.user.response;

import com.example.xinmall.entity.user.enums.AuthStatus;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;

@Data
public class UserProfileVO implements Serializable {

    private static final long serialVersionUID = 1L;

    private Long id;

    private String realName;

    private String idCard;

    private AuthStatus realNameStatus;

    private LocalDateTime realNameTime;

    private String realNameReason;

    private AuthStatus shopAuthStatus;

    private LocalDateTime shopAuthTime;

    private String shopAuthReason;

    private String province;

    private String city;

    private String district;

    public String getMaskedIdCard() {
        if (idCard == null || idCard.length() < 8) {
            return idCard;
        }
        return idCard.substring(0, 4) + "**********" + idCard.substring(idCard.length() - 4);
    }

    public String getMaskedRealName() {
        if (realName == null) {
            return null;
        }
        if (realName.length() <= 1) {
            return realName;
        }
        return realName.charAt(0) + "*" .repeat(realName.length() - 1);
    }
}
