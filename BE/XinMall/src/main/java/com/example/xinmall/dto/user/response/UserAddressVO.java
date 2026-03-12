package com.example.xinmall.dto.user.response;

import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;

@Data
public class UserAddressVO implements Serializable {

    private static final long serialVersionUID = 1L;

    private Long id;

    private String name;

    private String phone;

    private String province;

    private String city;

    private String district;

    private String detail;

    private Integer isDefault;

    private LocalDateTime createdAt;

    public String getFullAddress() {
        return province + city + district + detail;
    }
}
