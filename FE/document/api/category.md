# 分类模块 API 文档

## 概述

分类模块提供设备类型、品牌、型号（SPU）的查询功能，是"找产品"功能的核心接口。

**基础路径**: `/category`

**核心概念**:
- **设备类型**: 产品大类，如手机、笔记本、平板等
- **品牌**: 产品品牌，如苹果、华为、小米等（与设备类型同级）
- **型号(SPU)**: 具体产品型号，如 iPhone 15 Pro Max 256GB
- **商品**: 型号下的具体在售商品（个人闲置 + 商家商品）

---

## 数据模型

### 层级关系

```
设备类型（手机）────────── 品牌（苹果）
    │                        │
    ├── 子分类（旗舰机）      │
    │                        │
    └────────┬───────────────┘
             │
             ▼
         型号(SPU)
     iPhone 15 Pro Max 256GB
             │
             ▼
         商品列表
    ┌────────┴────────┐
    │                 │
个人闲置            商家商品
```

---

## 接口列表

| 接口 | 方法 | 路径 | 说明 |
|------|------|------|------|
| 获取设备类型列表 | GET | `/category/device-categories` | 获取所有设备类型（按字母分组） |
| 获取设备类型详情 | GET | `/category/device-type/{id}` | 获取子分类和品牌列表 |
| 获取型号列表 | GET | `/category/models` | 根据筛选条件获取型号列表 |
| 获取型号详情 | GET | `/category/model/{id}` | 获取单个型号详细信息 |
| 获取型号下的商品 | GET | `/category/model/{id}/products` | 获取某型号下的在售商品 |
| 获取热门型号 | GET | `/category/hot-models` | 获取热门型号排行 |
| 获取品牌列表 | GET | `/category/brands` | 获取品牌列表 |
| 搜索型号 | GET | `/category/models/search` | 按关键词搜索型号 |

---

## 详细接口说明

### 1. 获取设备类型列表

**接口路径**: `GET /category/device-categories`

**接口描述**: 获取所有设备类型，按首字母分组返回

**请求参数**: 无

**响应参数**:

| 参数名 | 类型 | 说明 |
|--------|------|------|
| letter | string | 首字母 |
| categories | DeviceCategory[] | 该字母下的设备类型列表 |

**DeviceCategory 结构**:

| 参数名 | 类型 | 说明 |
|--------|------|------|
| id | string | 设备类型ID |
| name | string | 设备类型名称 |
| icon | string | 图标名称/URL |
| productCount | number | 该类型下商品数量 |
| letter | string | 首字母 |

**响应示例**:
```json
{
  "code": 0,
  "msg": "success",
  "data": [
    {
      "letter": "B",
      "categories": [
        { "id": "dt_001", "name": "笔记本", "icon": "laptop", "productCount": 8960, "letter": "B" }
      ]
    },
    {
      "letter": "S",
      "categories": [
        { "id": "dt_002", "name": "手机", "icon": "phone", "productCount": 12580, "letter": "S" },
        { "id": "dt_003", "name": "摄像头", "icon": "camera", "productCount": 1230, "letter": "S" }
      ]
    }
  ]
}
```

---

### 2. 获取设备类型详情

**接口路径**: `GET /category/device-type/{id}`

**接口描述**: 获取设备类型的详细信息，包括子分类和关联品牌

**路径参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| id | string | 是 | 设备类型ID |

**响应参数**:

| 参数名 | 类型 | 说明 |
|--------|------|------|
| id | string | 设备类型ID |
| name | string | 设备类型名称 |
| icon | string | 图标 |
| description | string | 描述 |
| subCategories | SubCategory[] | 子分类列表 |
| brands | Brand[] | 品牌列表 |
| productCount | number | 商品总数 |

**SubCategory 结构**:

| 参数名 | 类型 | 说明 |
|--------|------|------|
| id | string | 子分类ID |
| name | string | 子分类名称 |
| productCount | number | 商品数量 |

**Brand 结构**:

| 参数名 | 类型 | 说明 |
|--------|------|------|
| id | string | 品牌ID |
| name | string | 品牌名称 |
| logo | string | 品牌Logo URL |
| productCount | number | 该品牌下商品数量 |

**响应示例**:
```json
{
  "code": 0,
  "msg": "success",
  "data": {
    "id": "dt_002",
    "name": "手机",
    "icon": "phone",
    "description": "智能手机、功能机等移动通讯设备",
    "subCategories": [
      { "id": "sc_001", "name": "旗舰机", "productCount": 3560 },
      { "id": "sc_002", "name": "中端机", "productCount": 4890 },
      { "id": "sc_003", "name": "入门机", "productCount": 2130 }
    ],
    "brands": [
      { "id": "b_001", "name": "苹果", "logo": "https://cdn.xinmall.com/brands/apple.png", "productCount": 4560 },
      { "id": "b_002", "name": "华为", "logo": "https://cdn.xinmall.com/brands/huawei.png", "productCount": 3280 },
      { "id": "b_003", "name": "小米", "logo": "https://cdn.xinmall.com/brands/xiaomi.png", "productCount": 2890 }
    ],
    "productCount": 12580
  }
}
```

---

### 3. 获取型号列表

**接口路径**: `GET /category/models`

**接口描述**: 根据筛选条件获取型号（SPU）列表

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| deviceTypeId | string | 是 | 设备类型ID |
| brandId | string | 否 | 品牌ID |
| subCategoryId | string | 否 | 子分类ID |
| keyword | string | 否 | 搜索关键词 |
| sort | string | 否 | 排序方式: `recommend`/`sales`/`new`/`price` |
| priceOrder | string | 否 | 价格排序: `asc`/`desc`（sort=price时生效） |
| page | number | 否 | 页码，默认1 |
| pageSize | number | 否 | 每页数量，默认20 |

**响应参数**:

| 参数名 | 类型 | 说明 |
|--------|------|------|
| list | ModelListItem[] | 型号列表 |
| total | number | 总数量 |
| hasMore | boolean | 是否有更多 |

**ModelListItem 结构**:

| 参数名 | 类型 | 说明 |
|--------|------|------|
| id | string | 型号ID |
| name | string | 型号名称 |
| brandId | string | 品牌ID |
| brandName | string | 品牌名称 |
| deviceTypeId | string | 设备类型ID |
| deviceTypeName | string | 设备类型名称 |
| cover | string | 封面图 |
| productCount | number | 在售商品数量 |
| priceRange | object | 价格区间 |
| specs | object | 规格参数 |
| tags | string[] | 标签 |

**响应示例**:
```json
{
  "code": 0,
  "msg": "success",
  "data": {
    "list": [
      {
        "id": "m_001",
        "name": "iPhone 15 Pro Max 256GB",
        "brandId": "b_001",
        "brandName": "苹果",
        "deviceTypeId": "dt_002",
        "deviceTypeName": "手机",
        "cover": "https://cdn.xinmall.com/models/iphone15pm.png",
        "productCount": 128,
        "priceRange": { "min": 7999, "max": 9999 },
        "specs": { "内存": "256GB", "颜色": "钛金属原色" },
        "tags": ["热门", "新品"]
      }
    ],
    "total": 156,
    "hasMore": true
  }
}
```

---

### 4. 获取型号详情

**接口路径**: `GET /category/model/{id}`

**接口描述**: 获取单个型号的详细信息

**路径参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| id | string | 是 | 型号ID |

**响应参数**:

| 参数名 | 类型 | 说明 |
|--------|------|------|
| id | string | 型号ID |
| name | string | 型号名称 |
| brandId | string | 品牌ID |
| brandName | string | 品牌名称 |
| deviceTypeId | string | 设备类型ID |
| deviceTypeName | string | 设备类型名称 |
| cover | string | 封面图 |
| images | string[] | 图片列表 |
| description | string | 描述 |
| specs | object | 规格参数 |
| productCount | number | 在售商品数量 |
| priceRange | object | 价格区间 |
| avgRating | number | 平均评分 |
| tags | string[] | 标签 |

**响应示例**:
```json
{
  "code": 0,
  "msg": "success",
  "data": {
    "id": "m_001",
    "name": "iPhone 15 Pro Max 256GB",
    "brandId": "b_001",
    "brandName": "苹果",
    "deviceTypeId": "dt_002",
    "deviceTypeName": "手机",
    "cover": "https://cdn.xinmall.com/models/iphone15pm.png",
    "images": [
      "https://cdn.xinmall.com/models/iphone15pm_1.png",
      "https://cdn.xinmall.com/models/iphone15pm_2.png"
    ],
    "description": "iPhone 15 Pro Max，A17 Pro芯片，钛金属设计...",
    "specs": {
      "内存": "256GB",
      "屏幕": "6.7英寸",
      "芯片": "A17 Pro",
      "摄像头": "4800万像素主摄"
    },
    "productCount": 128,
    "priceRange": { "min": 7999, "max": 9999 },
    "avgRating": 4.8,
    "tags": ["热门", "新品", "5G"]
  }
}
```

---

### 5. 获取型号下的商品

**接口路径**: `GET /category/model/{id}/products`

**接口描述**: 获取某个型号下的在售商品列表（包含个人闲置和商家商品）

**路径参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| id | string | 是 | 型号ID |

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| condition | string | 否 | 成色筛选: `全新`/`99新`/`95新`/`9成新` |
| priceMin | number | 否 | 最低价格 |
| priceMax | number | 否 | 最高价格 |
| sort | string | 否 | 排序方式: `recommend`/`price`/`sales`/`new` |
| priceOrder | string | 否 | 价格排序: `asc`/`desc` |
| page | number | 否 | 页码，默认1 |
| pageSize | number | 否 | 每页数量，默认20 |

**响应参数**:

| 参数名 | 类型 | 说明 |
|--------|------|------|
| list | ModelProductItem[] | 商品列表 |
| total | number | 总数量 |
| hasMore | boolean | 是否有更多 |

**ModelProductItem 结构**:

| 参数名 | 类型 | 说明 |
|--------|------|------|
| id | string | 商品ID |
| cover | string | 封面图 |
| title | string | 商品标题 |
| price | number | 价格 |
| originalPrice | number | 原价（可选） |
| condition | string | 成色 |
| sellerType | string | 卖家类型: `personal`/`merchant` |
| sellerId | string | 卖家ID |
| sellerName | string | 卖家名称 |
| sellerAvatar | string | 卖家头像 |
| tags | string[] | 标签 |
| viewCount | number | 浏览量 |
| likeCount | number | 收藏数 |
| createTime | string | 发布时间 |

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
        "price": 8299,
        "originalPrice": 9999,
        "condition": "99新",
        "sellerType": "personal",
        "sellerId": "u_001",
        "sellerName": "数码达人",
        "sellerAvatar": "https://cdn.xinmall.com/avatar/u001.png",
        "tags": ["在保", "有发票"],
        "viewCount": 256,
        "likeCount": 32,
        "createTime": "2024-01-15 10:30:00"
      }
    ],
    "total": 128,
    "hasMore": true
  }
}
```

---

### 6. 获取热门型号

**接口路径**: `GET /category/hot-models`

**接口描述**: 获取热门型号排行榜

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| deviceTypeId | string | 否 | 设备类型ID，不传则返回全站热门 |
| limit | number | 否 | 返回数量，默认10 |

**响应参数**:

| 参数名 | 类型 | 说明 |
|--------|------|------|
| id | string | 型号ID |
| name | string | 型号名称 |
| brandName | string | 品牌名称 |
| cover | string | 封面图 |
| productCount | number | 在售商品数量 |
| trend | string | 趋势: `up`/`down`/`stable` |

**响应示例**:
```json
{
  "code": 0,
  "msg": "success",
  "data": [
    {
      "id": "m_001",
      "name": "iPhone 15 Pro Max 256GB",
      "brandName": "苹果",
      "cover": "https://cdn.xinmall.com/models/iphone15pm.png",
      "productCount": 128,
      "trend": "up"
    }
  ]
}
```

---

### 7. 获取品牌列表

**接口路径**: `GET /category/brands`

**接口描述**: 获取品牌列表，可按设备类型筛选

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| deviceTypeId | string | 否 | 设备类型ID，不传则返回全部品牌 |

**响应参数**:

| 参数名 | 类型 | 说明 |
|--------|------|------|
| id | string | 品牌ID |
| name | string | 品牌名称 |
| logo | string | 品牌Logo |
| productCount | number | 商品数量 |

**响应示例**:
```json
{
  "code": 0,
  "msg": "success",
  "data": [
    { "id": "b_001", "name": "苹果", "logo": "https://cdn.xinmall.com/brands/apple.png", "productCount": 4560 },
    { "id": "b_002", "name": "华为", "logo": "https://cdn.xinmall.com/brands/huawei.png", "productCount": 3280 }
  ]
}
```

---

### 8. 搜索型号

**接口路径**: `GET /category/models/search`

**接口描述**: 按关键词搜索型号

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| keyword | string | 是 | 搜索关键词 |
| page | number | 否 | 页码，默认1 |
| pageSize | number | 否 | 每页数量，默认20 |

**响应参数**: 同 [获取型号列表](#3-获取型号列表)

---

## 前端调用示例

```typescript
import { categoryApi } from '@/api';

// 获取设备类型列表（按字母分组）
const fetchCategories = async () => {
  const result = await categoryApi.getDeviceCategories();
  console.log('设备类型列表', result);
};

// 获取设备类型详情（包含子分类和品牌）
const fetchDeviceTypeDetail = async (id: string) => {
  const detail = await categoryApi.getDeviceTypeDetail(id);
  console.log('子分类', detail.subCategories);
  console.log('品牌列表', detail.brands);
};

// 获取型号列表
const fetchModels = async (deviceTypeId: string, brandId?: string) => {
  const result = await categoryApi.getModels({
    deviceTypeId,
    brandId,
    sort: 'sales',
    page: 1,
    pageSize: 20
  });
  console.log('型号列表', result.list);
};

// 获取型号下的商品
const fetchModelProducts = async (modelId: string) => {
  const result = await categoryApi.getModelProducts({
    modelId,
    condition: '99新',
    sort: 'price',
    priceOrder: 'asc'
  });
  console.log('商品列表', result.list);
};

// 搜索型号
const searchModels = async (keyword: string) => {
  const result = await categoryApi.searchModels(keyword);
  console.log('搜索结果', result.list);
};
```

---

## 业务流程图

```
┌─────────────────────────────────────────────────────────────────┐
│                        找产品流程                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────┐                                              │
│  │ 首页找产品入口 │                                              │
│  └──────┬───────┘                                              │
│         │                                                       │
│         ▼                                                       │
│  ┌──────────────┐     GET /category/device-categories          │
│  │ 设备类型列表  │ ←─────────────────────────────────────────   │
│  │ (按字母分组)  │                                              │
│  └──────┬───────┘                                              │
│         │ 点击某个设备类型                                       │
│         ▼                                                       │
│  ┌──────────────┐     GET /category/device-type/{id}           │
│  │ 设备类型详情  │ ←─────────────────────────────────────────   │
│  │ ├─子分类     │                                              │
│  │ └─品牌列表   │                                              │
│  └──────┬───────┘                                              │
│         │ 选择品牌/子分类                                        │
│         ▼                                                       │
│  ┌──────────────┐     GET /category/models                     │
│  │   型号列表   │ ←─────────────────────────────────────────   │
│  │   (SPU)     │                                              │
│  └──────┬───────┘                                              │
│         │ 点击某个型号                                           │
│         ▼                                                       │
│  ┌──────────────┐     GET /category/model/{id}/products        │
│  │  商品列表    │ ←─────────────────────────────────────────   │
│  │ ├─个人闲置   │                                              │
│  │ └─商家商品   │                                              │
│  └──────────────┘                                              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 注意事项

1. **型号 vs 商品**: 
   - 型号（SPU）是标准化产品信息，如 "iPhone 15 Pro Max 256GB"
   - 商品是具体在售物品，包含价格、成色、卖家等信息

2. **品牌与设备类型同级**: 
   - 品牌不是设备类型的子级
   - 一个品牌可以跨多个设备类型（如苹果有手机、笔记本、平板）

3. **筛选逻辑**:
   - 设备类型 + 品牌 = 该品牌在该类型下的型号
   - 设备类型 + 子分类 = 该子分类下的型号

4. **商品来源**:
   - 型号下的商品包含个人闲置和商家商品
   - 通过 `sellerType` 字段区分
