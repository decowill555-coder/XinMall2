package com.example.xinmall.config;

import com.example.xinmall.common.constant.Constants;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Spring MVC Web配置类
 * <p>
 * 主要功能：
 * 1. 配置静态资源映射
 * 2. 支持Swagger/Knife4j文档页面访问
 * </p>
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {

    /**
     * 配置静态资源处理器
     * <p>
     * 资源映射：
     * - /doc.html -> Knife4j文档页面
     * - /webjars/** -> WebJars静态资源
     * - /swagger-ui/** -> Swagger UI资源
     * </p>
     *
     * @param registry 资源处理器注册器
     */
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("doc.html")
                .addResourceLocations("classpath:/META-INF/resources/");
        registry.addResourceHandler("/webjars/**")
                .addResourceLocations("classpath:/META-INF/resources/webjars/");
        registry.addResourceHandler("/swagger-ui/**")
                .addResourceLocations("classpath:/META-INF/resources/webjars/springfox-swagger-ui/");
    }
}
