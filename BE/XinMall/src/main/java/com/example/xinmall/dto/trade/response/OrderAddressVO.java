package com.example.xinmall.dto.trade.response;

import lombok.Data;

import java.io.Serializable;

@Data
public class OrderAddressVO implements Serializable {

    private static final long serialVersionUID = 1L;

    private Long id;

    private String name;

    private String phone;

    private String province;

    private String city;

    private String district;

    private String detail;
}
