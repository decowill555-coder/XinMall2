package com.example.xinmall.dto.system.response;

import lombok.Data;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/**
 * 店铺首页仪表盘数据VO
 */
@Data
public class ShopDashboardVO implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 店铺信息
     */
    private ShopVO shop;

    /**
     * 各状态订单数量
     */
    private Map<String, Long> orderCounts;

    /**
     * 待处理售后数量
     */
    private Long aftersaleCount;

    /**
     * 最近在售商品列表
     */
    private List<RecentGoodsVO> recentGoods;

    /**
     * 最近商品VO
     */
    @Data
    public static class RecentGoodsVO implements Serializable {

        private static final long serialVersionUID = 1L;

        private Long id;

        private String title;

        private String cover;

        private BigDecimal price;

        private Integer stock;

        private String status;

        private LocalDateTime createdAt;
    }
}
