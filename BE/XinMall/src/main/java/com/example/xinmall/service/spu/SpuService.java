package com.example.xinmall.service.spu;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.example.xinmall.dto.spu.request.SpuProductRequest;
import com.example.xinmall.dto.spu.request.SpuQueryRequest;
import com.example.xinmall.dto.spu.response.*;

import java.util.List;

public interface SpuService {

    SpuDetailVO getDetailById(Long id);

    IPage<SpuListVO> search(SpuQueryRequest request);

    List<SpuListVO> searchByKeyword(String keyword, Integer limit);

    IPage<SpuProductVO> getProducts(Long spuId, Integer page, Integer pageSize);

    IPage<SpuPostVO> getPosts(Long spuId, String type, String sort, Integer page, Integer pageSize);

    IPage<SpuEvaluationVO> getEvaluations(Long spuId, Integer page, Integer pageSize);

    void follow(Long spuId);

    void unfollow(Long spuId);

    List<SpuListVO> getHotSpus(Long deviceTypeId, Integer limit);

    List<SpuPriceTrendVO> getPriceTrend(Long spuId, Integer days);

    List<SpuSpecOptionVO> getSpecOptions(Long spuId);

    List<SpuListVO> getRelatedSpus(Long spuId, Integer limit);

    IPage<SpuListVO> getFollowedSpus(Integer page, Integer pageSize);

    void incrementViewCount(Long id);

    Long getMemberCount(Long spuId);
}
