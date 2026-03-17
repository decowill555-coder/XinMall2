package com.example.xinmall.dto.trade.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.io.Serializable;

@Data
public class AftersaleLogisticsRequest implements Serializable {

    private static final long serialVersionUID = 1L;

    @NotBlank(message = "物流公司不能为空")
    private String company;

    @NotBlank(message = "物流单号不能为空")
    private String trackingNo;
}
