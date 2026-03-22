package com.example.xinmall.mapper.community;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.example.xinmall.entity.community.PostCommunity;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface PostCommunityMapper extends BaseMapper<PostCommunity> {

    @Select("SELECT community_id FROM post_community WHERE post_id = #{postId}")
    List<Long> selectCommunityIdsByPostId(@Param("postId") Long postId);

    @Select("SELECT post_id FROM post_community WHERE community_id = #{communityId}")
    List<Long> selectPostIdsByCommunityId(@Param("communityId") Long communityId);
}
