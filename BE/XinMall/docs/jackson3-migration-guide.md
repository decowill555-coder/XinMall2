# Jackson 3.x 迁移指南

> 本文档整理了从 Jackson 2.x 迁移到 Jackson 3.x 的关键变更，适用于 Spring Boot 4.0+ 项目。

---

## 一、环境要求

| 项目 | Jackson 2.x | Jackson 3.x |
|------|-------------|-------------|
| JDK 最低版本 | JDK 8 | JDK 17 |
| Spring Boot | 2.x / 3.x | 4.0+ |

---

## 二、依赖变更

### Maven 依赖

```xml
<!-- Jackson 2.x -->
<dependency>
    <groupId>com.fasterxml.jackson.core</groupId>
    <artifactId>jackson-databind</artifactId>
</dependency>

<!-- Jackson 3.x -->
<dependency>
    <groupId>tools.jackson</groupId>
    <artifactId>jackson-databind</artifactId>
</dependency>
```

### 使用 BOM 统一版本

```xml
<dependencyManagement>
    <dependencies>
        <dependency>
            <groupId>tools.jackson</groupId>
            <artifactId>jackson-bom</artifactId>
            <version>3.0.0</version>
            <scope>import</scope>
            <type>pom</type>
        </dependency>
    </dependencies>
</dependencyManagement>
```

---

## 三、包名变更

| Jackson 2.x | Jackson 3.x |
|-------------|-------------|
| `com.fasterxml.jackson.databind.ObjectMapper` | `tools.jackson.databind.ObjectMapper` |
| `com.fasterxml.jackson.databind.SerializationFeature` | `tools.jackson.databind.SerializationFeature` |
| `com.fasterxml.jackson.databind.DeserializationFeature` | `tools.jackson.databind.DeserializationFeature` |
| `com.fasterxml.jackson.datatype.jsr310.JavaTimeModule` | 已内置，无需引入 |
| `com.fasterxml.jackson.core.JsonParser` | `tools.jackson.core.JsonParser` |
| `com.fasterxml.jackson.core.JsonGenerator` | `tools.jackson.core.JsonGenerator` |

**注意**：`com.fasterxml.jackson.annotation` 包名保持不变，便于迁移。

---

## 四、核心 API 变更

### 1. ObjectMapper 创建方式

```java
// ❌ Jackson 2.x
ObjectMapper mapper = new ObjectMapper();
mapper.registerModule(new JavaTimeModule());
mapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);

// ✅ Jackson 3.x
JsonMapper mapper = JsonMapper.builder()
    .disable(DateTimeFeature.WRITE_DATES_AS_TIMESTAMPS)
    .build();
```

### 2. ObjectMapper 变为抽象类

Jackson 3.x 中 `ObjectMapper` 是抽象类，必须使用 `JsonMapper.builder()` 创建实例：

```java
import tools.jackson.databind.json.JsonMapper;

JsonMapper mapper = JsonMapper.builder().build();
```

### 3. Java 8 时间模块已内置

无需再手动引入 `jackson-datatype-jsr310`：

```java
// ❌ Jackson 2.x - 需要手动注册
mapper.registerModule(new JavaTimeModule());

// ✅ Jackson 3.x - 已内置，无需注册
JsonMapper mapper = JsonMapper.builder().build();
```

---

## 五、配置特性迁移

### 日期时间配置

| Jackson 2.x | Jackson 3.x |
|-------------|-------------|
| `SerializationFeature.WRITE_DATES_AS_TIMESTAMPS` | `DateTimeFeature.WRITE_DATES_AS_TIMESTAMPS` |
| `SerializationFeature.WRITE_DATES_WITH_ZONE_ID` | `DateTimeFeature.WRITE_DATES_WITH_ZONE_ID` |
| `SerializationFeature.WRITE_DURATIONS_AS_TIMESTAMPS` | `DateTimeFeature.WRITE_DURATIONS_AS_TIMESTAMPS` |

```java
// ✅ Jackson 3.x 日期配置
import tools.jackson.databind.cfg.DateTimeFeature;

JsonMapper mapper = JsonMapper.builder()
    .disable(DateTimeFeature.WRITE_DATES_AS_TIMESTAMPS)
    .build();
```

### 枚举配置

| Jackson 2.x | Jackson 3.x |
|-------------|-------------|
| `SerializationFeature.WRITE_ENUMS_USING_TO_STRING` | `EnumFeature.WRITE_ENUMS_USING_TO_STRING` |
| `SerializationFeature.WRITE_ENUMS_USING_INDEX` | `EnumFeature.WRITE_ENUMS_USING_INDEX` |

---

## 六、默认行为变更

### 重要默认值变化

| 配置项 | Jackson 2.x 默认 | Jackson 3.x 默认 |
|--------|------------------|------------------|
| `WRITE_DATES_AS_TIMESTAMPS` | 开启（时间戳） | 关闭（ISO-8601 字符串） |
| `FAIL_ON_UNKNOWN_PROPERTIES` | 开启 | 关闭 |
| `FAIL_ON_EMPTY_BEANS` | 开启 | 关闭 |
| `FAIL_ON_TRAILING_TOKENS` | 关闭 | 开启 |

### 日期格式变化

```java
// Jackson 2.x 默认输出（时间戳）
{"createTime": 1710144000000}

// Jackson 3.x 默认输出（ISO-8601）
{"createTime": "2025-03-11T10:00:00"}
```

---

## 七、异常处理变更

### 异常类重命名

| Jackson 2.x | Jackson 3.x |
|-------------|-------------|
| `JsonProcessingException` | `JacksonException` |
| `JsonParseException` | `StreamReadException` |
| `JsonGenerationException` | `StreamWriteException` |
| `JsonMappingException` | `DatabindException` |

### 异常类型变更

所有异常改为非检查型（继承 `RuntimeException`），无需显式捕获。

---

## 八、Redis 序列化配置示例

### Spring Boot 4.0 + Jackson 3.x

```java
package com.example.xinmall.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.serializer.GenericJacksonJsonRedisSerializer;
import org.springframework.data.redis.serializer.StringRedisSerializer;
import tools.jackson.databind.json.JsonMapper;

@Configuration
public class RedisConfig {

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

    @Bean
    public StringRedisTemplate stringRedisTemplate(RedisConnectionFactory connectionFactory) {
        return new StringRedisTemplate(connectionFactory);
    }
}
```

---

## 九、常见问题

### Q1: Cannot resolve method 'builder' in 'ObjectMapper'

**原因**：Jackson 3.x 中 `ObjectMapper` 是抽象类。

**解决**：使用 `JsonMapper.builder()` 代替。

```java
// ❌ 错误
ObjectMapper.builder().build();

// ✅ 正确
JsonMapper.builder().build();
```

### Q2: Cannot resolve symbol 'JavaTimeModule'

**原因**：Jackson 3.x 已内置 Java 8 时间模块。

**解决**：移除 `JavaTimeModule` 相关代码，无需手动注册。

### Q3: Cannot resolve symbol 'WRITE_DATES_AS_TIMESTAMPS'

**原因**：该配置已迁移到 `DateTimeFeature`。

**解决**：

```java
import tools.jackson.databind.cfg.DateTimeFeature;

JsonMapper.builder()
    .disable(DateTimeFeature.WRITE_DATES_AS_TIMESTAMPS)
    .build();
```

### Q4: GenericJackson2JsonRedisSerializer deprecated

**原因**：Spring Data Redis 4.0 重命名了序列化器。

**解决**：

| 旧类名 | 新类名 |
|--------|--------|
| `GenericJackson2JsonRedisSerializer` | `GenericJacksonJsonRedisSerializer` |
| `Jackson2JsonRedisSerializer` | `JacksonJsonRedisSerializer` |

---

## 十、迁移检查清单

- [ ] JDK 升级到 17+
- [ ] 更新 Maven 依赖（`com.fasterxml.jackson` → `tools.jackson`）
- [ ] 更新导入语句（包名变更）
- [ ] 修改 ObjectMapper 创建方式（使用 `JsonMapper.builder()`）
- [ ] 移除 `JavaTimeModule` 注册代码
- [ ] 更新日期时间配置（使用 `DateTimeFeature`）
- [ ] 更新异常处理（异常类重命名）
- [ ] 更新 Redis 序列化配置
- [ ] 运行单元测试验证序列化/反序列化行为

---

## 十一、参考资源

- [Jackson 3.x 官方文档](https://github.com/FasterXML/jackson/wiki/Jackson-Release-3.0)
- [Spring Boot 4.0 迁移指南](https://github.com/spring-projects/spring-boot/wiki/Spring-Boot-4.0-Migration-Guide)
- [Jackson 3 迁移核心注意点总结](https://juejin.cn/post/7581727073580941363)

---

*文档版本：v1.0*
*最后更新：2025-03-11*
