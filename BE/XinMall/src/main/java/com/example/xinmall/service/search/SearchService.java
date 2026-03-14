package com.example.xinmall.service.search;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.example.xinmall.dto.search.request.SearchRequest;
import com.example.xinmall.dto.search.response.*;

import java.util.List;

public interface SearchService {

    List<SearchSuggestionVO> getSuggestions(String keyword, Integer limit);

    List<HotSearchVO> getHotSearches(Integer limit);

    SearchResultVO search(SearchRequest request);

    IPage<SearchResultVO.SearchItemVO> searchProducts(SearchRequest request);

    IPage<SearchResultVO.SearchItemVO> searchModels(SearchRequest request);

    IPage<SearchResultVO.SearchItemVO> searchCommunities(SearchRequest request);

    List<HotSearchVO> getHotModels(Integer limit);

    List<HotSearchVO> getHotCommunities(Integer limit);

    List<KeywordVO> getRecommendKeywords(Integer limit);

    SearchAggregationVO getSearchFilters(String keyword);
}
