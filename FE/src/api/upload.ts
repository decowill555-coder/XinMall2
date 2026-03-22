import { http } from '@/utils/http';
import { BASE_URL } from '@/utils/http';
import { apiLogger } from '@/utils/logger';

const DEBUG = process.env.NODE_ENV !== 'production';

export type UploadScene = 'avatar' | 'product' | 'post' | 'comment' | 'evaluation' | 'other';

export type UploadType = 'image' | 'video' | 'audio' | 'document' | 'other';

export interface UploadResponse {
  id: number;
  fileKey: string;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  mimeType: string;
  width?: number;
  height?: number;
  scene?: string;
  createdAt?: string;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percent: number;
}

export interface UploadOptions {
  scene: UploadScene;
  onProgress?: (progress: UploadProgress) => void;
  compress?: boolean;
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
}

export interface BatchUploadResult {
  success: UploadResponse[];
  failed: { file: string; error: string }[];
}

export const uploadApi = {
  uploadFile: (file: string, scene: UploadScene, options?: Omit<UploadOptions, 'scene'>): Promise<UploadResponse> => {
    return new Promise((resolve, reject) => {
      const token = uni.getStorageSync('token');
      const uploadUrl = `${BASE_URL}/upload`;

      if (DEBUG) {
        apiLogger.log('[Upload] 开始上传', scene, uploadUrl, file);
      }

      uni.uploadFile({
        url: uploadUrl,
        filePath: file,
        name: 'file',
        formData: { scene },
        header: {
          Authorization: token ? `Bearer ${token}` : ''
        },
        success: (res) => {
          if (DEBUG) {
            apiLogger.log('[Upload] 响应', res.statusCode, res.data);
          }
          if (res.statusCode === 200) {
            try {
              const data = JSON.parse(res.data);
              if (data.code === 200) {
                if (DEBUG) {
                  apiLogger.log('[Upload] 成功', data.data);
                }
                resolve(data.data);
              } else {
                if (DEBUG) {
                  apiLogger.error('[Upload] 业务错误', data.code, data.message);
                }
                reject(new Error(data.message || '上传失败'));
              }
            } catch (e) {
              if (DEBUG) {
                apiLogger.error('[Upload] 解析失败', e);
              }
              reject(new Error('解析响应失败'));
            }
          } else {
            if (DEBUG) {
              apiLogger.error('[Upload] HTTP错误', res.statusCode);
            }
            reject(new Error(`上传失败: ${res.statusCode}`));
          }
        },
        fail: (err) => {
          if (DEBUG) {
            apiLogger.error('[Upload] 请求失败', err);
          }
          reject(new Error(err.errMsg || '上传失败'));
        }
      });
    });
  },

  uploadImage: (file: string, scene: UploadScene = 'other') => {
    return uploadApi.uploadFile(file, scene);
  },

  uploadAvatar: (file: string) => {
    return uploadApi.uploadFile(file, 'avatar');
  },

  uploadProductImage: (file: string) => {
    return uploadApi.uploadFile(file, 'product');
  },

  uploadPostImage: (file: string) => {
    return uploadApi.uploadFile(file, 'post');
  },

  uploadCommentImage: (file: string) => {
    return uploadApi.uploadFile(file, 'comment');
  },

  uploadEvaluationImage: (file: string) => {
    return uploadApi.uploadFile(file, 'evaluation');
  },

  batchUpload: async (files: string[], scene: UploadScene): Promise<BatchUploadResult> => {
    const success: UploadResponse[] = [];
    const failed: { file: string; error: string }[] = [];

    for (const file of files) {
      try {
        const result = await uploadApi.uploadFile(file, scene);
        success.push(result);
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : '上传失败';
        failed.push({ file, error: errorMessage });
      }
    }

    return { success, failed };
  },

  batchUploadImages: (files: string[], scene: UploadScene = 'other') => {
    return uploadApi.batchUpload(files, scene);
  },

  uploadWithProgress: (
    file: string,
    scene: UploadScene,
    onProgress?: (progress: UploadProgress) => void
  ) => {
    return new Promise<UploadResponse>((resolve, reject) => {
      const uploadTask = uni.uploadFile({
        url: `${BASE_URL}/upload`,
        filePath: file,
        name: 'file',
        formData: { scene },
        header: {
          Authorization: uni.getStorageSync('token') ? `Bearer ${uni.getStorageSync('token')}` : ''
        },
        success: (res) => {
          if (DEBUG) {
            apiLogger.log('[Upload Progress] 响应', res.statusCode, res.data);
          }
          if (res.statusCode === 200) {
            try {
              const data = JSON.parse(res.data);
              if (data.code === 200) {
                resolve(data.data);
              } else {
                reject(new Error(data.message || '上传失败'));
              }
            } catch {
              reject(new Error('解析响应失败'));
            }
          } else {
            reject(new Error(`上传失败: ${res.statusCode}`));
          }
        },
        fail: (err) => {
          if (DEBUG) {
            apiLogger.error('[Upload Progress] 失败', err);
          }
          reject(new Error(err.errMsg || '上传失败'));
        }
      });

      if (onProgress && uploadTask.onProgressUpdate) {
        uploadTask.onProgressUpdate((res) => {
          onProgress({
            loaded: res.totalBytesWritten,
            total: res.totalBytesExpectedToWrite,
            percent: res.progress
          });
        });
      }
    });
  },

  getUploadConfig: () => {
    return http<{
      maxSize: number;
      maxCount: number;
      allowedTypes: string[];
      imageTypes: string[];
      videoTypes: string[];
      documentTypes: string[];
    }>({
      url: '/upload/config',
      method: 'GET'
    });
  },

  deleteFile: (id: string) => {
    return http<{ success: boolean }>({
      url: `/upload/${id}`,
      method: 'DELETE'
    });
  },

  getImageInfo: (url: string) => {
    return new Promise<{ width: number; height: number; type: string }>((resolve, reject) => {
      uni.getImageInfo({
        src: url,
        success: (res) => {
          resolve({
            width: res.width,
            height: res.height,
            type: res.type || 'unknown'
          });
        },
        fail: (err) => {
          reject(new Error(err.errMsg || '获取图片信息失败'));
        }
      });
    });
  },

  compressImage: (
    file: string,
    quality: number = 80
  ): Promise<string> => {
    return new Promise((resolve, reject) => {
      uni.compressImage({
        src: file,
        quality,
        success: (res) => {
          resolve(res.tempFilePath);
        },
        fail: (err) => {
          reject(new Error(err.errMsg || '压缩失败'));
        }
      });
    });
  },

  chooseImage: (count: number = 9, sourceType?: ('album' | 'camera')[]) => {
    return new Promise<string[]>((resolve, reject) => {
      uni.chooseImage({
        count: Math.min(count, 20),
        sizeType: ['original'],
        sourceType: sourceType || ['album', 'camera'],
        success: (res) => {
          resolve(res.tempFilePaths);
        },
        fail: (err) => {
          reject(new Error(err.errMsg || '选择图片失败'));
        }
      });
    });
  },

  chooseVideo: (sourceType?: ('album' | 'camera')[]) => {
    return new Promise<{ tempFilePath: string; duration: number; size: number; width: number; height: number }>((resolve, reject) => {
      uni.chooseVideo({
        sourceType: sourceType || ['album', 'camera'],
        maxDuration: 300,
        success: (res) => {
          resolve({
            tempFilePath: res.tempFilePath,
            duration: res.duration,
            size: res.size,
            width: res.width,
            height: res.height
          });
        },
        fail: (err) => {
          reject(new Error(err.errMsg || '选择视频失败'));
        }
      });
    });
  },

  chooseAndUploadImages: async (count: number, scene: UploadScene): Promise<BatchUploadResult> => {
    const files = await uploadApi.chooseImage(count);
    return uploadApi.batchUpload(files, scene);
  }
};

export const getImageUrl = (relativePath: string | undefined | null): string => {
  if (!relativePath) return '/static/default-avatar.png';
  // 如果已经是完整URL，直接返回
  if (relativePath.startsWith('http://') || relativePath.startsWith('https://')) return relativePath;
  // 如果是/uploads路径，使用当前服务器地址
  if (relativePath.startsWith('/uploads')) {
    // 开发环境使用localhost:8080，生产环境使用相对路径（由nginx代理）
    if (process.env.NODE_ENV === 'production') {
      return relativePath;  // 生产环境直接返回相对路径
    }
    return 'http://localhost:8080' + relativePath;  // 开发环境拼接完整URL
  }
  if (relativePath.startsWith('/static')) return relativePath;
  return relativePath;
};

export const UPLOAD_CONFIG = {
  MAX_SIZE: 256 * 1024 * 1024,
  MAX_COUNT: 20,
  IMAGE_TYPES: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'heic', 'heif'],
  VIDEO_TYPES: ['mp4', 'mov', 'avi', 'mkv', 'webm', 'flv'],
  AUDIO_TYPES: ['mp3', 'wav', 'aac', 'flac', 'm4a'],
  DOCUMENT_TYPES: ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'zip', 'rar']
};

export const isValidFileSize = (size: number): boolean => {
  return size <= UPLOAD_CONFIG.MAX_SIZE;
};

export const isValidImageType = (filename: string): boolean => {
  const ext = filename.split('.').pop()?.toLowerCase() || '';
  return UPLOAD_CONFIG.IMAGE_TYPES.includes(ext);
};

export const isValidVideoType = (filename: string): boolean => {
  const ext = filename.split('.').pop()?.toLowerCase() || '';
  return UPLOAD_CONFIG.VIDEO_TYPES.includes(ext);
};

export const getFileType = (filename: string): UploadType => {
  const ext = filename.split('.').pop()?.toLowerCase() || '';
  if (UPLOAD_CONFIG.IMAGE_TYPES.includes(ext)) return 'image';
  if (UPLOAD_CONFIG.VIDEO_TYPES.includes(ext)) return 'video';
  if (UPLOAD_CONFIG.AUDIO_TYPES.includes(ext)) return 'audio';
  if (UPLOAD_CONFIG.DOCUMENT_TYPES.includes(ext)) return 'document';
  return 'other';
};
