package com.example.xinmall.controller.search;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.example.xinmall.common.result.Result;
import com.example.xinmall.dto.search.request.SearchRequest;
import com.example.xinmall.dto.search.response.*;
import com.example.xinmall.service.search.SearchService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "搜索接口", description = "搜索相关接口")
@RestController
@RequestMapping("/api/search")
@RequiredArgsConstructor
public class SearchController {

    private final SearchService searchService;

    @Operation(summary = "搜索建议")
    @GetMapping("/suggestions")
    public Result<List<SearchSuggestionVO>> getSuggestions(
            @RequestParam String keyword,
            @RequestParam(required = false) Integer limit) {
        List<SearchSuggestionVO> result = searchService.getSuggestions(keyword, limit);
        return Result.success(result);
    }

    @Operation(summary = "热门搜索")
    @GetMapping("/hot")
    public Result<List<HotSearchVO>> getHotSearches(@RequestParam(required = false) Integer limit) {
        List<HotSearchVO> result = searchService.getHotSearches(limit);
        return Result.success(result);
    }

    @Operation(summary = "综合搜索")
    @GetMapping
    public Result<SearchResultVO> search(SearchRequest request) {
        SearchResultVO result = searchService.search(request);
        return Result.success(result);
    }

    @Operation(summary = "商品搜索")
    @GetMapping("/products")
    public Result<IPage<SearchResultVO.SearchItemVO>> searchProducts(SearchRequest request) {
        request.setType("product");
        IPage<SearchResultVO.SearchItemVO> result = searchService.searchProducts(request);
        return Result.success(result);
    }

    @Operation(summary = "型号搜索")
    @GetMapping("/models")
    public Result<IPage<SearchResultVO.SearchItemVO>> searchModels(SearchRequest request) {
        request.setType("model");
        IPage<SearchResultVO.SearchItemVO> result = searchService.searchModels(request);
        return Result.success(result);
    }

    @Operation(summary = "社区搜索")
    @GetMapping("/communities")
    public Result<IPage<SearchResultVO.SearchItemVO>> searchCommunities(SearchRequest request) {
        request.setType("community");
        IPage<SearchResultVO.SearchItemVO> result = searchService.searchCommunities(request);
        return Result.success(result);
    }

    @Operation(summary = "热门型号")
    @GetMapping("/hot-models")
    public Result<List<HotSearchVO>> getHotModels(@RequestParam(required = false) Integer limit) {
        List<HotSearchVO> result = searchService.getHotModels(limit);
        return Result.success(result);
    }

    @Operation(summary = "热门社区")
    @GetMapping("/hot-communities")
    public Result<List<HotSearchVO>> getHotCommunities(@RequestParam(required = false) Integer limit) {
        List<HotSearchVO> result = searchService.getHotCommunities(limit);
        return Result.success(result);
    }

    @Operation(summary = "推荐关键词")
    @GetMapping("/recommend-keywords")
    public Result<List<KeywordVO>> getRecommendKeywords(@RequestParam(required = false) Integer limit) {
        List<KeywordVO> result = searchService.getRecommendKeywords(limit);
        return Result.success(result);
    }

    @Operation(summary = "搜索筛选器")
    @GetMapping("/filters")
    public Result<SearchAggregationVO> getSearchFilters(@RequestParam String keyword) {
        SearchAggregationVO result = searchService.getSearchFilters(keyword);
        return Result.success(result);
    }
}
