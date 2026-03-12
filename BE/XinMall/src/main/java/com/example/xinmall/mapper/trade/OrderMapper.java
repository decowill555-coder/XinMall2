package com.example.xinmall.mapper.trade;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.example.xinmall.entity.trade.Order;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface OrderMapper extends BaseMapper<Order> {
}
