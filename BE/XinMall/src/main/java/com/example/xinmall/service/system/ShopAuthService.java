package com.example.xinmall.service.system;

import com.example.xinmall.dto.system.request.ShopAuthRequest;
import com.example.xinmall.dto.system.response.ShopAuthVO;

public interface ShopAuthService {

    /**
     * 提交店铺认证申请
     */
    Long submitAuth(ShopAuthRequest request);

    /**
     * 获取当前用户的认证状态
     */
    ShopAuthVO getAuthStatus();
}
