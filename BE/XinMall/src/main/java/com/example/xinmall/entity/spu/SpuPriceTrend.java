package com.example.xinmall.entity.spu;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@TableName("spu_price_trend")
public class SpuPriceTrend implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(type = IdType.AUTO)
    private Long id;

    private Long spuId;

    private LocalDate date;

    private BigDecimal avgPrice;

    private BigDecimal minPrice;

    private BigDecimal maxPrice;

    private Integer productCount;

    private LocalDateTime createdAt;
}
