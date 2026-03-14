import { http } from '@/utils/http';

export type UploadScene = 'avatar' | 'product' | 'post' | 'comment' | 'evaluation' | 'other';

export type UploadType = 'image' | 'video' | 'audio' | 'document' | 'other';

export interface UploadResponse {
  url: string;
  key: string;
  filename: string;
  size: number;
  type: UploadType;
  mimeType: string;
  width?: number;
  height?: number;
  duration?: number;
  thumbnailUrl?: string;
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
  uploadFile: (file: string, scene: UploadScene, options?: Omit<UploadOptions, 'scene'>) => {
    return http<UploadResponse>({
      url: '/upload',
      method: 'POST',
      data: {
        file,
        scene,
        compress: options?.compress,
        maxWidth: options?.maxWidth,
        maxHeight: options?.maxHeight,
        quality: options?.quality
      },
      loading: true
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
      } catch (error: any) {
        failed.push({ file, error: error.msg || '上传失败' });
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
        url: `${http.defaults?.baseURL}/upload/file`,
        filePath: file,
        name: 'file',
        formData: { scene },
        success: (res) => {
          if (res.statusCode === 200) {
            try {
              const data = JSON.parse(res.data);
              if (data.code === 0) {
                resolve(data.data);
              } else {
                reject(new Error(data.msg || '上传失败'));
              }
            } catch {
              reject(new Error('解析响应失败'));
            }
          } else {
            reject(new Error(`上传失败: ${res.statusCode}`));
          }
        },
        fail: (err) => {
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
