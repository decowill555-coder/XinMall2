package com.example.xinmall.entity.trade;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("evaluation")
public class Evaluation {

    @TableId(type = IdType.AUTO)
    private Long id;

    private Long orderId;

    private Long goodsId;

    private Long userId;

    private Long sellerId;

    private Integer rating;

    private String content;

    private String images;

    private String sellerReply;

    private LocalDateTime sellerReplyTime;

    private Boolean isAnonymous;

    private Integer status;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
