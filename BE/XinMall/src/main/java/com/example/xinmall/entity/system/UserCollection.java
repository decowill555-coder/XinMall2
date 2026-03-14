package com.example.xinmall.entity.system;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.example.xinmall.entity.system.enums.CollectionType;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("collection")
public class UserCollection {

    @TableId(type = IdType.AUTO)
    private Long id;

    private Long userId;

    private Long targetId;

    private CollectionType targetType;

    private LocalDateTime createdAt;
}
