package com.example.xinmall.entity.product;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("attribute_option")
public class AttributeOption {

    @TableId(type = IdType.AUTO)
    private Long id;

    private Long attributeId;

    private String value;

    private Integer sort;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
