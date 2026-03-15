package com.example.xinmall.mapper.user;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.example.xinmall.entity.user.UserFollow;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface UserFollowMapper extends BaseMapper<UserFollow> {

    @Select("SELECT COUNT(*) FROM user_follow WHERE followed_id = #{userId}")
    Integer countFollowers(@Param("userId") Long userId);

    @Select("SELECT COUNT(*) FROM user_follow WHERE user_id = #{userId}")
    Integer countFollowing(@Param("userId") Long userId);
}
