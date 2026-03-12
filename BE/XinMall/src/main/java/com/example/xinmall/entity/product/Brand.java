package com.example.xinmall.entity.product;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.example.xinmall.entity.product.enums.CommonStatus;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("brand")
public class Brand {

    @TableId(type = IdType.AUTO)
    private Long id;

    private String name;

    private String logo;

    private String description;

    private Integer sort;

    private CommonStatus status;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
