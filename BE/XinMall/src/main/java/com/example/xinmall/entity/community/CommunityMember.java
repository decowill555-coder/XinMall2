package com.example.xinmall.entity.community;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;

@Data
@TableName("community_member")
public class CommunityMember implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(type = IdType.AUTO)
    private Long id;

    private Long communityId;

    private Long userId;

    private Integer level;

    private Integer exp;

    private Integer isAdmin;

    private LocalDateTime createdAt;
}
