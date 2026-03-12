package com.example.xinmall.common.handler;

import com.baomidou.mybatisplus.core.handlers.MetaObjectHandler;
import org.apache.ibatis.reflection.MetaObject;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

/**
 * MyBatis-Plus 元数据字段自动填充处理器
 * <p>
 * 主要功能：
 * 1. 插入时自动填充 createTime, updateTime, deleted 字段
 * 2. 更新时自动填充 updateTime 字段
 * </p>
 * <p>
 * 使用方式：在实体类字段上添加 @TableField 注解
 * - @TableField(fill = FieldFill.INSERT) - 插入时填充
 * - @TableField(fill = FieldFill.UPDATE) - 更新时填充
 * - @TableField(fill = FieldFill.INSERT_UPDATE) - 插入和更新时都填充
 * </p>
 */
@Component
public class MyMetaObjectHandler implements MetaObjectHandler {

    /**
     * 插入时自动填充
     * <p>
     * 自动填充字段：
     * - createTime: 创建时间
     * - updateTime: 更新时间
     * - deleted: 逻辑删除标识（0-未删除）
     * </p>
     *
     * @param metaObject 元数据对象
     */
    @Override
    public void insertFill(MetaObject metaObject) {
        this.strictInsertFill(metaObject, "createTime", LocalDateTime.class, LocalDateTime.now());
        this.strictInsertFill(metaObject, "updateTime", LocalDateTime.class, LocalDateTime.now());
        this.strictInsertFill(metaObject, "deleted", Integer.class, 0);
    }

    /**
     * 更新时自动填充
     * <p>
     * 自动填充字段：
     * - updateTime: 更新时间
     * </p>
     *
     * @param metaObject 元数据对象
     */
    @Override
    public void updateFill(MetaObject metaObject) {
        this.strictUpdateFill(metaObject, "updateTime", LocalDateTime.class, LocalDateTime.now());
    }
}
