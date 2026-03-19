package com.example.xinmall.mapper.system;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.example.xinmall.entity.system.UserCollection;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface CollectionMapper extends BaseMapper<UserCollection> {

    /**
     * 分页查询用户收藏的商品
     */
    IPage<UserCollection> selectUserGoodsCollections(Page<UserCollection> page, @Param("userId") Long userId);

    /**
     * 统计用户收藏商品数
     */
    Integer countUserGoodsCollections(@Param("userId") Long userId);
}
