package com.example.xinmall.entity.product;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("brand_category")
public class BrandCategory {

    @TableId(type = IdType.AUTO)
    private Long id;

    private Long brandId;

    private Long categoryId;

    private LocalDateTime createdAt;
}
