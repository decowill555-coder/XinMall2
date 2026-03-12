package com.example.xinmall.dto.trade.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.io.Serializable;

@Data
public class OrderCreateRequest implements Serializable {

    private static final long serialVersionUID = 1L;

    @NotNull(message = "商品ID不能为空")
    private Long goodsId;

    @Min(value = 1, message = "数量至少为1")
    private Integer quantity = 1;

    private String remark;

    private Long addressId;
}
