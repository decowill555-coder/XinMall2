package com.example.xinmall.entity.product;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("product_model_attribute")
public class ProductModelAttribute {

    @TableId(type = IdType.AUTO)
    private Long id;

    private Long modelId;

    private Long attributeId;

    private String value;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
