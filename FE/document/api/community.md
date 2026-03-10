# 社区模块 API 文档

## 概述

社区模块（论坛）提供社区管理、帖子发布、评论互动等功能。

**基础路径**: `/community`

**核心概念**:
- **社区（论坛）**: 讨论交流的场所，分为型号社区（官方）和用户社区（非官方）
- **帖子**: 社区内的讨论内容，支持标签、置顶、加精
- **评论**: 对帖子的回复，支持楼中楼

---

## 数据模型

### 社区类型

| 类型 | 说明 | 创建方式 |
|------|------|----------|
| 型号社区 | 以产品型号命名，如"iPhone 15 Pro Max" | 投票创建（预留） |
| 用户社区 | 用户自定义名称 | 用户申请 + 审核（预留） |

### 标签系统

```
帖子标签 → 匹配社区名 → 帖子出现在该社区

示例：
帖子标签包含 "iPhone 15 Pro Max" → 该帖子出现在 "iPhone 15 Pro Max" 社区
```

### 用户与社区关系

| 状态 | 权限 |
|------|------|
| 未加入 | 可发帖、可评论 |
| 已加入（关注） | 消息推送 + 等级系统 |

---

## 接口列表

### 社区相关

| 接口 | 方法 | 路径 | 说明 |
|------|------|------|------|
| 获取社区列表 | GET | `/community/list` | 分页获取社区列表 |
| 获取社区详情 | GET | `/community/{id}` | 获取单个社区详情 |
| 按名称查询社区 | GET | `/community/by-name` | 按名称查询社区 |
| 创建社区 | POST | `/community/create` | 创建用户社区（需审核） |
| 加入社区 | POST | `/community/{id}/join` | 关注社区 |
| 退出社区 | POST | `/community/{id}/leave` | 取消关注 |
| 获取已加入社区 | GET | `/community/joined` | 获取我关注的社区 |
| 获取用户社区等级 | GET | `/community/{id}/level` | 获取用户在该社区的等级 |

### 帖子相关

| 接口 | 方法 | 路径 | 说明 |
|------|------|------|------|
| 获取帖子列表 | GET | `/community/posts` | 分页获取帖子 |
| 获取帖子详情 | GET | `/community/post/{id}` | 获取单个帖子详情 |
| 发布帖子 | POST | `/community/post/create` | 发布新帖子 |
| 删除帖子 | DELETE | `/community/post/{id}` | 删除帖子 |
| 点赞帖子 | POST | `/community/post/{id}/like` | 点赞 |
| 取消点赞 | POST | `/community/post/{id}/unlike` | 取消点赞 |
| 收藏帖子 | POST | `/community/post/{id}/collect` | 收藏 |
| 取消收藏 | POST | `/community/post/{id}/uncollect` | 取消收藏 |
| 置顶帖子 | POST | `/community/post/{id}/pin` | 管理员置顶 |
| 取消置顶 | POST | `/community/post/{id}/unpin` | 取消置顶 |
| 设为精华 | POST | `/community/post/{id}/essence` | 管理员加精 |
| 取消精华 | POST | `/community/post/{id}/unessence` | 取消加精 |

### 评论相关

| 接口 | 方法 | 路径 | 说明 |
|------|------|------|------|
| 获取评论列表 | GET | `/community/post/{id}/comments` | 获取帖子评论 |
| 获取回复列表 | GET | `/community/comment/{id}/replies` | 获取楼中楼回复 |
| 发表评论 | POST | `/community/comment/create` | 发表评论/回复 |
| 删除评论 | DELETE | `/community/comment/{id}` | 删除评论 |
| 点赞评论 | POST | `/community/comment/{id}/like` | 点赞评论 |
| 取消点赞 | POST | `/community/comment/{id}/unlike` | 取消点赞 |

### 其他

| 接口 | 方法 | 路径 | 说明 |
|------|------|------|------|
| 获取热门标签 | GET | `/community/tags/hot` | 获取热门标签 |
| 搜索帖子 | GET | `/community/posts/search` | 按关键词搜索帖子 |

---

## 详细接口说明

### 1. 获取社区列表

**接口路径**: `GET /community/list`

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| type | string | 否 | 社区类型: `model`/`user` |
| keyword | string | 否 | 搜索关键词 |
| sort | string | 否 | 排序: `hot`/`new`/`member` |
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
        "id": "f_001",
        "name": "iPhone 15 Pro Max",
        "type": "model",
        "cover": "https://cdn.xinmall.com/forum/iphone15pm.png",
        "description": "iPhone 15 Pro Max 交流社区",
        "memberCount": 12580,
        "postCount": 8960,
        "isOfficial": true,
        "isJoined": true
      }
    ],
    "total": 156,
    "hasMore": true
  }
}
```

---

### 2. 获取社区详情

**接口路径**: `GET /community/{id}`

**响应参数**:

| 参数名 | 类型 | 说明 |
|--------|------|------|
| id | string | 社区ID |
| name | string | 社区名称 |
| type | string | 类型: `model`/`user` |
| description | string | 描述 |
| cover | string | 封面图 |
| memberCount | number | 成员数 |
| postCount | number | 帖子数 |
| isOfficial | boolean | 是否官方社区 |
| isJoined | boolean | 是否已加入 |
| isAdmin | boolean | 是否管理员 |
| modelId | string | 关联型号ID（型号社区） |
| modelName | string | 关联型号名称 |
| creatorId | string | 创建者ID（用户社区） |
| creatorName | string | 创建者名称 |
| createdAt | string | 创建时间 |

---

### 3. 创建社区

**接口路径**: `POST /community/create`

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| name | string | 是 | 社区名称 |
| description | string | 是 | 社区描述 |
| cover | string | 否 | 封面图URL |

**响应示例**:
```json
{
  "code": 0,
  "msg": "success",
  "data": {
    "id": "f_new",
    "status": "pending"
  }
}
```

**说明**: 创建后需要审核，`status` 为 `pending` 表示待审核。

---

### 4. 获取帖子列表

**接口路径**: `GET /community/posts`

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| forumId | string | 否 | 社区ID，不传则获取全部 |
| tag | string | 否 | 按标签筛选 |
| type | string | 否 | 类型: `all`/`pinned`/`essence` |
| sort | string | 否 | 排序: `new`/`hot`/`comment` |
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
        "title": "iPhone 15 Pro Max 使用体验分享",
        "content": "入手一周，分享下使用感受...",
        "author": {
          "id": "u_001",
          "name": "数码达人",
          "avatar": "https://cdn.xinmall.com/avatar/u001.png",
          "level": 5,
          "levelName": "资深玩家"
        },
        "images": [
          "https://cdn.xinmall.com/post/img1.png"
        ],
        "tags": ["iPhone 15 Pro Max", "体验分享"],
        "likeCount": 256,
        "commentCount": 48,
        "collectCount": 32,
        "isLiked": false,
        "isCollected": true,
        "isPinned": false,
        "isEssence": true,
        "createdAt": "2024-01-15 10:30:00",
        "forumId": "f_001",
        "forumName": "iPhone 15 Pro Max"
      }
    ],
    "total": 896,
    "hasMore": true
  }
}
```

---

### 5. 发布帖子

**接口路径**: `POST /community/post/create`

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| title | string | 是 | 帖子标题 |
| content | string | 是 | 帖子内容 |
| images | string[] | 否 | 图片列表 |
| tags | string[] | 否 | 标签列表 |
| forumId | string | 否 | 指定社区ID |

**说明**: 
- 标签如果匹配社区名称，帖子会自动出现在该社区
- 不指定 `forumId` 时，帖子根据标签自动分配到对应社区

---

### 6. 获取评论列表

**接口路径**: `GET /community/post/{postId}/comments`

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| postId | string | 是 | 帖子ID（路径参数） |
| sort | string | 否 | 排序: `new`/`hot` |
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
        "id": "c_001",
        "content": "写得很好，学习了！",
        "images": [],
        "author": {
          "id": "u_002",
          "name": "小明",
          "avatar": "https://cdn.xinmall.com/avatar/u002.png"
        },
        "likeCount": 12,
        "isLiked": false,
        "replyCount": 3,
        "createdAt": "2024-01-15 11:00:00"
      }
    ],
    "total": 48,
    "hasMore": true
  }
}
```

---

### 7. 获取回复列表（楼中楼）

**接口路径**: `GET /community/comment/{commentId}/replies`

**响应示例**:
```json
{
  "code": 0,
  "msg": "success",
  "data": {
    "list": [
      {
        "id": "c_002",
        "content": "谢谢支持！",
        "images": [],
        "author": {
          "id": "u_001",
          "name": "数码达人",
          "avatar": "https://cdn.xinmall.com/avatar/u001.png"
        },
        "likeCount": 5,
        "isLiked": false,
        "replyTo": {
          "id": "c_001",
          "authorName": "小明",
          "content": "写得很好，学习了！"
        },
        "createdAt": "2024-01-15 11:05:00"
      }
    ],
    "total": 3,
    "hasMore": false
  }
}
```

---

### 8. 发表评论

**接口路径**: `POST /community/comment/create`

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| postId | string | 是 | 帖子ID |
| content | string | 是 | 评论内容 |
| images | string[] | 否 | 图片列表 |
| replyToId | string | 否 | 回复的评论ID（楼中楼） |

**说明**: 
- `replyToId` 为空时是直接评论帖子
- `replyToId` 有值时是回复某条评论（楼中楼）

---

### 9. 获取用户社区等级

**接口路径**: `GET /community/{forumId}/level`

**响应示例**:
```json
{
  "code": 0,
  "msg": "success",
  "data": {
    "forumId": "f_001",
    "forumName": "iPhone 15 Pro Max",
    "level": 5,
    "levelName": "资深玩家",
    "exp": 2580,
    "nextLevelExp": 3000,
    "postCount": 12,
    "commentCount": 86,
    "joinTime": "2023-06-15 10:00:00"
  }
}
```

---

## 前端调用示例

```typescript
import { forumApi } from '@/api';

// 获取社区列表 GET /community/list
const fetchForums = async () => {
  const result = await forumApi.getForumList({
    type: 'model',
    sort: 'hot',
    page: 1
  });
  console.log('社区列表', result.list);
};

// 获取社区详情 GET /community/{id}
const fetchForumDetail = async (id: string) => {
  const detail = await forumApi.getForumDetail(id);
  console.log('社区详情', detail);
  console.log('是否已加入', detail.isJoined);
  console.log('是否管理员', detail.isAdmin);
};

// 加入/退出社区 POST /community/{id}/join | POST /community/{id}/leave
const toggleJoin = async (forumId: string, isJoined: boolean) => {
  if (isJoined) {
    await forumApi.leaveForum(forumId);
  } else {
    await forumApi.joinForum(forumId);
  }
};

// 获取帖子列表 GET /community/posts
const fetchPosts = async (forumId: string) => {
  const result = await forumApi.getPosts({
    forumId,
    type: 'all',
    sort: 'new'
  });
  console.log('帖子列表', result.list);
};

// 发布帖子 POST /community/post/create
const createPost = async () => {
  const result = await forumApi.createPost({
    title: '分享我的使用体验',
    content: '入手一周，感觉很不错...',
    images: ['https://...'],
    tags: ['iPhone 15 Pro Max', '体验分享']
  });
  console.log('帖子ID', result.id);
};

// 点赞帖子 POST /community/post/{id}/like
const likePost = async (postId: string) => {
  const result = await forumApi.likePost(postId);
  console.log('点赞成功，当前点赞数', result.likeCount);
};

// 获取评论 GET /community/post/{id}/comments
const fetchComments = async (postId: string) => {
  const result = await forumApi.getComments({
    postId,
    sort: 'hot'
  });
  console.log('评论列表', result.list);
};

// 发表评论（楼中楼） POST /community/comment/create
const replyComment = async (postId: string, commentId: string, content: string) => {
  await forumApi.createComment({
    postId,
    content,
    replyToId: commentId
  });
};

// 管理员置顶帖子 POST /community/post/{id}/pin
const pinPost = async (postId: string, forumId: string) => {
  await forumApi.pinPost(postId, forumId);
};
```

---

## 社区导航结构

```
社区详情页
├── 全部帖子
├── 置顶帖子（pinned）
├── 精华帖子（essence）
└── 热门标签
```

---

## 等级系统

| 等级 | 名称 | 所需经验 |
|------|------|----------|
| 1 | 新手上路 | 0 |
| 2 | 初级玩家 | 100 |
| 3 | 中级玩家 | 500 |
| 4 | 高级玩家 | 1500 |
| 5 | 资深玩家 | 3000 |
| 6 | 大神玩家 | 6000 |
| 7 | 传奇玩家 | 12000 |

**经验获取**:
- 发帖: +20 经验
- 评论: +5 经验
- 被点赞: +2 经验
- 被收藏: +5 经验

---

## 注意事项

1. **标签与社区关联**: 帖子标签匹配社区名称时，帖子会自动出现在该社区
2. **加入社区**: 加入（关注）社区不影响发帖和评论权限，主要影响消息推送和等级系统
3. **管理员权限**: 置顶、加精操作需要管理员权限
4. **审核机制**: 用户创建社区需要审核，接口返回 `status: 'pending'`
