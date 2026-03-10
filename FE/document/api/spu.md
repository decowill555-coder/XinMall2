# 型号模块 API 文档

## 概述

型号模块（SPU）提供型号详情、商品列表、社区帖子、评价等功能。**型号详情页即型号社区**，是同一个概念。

**基础路径**: `/spu`

**核心概念**:
- **SPU（型号）**: 标准化产品型号，如 iPhone 15 Pro Max 256GB
- **规格**: 型号的分类属性，如颜色、内存大小等
- **型号社区**: 与型号一一对应，展示商品、帖子、评价

---

## 数据模型

### SPU 结构

```
SPU（型号）= 型号社区
├── 基本信息：名称、品牌、描述、图片
├── 规格参数：颜色、内存、屏幕等
├── 在售商品列表
├── 社区帖子
├── 用户评价
├── 价格趋势
└── 关注成员
```

### 规格与商品

```
SPU: iPhone 15 Pro Max
    │
    ├── 规格
    │   ├── 颜色: 钛金属原色、白色、黑色、蓝色
    │   └── 内存: 256GB、512GB、1TB
    │
    └── 商品
        ├── 商品A: 钛金属原色 + 256GB + 99新 + ¥7999
        ├── 商品B: 白色 + 512GB + 全新 + ¥9999
        └── ...
```

---

## 接口列表

| 接口 | 方法 | 路径 | 说明 |
|------|------|------|------|
| 获取型号详情 | GET | `/spu/{id}` | 获取型号/社区详情 |
| 获取型号列表 | GET | `/spu/list` | 分页获取型号列表 |
| 搜索型号 | GET | `/spu/search` | 按关键词搜索型号 |
| 获取型号商品 | GET | `/spu/{id}/products` | 获取型号下的商品 |
| 获取型号帖子 | GET | `/spu/{id}/posts` | 获取社区帖子 |
| 获取型号评价 | GET | `/spu/{id}/evaluations` | 获取用户评价 |
| 关注型号 | POST | `/spu/{id}/follow` | 关注型号社区 |
| 取消关注 | POST | `/spu/{id}/unfollow` | 取消关注 |
| 获取热门型号 | GET | `/spu/hot` | 热门型号排行 |
| 获取价格趋势 | GET | `/spu/{id}/price-trend` | 价格走势图数据 |
| 获取规格选项 | GET | `/spu/{id}/spec-options` | 获取可筛选规格 |
| 获取相关型号 | GET | `/spu/{id}/related` | 相关型号推荐 |
| 获取已关注型号 | GET | `/spu/followed` | 我关注的型号 |

---

## 详细接口说明

### 1. 获取型号详情

**接口路径**: `GET /spu/{id}`

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
| specs | SpuSpec[] | 规格参数 |
| productCount | number | 在售商品数 |
| priceRange | object | 价格区间 |
| avgRating | number | 平均评分 |
| memberCount | number | 社区成员数 |
| postCount | number | 帖子数 |
| isFollowed | boolean | 是否已关注 |
| tags | string[] | 标签 |
| createdAt | string | 创建时间 |

**响应示例**:
```json
{
  "code": 0,
  "msg": "success",
  "data": {
    "id": "spu_001",
    "name": "iPhone 15 Pro Max 256GB",
    "brandId": "b_001",
    "brandName": "苹果",
    "deviceTypeId": "dt_002",
    "deviceTypeName": "手机",
    "cover": "https://cdn.xinmall.com/spu/iphone15pm.png",
    "images": [
      "https://cdn.xinmall.com/spu/iphone15pm_1.png",
      "https://cdn.xinmall.com/spu/iphone15pm_2.png"
    ],
    "description": "iPhone 15 Pro Max，A17 Pro芯片，钛金属设计...",
    "specs": [
      {
        "name": "颜色",
        "options": ["钛金属原色", "白色", "黑色", "蓝色"]
      },
      {
        "name": "内存",
        "options": ["256GB", "512GB", "1TB"]
      }
    ],
    "productCount": 128,
    "priceRange": {
      "min": 799900,
      "max": 999900
    },
    "avgRating": 4.8,
    "memberCount": 12580,
    "postCount": 896,
    "isFollowed": false,
    "tags": ["热门", "新品", "5G"],
    "createdAt": "2023-09-15 00:00:00"
  }
}
```

---

### 2. 获取型号列表

**接口路径**: `GET /spu/list`

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| deviceTypeId | string | 否 | 设备类型ID |
| brandId | string | 否 | 品牌ID |
| keyword | string | 否 | 搜索关键词 |
| sort | string | 否 | 排序: hot/new/product_count |
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
        "id": "spu_001",
        "name": "iPhone 15 Pro Max 256GB",
        "brandId": "b_001",
        "brandName": "苹果",
        "deviceTypeId": "dt_002",
        "deviceTypeName": "手机",
        "cover": "https://cdn.xinmall.com/spu/iphone15pm.png",
        "productCount": 128,
        "priceRange": { "min": 799900, "max": 999900 },
        "memberCount": 12580,
        "isFollowed": false,
        "tags": ["热门", "新品"]
      }
    ],
    "total": 156,
    "hasMore": true
  }
}
```

---

### 3. 获取型号商品

**接口路径**: `GET /spu/{id}/products`

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| spuId | string | 是 | 型号ID（路径参数） |
| specFilters | object | 否 | 规格筛选，如 { "颜色": "钛金属原色" } |
| condition | string | 否 | 成色筛选 |
| priceMin | number | 否 | 最低价格 |
| priceMax | number | 否 | 最高价格 |
| sellerType | string | 否 | 卖家类型: personal/merchant |
| sort | string | 否 | 排序: recommend/price/new |
| priceOrder | string | 否 | 价格排序: asc/desc |
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
        "id": "p_001",
        "cover": "https://cdn.xinmall.com/products/p001.png",
        "title": "iPhone 15 Pro Max 256GB 钛金属原色 99新",
        "price": 799900,
        "originalPrice": 999900,
        "condition": "99新",
        "specValues": {
          "颜色": "钛金属原色",
          "内存": "256GB"
        },
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
    "total": 128,
    "hasMore": true
  }
}
```

---

### 4. 获取型号帖子

**接口路径**: `GET /spu/{id}/posts`

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| spuId | string | 是 | 型号ID（路径参数） |
| type | string | 否 | 类型: all/pinned/essence |
| sort | string | 否 | 排序: new/hot |
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
        "id": "post_001",
        "title": "iPhone 15 Pro Max 使用体验分享",
        "content": "入手一周，分享下使用感受...",
        "author": {
          "id": "u_001",
          "name": "数码达人",
          "avatar": "https://cdn.xinmall.com/avatar/u001.png",
          "level": 5,
          "levelName": "资深玩家"
        },
        "images": ["https://cdn.xinmall.com/post/img1.png"],
        "likeCount": 256,
        "commentCount": 48,
        "isLiked": false,
        "isPinned": false,
        "isEssence": true,
        "createdAt": "2024-01-15 10:30:00"
      }
    ],
    "total": 896,
    "hasMore": true
  }
}
```

---

### 5. 获取型号评价

**接口路径**: `GET /spu/{id}/evaluations`

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| spuId | string | 是 | 型号ID（路径参数） |
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
        "id": "eval_001",
        "productId": "p_001",
        "productCover": "https://cdn.xinmall.com/products/p001.png",
        "productTitle": "iPhone 15 Pro Max 256GB 钛金属原色",
        "author": {
          "id": "u_002",
          "name": "小明",
          "avatar": "https://cdn.xinmall.com/avatar/u002.png"
        },
        "rating": 5,
        "content": "商品质量很好，卖家发货速度快",
        "images": ["https://cdn.xinmall.com/eval/img1.png"],
        "createdAt": "2024-01-16 14:30:00"
      }
    ],
    "total": 256,
    "hasMore": true
  }
}
```

---

### 6. 关注/取消关注型号

**接口路径**: 
- 关注: `POST /spu/{id}/follow`
- 取消: `POST /spu/{id}/unfollow`

**响应示例**:
```json
{
  "code": 0,
  "msg": "success",
  "data": {
    "success": true,
    "memberCount": 12581
  }
}
```

---

### 7. 获取价格趋势

**接口路径**: `GET /spu/{id}/price-trend`

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| days | number | 否 | 天数，默认30天 |

**响应示例**:
```json
{
  "code": 0,
  "msg": "success",
  "data": [
    {
      "date": "2024-01-01",
      "avgPrice": 829900,
      "minPrice": 799900,
      "maxPrice": 899900,
      "productCount": 135
    },
    {
      "date": "2024-01-02",
      "avgPrice": 825600,
      "minPrice": 789900,
      "maxPrice": 899900,
      "productCount": 132
    }
  ]
}
```

---

### 8. 获取规格选项

**接口路径**: `GET /spu/{id}/spec-options`

**说明**: 获取该型号下可筛选的规格选项及各选项的商品数量

**响应示例**:
```json
{
  "code": 0,
  "msg": "success",
  "data": [
    {
      "name": "颜色",
      "options": [
        { "value": "钛金属原色", "count": 45 },
        { "value": "白色", "count": 38 },
        { "value": "黑色", "count": 32 },
        { "value": "蓝色", "count": 13 }
      ]
    },
    {
      "name": "内存",
      "options": [
        { "value": "256GB", "count": 68 },
        { "value": "512GB", "count": 42 },
        { "value": "1TB", "count": 18 }
      ]
    }
  ]
}
```

---

## 前端调用示例

```typescript
import { spuApi } from '@/api';

// 获取型号详情（即型号社区）
const fetchSpuDetail = async (id: string) => {
  const spu = await spuApi.getSpuDetail(id);
  console.log('型号信息', spu.name, spu.brandName);
  console.log('社区成员数', spu.memberCount);
  console.log('在售商品数', spu.productCount);
};

// 获取型号下的商品（带规格筛选）
const fetchSpuProducts = async (spuId: string) => {
  const result = await spuApi.getSpuProducts({
    spuId,
    specFilters: { '颜色': '钛金属原色' },
    condition: '99新',
    sort: 'price',
    priceOrder: 'asc'
  });
  console.log('商品列表', result.list);
};

// 获取社区帖子
const fetchSpuPosts = async (spuId: string) => {
  const result = await spuApi.getSpuPosts({
    spuId,
    type: 'essence',
    sort: 'hot'
  });
  console.log('精华帖子', result.list);
};

// 关注/取消关注
const toggleFollow = async (spuId: string, isFollowed: boolean) => {
  if (isFollowed) {
    await spuApi.unfollowSpu(spuId);
  } else {
    const result = await spuApi.followSpu(spuId);
    console.log('关注成功，当前成员数', result.memberCount);
  }
};

// 获取价格趋势
const fetchPriceTrend = async (spuId: string) => {
  const trend = await spuApi.getPriceTrend(spuId, 30);
  console.log('30天价格趋势', trend);
};

// 获取规格筛选选项
const fetchSpecOptions = async (spuId: string) => {
  const options = await spuApi.getSpecOptions(spuId);
  console.log('可选规格', options);
};

// 获取热门型号
const fetchHotSpus = async (deviceTypeId?: string) => {
  const hotList = await spuApi.getHotSpus(deviceTypeId, 10);
  console.log('热门型号', hotList);
};

// 获取我关注的型号
const fetchFollowedSpus = async () => {
  const result = await spuApi.getFollowedSpus();
  console.log('我关注的型号', result.list);
};
```

---

## 型号详情页结构

```
型号详情页（型号社区）
├── 头部信息
│   ├── 型号名称、品牌
│   ├── 关注按钮
│   └── 成员数、商品数
├── Tab导航
│   ├── 商品
│   ├── 帖子
│   └── 评价
├── 商品Tab
│   ├── 规格筛选（颜色、内存）
│   ├── 排序筛选
│   └── 商品列表
├── 帖子Tab
│   ├── 全部/置顶/精华
│   └── 帖子列表
└── 评价Tab
    └── 评价列表
```

---

## 注意事项

1. **型号 = 社区**: 型号详情页即型号社区，两者是同一概念
2. **规格筛选**: 通过 `specFilters` 参数按规格筛选商品
3. **价格单位**: 价格以"分"为单位
4. **关注功能**: 关注后可收到该型号的动态推送
5. **价格趋势**: 用于展示价格走势图表
