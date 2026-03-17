package com.example.xinmall.dto.trade.response;

import com.example.xinmall.entity.trade.enums.AftersaleStatus;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;

@Data
public class AftersaleTimelineVO implements Serializable {

    private static final long serialVersionUID = 1L;

    private LocalDateTime time;

    private AftersaleStatus status;

    private String description;

    private String operator;
}
