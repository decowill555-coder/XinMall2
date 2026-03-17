package com.example.xinmall.dto.trade.response;

import lombok.Data;

import java.io.Serializable;
import java.util.List;

@Data
public class AftersaleLogisticsVO implements Serializable {

    private static final long serialVersionUID = 1L;

    private String company;

    private String trackingNo;

    private List<LogisticsTraceVO> traces;
}
