package com.example.xinmall.service.trade;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.example.xinmall.dto.trade.request.EvaluationRequest;
import com.example.xinmall.dto.trade.response.EvaluationVO;

public interface EvaluationService {

    Long create(EvaluationRequest request);

    IPage<EvaluationVO> getByGoodsId(Long goodsId, Integer page, Integer size);

    IPage<EvaluationVO> getBySellerId(Long sellerId, Integer page, Integer size);

    void reply(Long id, String content);
}
