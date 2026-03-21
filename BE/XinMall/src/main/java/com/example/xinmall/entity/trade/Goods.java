package com.example.xinmall.entity.trade;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableLogic;
import com.baomidou.mybatisplus.annotation.TableName;
import com.example.xinmall.entity.trade.enums.GoodsStatus;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@TableName("goods")
public class Goods {

    @TableId(type = IdType.AUTO)
    private Long id;

    private String title;

    private Long sellerId;

    private Long modelId;

    private Long categoryId;

    private String description;

    private String images;

    private BigDecimal price;

    private BigDecimal originalPrice;

    private Integer conditionLevel;

    private String conditionDesc;

    private Boolean warranty;

    private Boolean invoice;

    private Boolean canBargain;

    private String location;

    private String tradeMethod;

    private Boolean freeShipping;

    private Boolean canInspect;

    private Integer stock;

    private Integer viewCount;

    private Integer likeCount;

    private GoodsStatus status;

    private String rejectReason;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @TableLogic
    private Integer deleted;
}
