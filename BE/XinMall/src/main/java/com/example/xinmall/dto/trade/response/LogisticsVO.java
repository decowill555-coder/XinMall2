package com.example.xinmall.dto.trade.response;

import lombok.Data;

import java.io.Serializable;

@Data
public class LogisticsVO implements Serializable {

    private static final long serialVersionUID = 1L;

    private String company;

    private String trackingNo;

    private String status;

    private String updateTime;
}
