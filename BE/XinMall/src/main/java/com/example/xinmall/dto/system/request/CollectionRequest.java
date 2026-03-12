package com.example.xinmall.dto.system.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.io.Serializable;

@Data
public class CollectionRequest implements Serializable {

    private static final long serialVersionUID = 1L;

    @NotNull(message = "目标ID不能为空")
    private Long targetId;

    @NotNull(message = "目标类型不能为空")
    private Integer targetType;
}
