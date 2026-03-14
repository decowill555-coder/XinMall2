package com.example.xinmall.service.system;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.example.xinmall.dto.system.request.ShopCreateRequest;
import com.example.xinmall.dto.system.response.ShopVO;

public interface ShopService {

    Long createShop(ShopCreateRequest request);

    ShopVO getMyShop();

    ShopVO getById(Long id);

    void updateShop(Long id, ShopCreateRequest request);

    void closeShop(Long id);

    void reopenShop(Long id);

    IPage<ShopVO> getShopList(Integer page, Integer size);

    void incrementGoodsCount(Long shopId);

    void decrementGoodsCount(Long shopId);

    void incrementSoldCount(Long shopId, Integer count);

    void incrementFollowerCount(Long shopId);

    void decrementFollowerCount(Long shopId);
}
