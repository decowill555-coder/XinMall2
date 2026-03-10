# 搜索模块 API 文档

## 概述

搜索模块提供混合搜索、搜索建议、热门搜索等功能，支持商品、型号、社区的统一搜索。

**基础路径**: `/search`

**核心概念**:
- **混合搜索**: 同时搜索商品、型号、社区，统一展示结果
- **搜索建议**: 关键词联想，不区分类型
- **热门搜索**: 热门关键词/型号/商品
- **搜索历史**: 本地存储，无需服务端接口

---

## 接口列表

| 接口 | 方法 | 路径 | 说明 |
|------|------|------|------|
| 获取搜索建议 | GET | `/search/suggestions` | 关键词联想建议 |
| 获取热门搜索 | GET | `/search/hot` | 热门搜索列表 |
| 混合搜索 | GET | `/search` | 统一搜索入口 |
| 搜索商品 | GET | `/search/products` | 仅搜索商品 |
| 搜索型号 | GET | `/search/models` | 仅搜索型号 |
| 搜索社区 | GET | `/search/communities` | 仅搜索社区 |
| 获取热门型号 | GET | `/search/hot-models` | 热门型号排行 |
| 获取热门社区 | GET | `/search/hot-communities` | 热门社区排行 |
| 获取推荐关键词 | GET | `/search/recommend-keywords` | 推荐搜索词 |
| 获取搜索筛选项 | GET | `/search/filters` | 获取可用筛选条件 |

---

## 详细接口说明

### 1. 获取搜索建议

**接口路径**: `GET /search/suggestions`

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| keyword | string | 是 | 输入的关键词 |
| limit | number | 否 | 返回数量，默认10 |

**响应参数**:

| 参数名 | 类型 | 说明 |
|--------|------|------|
| keyword | string | 建议关键词 |
| type | string | 类型: keyword/model/product/community |
| subtitle | string | 副标题（如品牌名、型号名） |
| cover | string | 封面图（型号/商品时有） |
| id | string | 关联ID（型号/商品/社区时有） |

**响应示例**:
```json
{
  "code": 0,
  "msg": "success",
  "data": [
    { "keyword": "iPhone 15", "type": "keyword" },
    { "keyword": "iPhone 15 Pro Max", "type": "model", "subtitle": "苹果", "id": "m_001", "cover": "https://..." },
    { "keyword": "iPhone 15 手机壳", "type": "keyword" },
    { "keyword": "iPhone 15 Pro Max 256GB 99新", "type": "product", "subtitle": "¥7999", "id": "p_001", "cover": "https://..." }
  ]
}
```

---

### 2. 获取热门搜索

**接口路径**: `GET /search/hot`

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| limit | number | 否 | 返回数量，默认10 |

**响应参数**:

| 参数名 | 类型 | 说明 |
|--------|------|------|
| keyword | string | 关键词 |
| type | string | 类型: keyword/model/product |
| heat | number | 热度值 |
| trend | string | 趋势: up/down/stable |
| cover | string | 封面图（可选） |
| id | string | 关联ID（可选） |

**响应示例**:
```json
{
  "code": 0,
  "msg": "success",
  "data": [
    { "keyword": "iPhone 15 Pro Max", "type": "model", "heat": 9865, "trend": "up", "id": "m_001" },
    { "keyword": "华为 Mate 60", "type": "keyword", "heat": 8521, "trend": "up" },
    { "keyword": "二手笔记本", "type": "keyword", "heat": 7234, "trend": "stable" }
  ]
}
```

---

### 3. 混合搜索

**接口路径**: `GET /search`

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| keyword | string | 是 | 搜索关键词 |
| type | string | 否 | 类型筛选: all/product/model/community，默认all |
| deviceTypeId | string | 否 | 设备类型ID |
| brandId | string | 否 | 品牌ID |
| condition | string | 否 | 成色筛选 |
| priceMin | number | 否 | 最低价格 |
| priceMax | number | 否 | 最高价格 |
| sellerType | string | 否 | 卖家类型: personal/merchant |
| sort | string | 否 | 排序: relevance/new/price/sales |
| priceOrder | string | 否 | 价格排序: asc/desc |
| page | number | 否 | 页码，默认1 |
| pageSize | number | 否 | 每页数量，默认20 |

**响应参数**:

| 参数名 | 类型 | 说明 |
|--------|------|------|
| list | SearchResultItem[] | 搜索结果列表 |
| total | number | 总数量 |
| hasMore | boolean | 是否有更多 |
| aggregations | object | 聚合信息（各类型数量、筛选条件） |

**SearchResultItem 结构**:

| 参数名 | 类型 | 说明 |
|--------|------|------|
| id | string | ID |
| type | string | 类型: product/model/community |
| title | string | 标题 |
| subtitle | string | 副标题 |
| cover | string | 封面图 |
| price | number | 价格（商品时） |
| originalPrice | number | 原价（商品时） |
| condition | string | 成色（商品时） |
| memberCount | number | 成员数（社区时） |
| postCount | number | 帖子数（社区时） |
| productCount | number | 商品数（型号时） |
| sellerType | string | 卖家类型（商品时） |
| sellerName | string | 卖家名称（商品时） |
| tags | string[] | 标签 |
| highlight | string | 高亮匹配文本 |

**响应示例**:
```json
{
  "code": 0,
  "msg": "success",
  "data": {
    "list": [
      {
        "id": "m_001",
        "type": "model",
        "title": "iPhone 15 Pro Max 256GB",
        "subtitle": "苹果",
        "cover": "https://cdn.xinmall.com/models/iphone15pm.png",
        "productCount": 128,
        "tags": ["热门", "新品"],
        "highlight": "<em>iPhone 15</em> Pro Max 256GB"
      },
      {
        "id": "p_001",
        "type": "product",
        "title": "iPhone 15 Pro Max 256GB 钛金属原色 99新",
        "subtitle": "数码达人",
        "cover": "https://cdn.xinmall.com/products/p001.png",
        "price": 799900,
        "originalPrice": 999900,
        "condition": "99新",
        "sellerType": "personal",
        "sellerName": "数码达人",
        "tags": ["在保", "有发票"]
      },
      {
        "id": "c_001",
        "type": "community",
        "title": "iPhone 15 Pro Max 交流圈",
        "cover": "https://cdn.xinmall.com/community/iphone15pm.png",
        "memberCount": 12580,
        "postCount": 8960
      }
    ],
    "total": 256,
    "hasMore": true,
    "aggregations": {
      "productCount": 156,
      "modelCount": 12,
      "communityCount": 3,
      "brands": [
        { "id": "b_001", "name": "苹果", "count": 128 },
        { "id": "b_002", "name": "华为", "count": 45 }
      ],
      "conditions": [
        { "name": "全新", "count": 23 },
        { "name": "99新", "count": 56 },
        { "name": "95新", "count": 42 }
      ],
      "priceRange": { "min": 500000, "max": 1500000 }
    }
  }
}
```

---

### 4. 搜索商品

**接口路径**: `GET /search/products`

**请求参数**: 同混合搜索，type 固定为 product

**响应**: 同混合搜索，仅返回商品类型结果

---

### 5. 搜索型号

**接口路径**: `GET /search/models`

**请求参数**: 同混合搜索，type 固定为 model

**响应**: 同混合搜索，仅返回型号类型结果

---

### 6. 搜索社区

**接口路径**: `GET /search/communities`

**请求参数**: 同混合搜索，type 固定为 community

**响应**: 同混合搜索，仅返回社区类型结果

---

### 7. 获取热门型号

**接口路径**: `GET /search/hot-models`

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| limit | number | 否 | 返回数量，默认10 |

**响应示例**:
```json
{
  "code": 0,
  "msg": "success",
  "data": [
    {
      "id": "m_001",
      "name": "iPhone 15 Pro Max 256GB",
      "brand": "苹果",
      "cover": "https://cdn.xinmall.com/models/iphone15pm.png",
      "productCount": 128,
      "heat": 9865,
      "trend": "up"
    }
  ]
}
```

---

### 8. 获取热门社区

**接口路径**: `GET /search/hot-communities`

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| limit | number | 否 | 返回数量，默认10 |

**响应示例**:
```json
{
  "code": 0,
  "msg": "success",
  "data": [
    {
      "id": "c_001",
      "name": "iPhone 15 Pro Max 交流圈",
      "type": "model",
      "cover": "https://cdn.xinmall.com/community/iphone15pm.png",
      "memberCount": 12580,
      "postCount": 8960
    }
  ]
}
```

---

### 9. 获取推荐关键词

**接口路径**: `GET /search/recommend-keywords`

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| limit | number | 否 | 返回数量，默认10 |

**响应示例**:
```json
{
  "code": 0,
  "msg": "success",
  "data": [
    { "keyword": "iPhone 15", "category": "手机" },
    { "keyword": "华为 Mate 60", "category": "手机" },
    { "keyword": "MacBook Pro", "category": "笔记本" }
  ]
}
```

---

### 10. 获取搜索筛选项

**接口路径**: `GET /search/filters`

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| keyword | string | 是 | 搜索关键词 |

**响应**: 返回该关键词搜索结果中可用的筛选条件（品牌、成色、价格区间等）

---

## 前端调用示例

```typescript
import { searchApi } from '@/api';

// 获取搜索建议
const fetchSuggestions = async (keyword: string) => {
  if (!keyword.trim()) return;
  const suggestions = await searchApi.getSuggestions(keyword, 10);
  console.log('搜索建议', suggestions);
};

// 获取热门搜索
const fetchHotSearches = async () => {
  const hotList = await searchApi.getHotSearches(10);
  console.log('热门搜索', hotList);
};

// 混合搜索
const doSearch = async (keyword: string) => {
  const result = await searchApi.search({
    keyword,
    type: 'all',
    sort: 'relevance',
    page: 1,
    pageSize: 20
  });
  console.log('搜索结果', result.list);
  console.log('各类型数量', result.aggregations);
};

// 带筛选条件的搜索
const searchWithFilter = async (keyword: string) => {
  const result = await searchApi.search({
    keyword,
    brandId: 'b_001',
    condition: '99新',
    priceMin: 500000,
    priceMax: 1000000,
    sellerType: 'personal',
    sort: 'price',
    priceOrder: 'asc'
  });
  console.log('筛选结果', result.list);
};

// 仅搜索商品
const searchProducts = async (keyword: string) => {
  const result = await searchApi.searchProducts({ keyword });
  console.log('商品结果', result.list);
};

// 仅搜索型号
const searchModels = async (keyword: string) => {
  const result = await searchApi.searchModels({ keyword });
  console.log('型号结果', result.list);
};

// 仅搜索社区
const searchCommunities = async (keyword: string) => {
  const result = await searchApi.searchCommunities({ keyword });
  console.log('社区结果', result.list);
};
```

---

## 搜索结果类型说明

### 商品类型 (product)

```typescript
{
  id: string;           // 商品ID
  type: 'product';
  title: string;        // 商品标题
  cover: string;        // 商品封面
  price: number;        // 价格（分）
  originalPrice?: number; // 原价
  condition: string;    // 成色
  sellerType: 'personal' | 'merchant'; // 卖家类型
  sellerName: string;   // 卖家名称
  tags?: string[];      // 标签
}
```

### 型号类型 (model)

```typescript
{
  id: string;           // 型号ID
  type: 'model';
  title: string;        // 型号名称
  subtitle: string;     // 品牌名
  cover: string;        // 型号封面
  productCount: number; // 在售商品数
  tags?: string[];      // 标签
}
```

### 社区类型 (community)

```typescript
{
  id: string;           // 社区ID
  type: 'community';
  title: string;        // 社区名称
  cover: string;        // 社区封面
  memberCount: number;  // 成员数
  postCount: number;    // 帖子数
}
```

---

## 搜索历史（本地存储）

搜索历史由前端本地管理，无需服务端接口。

```typescript
// 存储到本地
const saveSearchHistory = (keyword: string) => {
  const history = uni.getStorageSync('search_history') || [];
  const newHistory = [
    { keyword, time: Date.now() },
    ...history.filter(h => h.keyword !== keyword)
  ].slice(0, 20);
  uni.setStorageSync('search_history', newHistory);
};

// 读取本地历史
const getSearchHistory = () => {
  return uni.getStorageSync('search_history') || [];
};

// 清空历史
const clearSearchHistory = () => {
  uni.removeStorageSync('search_history');
};
```

---

## 注意事项

1. **混合搜索**: 默认返回所有类型结果，可通过 `type` 参数筛选
2. **价格单位**: 价格以"分"为单位，前端展示时需转换
3. **高亮显示**: `highlight` 字段包含高亮标记 `<em>` 标签
4. **聚合信息**: `aggregations` 用于展示筛选条件和各类型数量
5. **搜索历史**: 由前端本地管理，无需调用服务端接口
