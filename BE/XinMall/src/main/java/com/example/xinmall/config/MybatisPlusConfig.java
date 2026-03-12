package com.example.xinmall.config;

import com.baomidou.mybatisplus.annotation.DbType;
import com.baomidou.mybatisplus.extension.plugins.MybatisPlusInterceptor;
import com.baomidou.mybatisplus.extension.plugins.inner.PaginationInnerInterceptor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * MyBatis-Plus 配置类
 * <p>
 * 主要功能：
 * 1. 配置分页插件，支持MySQL数据库分页查询
 * 2. 可扩展添加其他MyBatis-Plus拦截器（如乐观锁、数据权限等）
 * </p>
 */
@Configuration
public class MybatisPlusConfig {

    /**
     * 配置 MyBatis-Plus 拦截器
     * <p>
     * 当前已配置：
     * - PaginationInnerInterceptor: 分页插件，自动处理分页SQL
     * </p>
     *
     * @return MybatisPlusInterceptor 拦截器实例
     */
    @Bean
    public MybatisPlusInterceptor mybatisPlusInterceptor() {
        MybatisPlusInterceptor interceptor = new MybatisPlusInterceptor();
        interceptor.addInnerInterceptor(new PaginationInnerInterceptor(DbType.MYSQL));
        return interceptor;
    }
}
