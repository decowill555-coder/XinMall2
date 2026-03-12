package com.example.xinmall.service.trade;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.example.xinmall.dto.trade.request.GoodsPublishRequest;
import com.example.xinmall.dto.trade.request.GoodsQueryRequest;
import com.example.xinmall.dto.trade.response.GoodsDetailVO;
import com.example.xinmall.dto.trade.response.GoodsVO;
import com.example.xinmall.entity.trade.Goods;

public interface GoodsService {

    Long publish(GoodsPublishRequest request);

    Page<GoodsVO> search(GoodsQueryRequest request);

    GoodsDetailVO getDetailById(Long id);

    void update(Long id, GoodsPublishRequest request);

    void offShelf(Long id);

    void onShelf(Long id);

    Page<GoodsVO> getMyGoods(Integer page, Integer size);

    void incrementViewCount(Long id);

    void incrementLikeCount(Long id);

    void decrementLikeCount(Long id);

    Goods getById(Long id);
}
