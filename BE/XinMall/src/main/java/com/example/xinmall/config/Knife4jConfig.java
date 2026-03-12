package com.example.xinmall.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Knife4j (Swagger) API文档配置类
 * <p>
 * 主要功能：
 * 1. 配置OpenAPI 3.0规范的API文档信息
 * 2. 配置JWT Token认证方式
 * 3. 访问地址: http://localhost:port/doc.html
 * </p>
 */
@Configuration
public class Knife4jConfig {

    /**
     * 配置 OpenAPI 文档
     * <p>
     * 包含内容：
     * - API基本信息（标题、描述、版本）
     * - 联系方式和许可证
     * - JWT Bearer Token认证配置
     * </p>
     *
     * @return OpenAPI 文档配置实例
     */
    @Bean
    public OpenAPI openAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("XinMall API")
                        .description("XinMall 垂直数码电商平台接口文档")
                        .version("v1.0.0")
                        .contact(new Contact()
                                .name("XinMall Team")
                                .email("contact@xinmall.com"))
                        .license(new License()
                                .name("MIT License")
                                .url("https://opensource.org/licenses/MIT")))
                .schemaRequirement("Bearer", securityScheme())
                .addSecurityItem(new SecurityRequirement().addList("Bearer"));
    }

    /**
     * 配置 JWT 安全认证方案
     * <p>
     * 认证方式：HTTP Bearer Token
     * Token格式：JWT
     * 传输位置：请求头 Authorization
     * </p>
     *
     * @return SecurityScheme 安全方案配置
     */
    private SecurityScheme securityScheme() {
        return new SecurityScheme()
                .type(SecurityScheme.Type.HTTP)
                .scheme("bearer")
                .bearerFormat("JWT")
                .in(SecurityScheme.In.HEADER)
                .name("Authorization")
                .description("JWT Token 认证");
    }
}
