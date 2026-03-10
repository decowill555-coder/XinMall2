# 交易模块 API 文档

## 概述

交易模块提供商品浏览、订单管理、支付、收货地址、评价等核心交易功能。

**基础路径**: `/trade`

**核心概念**:
- **商品**: 具体在售物品，个人闲置或商家商品
- **型号(SPU)**: 标准化产品型号，有规格概念
- **订单**: 交易记录，一个订单对应一个商品（可多件）

---

## 数据模型

### 商品与型号

```
型号(SPU) - iPhone 15 Pro Max 256GB
    ├── 规格: 颜色、内存等
    │
    └── 商品列表
        ├── 个人闲置商品A（99新，¥7999）
        ├── 商家商品B（全新，¥8999）
        └── ...
```

### 订单状态

| 状态 | 说明 | 用户操作 |
|------|------|----------|
| pending | 待付款 | 支付、取消 |
| paid | 待发货 | 联系卖家、申请退款 |
| shipped | 待收货 | 确认收货、查看物流 |
| completed | 已完成 | 评价、再次购买 |
| cancelled | 已取消 | 删除订单 |

---

## 接口列表

### 商品相关

| 接口 | 方法 | 路径 | 说明 |
|------|------|------|------|
| 获取商品详情 | GET | `/trade/product/{id}` | 获取单个商品详情 |
| 获取商品列表 | GET | `/trade/products` | 分页获取商品列表 |
| 收藏商品 | POST | `/trade/product/{id}/collect` | 收藏商品 |
| 取消收藏 | POST | `/trade/product/{id}/uncollect` | 取消收藏 |

### 订单相关

| 接口 | 方法 | 路径 | 说明 |
|------|------|------|------|
| 创建订单 | POST | `/trade/order` | 创建新订单 |
| 获取订单列表 | GET | `/trade/orders` | 分页获取订单 |
| 获取订单详情 | GET | `/trade/order/{id}` | 获取单个订单详情 |
| 取消订单 | POST | `/trade/order/{id}/cancel` | 取消待付款订单 |
| 支付订单 | POST | `/trade/order/{id}/pay` | 发起支付 |
| 确认收货 | POST | `/trade/order/{id}/confirm` | 确认收货 |
| 获取物流信息 | GET | `/trade/order/{id}/logistics` | 获取物流轨迹 |

### 地址相关

| 接口 | 方法 | 路径 | 说明 |
|------|------|------|------|
| 获取地址列表 | GET | `/trade/address` | 获取用户所有地址 |
| 获取地址详情 | GET | `/trade/address/{id}` | 获取单个地址 |
| 创建地址 | POST | `/trade/address` | 新增收货地址 |
| 更新地址 | PUT | `/trade/address/{id}` | 修改地址 |
| 删除地址 | DELETE | `/trade/address/{id}` | 删除地址 |
| 设为默认 | POST | `/trade/address/{id}/default` | 设为默认地址 |

### 评价相关

| 接口 | 方法 | 路径 | 说明 |
|------|------|------|------|
| 创建评价 | POST | `/trade/evaluation` | 提交评价 |
| 获取评价详情 | GET | `/trade/evaluation/{orderId}` | 获取订单评价 |
| 获取商品评价 | GET | `/trade/product/{id}/evaluations` | 获取商品所有评价 |

---

## 详细接口说明

### 1. 获取商品详情

**接口路径**: `GET /trade/product/{id}`

**响应参数**:

| 参数名 | 类型 | 说明 |
|--------|------|------|
| id | string | 商品ID |
| title | string | 商品标题 |
| price | number | 价格（分） |
| originalPrice | number | 原价（可选） |
| condition | string | 成色 |
| warranty | boolean | 是否有保修 |
| invoice | boolean | 是否有发票 |
| canBargain | boolean | 是否可议价 |
| description | string | 商品描述 |
| images | string[] | 商品图片 |
| location | string | 发货地 |
| viewCount | number | 浏览量 |
| likeCount | number | 收藏数 |
| isCollected | boolean | 是否已收藏 |
| stock | number | 库存数量 |
| status | string | 状态: on_sale/sold/off_sale |
| seller | object | 卖家信息 |
| model | object | 关联型号信息 |
| createdAt | string | 发布时间 |

**响应示例**:
```json
{
  "code": 0,
  "msg": "success",
  "data": {
    "id": "p_001",
    "title": "iPhone 15 Pro Max 256GB 钛金属原色 99新",
    "price": 799900,
    "originalPrice": 999900,
    "condition": "99新",
    "warranty": true,
    "invoice": true,
    "canBargain": true,
    "description": "自用 iPhone 15 Pro Max，99新，无任何划痕磕碰...",
    "images": [
      "https://cdn.xinmall.com/products/p001_1.png",
      "https://cdn.xinmall.com/products/p001_2.png"
    ],
    "location": "北京市朝阳区",
    "viewCount": 256,
    "likeCount": 32,
    "isCollected": false,
    "stock": 1,
    "status": "on_sale",
    "seller": {
      "id": "u_001",
      "name": "数码达人",
      "avatar": "https://cdn.xinmall.com/avatar/u001.png",
      "type": "personal",
      "levelName": "资深玩家",
      "signature": "诚信交易，品质保证",
      "sellingCount": 12,
      "followerCount": 256,
      "rating": 98,
      "isFollowed": false
    },
    "model": {
      "id": "m_001",
      "name": "iPhone 15 Pro Max 256GB",
      "brandId": "b_001",
      "brandName": "苹果",
      "specs": {
        "内存": "256GB",
        "屏幕": "6.7英寸",
        "芯片": "A17 Pro"
      }
    },
    "createdAt": "2024-01-15 10:30:00"
  }
}
```

---

### 2. 获取商品列表

**接口路径**: `GET /trade/products`

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| keyword | string | 否 | 搜索关键词 |
| modelId | string | 否 | 型号ID |
| deviceTypeId | string | 否 | 设备类型ID |
| brandId | string | 否 | 品牌ID |
| condition | string | 否 | 成色筛选 |
| priceMin | number | 否 | 最低价格 |
| priceMax | number | 否 | 最高价格 |
| sellerType | string | 否 | 卖家类型: personal/merchant |
| sort | string | 否 | 排序: recommend/new/price/sales |
| priceOrder | string | 否 | 价格排序: asc/desc |
| page | number | 否 | 页码，默认1 |
| pageSize | number | 否 | 每页数量，默认20 |

**响应示例**:
```json
{
  "code": 0,
  "msg": "success",
  "data": {
    "list": [
      {
        "id": "p_001",
        "cover": "https://cdn.xinmall.com/products/p001.png",
        "title": "iPhone 15 Pro Max 256GB 钛金属原色 99新",
        "price": 799900,
        "originalPrice": 999900,
        "condition": "99新",
        "sellerType": "personal",
        "sellerId": "u_001",
        "sellerName": "数码达人",
        "sellerAvatar": "https://cdn.xinmall.com/avatar/u001.png",
        "tags": ["在保", "有发票"],
        "viewCount": 256,
        "likeCount": 32,
        "createdAt": "2024-01-15 10:30:00"
      }
    ],
    "total": 156,
    "hasMore": true
  }
}
```

---

### 3. 创建订单

**接口路径**: `POST /trade/order`

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| productId | string | 是 | 商品ID |
| quantity | number | 是 | 购买数量 |
| addressId | string | 是 | 收货地址ID |
| remark | string | 否 | 订单备注 |

**请求示例**:
```json
{
  "productId": "p_001",
  "quantity": 1,
  "addressId": "addr_001",
  "remark": "请尽快发货"
}
```

**响应参数**:

| 参数名 | 类型 | 说明 |
|--------|------|------|
| orderId | string | 订单ID |
| orderNo | string | 订单编号 |
| totalAmount | number | 商品总额（分） |
| freightAmount | number | 运费（分） |
| finalAmount | number | 实付金额（分） |

**响应示例**:
```json
{
  "code": 0,
  "msg": "success",
  "data": {
    "orderId": "o_001",
    "orderNo": "20240115123456789",
    "totalAmount": 799900,
    "freightAmount": 0,
    "finalAmount": 799900
  }
}
```

---

### 4. 获取订单列表

**接口路径**: `GET /trade/orders`

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| status | string | 否 | 订单状态筛选 |
| page | number | 否 | 页码 |
| pageSize | number | 否 | 每页数量 |

**响应示例**:
```json
{
  "code": 0,
  "msg": "success",
  "data": {
    "list": [
      {
        "id": "o_001",
        "orderNo": "20240115123456789",
        "status": "paid",
        "product": {
          "id": "p_001",
          "cover": "https://cdn.xinmall.com/products/p001.png",
          "title": "iPhone 15 Pro Max 256GB",
          "price": 799900,
          "condition": "99新"
        },
        "quantity": 1,
        "totalAmount": 799900,
        "seller": {
          "id": "u_001",
          "name": "数码达人",
          "avatar": "https://cdn.xinmall.com/avatar/u001.png",
          "type": "personal"
        },
        "createdAt": "2024-01-15 10:30:00"
      }
    ],
    "total": 12,
    "hasMore": false
  }
}
```

---

### 5. 获取订单详情

**接口路径**: `GET /trade/order/{orderId}`

**响应参数**:

| 参数名 | 类型 | 说明 |
|--------|------|------|
| id | string | 订单ID |
| orderNo | string | 订单编号 |
| status | string | 订单状态 |
| product | object | 商品信息 |
| quantity | number | 购买数量 |
| totalAmount | number | 商品总额 |
| freightAmount | number | 运费 |
| finalAmount | number | 实付金额 |
| address | object | 收货地址 |
| remark | string | 订单备注 |
| paymentMethod | string | 支付方式 |
| paymentTime | string | 支付时间 |
| shipTime | string | 发货时间 |
| receiveTime | string | 收货时间 |
| finishTime | string | 完成时间 |
| logistics | object | 物流信息 |
| evaluation | object | 评价信息 |
| seller | object | 卖家信息 |
| createdAt | string | 创建时间 |

---

### 6. 支付订单

**接口路径**: `POST /trade/order/{orderId}/pay`

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| method | string | 是 | 支付方式: wechat/alipay/balance |

**响应示例**:
```json
{
  "code": 0,
  "msg": "success",
  "data": {
    "success": true,
    "paymentId": "pay_001",
    "payParams": {
      "appId": "wx...",
      "timeStamp": "1705...",
      "nonceStr": "...",
      "package": "prepay_id=...",
      "signType": "RSA",
      "paySign": "..."
    }
  }
}
```

**说明**: 
- 微信/支付宝支付返回 `payParams` 用于调起支付SDK
- 余额支付直接返回 `success: true`

---

### 7. 获取物流信息

**接口路径**: `GET /trade/order/{orderId}/logistics`

**响应示例**:
```json
{
  "code": 0,
  "msg": "success",
  "data": {
    "company": "顺丰速运",
    "trackingNo": "SF1234567890",
    "traces": [
      {
        "time": "2024-01-16 14:30:00",
        "content": "快件已签收"
      },
      {
        "time": "2024-01-16 10:00:00",
        "content": "快件派送中"
      },
      {
        "time": "2024-01-15 20:00:00",
        "content": "快件已发出"
      }
    ]
  }
}
```

---

### 8. 创建评价

**接口路径**: `POST /trade/evaluation`

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| orderId | string | 是 | 订单ID |
| rating | number | 是 | 评分 1-5 |
| content | string | 是 | 评价内容 |
| images | string[] | 否 | 图片列表 |
| tags | string[] | 否 | 标签列表 |

**请求示例**:
```json
{
  "orderId": "o_001",
  "rating": 5,
  "content": "商品质量很好，卖家发货速度快，包装也很用心",
  "images": [
    "https://cdn.xinmall.com/eval/img1.png"
  ],
  "tags": ["质量好", "发货快", "包装好"]
}
```

---

### 9. 地址管理

**创建地址请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| name | string | 是 | 收货人姓名 |
| phone | string | 是 | 手机号 |
| province | string | 是 | 省 |
| city | string | 是 | 市 |
| district | string | 是 | 区 |
| detail | string | 是 | 详细地址 |

**响应示例**:
```json
{
  "code": 0,
  "msg": "success",
  "data": {
    "id": "addr_001",
    "name": "张三",
    "phone": "138****8888",
    "province": "北京市",
    "city": "北京市",
    "district": "朝阳区",
    "detail": "建国路88号SOHO现代城A座1201",
    "isDefault": false
  }
}
```

---

## 前端调用示例

```typescript
import { tradeApi } from '@/api';

// 获取商品详情
const fetchProduct = async (id: string) => {
  const product = await tradeApi.getProductDetail(id);
  console.log('商品详情', product);
  console.log('卖家类型', product.seller.type);
  console.log('库存', product.stock);
};

// 收藏/取消收藏
const toggleCollect = async (productId: string, isCollected: boolean) => {
  if (isCollected) {
    await tradeApi.uncollectProduct(productId);
  } else {
    await tradeApi.collectProduct(productId);
  }
};

// 创建订单
const createOrder = async () => {
  const result = await tradeApi.createOrder({
    productId: 'p_001',
    quantity: 1,
    addressId: 'addr_001',
    remark: '请尽快发货'
  });
  console.log('订单创建成功', result.orderNo);
  console.log('实付金额', result.finalAmount);
};

// 支付订单
const payOrder = async (orderId: string) => {
  const result = await tradeApi.payOrder({
    orderId,
    method: 'wechat'
  });
  if (result.payParams) {
    // 调起微信支付
    uni.requestPayment({
      provider: 'wxpay',
      ...result.payParams,
      success: () => console.log('支付成功')
    });
  }
};

// 确认收货
const confirmReceive = async (orderId: string) => {
  uni.showModal({
    title: '确认收货',
    content: '确认已收到商品吗？',
    success: async (res) => {
      if (res.confirm) {
        await tradeApi.confirmReceive(orderId);
        uni.showToast({ title: '确认成功', icon: 'success' });
      }
    }
  });
};

// 提交评价
const submitEvaluation = async (orderId: string) => {
  await tradeApi.createEvaluation({
    orderId,
    rating: 5,
    content: '商品质量很好，卖家发货速度快',
    tags: ['质量好', '发货快']
  });
};

// 地址管理
const manageAddress = async () => {
  // 获取地址列表
  const addresses = await tradeApi.getAddressList();
  
  // 新增地址
  const newAddress = await tradeApi.createAddress({
    name: '张三',
    phone: '13800138000',
    province: '北京市',
    city: '北京市',
    district: '朝阳区',
    detail: '建国路88号'
  });
  
  // 设为默认
  await tradeApi.setDefaultAddress(newAddress.id);
};
```

---

## 业务流程图

```
┌─────────────────────────────────────────────────────────────────┐
│                          交易流程                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐ │
│  │ 商品详情 │───→│ 确认订单 │───→│ 创建订单 │───→│ 支付订单 │ │
│  └──────────┘    └──────────┘    └──────────┘    └──────────┘ │
│       │                                                │       │
│       │                                                ↓       │
│       │                                          ┌──────────┐ │
│       │                                          │ 待发货   │ │
│       │                                          │ (paid)   │ │
│       │                                          └──────────┘ │
│       │                                                │       │
│       │                                                ↓       │
│       │                                          ┌──────────┐ │
│       │                                          │ 待收货   │ │
│       │                                          │(shipped) │ │
│       │                                          └──────────┘ │
│       │                                                │       │
│       │                                                ↓       │
│       │                                          ┌──────────┐ │
│       │                                          │ 确认收货 │ │
│       │                                          └──────────┘ │
│       │                                                │       │
│       │                                                ↓       │
│       │                                          ┌──────────┐ │
│       │                                          │ 已完成   │ │
│       │                                          │(completed│ │
│       │                                          └──────────┘ │
│       │                                                │       │
│       │                                                ↓       │
│       │                                          ┌──────────┐ │
│       │                                          │ 提交评价 │ │
│       │                                          └──────────┘ │
│       │                                                        │
│       │  可随时: 收藏商品、联系卖家                            │
│       │                                                        │
└──────┴────────────────────────────────────────────────────────┘
```

---

## 注意事项

1. **商品库存**: 下单时会校验库存，库存不足则无法下单
2. **订单有效期**: 待付款订单30分钟后自动取消
3. **支付方式**: 支持微信、支付宝、余额三种方式
4. **运费**: 部分商品有运费，在订单创建时返回
5. **评价期限**: 确认收货后15天内可评价
6. **无购物车**: 商品直接下单购买，无购物车功能
