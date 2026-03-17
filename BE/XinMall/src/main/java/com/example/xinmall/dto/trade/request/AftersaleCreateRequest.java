package com.example.xinmall.dto.trade.request;

import com.example.xinmall.entity.trade.enums.AftersaleType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.List;

@Data
public class AftersaleCreateRequest implements Serializable {

    private static final long serialVersionUID = 1L;

    @NotNull(message = "订单ID不能为空")
    private Long orderId;

    @NotNull(message = "售后类型不能为空")
    private AftersaleType type;

    @NotBlank(message = "售后原因不能为空")
    private String reason;

    private String description;

    private List<String> images;

    private BigDecimal refundAmount;
}
