package com.example.xinmall.entity.product;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("category_attribute")
public class CategoryAttribute {

    @TableId(type = IdType.AUTO)
    private Long id;

    private Long categoryId;

    private Long attributeId;

    private Boolean isRequired;

    private Boolean isFilter;

    private Boolean isShow;

    private Integer sort;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
