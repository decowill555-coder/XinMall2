package com.example.xinmall.entity.product;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.example.xinmall.entity.product.enums.CommonStatus;
import com.example.xinmall.entity.product.enums.InputType;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("attribute")
public class Attribute {

    @TableId(type = IdType.AUTO)
    private Long id;

    private String name;

    private String unit;

    private InputType inputType;

    private Integer sort;

    private CommonStatus status;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
