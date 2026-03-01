import { http } from '@/utils/http';

export interface UploadResponse {
  url: string;
  key: string;
  size: number;
  type: string;
  width?: number;
  height?: number;
}

export const uploadApi = {
  getUploadSignature: (type: 'image' | 'video' | 'audio' | 'file'): Promise<{ signature: string; policy: string; callback: any }> => {
    return http({
      url: '/upload/signature',
      method: 'POST',
      data: { type }
    });
  },

  uploadFile: (file: string, type: 'image' | 'video' | 'audio' | 'file'): Promise<UploadResponse> => {
    return http({
      url: '/upload/file',
      method: 'POST',
      data: { file, type },
      loading: true
    });
  },

  uploadImage: (file: string): Promise<UploadResponse> => {
    return uploadApi.uploadFile(file, 'image');
  },

  uploadAvatar: (file: string): Promise<UploadResponse> => {
    return uploadApi.uploadFile(file, 'image');
  }
};