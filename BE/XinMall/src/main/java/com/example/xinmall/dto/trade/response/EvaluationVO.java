package com.example.xinmall.dto.trade.response;

import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class EvaluationVO implements Serializable {

    private static final long serialVersionUID = 1L;

    private Long id;

    private Long orderId;

    private Long goodsId;

    private Long userId;

    private String userName;

    private String userAvatar;

    private Integer rating;

    private String content;

    private List<String> images;

    private String sellerReply;

    private LocalDateTime sellerReplyTime;

    private Boolean isAnonymous;

    private LocalDateTime createdAt;
}
