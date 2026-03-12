package com.example.xinmall.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.serializer.GenericJacksonJsonRedisSerializer;
import org.springframework.data.redis.serializer.StringRedisSerializer;
import tools.jackson.databind.json.JsonMapper;

/**
 * Redis 配置类
 * <p>
 * 主要功能：
 * 1. 配置 RedisTemplate，自定义序列化方式
 * 2. 配置 StringRedisTemplate 用于简单字符串操作
 * 3. Key使用String序列化，Value使用JSON序列化
 * </p>
 */
@Configuration
public class RedisConfig {

    /**
     * 配置 RedisTemplate
     * <p>
     * 序列化配置：
     * - Key: String序列化，便于在Redis客户端查看
     * - Value: JSON序列化，支持复杂对象存储
     * - HashKey: String序列化
     * - HashValue: JSON序列化
     * </p>
     *
     * @param connectionFactory Redis连接工厂（Spring Boot自动配置）
     * @return RedisTemplate Redis操作模板
     */
    @Bean
    public RedisTemplate<String, Object> redisTemplate(RedisConnectionFactory connectionFactory) {
        RedisTemplate<String, Object> template = new RedisTemplate<>();
        template.setConnectionFactory(connectionFactory);

        JsonMapper jsonMapper = JsonMapper.builder().build();
        GenericJacksonJsonRedisSerializer jsonSerializer = new GenericJacksonJsonRedisSerializer(jsonMapper);
        StringRedisSerializer stringSerializer = new StringRedisSerializer();

        template.setKeySerializer(stringSerializer);
        template.setHashKeySerializer(stringSerializer);
        template.setValueSerializer(jsonSerializer);
        template.setHashValueSerializer(jsonSerializer);
        template.afterPropertiesSet();

        return template;
    }

    /**
     * 配置 StringRedisTemplate
     * <p>
     * 适用于简单的字符串操作场景，如缓存Token、验证码等
     * 所有Key和Value都使用String序列化
     * </p>
     *
     * @param connectionFactory Redis连接工厂
     * @return StringRedisTemplate 字符串Redis操作模板
     */
    @Bean
    public StringRedisTemplate stringRedisTemplate(RedisConnectionFactory connectionFactory) {
        return new StringRedisTemplate(connectionFactory);
    }
}
