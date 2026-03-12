# Spring Boot 4.0 + Jackson 3.x 迁移指南

> 本文档整理了从 Spring Boot 3.x + Jackson 2.x 迁移到 Spring Boot 4.0 + Jackson 3.x 的关键变更和实战问题解决方案。

---

## 一、环境要求

| 项目 | 旧版本 | 新版本 |
|------|--------|--------|
| JDK | JDK 8+ | JDK 17+ |
| Spring Boot | 2.x / 3.x | 4.0+ |
| Jackson | 2.x | 3.x |

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
| `com.fasterxml.jackson.core.JsonProcessingException` | `tools.jackson.core.JacksonException` |
| `com.fasterxml.jackson.core.type.TypeReference` | `tools.jackson.core.type.TypeReference` |

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

### 异常导入位置变更

```java
// ❌ 错误 - Jackson 2.x 风格
import com.fasterxml.jackson.core.JsonProcessingException;

// ❌ 错误 - 错误的 Jackson 3.x 导入位置
import tools.jackson.databind.JacksonException;

// ✅ 正确 - Jackson 3.x 导入
import tools.jackson.core.JacksonException;
```

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

## 九、实战问题解决方案

> 以下是在实际迁移过程中遇到的问题和解决方案。

### 问题 1：ObjectMapper Bean 无法自动注入

#### 错误信息

```
Could not autowire. No beans of 'ObjectMapper' type found.
```

#### 原因分析

Spring Boot 4.0 + Jackson 3.x 中：
1. `ObjectMapper` 变成了抽象类，不能直接实例化
2. Spring Boot 不会自动配置 `ObjectMapper` Bean

#### 解决方案

创建 `JacksonConfig` 配置类，手动配置 `ObjectMapper` Bean：

```java
package com.example.xinmall.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import tools.jackson.databind.ObjectMapper;
import tools.jackson.databind.json.JsonMapper;

@Configuration
public class JacksonConfig {

    @Bean
    public ObjectMapper objectMapper() {
        return JsonMapper.builder().build();
    }
}
```

---

### 问题 2：Jackson 版本混用导致类型不匹配

#### 错误现象

项目同时存在两个版本的 Jackson：
- **Jackson 3.x** (`tools.jackson.core:jackson-databind:3.0.4`) - Spring Boot 4.0 自带
- **Jackson 2.x** (`com.fasterxml.jackson.core:jackson-databind:2.20.2`) - 来自第三方依赖（如 jjwt-jackson）

#### 原因分析

代码中导入的是 Jackson 2.x 的包名，但配置的是 Jackson 3.x 的 Bean，导致类型不匹配。

#### 解决方案

**方案一**：统一使用 Jackson 3.x 包名（推荐）

修改所有使用 Jackson 的代码：

```java
// ❌ Jackson 2.x 导入
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;

// ✅ Jackson 3.x 导入
import tools.jackson.databind.ObjectMapper;
import tools.jackson.core.JacksonException;
import tools.jackson.core.type.TypeReference;
```

**方案二**：排除第三方依赖中的 Jackson 2.x

```xml
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-jackson</artifactId>
    <version>0.12.5</version>
    <exclusions>
        <exclusion>
            <groupId>com.fasterxml.jackson.core</groupId>
            <artifactId>*</artifactId>
        </exclusion>
    </exclusions>
</dependency>
```

---

### 问题 3：JacksonException 导入位置错误

#### 错误现象

IDE 提示 `JacksonException` 无法解析或类型不匹配。

#### 原因分析

`JacksonException` 的正确导入位置是 `tools.jackson.core`，而不是 `tools.jackson.databind`。

#### 解决方案

```java
// ❌ 错误
import tools.jackson.databind.JacksonException;

// ✅ 正确
import tools.jackson.core.JacksonException;
```

---

### 问题 4：MyBatis-Plus 枚举注解位置错误

#### 错误现象

枚举类的 `@EnumValue` 和 `@JsonValue` 注解放在 getter 方法上，与项目其他枚举类写法不一致。

#### 原因分析

注解应该放在字段上，而不是 getter 方法上。`@Getter` 注解会自动生成 getter 方法。

#### 解决方案

```java
// ❌ 错误写法
@Getter
public enum UserStatus {
    DISABLED(0, "禁用"),
    NORMAL(1, "正常");

    private final Integer code;
    private final String desc;

    UserStatus(Integer code, String desc) {
        this.code = code;
        this.desc = desc;
    }

    @EnumValue
    public Integer getCode() {
        return code;
    }

    @JsonValue
    public String getDesc() {
        return desc;
    }
}

// ✅ 正确写法
@Getter
public enum UserStatus {
    DISABLED(0, "禁用"),
    NORMAL(1, "正常");

    @EnumValue
    private final Integer code;

    @JsonValue
    private final String desc;

    UserStatus(Integer code, String desc) {
        this.code = code;
        this.desc = desc;
    }
}
```

---

### 问题 5：Security Handler 中 ObjectMapper 使用方式错误

#### 错误写法

```java
@Component
public class AuthenticationEntryPointImpl implements AuthenticationEntryPoint {

    @Override
    public void commence(...) throws IOException {
        ObjectMapper objectMapper = new ObjectMapper();  // ❌ Jackson 3.x 中 ObjectMapper 是抽象类
        response.getWriter().write(objectMapper.writeValueAsString(result));
    }
}
```

#### 正确写法

```java
@Component
@RequiredArgsConstructor
public class AuthenticationEntryPointImpl implements AuthenticationEntryPoint {

    private final ObjectMapper objectMapper;  // ✅ 注入 Spring 管理的 Bean

    @Override
    public void commence(...) throws IOException {
        response.getWriter().write(objectMapper.writeValueAsString(result));
    }
}
```

---

### 问题 6：MyBatis-Plus Page.convert() 返回类型变更

#### 错误信息

```
Incompatible types. 
Found: 'com.baomidou.mybatisplus.core.metadata.IPage<...VO>'
required: 'com.baomidou.mybatisplus.extension.plugins.pagination.Page<...VO>'
```

#### 原因分析

在 **MyBatis-Plus 3.5.x** 中，`Page.convert()` 方法的返回类型发生了变化：

| 版本 | 返回类型 |
|------|----------|
| 旧版本 | `Page<R>` |
| 3.5.x | `IPage<R>` |

`Page` 是 `IPage` 的实现类，但 `IPage` 不能直接赋值给 `Page`。

#### 解决方案

将 Service 接口、实现类和 Controller 的返回类型从 `Page<VO>` 改为 `IPage<VO>`：

```java
// ❌ 错误 - 旧版本写法
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;

public interface UserService {
    Page<UserVO> getList(Integer page, Integer size);
}

public class UserServiceImpl implements UserService {
    @Override
    public Page<UserVO> getList(Integer page, Integer size) {
        Page<User> result = userMapper.selectPage(new Page<>(page, size), wrapper);
        return result.convert(this::convertToVO);  // 编译错误
    }
}

// ✅ 正确 - MyBatis-Plus 3.5.x 写法
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;

public interface UserService {
    IPage<UserVO> getList(Integer page, Integer size);
}

public class UserServiceImpl implements UserService {
    @Override
    public IPage<UserVO> getList(Integer page, Integer size) {
        Page<User> result = userMapper.selectPage(new Page<>(page, size), wrapper);
        return result.convert(this::convertToVO);  // 正确
    }
}
```

#### 受影响的代码模式

所有使用 `result.convert(this::convertToVO)` 模式的方法都需要修改返回类型。

---

## 十、常见问题 FAQ

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

## 十一、迁移检查清单

- [ ] JDK 升级到 17+
- [ ] 更新 Maven 依赖（`com.fasterxml.jackson` → `tools.jackson`）
- [ ] 创建 `JacksonConfig` 配置类
- [ ] 更新所有导入语句（包名变更）
- [ ] 修改 ObjectMapper 创建方式（使用 `JsonMapper.builder()`）
- [ ] 移除 `JavaTimeModule` 注册代码
- [ ] 更新日期时间配置（使用 `DateTimeFeature`）
- [ ] 更新异常处理（异常类重命名）
- [ ] 更新异常导入位置（`tools.jackson.core.JacksonException`）
- [ ] 更新 Redis 序列化配置
- [ ] 检查枚举类注解位置（放在字段上）
- [ ] 检查 Security Handler 中的 ObjectMapper 使用方式
- [ ] 检查 MyBatis-Plus 分页方法返回类型（`Page` → `IPage`）
- [ ] 运行单元测试验证序列化/反序列化行为

---

## 十二、参考资源

- [Jackson 3.x 官方文档](https://github.com/FasterXML/jackson/wiki/Jackson-Release-3.0)
- [Spring Boot 4.0 迁移指南](https://github.com/spring-projects/spring-boot/wiki/Spring-Boot-4.0-Migration-Guide)
- [Jackson 3 迁移核心注意点总结](https://juejin.cn/post/7581727073580941363)

---

*文档版本：v2.1*
*最后更新：2025-03-12*
