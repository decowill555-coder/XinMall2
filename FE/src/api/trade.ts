import { http } from '@/utils/http';

export interface ProductDetail {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  condition: string;
  warranty: boolean;
  invoice: boolean;
  canBargain: boolean;
  description: string;
  images: string[];
  location: string;
  viewCount: number;
  likeCount: number;
  isCollected: boolean;
  createdAt: string;
  seller: ProductSeller;
  model?: ProductModel;
  stock: number;
  status: 'on_sale' | 'sold' | 'off_sale';
}

export interface ProductSeller {
  id: string;
  name: string;
  avatar: string;
  type: 'personal' | 'merchant';
  levelName?: string;
  signature?: string;
  sellingCount: number;
  followerCount: number;
  rating: number;
  isFollowed: boolean;
}

export interface ProductModel {
  id: string;
  name: string;
  brandId: string;
  brandName: string;
  specs: Record<string, string>;
}

export interface ProductListParams {
  keyword?: string;
  modelId?: string;
  deviceTypeId?: string;
  brandId?: string;
  condition?: string;
  priceMin?: number;
  priceMax?: number;
  sellerType?: 'personal' | 'merchant';
  sort?: 'recommend' | 'new' | 'price' | 'sales';
  priceOrder?: 'asc' | 'desc';
  page?: number;
  size?: number;
}

export interface ProductListItem {
  id: string;
  title: string;
  cover: string;
  price: number;
  originalPrice?: number;
  conditionLevel?: number;
  sellerId?: string;
  sellerName?: string;
  sellerAvatar?: string;
  location?: string;
  viewCount?: number;
  likeCount?: number;
  createdAt?: string;
  sellerType?: 'personal' | 'merchant';
}

export interface ProductListResult {
  list: ProductListItem[];
  total: number;
  hasMore: boolean;
}

export interface CreateOrderParams {
  productId: string;
  quantity: number;
  addressId: string;
  remark?: string;
}

export interface CreateOrderResult {
  orderId: string;
  orderNo: string;
  totalAmount: number;
  freightAmount: number;
  finalAmount: number;
}

export interface OrderDetail {
  id: string;
  orderNo: string;
  status: OrderStatus;
  product: OrderProduct;
  quantity: number;
  totalAmount: number;
  freightAmount: number;
  finalAmount: number;
  address: OrderAddress;
  remark: string;
  paymentMethod?: 'wechat' | 'alipay' | 'balance';
  paymentTime?: string;
  shipTime?: string;
  receiveTime?: string;
  finishTime?: string;
  logistics?: LogisticsInfo;
  evaluation?: EvaluationInfo;
  createdAt: string;
  seller: OrderSeller;
}

export type OrderStatus = 'pending' | 'paid' | 'shipped' | 'completed' | 'cancelled';

export interface OrderProduct {
  id: string;
  cover: string;
  title: string;
  price: number;
  condition: string;
}

export interface OrderAddress {
  id: string;
  name: string;
  phone: string;
  province: string;
  city: string;
  district: string;
  detail: string;
}

export interface OrderSeller {
  id: string;
  name: string;
  avatar: string;
  type: 'personal' | 'merchant';
}

export interface LogisticsInfo {
  company: string;
  trackingNo: string;
  traces: LogisticsTrace[];
}

export interface LogisticsTrace {
  time: string;
  content: string;
}

export interface EvaluationInfo {
  id: string;
  rating: number;
  content: string;
  images: string[];
  createdAt: string;
}

export interface OrderListParams {
  status?: string;
  page?: number;
  size?: number;
}

export interface OrderListItem {
  id: string;
  orderNo: string;
  status: OrderStatus;
  product: OrderProduct;
  quantity: number;
  totalAmount: number;
  seller: OrderSeller;
  createdAt: string;
}

export interface OrderListResult {
  list: OrderListItem[];
  total: number;
  hasMore: boolean;
}

export interface PayOrderParams {
  orderId: string;
  method: 'wechat' | 'alipay' | 'balance';
}

export interface PayOrderResult {
  success: boolean;
  paymentId: string;
  payParams?: any;
}

export interface Address {
  id: string;
  name: string;
  phone: string;
  province: string;
  city: string;
  district: string;
  detail: string;
  isDefault: boolean;
}

export interface CreateEvaluationParams {
  orderId: string;
  rating: number;
  content: string;
  images?: string[];
  tags?: string[];
}

export interface EvaluationDetail {
  id: string;
  orderId: string;
  productId: string;
  productCover: string;
  productTitle: string;
  rating: number;
  content: string;
  images: string[];
  tags: string[];
  sellerReply?: string;
  createdAt: string;
}

export const tradeApi = {
  getProductDetail: (id: string) => {
    return http<ProductDetail>({
      url: `/goods/${id}`,
      method: 'GET'
    });
  },

  getProductList: (params: ProductListParams) => {
    return http<ProductListResult>({
      url: '/goods',
      method: 'GET',
      data: params
    });
  },

  collectProduct: (productId: string) => {
    return http<{ success: boolean; likeCount: number }>({
      url: `/goods/${productId}/collect`,
      method: 'POST'
    });
  },

  uncollectProduct: (productId: string) => {
    return http<{ success: boolean; likeCount: number }>({
      url: `/goods/${productId}/uncollect`,
      method: 'POST'
    });
  },

  createOrder: (params: CreateOrderParams) => {
    return http<CreateOrderResult>({
      url: '/order',
      method: 'POST',
      data: params,
      loading: true
    });
  },

  getOrderList: (params: OrderListParams) => {
    return http<OrderListResult>({
      url: '/order',
      method: 'GET',
      data: params
    });
  },

  getOrderDetail: (orderId: string) => {
    return http<OrderDetail>({
      url: `/order/${orderId}`,
      method: 'GET'
    });
  },

  cancelOrder: (orderId: string) => {
    return http<{ success: boolean }>({
      url: `/order/${orderId}/cancel`,
      method: 'PUT'
    });
  },

  payOrder: (params: PayOrderParams) => {
    return http<PayOrderResult>({
      url: `/order/${params.orderId}/pay`,
      method: 'POST',
      data: { method: params.method },
      loading: true
    });
  },

  confirmReceive: (orderId: string) => {
    return http<{ success: boolean }>({
      url: `/order/${orderId}/receive`,
      method: 'PUT'
    });
  },

  getLogistics: (orderId: string) => {
    return http<LogisticsInfo>({
      url: `/order/${orderId}/logistics`,
      method: 'GET'
    });
  },

  getAddressList: () => {
    return http<Address[]>({
      url: '/user/address',
      method: 'GET'
    });
  },

  getAddressDetail: (id: string) => {
    return http<Address>({
      url: `/user/address/${id}`,
      method: 'GET'
    });
  },

  createAddress: (data: Omit<Address, 'id' | 'isDefault'>) => {
    return http<Address>({
      url: '/user/address',
      method: 'POST',
      data
    });
  },

  updateAddress: (id: string, data: Partial<Address>) => {
    return http<Address>({
      url: `/user/address/${id}`,
      method: 'PUT',
      data
    });
  },

  deleteAddress: (id: string) => {
    return http<{ success: boolean }>({
      url: `/user/address/${id}`,
      method: 'DELETE'
    });
  },

  setDefaultAddress: (id: string) => {
    return http<{ success: boolean }>({
      url: `/user/address/${id}/default`,
      method: 'PUT'
    });
  },

  createEvaluation: (params: CreateEvaluationParams) => {
    return http<{ id: string }>({
      url: '/evaluation',
      method: 'POST',
      data: params,
      loading: true
    });
  },

  getEvaluation: (orderId: string) => {
    return http<EvaluationDetail>({
      url: `/evaluation/order/${orderId}`,
      method: 'GET'
    });
  },

  getProductEvaluations: (productId: string, page?: number, size?: number) => {
    return http<{ records: EvaluationDetail[]; total: number; size: number; current: number; pages: number }>({
      url: `/evaluation/goods/${productId}`,
      method: 'GET',
      data: { page, size }
    });
  }
};
