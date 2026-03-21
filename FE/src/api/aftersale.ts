import { http } from '@/utils/http';

export type AftersaleStatus = 'pending' | 'processing' | 'waiting_return' | 'completed' | 'rejected' | 'cancelled';
export type AftersaleType = 'refund_only' | 'refund_return' | 'exchange';

export interface AftersaleListItem {
  id: string;
  orderNo: string;
  orderId: string;
  type: AftersaleType;
  reason: string;
  status: AftersaleStatus;
  goodsCover: string;
  goodsTitle: string;
  goodsSpec?: string;
  goodsPrice: number;
  quantity: number;
  refundAmount: number;
  createTime: string;
  updateTime: string;
}

export interface AftersaleDetail extends AftersaleListItem {
  description: string;
  images: string[];
  rejectReason?: string;
  logistics?: {
    company: string;
    trackingNo: string;
    traces: LogisticsTrace[];
  };
  timeline: AftersaleTimelineItem[];
  order: {
    id: string;
    orderNo: string;
    product: {
      id: string;
      cover: string;
      title: string;
      price: number;
      spec?: string;
    };
    quantity: number;
    totalAmount: number;
  };
  seller: {
    id: string;
    name: string;
    avatar: string;
    phone?: string;
  };
}

export interface AftersaleTimelineItem {
  time: string;
  status: string;
  description: string;
  operator?: string;
}

export interface LogisticsTrace {
  time: string;
  content: string;
}

export interface AftersaleListParams {
  status?: AftersaleStatus;
  page?: number;
  size?: number;
}

export interface AftersaleListResult {
  list: AftersaleListItem[];
  total: number;
  hasMore: boolean;
}

export interface CreateAftersaleParams {
  orderId: string;
  type: AftersaleType;
  reason: string;
  description: string;
  images?: string[];
  refundAmount?: number;
}

export interface CreateAftersaleResult {
  id: string;
  status: AftersaleStatus;
}

export interface SubmitLogisticsParams {
  aftersaleId: string;
  company: string;
  trackingNo: string;
}

export interface CancelAftersaleResult {
  success: boolean;
}

export const aftersaleApi = {
  getAftersaleList: (params: AftersaleListParams) => {
    return http<AftersaleListResult>({
      url: '/aftersale',
      method: 'GET',
      data: params
    });
  },

  getAftersaleDetail: (id: string) => {
    return http<AftersaleDetail>({
      url: `/aftersale/${id}`,
      method: 'GET'
    });
  },

  createAftersale: (params: CreateAftersaleParams) => {
    return http<CreateAftersaleResult>({
      url: '/aftersale',
      method: 'POST',
      data: params,
      loading: true
    });
  },

  cancelAftersale: (id: string) => {
    return http<CancelAftersaleResult>({
      url: `/aftersale/${id}/cancel`,
      method: 'PUT'
    });
  },

  submitLogistics: (params: SubmitLogisticsParams) => {
    return http<{ success: boolean }>({
      url: `/aftersale/${params.aftersaleId}/logistics`,
      method: 'POST',
      data: {
        company: params.company,
        trackingNo: params.trackingNo
      }
    });
  },

  getAftersaleReasons: (type: AftersaleType) => {
    return http<string[]>({
      url: '/aftersale/reasons',
      method: 'GET',
      data: { type }
    });
  },

  // 卖家售后列表
  getSellerAftersaleList: (params: AftersaleListParams) => {
    return http<AftersaleListResult>({
      url: '/aftersale/seller',
      method: 'GET',
      data: params
    });
  },

  // 卖家售后数量统计
  getSellerAftersaleCount: () => {
    return http<number>({
      url: '/aftersale/seller/count',
      method: 'GET'
    });
  },

  // 同意售后
  agreeAftersale: (id: string) => {
    return http<{ success: boolean }>({
      url: `/aftersale/${id}/agree`,
      method: 'PUT',
      loading: true
    });
  },

  // 拒绝售后
  rejectAftersale: (id: string, reason: string) => {
    return http<{ success: boolean }>({
      url: `/aftersale/${id}/reject`,
      method: 'PUT',
      data: { reason },
      loading: true
    });
  }
};
