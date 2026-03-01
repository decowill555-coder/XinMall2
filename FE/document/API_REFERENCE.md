# API 接口文档

本文档详细说明 XinMall 前端项目的 API 接口规范和各模块接口定义。

## 接口规范

### 基础配置

```typescript
const BASE_URL = 'https://api.xinmall.com/v1';
const TIMEOUT = 10000;
```

### 请求格式

所有请求使用 JSON 格式：

```typescript
{
  'Content-Type': 'application/json'
}
```

### 响应格式

统一响应格式：

```typescript
interface ApiResponse<T> {
  code: number;      // 0 表示成功，非 0 表示错误
  data: T;           // 响应数据
  message: string;   // 响应消息
  timestamp: number; // 时间戳
}
```

### 错误码定义

| 错误码 | 说明 |
|--------|------|
| 0 | 成功 |
| 1001 | 参数错误 |
| 1002 | 未授权 |
| 1003 | 禁止访问 |
| 1004 | 资源不存在 |
| 2001 | 用户名或密码错误 |
| 2002 | 账号已被禁用 |
| 2003 | Token 已过期 |
| 3001 | 商品不存在 |
| 3002 | 库存不足 |
| 4001 | 订单不存在 |
| 4002 | 订单状态错误 |
| 5000 | 服务器内部错误 |

### 请求拦截

自动注入 Token：

```typescript
const token = uni.getStorageSync('token');
if (token) {
  header['Authorization'] = `Bearer ${token}`;
}
```

### 响应拦截

统一错误处理：

```typescript
if (res.statusCode === 401) {
  // Token 过期，跳转登录
  uni.navigateTo({ url: '/pages-sub/user/login/index' });
}
```

---

## 认证模块 (auth)

### 登录

**POST** `/auth/login`

**请求参数：**

```typescript
interface LoginRequest {
  username: string;   // 用户名/手机号
  password: string;   // 密码
  deviceId?: string;  // 设备 ID
}
```

**响应数据：**

```typescript
interface LoginResponse {
  token: string;
  refreshToken: string;
  expiresIn: number;
  user: UserInfo;
}

interface UserInfo {
  id: string;
  username: string;
  nickname: string;
  avatar: string;
  phone: string;
  email: string;
  role: 'user' | 'seller' | 'vip' | 'admin';
  createdAt: string;
}
```

---

### 注册

**POST** `/auth/register`

**请求参数：**

```typescript
interface RegisterRequest {
  username: string;
  password: string;
  phone: string;
  code: string;       // 短信验证码
  inviteCode?: string;
}
```

**响应数据：**

```typescript
interface RegisterResponse {
  token: string;
  user: UserInfo;
}
```

---

### 发送验证码

**POST** `/auth/sms/send`

**请求参数：**

```typescript
interface SendSmsRequest {
  phone: string;
  type: 'register' | 'login' | 'reset' | 'bind';
}
```

---

### 刷新 Token

**POST** `/auth/refresh`

**请求参数：**

```typescript
interface RefreshTokenRequest {
  refreshToken: string;
}
```

**响应数据：**

```typescript
interface RefreshTokenResponse {
  token: string;
  refreshToken: string;
  expiresIn: number;
}
```

---

### 退出登录

**POST** `/auth/logout`

---

## 商品模块 (spu)

### 搜索商品

**GET** `/spu/search`

**请求参数：**

```typescript
interface SearchSpuRequest {
  keyword?: string;
  categoryId?: string;
  brandId?: string;
  minPrice?: number;
  maxPrice?: number;
  condition?: 'NEW' | '99' | '95' | '90' | '85' | '80';
  isPackageSale?: boolean;
  sortBy?: 'default' | 'sales' | 'price' | 'new';
  sortOrder?: 'asc' | 'desc';
  page: number;
  pageSize: number;
}
```

**响应数据：**

```typescript
interface SearchSpuResponse {
  list: SpuDetail[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
```

---

### 获取商品详情

**GET** `/spu/:id`

**响应数据：**

```typescript
interface SpuDetail {
  id: string;
  name: string;
  subName: string;
  cover: string;
  gallery: SpuImage[];
  brand: SpuBrand;
  category: SpuCategory;
  attributes: SpuAttribute[];
  skus: SpuSku[];
  description: string;
  specs: any[];
  score: number;
  commentCount: number;
  salesCount: number;
  stock: number;
  marketPrice: number;
  price: number;
  isNew: boolean;
  isHot: boolean;
  createdAt: string;
}

interface SpuImage {
  url: string;
  isCover: boolean;
  sort: number;
}

interface SpuBrand {
  id: string;
  name: string;
  logo: string;
  description: string;
}

interface SpuCategory {
  id: string;
  name: string;
  parentId: string;
}

interface SpuAttribute {
  name: string;
  value: string;
}

interface SpuSku {
  id: string;
  price: number;
  originalPrice: number;
  stock: number;
  attributes: SpuAttribute[];
  barCode: string;
  weight: number;
  volume: number;
}
```

---

### 获取热门商品

**GET** `/spu/hot`

**请求参数：**

```typescript
interface HotSpuRequest {
  limit?: number;
}
```

**响应数据：**

```typescript
interface SpuRecommendation {
  id: string;
  name: string;
  cover: string;
  price: number;
  marketPrice: number;
}
```

---

### 获取新品

**GET** `/spu/new`

**请求参数：**

```typescript
interface NewSpuRequest {
  limit?: number;
}
```

---

### 获取相关商品

**GET** `/spu/:id/related`

**请求参数：**

```typescript
interface RelatedSpuRequest {
  limit?: number;
}
```

---

### 获取分类列表

**GET** `/spu/categories`

**响应数据：**

```typescript
interface CategoryTree {
  id: string;
  name: string;
  parentId: string | null;
  children: CategoryTree[];
}
```

---

### 获取品牌列表

**GET** `/spu/brands`

**请求参数：**

```typescript
interface BrandsRequest {
  page: number;
  pageSize: number;
}
```

**响应数据：**

```typescript
interface BrandsResponse {
  list: SpuBrand[];
  total: number;
}
```

---

## 交易模块 (trade)

### 创建订单

**POST** `/trade/order/create`

**请求参数：**

```typescript
interface CreateOrderRequest {
  items: OrderItem[];
  addressId: string;
  couponId?: string;
  remark?: string;
  payType: 'wechat' | 'alipay' | 'balance';
}

interface OrderItem {
  spuId: string;
  skuId: string;
  quantity: number;
  price: number;
}
```

**响应数据：**

```typescript
interface CreateOrderResponse {
  orderId: string;
  orderNo: string;
  totalAmount: number;
  payAmount: number;
  payParams: any;  // 支付参数
}
```

---

### 获取订单列表

**GET** `/trade/order/list`

**请求参数：**

```typescript
interface OrderListRequest {
  status?: 'pending' | 'paid' | 'shipped' | 'completed' | 'cancelled' | 'refunding';
  page: number;
  pageSize: number;
}
```

**响应数据：**

```typescript
interface OrderListResponse {
  list: OrderDetail[];
  total: number;
  page: number;
  pageSize: number;
}
```

---

### 获取订单详情

**GET** `/trade/order/:id`

**响应数据：**

```typescript
interface OrderDetail {
  id: string;
  orderNo: string;
  status: OrderStatus;
  items: OrderProductItem[];
  address: OrderAddress;
  totalAmount: number;
  discountAmount: number;
  payAmount: number;
  payType: string;
  payTime: string;
  shipTime: string;
  completeTime: string;
  createdAt: string;
}

interface OrderProductItem {
  spuId: string;
  skuId: string;
  name: string;
  cover: string;
  price: number;
  quantity: number;
  specs: SpuAttribute[];
}

interface OrderAddress {
  name: string;
  phone: string;
  province: string;
  city: string;
  district: string;
  address: string;
}
```

---

### 取消订单

**POST** `/trade/order/:id/cancel`

**请求参数：**

```typescript
interface CancelOrderRequest {
  reason: string;
}
```

---

### 确认收货

**POST** `/trade/order/:id/confirm`

---

### 申请退款

**POST** `/trade/order/:id/refund`

**请求参数：**

```typescript
interface RefundRequest {
  reason: string;
  amount: number;
  images?: string[];
}
```

---

### 获取收货地址列表

**GET** `/trade/address/list`

**响应数据：**

```typescript
interface Address {
  id: string;
  name: string;
  phone: string;
  province: string;
  city: string;
  district: string;
  address: string;
  isDefault: boolean;
}
```

---

### 添加收货地址

**POST** `/trade/address/add`

**请求参数：**

```typescript
interface AddAddressRequest {
  name: string;
  phone: string;
  province: string;
  city: string;
  district: string;
  address: string;
  isDefault?: boolean;
}
```

---

### 更新收货地址

**PUT** `/trade/address/:id`

---

### 删除收货地址

**DELETE** `/trade/address/:id`

---

## 上传模块 (upload)

### 上传图片

**POST** `/upload/image`

**请求格式：** `multipart/form-data`

**请求参数：**

```typescript
interface UploadImageRequest {
  file: File;
  type: 'avatar' | 'product' | 'order' | 'chat';
}
```

**响应数据：**

```typescript
interface UploadImageResponse {
  url: string;
  key: string;
  width: number;
  height: number;
  size: number;
}
```

---

### 批量上传图片

**POST** `/upload/images`

**请求格式：** `multipart/form-data`

**请求参数：**

```typescript
interface UploadImagesRequest {
  files: File[];
  type: 'avatar' | 'product' | 'order' | 'chat';
}
```

**响应数据：**

```typescript
interface UploadImagesResponse {
  list: UploadImageResponse[];
}
```

---

## HTTP 工具使用

### 基础用法

```typescript
import { http } from '@/utils/http';

// GET 请求
const data = await http<UserInfo>({
  url: '/user/profile',
  method: 'GET'
});

// POST 请求
const result = await http<LoginResponse>({
  url: '/auth/login',
  method: 'POST',
  data: {
    username: 'user',
    password: 'password'
  }
});

// 带 Loading
const data = await http<SpuDetail>({
  url: '/spu/123',
  method: 'GET',
  loading: true
});
```

### API 模块使用

```typescript
import { spuApi } from '@/api';

// 搜索商品
const result = await spuApi.searchSpu({
  keyword: 'iPhone',
  page: 1,
  pageSize: 20
});

// 获取商品详情
const detail = await spuApi.getSpuDetail('spu-123');

// 获取热门商品
const hotList = await spuApi.getHotSpu(10);
```

---

## 错误处理

### 统一错误处理

```typescript
try {
  const data = await spuApi.getSpuDetail('spu-123');
} catch (error) {
  // 错误已在 http.ts 中统一处理
  // 这里可以添加额外的错误处理逻辑
  console.error('获取商品详情失败', error);
}
```

### 自定义错误处理

```typescript
const data = await http<SpuDetail>({
  url: '/spu/123',
  method: 'GET',
  loading: true
}).catch(error => {
  if (error.code === 3001) {
    // 商品不存在
    uni.showToast({ title: '商品不存在', icon: 'none' });
  }
  throw error;
});
```

---

## 接口缓存

### 缓存策略

对于不常变化的数据，可以使用本地缓存：

```typescript
// 获取分类（带缓存）
const getCategories = async () => {
  const cacheKey = 'spu_categories';
  const cached = uni.getStorageSync(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < 3600000) {
    return cached.data;
  }
  
  const data = await spuApi.getCategories();
  uni.setStorageSync(cacheKey, {
    data,
    timestamp: Date.now()
  });
  
  return data;
};
```
