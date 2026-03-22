package com.example.xinmall.mapper.community;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.example.xinmall.entity.community.Post;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface PostMapper extends BaseMapper<Post> {

    IPage<Post> selectFollowedPosts(Page<Post> page, @Param("userId") Long userId);

    IPage<Post> selectPostsByCommunityId(Page<Post> page, @Param("communityId") Long communityId);

    Integer countByUserId(@Param("userId") Long userId);
}
