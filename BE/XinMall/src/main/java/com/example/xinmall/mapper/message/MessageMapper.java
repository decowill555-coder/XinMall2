package com.example.xinmall.mapper.message;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.example.xinmall.entity.message.Message;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface MessageMapper extends BaseMapper<Message> {

    @Select("SELECT m.* FROM message m " +
            "INNER JOIN (" +
            "  SELECT MIN(id) as id FROM message " +
            "  WHERE (sender_id = #{userId} AND receiver_id = #{targetId}) " +
            "     OR (sender_id = #{targetId} AND receiver_id = #{userId}) " +
            "  GROUP BY sender_id, receiver_id, content, created_at" +
            ") t ON m.id = t.id " +
            "ORDER BY m.created_at DESC")
    IPage<Message> selectMessagesBetweenUsers(Page<Message> page, @Param("userId") Long userId, @Param("targetId") Long targetId);
}
