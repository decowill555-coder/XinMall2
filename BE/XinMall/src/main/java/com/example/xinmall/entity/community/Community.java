package com.example.xinmall.entity.community;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.baomidou.mybatisplus.extension.handlers.JacksonTypeHandler;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.List;

@Data
@TableName(value = "community", autoResultMap = true)
public class Community implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(type = IdType.AUTO)
    private Long id;

    private String name;

    private String type;

    private String description;

    private String cover;

    private Long modelId;

    private Integer isOfficial;

    private Long creatorId;

    private Integer memberCount;

    private Integer postCount;

    private Integer status;

    @TableField(typeHandler = JacksonTypeHandler.class)
    private List<String> tags;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
