package com.example.xinmall.service.trade;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.example.xinmall.dto.trade.request.EvaluationRequest;
import com.example.xinmall.dto.trade.response.EvaluationVO;

public interface EvaluationService {

    Long create(EvaluationRequest request);

    Page<EvaluationVO> getByGoodsId(Long goodsId, Integer page, Integer size);

    Page<EvaluationVO> getBySellerId(Long sellerId, Integer page, Integer size);

    void reply(Long id, String content);
}
