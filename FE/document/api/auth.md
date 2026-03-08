# 认证模块 API 文档

## 概述

认证模块提供用户登录、注册、密码重置、第三方登录等功能。

**基础路径**: `/auth`

**认证方式**: Bearer Token (JWT)

---

## 接口列表

| 接口 | 方法 | 路径 | 说明 |
|------|------|------|------|
| 账号密码登录 | POST | `/auth/login` | 手机号 + 密码登录 |
| 发送验证码 | POST | `/auth/sms/send` | 发送短信验证码 |
| 用户注册 | POST | `/auth/register` | 手机号注册新用户 |
| 重置密码 | POST | `/auth/password/reset` | 忘记密码重置 |
| 第三方登录 | POST | `/auth/social/login` | 微信/支付宝登录 |
| 退出登录 | POST | `/auth/logout` | 用户退出登录 |
| 刷新Token | POST | `/auth/token/refresh` | 刷新访问令牌 |
| 检查手机号 | GET | `/auth/check/phone` | 检查手机号是否已注册 |

---

## 详细接口说明

### 1. 账号密码登录

**接口路径**: `POST /auth/login`

**接口描述**: 用户通过手机号和密码进行登录

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| phone | string | 是 | 手机号，11位数字 |
| password | string | 是 | 密码，6-20位 |

**请求示例**:
```json
{
  "phone": "13800138000",
  "password": "123456"
}
```

**响应参数**:

| 参数名 | 类型 | 说明 |
|--------|------|------|
| token | string | 访问令牌 |
| refreshToken | string | 刷新令牌 |
| expiresIn | number | Token有效期(秒) |
| user | object | 用户信息 |

**user 对象结构**:

| 参数名 | 类型 | 说明 |
|--------|------|------|
| id | string | 用户ID |
| phone | string | 手机号 |
| nickname | string | 昵称 |
| avatar | string | 头像URL |
| gender | number | 性别: 0-未知, 1-男, 2-女 |
| birthday | string | 生日 (YYYY-MM-DD) |
| signature | string | 个性签名 |
| isSeller | boolean | 是否是卖家 |
| sellerId | string \| null | 卖家店铺ID |
| createTime | string | 注册时间 |

**响应示例**:
```json
{
  "code": 0,
  "msg": "success",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "refresh_token_xxx",
    "expiresIn": 7200,
    "user": {
      "id": "user_001",
      "phone": "138****8000",
      "nickname": "XinMall用户",
      "avatar": "https://cdn.xinmall.com/avatar/default.png",
      "gender": 0,
      "birthday": "",
      "signature": "",
      "isSeller": false,
      "sellerId": null,
      "createTime": "2024-01-01 12:00:00"
    }
  }
}
```

**错误码**:

| 错误码 | 说明 |
|--------|------|
| 1001 | 手机号格式错误 |
| 1002 | 用户不存在 |
| 1003 | 密码错误 |
| 1004 | 账号已被禁用 |

---

### 2. 发送验证码

**接口路径**: `POST /auth/sms/send`

**接口描述**: 发送短信验证码，用于注册、找回密码、验证码登录等场景

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| phone | string | 是 | 手机号，11位数字 |
| type | string | 是 | 验证码类型: `register`-注册, `forgot`-找回密码, `login`-验证码登录 |

**请求示例**:
```json
{
  "phone": "13800138000",
  "type": "register"
}
```

**响应参数**:

| 参数名 | 类型 | 说明 |
|--------|------|------|
| success | boolean | 是否发送成功 |
| expireIn | number | 验证码有效期(秒) |

**响应示例**:
```json
{
  "code": 0,
  "msg": "success",
  "data": {
    "success": true,
    "expireIn": 300
  }
}
```

**错误码**:

| 错误码 | 说明 |
|--------|------|
| 1001 | 手机号格式错误 |
| 1005 | 发送频率过高，请稍后再试 |
| 1006 | 手机号已注册 (type=register时) |
| 1007 | 手机号未注册 (type=forgot时) |

---

### 3. 用户注册

**接口路径**: `POST /auth/register`

**接口描述**: 使用手机号注册新用户账号

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| phone | string | 是 | 手机号，11位数字 |
| code | string | 是 | 短信验证码，4-6位 |
| password | string | 是 | 密码，6-20位 |

**请求示例**:
```json
{
  "phone": "13800138000",
  "code": "123456",
  "password": "123456"
}
```

**响应参数**: 同 [账号密码登录](#1-账号密码登录)

**错误码**:

| 错误码 | 说明 |
|--------|------|
| 1001 | 手机号格式错误 |
| 1008 | 验证码错误或已过期 |
| 1006 | 手机号已注册 |
| 1009 | 密码格式错误 |

---

### 4. 重置密码

**接口路径**: `POST /auth/password/reset`

**接口描述**: 忘记密码时通过手机验证码重置密码

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| phone | string | 是 | 手机号，11位数字 |
| code | string | 是 | 短信验证码，4-6位 |
| password | string | 是 | 新密码，6-20位 |

**请求示例**:
```json
{
  "phone": "13800138000",
  "code": "123456",
  "password": "newpassword"
}
```

**响应参数**:

| 参数名 | 类型 | 说明 |
|--------|------|------|
| success | boolean | 是否重置成功 |

**响应示例**:
```json
{
  "code": 0,
  "msg": "success",
  "data": {
    "success": true
  }
}
```

**错误码**:

| 错误码 | 说明 |
|--------|------|
| 1001 | 手机号格式错误 |
| 1007 | 手机号未注册 |
| 1008 | 验证码错误或已过期 |
| 1009 | 密码格式错误 |

---

### 5. 第三方登录

**接口路径**: `POST /auth/social/login`

**接口描述**: 通过微信或支付宝等第三方平台登录

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| platform | string | 是 | 平台类型: `wechat`-微信, `alipay`-支付宝 |
| code | string | 是 | 第三方授权码 |

**请求示例**:
```json
{
  "platform": "wechat",
  "code": "wx_auth_code_xxx"
}
```

**响应参数**:

| 参数名 | 类型 | 说明 |
|--------|------|------|
| token | string | 访问令牌 |
| refreshToken | string | 刷新令牌 |
| expiresIn | number | Token有效期(秒) |
| user | object | 用户信息 |
| isNewUser | boolean | 是否新用户 |

**响应示例**:
```json
{
  "code": 0,
  "msg": "success",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "refresh_token_xxx",
    "expiresIn": 7200,
    "user": {
      "id": "user_001",
      "phone": "",
      "nickname": "微信用户",
      "avatar": "https://wx.qlogo.cn/xxx",
      "gender": 1,
      "birthday": "",
      "signature": "",
      "isSeller": false,
      "sellerId": null,
      "createTime": "2024-01-01 12:00:00"
    },
    "isNewUser": true
  }
}
```

**错误码**:

| 错误码 | 说明 |
|--------|------|
| 1010 | 不支持的登录平台 |
| 1011 | 第三方授权失败 |
| 1012 | 第三方账号未绑定手机号 |

---

### 6. 退出登录

**接口路径**: `POST /auth/logout`

**接口描述**: 用户退出登录，使当前Token失效

**请求头**:
```
Authorization: Bearer <token>
```

**请求参数**: 无

**响应参数**:

| 参数名 | 类型 | 说明 |
|--------|------|------|
| success | boolean | 是否退出成功 |

**响应示例**:
```json
{
  "code": 0,
  "msg": "success",
  "data": {
    "success": true
  }
}
```

---

### 7. 刷新Token

**接口路径**: `POST /auth/token/refresh`

**接口描述**: 使用刷新令牌获取新的访问令牌

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| refreshToken | string | 是 | 刷新令牌 |

**请求示例**:
```json
{
  "refreshToken": "refresh_token_xxx"
}
```

**响应参数**:

| 参数名 | 类型 | 说明 |
|--------|------|------|
| token | string | 新的访问令牌 |
| refreshToken | string | 新的刷新令牌 |
| expiresIn | number | Token有效期(秒) |

**响应示例**:
```json
{
  "code": 0,
  "msg": "success",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "new_refresh_token_xxx",
    "expiresIn": 7200
  }
}
```

**错误码**:

| 错误码 | 说明 |
|--------|------|
| 1013 | 刷新令牌无效或已过期 |

---

### 8. 检查手机号

**接口路径**: `GET /auth/check/phone`

**接口描述**: 检查手机号是否已注册

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| phone | string | 是 | 手机号，11位数字 |

**请求示例**:
```
GET /auth/check/phone?phone=13800138000
```

**响应参数**:

| 参数名 | 类型 | 说明 |
|--------|------|------|
| exists | boolean | 手机号是否已注册 |

**响应示例**:
```json
{
  "code": 0,
  "msg": "success",
  "data": {
    "exists": true
  }
}
```

---

## 通用错误码

| 错误码 | 说明 |
|--------|------|
| 0 | 成功 |
| 400 | 请求参数错误 |
| 401 | 未授权/Token失效 |
| 403 | 无权限访问 |
| 500 | 服务器内部错误 |

---

## 前端调用示例

```typescript
import { authApi } from '@/api';

// 账号密码登录
const handleLogin = async () => {
  try {
    const result = await authApi.login({
      phone: '13800138000',
      password: '123456'
    });
    console.log('登录成功', result.token, result.user);
  } catch (error) {
    console.error('登录失败', error);
  }
};

// 发送验证码
const handleSendCode = async () => {
  try {
    const result = await authApi.sendCode({
      phone: '13800138000',
      type: 'register'
    });
    console.log('验证码已发送，有效期', result.expireIn, '秒');
  } catch (error) {
    console.error('发送失败', error);
  }
};

// 注册
const handleRegister = async () => {
  try {
    const result = await authApi.register({
      phone: '13800138000',
      code: '123456',
      password: '123456'
    });
    console.log('注册成功', result.token);
  } catch (error) {
    console.error('注册失败', error);
  }
};

// 微信登录
const handleWechatLogin = async () => {
  // 获取微信授权码
  const loginRes = await uni.login({ provider: 'weixin' });
  const code = loginRes.code;
  
  try {
    const result = await authApi.wechatLogin(code);
    if (result.isNewUser) {
      console.log('新用户注册成功');
    }
    console.log('登录成功', result.token);
  } catch (error) {
    console.error('微信登录失败', error);
  }
};

// 刷新Token
const handleRefreshToken = async (refreshToken: string) => {
  try {
    const result = await authApi.refreshToken(refreshToken);
    console.log('Token刷新成功', result.token);
    return result;
  } catch (error) {
    console.error('Token刷新失败，需要重新登录');
    throw error;
  }
};
```

---

## 注意事项

1. **Token有效期**: 访问令牌默认有效期2小时，刷新令牌有效期7天
2. **验证码有效期**: 短信验证码默认有效期5分钟
3. **发送频率限制**: 同一手机号60秒内只能发送一次验证码
4. **密码规则**: 6-20位，建议包含字母和数字
5. **安全建议**: 
   - 不要在本地存储敏感信息
   - Token应存储在安全存储中
   - 定期刷新Token
