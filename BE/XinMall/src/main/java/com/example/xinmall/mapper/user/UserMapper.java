package com.example.xinmall.mapper.user;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.example.xinmall.entity.user.User;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDateTime;

@Mapper
public interface UserMapper extends BaseMapper<User> {
    
    User selectByPhone(@Param("phone") String phone);
    
    User selectUserWithProfile(@Param("userId") Long userId);
    
    void updateLoginInfo(@Param("userId") Long userId, 
                         @Param("loginTime") LocalDateTime loginTime, 
                         @Param("loginIp") String loginIp);
}
