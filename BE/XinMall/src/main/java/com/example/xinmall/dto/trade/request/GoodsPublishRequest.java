package com.example.xinmall.dto.trade.request;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.List;

@Data
public class GoodsPublishRequest implements Serializable {

    private static final long serialVersionUID = 1L;

    @NotBlank(message = "商品标题不能为空")
    @Size(max = 100, message = "标题最长100个字符")
    private String title;

    private Long modelId;

    private Long categoryId;

    @NotBlank(message = "商品描述不能为空")
    @Size(max = 2000, message = "描述最长2000个字符")
    private String description;

    @NotEmpty(message = "至少上传一张图片")
    private List<String> images;

    @NotNull(message = "价格不能为空")
    @DecimalMin(value = "0.01", message = "价格必须大于0")
    private BigDecimal price;

    private BigDecimal originalPrice;

    @NotNull(message = "成色不能为空")
    @Min(value = 1, message = "成色范围为1-10")
    @Max(value = 10, message = "成色范围为1-10")
    private Integer conditionLevel;

    private String conditionDesc;

    private Boolean warranty;

    private Boolean invoice;

    private Boolean canBargain;

    private String location;

    private Integer stock;
}
