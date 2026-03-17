package com.example.xinmall.dto.trade.response;

import lombok.Data;

import java.io.Serializable;

@Data
public class LogisticsTraceVO implements Serializable {

    private static final long serialVersionUID = 1L;

    private String time;

    private String content;
}
