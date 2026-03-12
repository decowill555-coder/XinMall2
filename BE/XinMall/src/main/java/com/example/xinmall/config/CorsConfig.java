package com.example.xinmall.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

/**
 * 跨域资源共享(CORS)配置类
 * <p>
 * 主要功能：
 * 1. 允许前端跨域访问后端API
 * 2. 配置允许的请求来源、请求头、请求方法
 * 3. 暴露Authorization响应头供前端获取Token
 * </p>
 */
@Configuration
public class CorsConfig {

    /**
     * 配置 CORS 过滤器
     * <p>
     * 配置说明：
     * - allowCredentials: 允许携带Cookie
     * - allowedOriginPattern: 允许所有来源
     * - allowedHeader: 允许所有请求头
     * - allowedMethod: 允许所有HTTP方法
     * - exposedHeader: 暴露Authorization头供前端获取
     * - maxAge: 预检请求缓存时间(秒)
     * </p>
     *
     * @return CorsFilter CORS过滤器实例
     */
    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);
        config.addAllowedOriginPattern("*");
        config.addAllowedHeader("*");
        config.addAllowedMethod("*");
        config.addExposedHeader("Authorization");
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        return new CorsFilter(source);
    }
}
