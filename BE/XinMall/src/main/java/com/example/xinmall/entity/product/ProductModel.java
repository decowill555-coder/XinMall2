package com.example.xinmall.entity.product;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableLogic;
import com.baomidou.mybatisplus.annotation.TableName;
import com.example.xinmall.entity.product.enums.ProductModelStatus;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@TableName("product_model")
public class ProductModel {

    @TableId(type = IdType.AUTO)
    private Long id;

    private String name;

    private Long brandId;

    private Long categoryId;

    private String cover;

    private String images;

    private String description;

    private LocalDate releaseDate;

    private BigDecimal referencePrice;

    private ProductModelStatus status;

    private Integer sort;

    private Integer viewCount;

    private Integer followCount;

    private Integer postCount;

    private Integer goodsCount;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @TableLogic
    private Integer deleted;
}
