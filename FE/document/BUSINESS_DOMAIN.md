# 业务模型文档

本文档详细说明 XinMall 电商平台的业务模型、领域概念和核心业务流程。

## 业务概述

### 平台定位

XinMall 是一个 **数码产品垂直电商平台**，采用 **C2B2C** 模式：

- **C (Consumer)** - 消费者/买家
- **B (Business)** - 平台/认证商家
- **C (Consumer)** - 个人卖家

### 核心特色

1. **标准化商品库 (SPU)** - 统一管理数码产品型号、参数
2. **成色分级** - 99新/95新/90新/85新/80新
3. **打包出售** - 支持配件打包销售
4. **商家认证** - 官方授权店、认证商家
5. **交易保障** - 平台担保交易

---

## 核心领域模型

### 1. 商品域 (Product Domain)

#### SPU (Standard Product Unit) - 标准产品单位

SPU 是商品的标准信息集合，代表一款标准化的产品。

```typescript
interface Spu {
  id: string;
  name: string;              // 产品名称：iPhone 15 Pro
  subName: string;           // 副标题：256GB 暗夜紫
  brand: Brand;              // 品牌：Apple
  category: Category;        // 分类：手机
  cover: string;             // 封面图
  gallery: string[];         // 图片库
  attributes: Attribute[];   // 标准参数：CPU、屏幕、电池
  specs: Spec[];             // 规格选项：颜色、容量
  skus: Sku[];               // SKU 列表
  officialPrice: number;     // 官方价格
  description: string;       // 产品描述
  status: 'active' | 'inactive';
  createdAt: string;
}
```

**SPU 特点：**
- 由平台统一维护
- 包含官方参数和图片
- 不包含价格和库存
- 是 SKU 的父级概念

---

#### SKU (Stock Keeping Unit) - 库存单位

SKU 是 SPU 的具体规格组合，是实际交易的最小单位。

```typescript
interface Sku {
  id: string;
  spuId: string;             // 关联 SPU
  specs: SpecValue[];        // 规格值：颜色=暗夜紫，容量=256GB
  price: number;             // 售价
  originalPrice: number;     // 原价
  stock: number;             // 库存
  image: string;             // 规格图
  skuCode: string;           // SKU 编码
  weight: number;            // 重量
  volume: number;            // 体积
}
```

**SKU 示例：**
- iPhone 15 Pro / 暗夜紫 / 256GB
- iPhone 15 Pro / 白色 / 512GB

---

#### Product (商品) - 实际上架商品

Product 是卖家发布的实际商品，关联 SPU 和 SKU。

```typescript
interface Product {
  id: string;
  spu: Spu;                  // 关联 SPU
  sku: Sku;                  // 关联 SKU
  seller: Seller;            // 卖家信息
  condition: Condition;      // 成色
  price: number;             // 售价
  originalPrice: number;     // 原价
  images: string[];          // 实拍图
  description: string;       // 描述
  isPackageSale: boolean;    // 是否打包出售
  packageConfig?: Package;   // 打包配置
  isOfficialAuth: boolean;   // 是否官方授权
  status: ProductStatus;
  location: string;          // 发货地
  views: number;             // 浏览量
  likes: number;             // 收藏数
  publishedAt: string;
  createdAt: string;
}
```

---

#### Condition (成色)

```typescript
type ConditionGrade = 'NEW' | '99' | '95' | '90' | '85' | '80';

interface Condition {
  grade: ConditionGrade;
  label: string;             // 全新/99新/95新...
  description: string;       // 成色描述
  defects: string[];         // 瑕疵列表
  images: string[];          // 瑕疵图片
  batteryHealth?: number;    // 电池健康度 (手机)
  screenCondition?: string;  // 屏幕状态
}
```

**成色标准：**

| 等级 | 描述 | 标准 |
|------|------|------|
| NEW | 全新 | 未拆封，未激活 |
| 99 | 99新 | 几乎无使用痕迹，配件齐全 |
| 95 | 95新 | 轻微使用痕迹，功能完好 |
| 90 | 90新 | 明显使用痕迹，功能完好 |
| 85 | 85新 | 较重使用痕迹，功能正常 |
| 80 | 80新 | 使用痕迹明显，有轻微瑕疵 |

---

#### Package Sale (打包出售)

打包出售是 XinMall 的特色功能，允许卖家将配件与主机一起出售。

```typescript
interface PackageSale {
  enabled: boolean;
  items: PackageItem[];
  agreementSigned: boolean;  // 是否签署协议
  agreementDate?: string;
  discount: number;          // 打包优惠
}

interface PackageItem {
  id: string;
  name: string;              // 充电器、数据线、保护壳...
  type: 'CHARGER' | 'CABLE' | 'CASE' | 'HEADPHONE' | 'OTHER';
  condition: ConditionGrade;
  included: boolean;
  price: number;
}
```

---

### 2. 交易域 (Trade Domain)

#### Order (订单)

```typescript
interface Order {
  id: string;
  orderNo: string;           // 订单号
  buyer: User;               // 买家
  seller: User;              // 卖家
  items: OrderItem[];        // 订单商品
  address: Address;          // 收货地址
  totalAmount: number;       // 商品总额
  freightAmount: number;     // 运费
  discountAmount: number;    // 优惠金额
  payAmount: number;         // 实付金额
  status: OrderStatus;
  payType: PayType;
  payTime?: string;
  shipTime?: string;
  receiveTime?: string;
  completeTime?: string;
  remark?: string;
  createdAt: string;
}

type OrderStatus = 
  | 'pending'      // 待付款
  | 'paid'         // 待发货
  | 'shipped'      // 待收货
  | 'completed'    // 已完成
  | 'cancelled'    // 已取消
  | 'refunding'    // 退款中
  | 'refunded';    // 已退款

type PayType = 'wechat' | 'alipay' | 'balance';
```

---

#### 订单状态流转

```
                    ┌──────────────┐
                    │   pending    │ 待付款
                    └──────┬───────┘
                           │ 支付
                    ┌──────▼───────┐
           ┌───────│     paid     │ 待发货
           │       └──────┬───────┘
           │              │ 发货
           │       ┌──────▼───────┐
           │       │   shipped    │ 待收货
           │       └──────┬───────┘
           │              │ 确认收货
           │       ┌──────▼───────┐
           │       │  completed   │ 已完成
           │       └──────────────┘
           │
           │ 取消
    ┌──────▼───────┐
    │  cancelled   │ 已取消
    └──────────────┘
```

---

#### Refund (退款/售后)

```typescript
interface Refund {
  id: string;
  orderId: string;
  type: 'refund_only' | 'return_refund';  // 仅退款/退货退款
  reason: string;
  amount: number;
  status: RefundStatus;
  images: string[];
  result?: string;
  createdAt: string;
}

type RefundStatus = 
  | 'pending'      // 待处理
  | 'approved'     // 已同意
  | 'rejected'     // 已拒绝
  | 'returning'    // 退货中
  | 'completed'    // 已完成
  | 'closed';      // 已关闭
```

---

### 3. 用户域 (User Domain)

#### User (用户)

```typescript
interface User {
  id: string;
  username: string;
  nickname: string;
  avatar: string;
  phone: string;
  email: string;
  role: UserRole;
  status: 'active' | 'inactive' | 'banned';
  sellerInfo?: SellerInfo;
  buyerInfo?: BuyerInfo;
  createdAt: string;
}

type UserRole = 'guest' | 'user' | 'seller' | 'vip' | 'admin';
```

---

#### Seller (卖家信息)

```typescript
interface SellerInfo {
  isVerified: boolean;
  verifiedAt?: string;
  authType: 'PERSONAL' | 'BUSINESS' | 'OFFICIAL';
  shopName: string;
  shopLogo: string;
  shopDescription: string;
  badges: SellerBadge[];
  stats: SellerStats;
}

interface SellerBadge {
  type: 'OFFICIAL' | 'VERIFIED' | 'TOP_SELLER' | 'FAST_SHIPPER';
  icon: string;
  label: string;
}

interface SellerStats {
  productCount: number;      // 在售商品数
  soldCount: number;         // 已售数量
  rating: number;            // 评分
  responseRate: number;      // 回复率
  shipTime: number;          // 发货时效（小时）
}
```

---

#### Buyer (买家信息)

```typescript
interface BuyerInfo {
  orderCount: number;        // 订单数
  totalSpent: number;        // 总消费
  couponCount: number;       // 优惠券数
  points: number;            // 积分
  level: number;             // 会员等级
}
```

---

### 4. 消息域 (Message Domain)

#### Conversation (会话)

```typescript
interface Conversation {
  id: string;
  participants: string[];    // 参与者 ID
  type: 'private' | 'group';
  lastMessage: Message;
  unreadCount: number;
  isMuted: boolean;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
}
```

---

#### Message (消息)

```typescript
interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  type: MessageType;
  content: string;
  status: 'sending' | 'sent' | 'delivered' | 'read' | 'failed';
  extra?: MessageExtra;
  createdAt: string;
}

type MessageType = 
  | 'text'        // 文本
  | 'image'       // 图片
  | 'product'     // 商品卡片
  | 'order'       // 订单卡片
  | 'location'    // 位置
  | 'system';     // 系统消息

interface MessageExtra {
  productId?: string;
  orderId?: string;
  imageUrl?: string;
  imageWidth?: number;
  imageHeight?: number;
}
```

---

## 核心业务流程

### 1. 商品发布流程

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  选择 SPU   │───▶│  选择 SKU   │───▶│  填写成色   │
└─────────────┘    └─────────────┘    └──────┬──────┘
                                             │
                    ┌─────────────┐          │
                    │  设置价格   │◀─────────┘
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐
                    │  上传图片   │
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐
                    │  打包设置   │ (可选)
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐
                    │  签署协议   │
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐
                    │  提交审核   │
                    └─────────────┘
```

---

### 2. 交易流程

```
买家                              卖家
  │                                │
  │──── 浏览商品 ─────────────────▶│
  │                                │
  │◀─── 查看详情 ──────────────────│
  │                                │
  │──── 发起聊天 ─────────────────▶│
  │                                │
  │◀─── 回复消息 ──────────────────│
  │                                │
  │──── 下单支付 ─────────────────▶│
  │                                │
  │                                │──── 发货 ────▶
  │                                │
  │◀─── 确认收货 ──────────────────│
  │                                │
  │                                │◀─── 评价 ────│
  │                                │
  │◀─── 交易完成 ──────────────────│
```

---

### 3. 退款流程

```
买家                              卖家                              平台
  │                                │                                │
  │──── 申请退款 ─────────────────▶│                                │
  │                                │                                │
  │                                │──── 同意/拒绝 ────────────────▶│
  │                                │                                │
  │                                │                                │──▶ 审核通过
  │                                │                                │
  │◀─── 退货地址 ──────────────────│                                │
  │                                │                                │
  │──── 寄回商品 ─────────────────▶│                                │
  │                                │                                │
  │                                │──── 确认收货 ────────────────▶│
  │                                │                                │
  │                                │                                │──▶ 退款
  │◀─── 退款成功 ─────────────────────────────────────────────────│
```

---

## 权限模型 (RBAC)

### 角色定义

| 角色 | 说明 | 权限范围 |
|------|------|----------|
| guest | 游客 | 浏览商品、搜索 |
| user | 普通用户 | 下单、收藏、聊天 |
| seller | 卖家 | 发布商品、管理订单 |
| vip | VIP 会员 | 专属优惠、优先客服 |
| admin | 管理员 | 后台管理、审核 |

### 权限点

```typescript
type Permission = 
  // 商品权限
  | 'product:view'
  | 'product:publish'
  | 'product:edit'
  | 'product:delete'
  
  // 订单权限
  | 'order:view'
  | 'order:create'
  | 'order:cancel'
  | 'order:refund'
  
  // 店铺权限
  | 'shop:create'
  | 'shop:manage'
  
  // 用户权限
  | 'user:profile:edit'
  | 'user:address:manage'
  
  // 消息权限
  | 'message:send'
  
  // 其他权限
  | 'comment:publish'
  | 'coupon:use'
  | 'vip:access'
  
  // 管理权限
  | 'admin:dashboard'
  | 'admin:user:manage'
  | 'admin:product:audit';
```

---

## 数据统计指标

### 商品指标

| 指标 | 说明 |
|------|------|
| PV | 商品详情页浏览量 |
| UV | 商品详情页访客数 |
| 收藏数 | 商品被收藏次数 |
| 分享数 | 商品被分享次数 |
| 转化率 | 浏览→下单转化率 |

### 卖家指标

| 指标 | 说明 |
|------|------|
| 在售商品数 | 当前在售商品数量 |
| 已售数量 | 累计销售数量 |
| 评分 | 综合评分 (1-5) |
| 回复率 | 消息回复率 |
| 发货时效 | 平均发货时间 |

### 平台指标

| 指标 | 说明 |
|------|------|
| GMV | 商品交易总额 |
| DAU | 日活跃用户数 |
| MAU | 月活跃用户数 |
| 订单量 | 订单总数 |
| 客单价 | 平均订单金额 |
