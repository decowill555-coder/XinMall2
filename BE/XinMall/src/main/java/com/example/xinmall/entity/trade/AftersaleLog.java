package com.example.xinmall.entity.trade;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.example.xinmall.entity.trade.enums.AftersaleOperatorType;
import com.example.xinmall.entity.trade.enums.AftersaleStatus;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("aftersale_log")
public class AftersaleLog {

    @TableId(type = IdType.AUTO)
    private Long id;

    private Long aftersaleId;

    private AftersaleOperatorType operatorType;

    private Long operatorId;

    private String action;

    private String content;

    private LocalDateTime createdAt;
}
