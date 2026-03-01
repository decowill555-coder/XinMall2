import { http } from '@/utils/http';

export interface CartItem {
  id: string;
  spuId: string;
  skuId: string;
  name: string;
  cover: string;
  price: number;
  originalPrice: number;
  quantity: number;
  maxQuantity: number;
  attributes: { name: string; value: string }[];
  isSelected: boolean;
}

export interface CreateOrderRequest {
  skuId: string;
  quantity: number;
  addressId: string;
  couponId?: string;
  giftCardId?: string;
  note?: string;
}

export interface OrderItem {
  id: string;
  orderNo: string;
  spuId: string;
  skuId: string;
  name: string;
  cover: string;
  price: number;
  originalPrice: number;
  quantity: number;
  attributes: { name: string; value: string }[];
  totalAmount: number;
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'completed' | 'cancelled' | 'refunded';
  createdAt: string;
  updatedAt: string;
}

export interface OrderSummary {
  totalAmount: number;
  freightAmount: number;
  couponAmount: number;
  giftCardAmount: number;
  discountAmount: number;
  finalAmount: number;
  items: OrderItem[];
}

export interface Address {
  id: string;
  receiverName: string;
  receiverPhone: string;
  province: string;
  city: string;
  district: string;
  detailAddress: string;
  isDefault: boolean;
  zipCode?: string;
}

export const tradeApi = {
  getCartList: (): Promise<CartItem[]> => {
    return http({
      url: '/trade/cart',
      method: 'GET'
    });
  },

  addToCart: (spuId: string, skuId: string, quantity: number): Promise<CartItem[]> => {
    return http({
      url: '/trade/cart',
      method: 'POST',
      data: { spuId, skuId, quantity },
      loading: true
    });
  },

  updateCartQuantity: (itemId: string, quantity: number): Promise<CartItem[]> => {
    return http({
      url: `/trade/cart/${itemId}`,
      method: 'PUT',
      data: { quantity }
    });
  },

  deleteCartItems: (ids: string[]): Promise<CartItem[]> => {
    return http({
      url: '/trade/cart',
      method: 'DELETE',
      data: { ids }
    });
  },

  selectCartItems: (ids: string[], selected: boolean): Promise<CartItem[]> => {
    return http({
      url: '/trade/cart/select',
      method: 'POST',
      data: { ids, selected }
    });
  },

  calculateOrder: (skuId: string, quantity: number, addressId?: string, couponId?: string): Promise<OrderSummary> => {
    return http({
      url: '/trade/calculate',
      method: 'POST',
      data: { skuId, quantity, addressId, couponId }
    });
  },

  createOrder: (data: CreateOrderRequest): Promise<{ orderNo: string; finalAmount: number }> => {
    return http({
      url: '/trade/order',
      method: 'POST',
      data,
      loading: true
    });
  },

  getOrderList: (params: { status?: string; page: number; pageSize: number }): Promise<{ list: OrderItem[]; total: number }> => {
    return http({
      url: '/trade/order',
      method: 'GET',
      data: params
    });
  },

  getOrderDetail: (orderNo: string): Promise<OrderSummary> => {
    return http({
      url: `/trade/order/${orderNo}`,
      method: 'GET'
    });
  },

  cancelOrder: (orderNo: string): Promise<{ success: boolean }> => {
    return http({
      url: `/trade/order/${orderNo}/cancel`,
      method: 'POST'
    });
  },

  payOrder: (orderNo: string, method: 'wechat' | 'alipay' | 'balance'): Promise<{ payParams: any }> => {
    return http({
      url: `/trade/order/${orderNo}/pay`,
      method: 'POST',
      data: { method }
    });
  },

  getAddressList: (): Promise<Address[]> => {
    return http({
      url: '/trade/address',
      method: 'GET'
    });
  },

  createAddress: (data: Omit<Address, 'id' | 'isDefault'>): Promise<Address> => {
    return http({
      url: '/trade/address',
      method: 'POST',
      data
    });
  },

  updateAddress: (id: string, data: Partial<Address>): Promise<Address> => {
    return http({
      url: `/trade/address/${id}`,
      method: 'PUT',
      data
    });
  },

  deleteAddress: (id: string): Promise<{ success: boolean }> => {
    return http({
      url: `/trade/address/${id}`,
      method: 'DELETE'
    });
  },

  setDefaultAddress: (id: string): Promise<Address> => {
    return http({
      url: `/trade/address/${id}/default`,
      method: 'POST'
    });
  }
};