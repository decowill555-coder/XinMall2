package com.example.xinmall.mapper.trade;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.example.xinmall.entity.trade.Goods;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface GoodsMapper extends BaseMapper<Goods> {

    /**
     * 统计用户商品数
     */
    Integer countBySellerId(@Param("sellerId") Long sellerId);

    /**
     * 分页查询用户商品
     */
    IPage<Goods> selectBySellerId(Page<Goods> page, @Param("sellerId") Long sellerId, @Param("status") String status);
}
