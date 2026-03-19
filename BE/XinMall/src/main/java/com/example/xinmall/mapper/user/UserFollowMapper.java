package com.example.xinmall.mapper.user;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.example.xinmall.entity.user.UserFollow;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Delete;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Mapper
public interface UserFollowMapper extends BaseMapper<UserFollow> {

    @Select("SELECT COUNT(*) FROM user_follow WHERE followed_id = #{userId}")
    Integer countFollowers(@Param("userId") Long userId);

    @Select("SELECT COUNT(*) FROM user_follow WHERE user_id = #{userId}")
    Integer countFollowing(@Param("userId") Long userId);

    /**
     * 查询是否已关注
     */
    @Select("SELECT COUNT(*) > 0 FROM user_follow WHERE user_id = #{userId} AND followed_id = #{followedId}")
    boolean isFollowing(@Param("userId") Long userId, @Param("followedId") Long followedId);

    /**
     * 取消关注
     */
    @Delete("DELETE FROM user_follow WHERE user_id = #{userId} AND followed_id = #{followedId}")
    int deleteFollow(@Param("userId") Long userId, @Param("followedId") Long followedId);

    /**
     * 查询关注列表 - 返回Map
     */
    @Select("SELECT uf.followed_id AS followedId, u.nickname, u.avatar, u.signature, u.gender, uf.created_at AS createdAt " +
            "FROM user_follow uf " +
            "LEFT JOIN user u ON uf.followed_id = u.id " +
            "WHERE uf.user_id = #{userId} " +
            "ORDER BY uf.created_at DESC")
    IPage<Map<String, Object>> selectFollowingPage(Page<Map<String, Object>> page, @Param("userId") Long userId);

    /**
     * 查询粉丝列表 - 返回Map，包含是否回关
     */
    @Select("SELECT uf.user_id AS userId, u.nickname, u.avatar, u.signature, u.gender, uf.created_at AS createdAt, " +
            "CASE WHEN EXISTS(SELECT 1 FROM user_follow WHERE user_id = #{currentUserId} AND followed_id = uf.user_id) THEN 1 ELSE 0 END AS isFollowed " +
            "FROM user_follow uf " +
            "LEFT JOIN user u ON uf.user_id = u.id " +
            "WHERE uf.followed_id = #{userId} " +
            "ORDER BY uf.created_at DESC")
    IPage<Map<String, Object>> selectFollowersPage(Page<Map<String, Object>> page, @Param("userId") Long userId, @Param("currentUserId") Long currentUserId);
}
