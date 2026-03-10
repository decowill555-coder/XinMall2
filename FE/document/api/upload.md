# 上传模块 API 文档

## 概述

上传模块提供文件上传、批量上传、图片选择等功能，支持图片、视频、文档等多种文件类型。

**基础路径**: `/upload`

**核心概念**:
- **上传场景**: 区分不同业务场景的上传，如头像、商品、帖子等
- **文件类型**: 图片、视频、音频、文档等
- **批量上传**: 最多支持 20 个文件同时上传

---

## 配置说明

### 文件限制

| 配置项 | 值 |
|--------|-----|
| 单文件最大大小 | 256MB |
| 批量上传最大数量 | 20 个 |

### 支持的文件类型

| 类型 | 扩展名 |
|------|--------|
| 图片 | jpg, jpeg, png, gif, webp, bmp, heic, heif |
| 视频 | mp4, mov, avi, mkv, webm, flv |
| 音频 | mp3, wav, aac, flac, m4a |
| 文档 | pdf, doc, docx, xls, xlsx, ppt, pptx, txt, zip, rar |

### 上传场景

| 场景 | 说明 |
|------|------|
| avatar | 用户头像 |
| product | 商品图片 |
| post | 帖子图片 |
| comment | 评论图片 |
| evaluation | 评价图片 |
| other | 其他 |

---

## 接口列表

| 接口 | 方法 | 路径 | 说明 |
|------|------|------|------|
| 上传文件 | POST | `/upload/file` | 单文件上传 |
| 获取上传配置 | GET | `/upload/config` | 获取上传限制配置 |
| 删除文件 | DELETE | `/upload/file/{key}` | 删除已上传文件 |

---

## 详细接口说明

### 1. 上传文件

**接口路径**: `POST /upload/file`

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| file | string | 是 | 文件内容（Base64或文件路径） |
| scene | string | 是 | 上传场景: avatar/product/post/comment/evaluation/other |
| compress | boolean | 否 | 是否压缩（预留） |
| maxWidth | number | 否 | 最大宽度（预留） |
| maxHeight | number | 否 | 最大高度（预留） |
| quality | number | 否 | 压缩质量（预留） |

**响应参数**:

| 参数名 | 类型 | 说明 |
|--------|------|------|
| url | string | 文件访问URL |
| key | string | 文件唯一标识 |
| filename | string | 文件名 |
| size | number | 文件大小（字节） |
| type | string | 文件类型: image/video/audio/document/other |
| mimeType | string | MIME类型 |
| width | number | 图片宽度（图片时） |
| height | number | 图片高度（图片时） |
| duration | number | 时长（音视频时，秒） |
| thumbnailUrl | string | 缩略图URL（视频时） |

**响应示例**:
```json
{
  "code": 0,
  "msg": "success",
  "data": {
    "url": "https://cdn.xinmall.com/uploads/2024/01/15/abc123.jpg",
    "key": "uploads/2024/01/15/abc123.jpg",
    "filename": "image.jpg",
    "size": 102400,
    "type": "image",
    "mimeType": "image/jpeg",
    "width": 1920,
    "height": 1080
  }
}
```

---

### 2. 获取上传配置

**接口路径**: `GET /upload/config`

**响应示例**:
```json
{
  "code": 0,
  "msg": "success",
  "data": {
    "maxSize": 268435456,
    "maxCount": 20,
    "allowedTypes": ["jpg", "jpeg", "png", "gif", "webp", "mp4", "pdf"],
    "imageTypes": ["jpg", "jpeg", "png", "gif", "webp", "bmp", "heic", "heif"],
    "videoTypes": ["mp4", "mov", "avi", "mkv", "webm", "flv"],
    "documentTypes": ["pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx", "txt", "zip", "rar"]
  }
}
```

---

### 3. 删除文件

**接口路径**: `DELETE /upload/file/{key}`

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

## 前端调用示例

### 单文件上传

```typescript
import { uploadApi } from '@/api';

// 上传头像
const uploadAvatar = async (filePath: string) => {
  try {
    const result = await uploadApi.uploadAvatar(filePath);
    console.log('头像上传成功', result.url);
    return result;
  } catch (error) {
    console.error('头像上传失败', error);
  }
};

// 上传商品图片
const uploadProductImage = async (filePath: string) => {
  const result = await uploadApi.uploadProductImage(filePath);
  return result.url;
};

// 上传帖子图片
const uploadPostImage = async (filePath: string) => {
  const result = await uploadApi.uploadPostImage(filePath);
  return result.url;
};
```

### 批量上传

```typescript
import { uploadApi } from '@/api';

// 批量上传图片
const batchUploadImages = async (filePaths: string[], scene: UploadScene) => {
  const result = await uploadApi.batchUpload(filePaths, scene);
  
  console.log('上传成功', result.success.length, '张');
  console.log('上传失败', result.failed.length, '张');
  
  // 获取成功上传的URL列表
  const urls = result.success.map(item => item.url);
  return urls;
};

// 选择并上传图片
const chooseAndUpload = async (count: number, scene: UploadScene) => {
  const result = await uploadApi.chooseAndUploadImages(count, scene);
  return result.success.map(item => item.url);
};
```

### 带进度上传

```typescript
import { uploadApi } from '@/api';

// 带进度的上传
const uploadWithProgress = async (filePath: string, scene: UploadScene) => {
  const result = await uploadApi.uploadWithProgress(
    filePath,
    scene,
    (progress) => {
      console.log(`上传进度: ${progress.percent}%`);
      console.log(`已上传: ${progress.loaded} / ${progress.total} bytes`);
    }
  );
  return result;
};
```

### 选择文件

```typescript
import { uploadApi } from '@/api';

// 选择图片
const chooseImages = async () => {
  const filePaths = await uploadApi.chooseImage(9); // 最多选择9张
  console.log('选择的图片', filePaths);
  return filePaths;
};

// 选择视频
const chooseVideo = async () => {
  const video = await uploadApi.chooseVideo();
  console.log('选择的视频', video.tempFilePath);
  console.log('视频时长', video.duration, '秒');
  return video;
};
```

### 图片压缩（预留）

```typescript
import { uploadApi } from '@/api';

// 压缩图片
const compressAndUpload = async (filePath: string, scene: UploadScene) => {
  // 先压缩
  const compressedPath = await uploadApi.compressImage(filePath, 80);
  // 再上传
  const result = await uploadApi.uploadFile(compressedPath, scene);
  return result;
};
```

### 文件校验

```typescript
import { 
  uploadApi, 
  UPLOAD_CONFIG, 
  isValidFileSize, 
  isValidImageType,
  getFileType 
} from '@/api/upload';

// 校验文件
const validateFile = (filename: string, size: number) => {
  // 校验文件大小
  if (!isValidFileSize(size)) {
    uni.showToast({ title: '文件大小不能超过256MB', icon: 'none' });
    return false;
  }
  
  // 校验图片类型
  if (!isValidImageType(filename)) {
    uni.showToast({ title: '不支持的图片格式', icon: 'none' });
    return false;
  }
  
  return true;
};

// 获取文件类型
const type = getFileType('image.jpg'); // 'image'
```

---

## 完整示例：发布商品

```typescript
import { uploadApi } from '@/api';

const publishProduct = async () => {
  // 1. 选择图片
  const filePaths = await uploadApi.chooseImage(9);
  
  // 2. 显示上传进度
  uni.showLoading({ title: '上传中...' });
  
  // 3. 批量上传
  const result = await uploadApi.batchUpload(filePaths, 'product');
  
  uni.hideLoading();
  
  if (result.failed.length > 0) {
    uni.showToast({ 
      title: `${result.failed.length}张图片上传失败`, 
      icon: 'none' 
    });
  }
  
  // 4. 获取图片URL列表
  const imageUrls = result.success.map(item => item.url);
  
  // 5. 提交商品信息
  // await tradeApi.createProduct({ images: imageUrls, ... })
  
  console.log('商品图片', imageUrls);
};
```

---

## 完整示例：发布帖子

```typescript
import { uploadApi } from '@/api';

const publishPost = async () => {
  // 1. 选择图片
  const filePaths = await uploadApi.chooseImage(9);
  
  // 2. 批量上传
  const result = await uploadApi.batchUpload(filePaths, 'post');
  
  // 3. 获取图片URL列表
  const imageUrls = result.success.map(item => item.url);
  
  // 4. 提交帖子
  // await forumApi.createPost({ images: imageUrls, ... })
  
  console.log('帖子图片', imageUrls);
};
```

---

## 注意事项

1. **文件大小**: 单个文件最大 256MB
2. **批量上传**: 最多 20 个文件，串行上传
3. **上传场景**: 不同场景可能有不同的处理逻辑（如头像裁剪）
4. **图片压缩**: 预留接口，默认不压缩
5. **进度回调**: 使用 `uploadWithProgress` 可获取上传进度
6. **错误处理**: 批量上传返回成功和失败列表，需分别处理
