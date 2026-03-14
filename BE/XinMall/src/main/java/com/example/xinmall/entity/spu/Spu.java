package com.example.xinmall.entity.spu;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.baomidou.mybatisplus.extension.handlers.JacksonTypeHandler;
import lombok.Data;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@TableName(value = "spu", autoResultMap = true)
public class Spu implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(type = IdType.AUTO)
    private Long id;

    private String name;

    private Long brandId;

    private Long categoryId;

    private String cover;

    @TableField(typeHandler = JacksonTypeHandler.class)
    private List<String> images;

    private String description;

    @TableField(typeHandler = JacksonTypeHandler.class)
    private List<SpuSpec> specs;

    private Integer productCount;

    private Integer memberCount;

    private Integer postCount;

    private BigDecimal avgRating;

    private BigDecimal priceMin;

    private BigDecimal priceMax;

    @TableField(typeHandler = JacksonTypeHandler.class)
    private List<String> tags;

    private Integer status;

    private Integer viewCount;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @Data
    public static class SpuSpec implements Serializable {
        private String name;
        private List<String> options;
    }
}
