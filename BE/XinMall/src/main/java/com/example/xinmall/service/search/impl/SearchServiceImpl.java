package com.example.xinmall.service.search.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.example.xinmall.dto.search.request.SearchRequest;
import com.example.xinmall.dto.search.response.*;
import com.example.xinmall.entity.community.Community;
import com.example.xinmall.entity.product.ProductModel;
import com.example.xinmall.entity.spu.Spu;
import com.example.xinmall.entity.trade.Goods;
import com.example.xinmall.entity.trade.enums.GoodsStatus;
import com.example.xinmall.mapper.community.CommunityMapper;
import com.example.xinmall.mapper.product.ProductModelMapper;
import com.example.xinmall.mapper.spu.SpuMapper;
import com.example.xinmall.mapper.trade.GoodsMapper;
import com.example.xinmall.service.search.SearchService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class SearchServiceImpl implements SearchService {

    private final SpuMapper spuMapper;
    private final ProductModelMapper productModelMapper;
    private final CommunityMapper communityMapper;
    private final GoodsMapper goodsMapper;

    @Override
    public List<SearchSuggestionVO> getSuggestions(String keyword, Integer limit) {
        List<SearchSuggestionVO> suggestions = new ArrayList<>();
        int actualLimit = limit != null ? limit : 10;

        LambdaQueryWrapper<Spu> spuWrapper = new LambdaQueryWrapper<>();
        spuWrapper.eq(Spu::getStatus, 1)
                .like(Spu::getName, keyword)
                .last("LIMIT " + actualLimit);
        List<Spu> spuList = spuMapper.selectList(spuWrapper);
        for (Spu spu : spuList) {
            SearchSuggestionVO vo = new SearchSuggestionVO();
            vo.setKeyword(spu.getName());
            vo.setType("spu");
            vo.setId(spu.getId());
            suggestions.add(vo);
        }

        LambdaQueryWrapper<ProductModel> modelWrapper = new LambdaQueryWrapper<>();
        modelWrapper.eq(ProductModel::getStatus, 1)
                .like(ProductModel::getName, keyword)
                .last("LIMIT " + Math.max(1, actualLimit - spuList.size()));
        List<ProductModel> modelList = productModelMapper.selectList(modelWrapper);
        for (ProductModel model : modelList) {
            SearchSuggestionVO vo = new SearchSuggestionVO();
            vo.setKeyword(model.getName());
            vo.setType("model");
            vo.setId(model.getId());
            suggestions.add(vo);
        }

        return suggestions;
    }

    @Override
    public List<HotSearchVO> getHotSearches(Integer limit) {
        int actualLimit = limit != null ? limit : 10;
        
        LambdaQueryWrapper<Spu> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Spu::getStatus, 1)
                .orderByDesc(Spu::getViewCount)
                .last("LIMIT " + actualLimit);
        
        List<Spu> spuList = spuMapper.selectList(wrapper);
        
        return spuList.stream().map(spu -> {
            HotSearchVO vo = new HotSearchVO();
            vo.setKeyword(spu.getName());
            vo.setCount(spu.getViewCount());
            return vo;
        }).collect(Collectors.toList());
    }

    @Override
    public SearchResultVO search(SearchRequest request) {
        SearchResultVO result = new SearchResultVO();
        List<SearchResultVO.SearchItemVO> items = new ArrayList<>();
        
        String type = request.getType();
        if (type == null || type.isEmpty()) {
            type = "all";
        }

        if ("all".equals(type) || "product".equals(type)) {
            items.addAll(searchGoods(request));
        }
        
        if ("all".equals(type) || "model".equals(type)) {
            items.addAll(searchSpu(request));
        }
        
        if ("all".equals(type) || "community".equals(type)) {
            items.addAll(searchCommunity(request));
        }

        result.setList(items);
        result.setTotal((long) items.size());
        result.setHasMore(items.size() >= request.getPageSize());
        
        SearchAggregationVO aggregations = buildAggregations(request.getKeyword());
        result.setAggregations(aggregations);
        
        return result;
    }

    @Override
    public IPage<SearchResultVO.SearchItemVO> searchProducts(SearchRequest request) {
        Page<Goods> page = new Page<>(request.getPage(), request.getPageSize());
        LambdaQueryWrapper<Goods> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Goods::getStatus, GoodsStatus.ON_SHELF);
        
        if (request.getKeyword() != null && !request.getKeyword().isEmpty()) {
            wrapper.like(Goods::getTitle, request.getKeyword());
        }
        if (request.getBrandId() != null) {
            wrapper.eq(Goods::getModelId, request.getBrandId());
        }
        if (request.getPriceMin() != null) {
                wrapper.ge(Goods::getPrice, request.getPriceMin());
        }
        if (request.getPriceMax() != null) {
                wrapper.le(Goods::getPrice, request.getPriceMax());
        }
        if (request.getCondition() != null && !request.getCondition().isEmpty()) {
                wrapper.eq(Goods::getConditionLevel, parseConditionLevel(request.getCondition()));
        }
        
        if ("price_asc".equals(request.getSort())) {
            wrapper.orderByAsc(Goods::getPrice);
        } else if ("price_desc".equals(request.getSort())) {
            wrapper.orderByDesc(Goods::getPrice);
        } else {
            wrapper.orderByDesc(Goods::getCreatedAt);
        }
        
        IPage<Goods> goodsPage = goodsMapper.selectPage(page, wrapper);
        
        return goodsPage.convert(this::convertGoodsToItem);
    }

    @Override
    public IPage<SearchResultVO.SearchItemVO> searchModels(SearchRequest request) {
        Page<Spu> page = new Page<>(request.getPage(), request.getPageSize());
        LambdaQueryWrapper<Spu> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Spu::getStatus, 1);
        
        if (request.getKeyword() != null && !request.getKeyword().isEmpty()) {
            wrapper.like(Spu::getName, request.getKeyword());
        }
        if (request.getDeviceTypeId() != null) {
            wrapper.eq(Spu::getCategoryId, request.getDeviceTypeId());
        }
        if (request.getBrandId() != null) {
            wrapper.eq(Spu::getBrandId, request.getBrandId());
        }
        
        if ("hot".equals(request.getSort())) {
            wrapper.orderByDesc(Spu::getMemberCount);
        } else {
            wrapper.orderByDesc(Spu::getCreatedAt);
        }
        
        IPage<Spu> spuPage = spuMapper.selectPage(page, wrapper);
        
        return spuPage.convert(this::convertSpuToItem);
    }

    @Override
    public IPage<SearchResultVO.SearchItemVO> searchCommunities(SearchRequest request) {
        Page<Community> page = new Page<>(request.getPage(), request.getPageSize());
        LambdaQueryWrapper<Community> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Community::getStatus, 1);
        
        if (request.getKeyword() != null && !request.getKeyword().isEmpty()) {
            wrapper.like(Community::getName, request.getKeyword());
        }
        
        wrapper.orderByDesc(Community::getMemberCount);
        
        IPage<Community> communityPage = communityMapper.selectPage(page, wrapper);
        
        return communityPage.convert(this::convertCommunityToItem);
    }

    @Override
    public List<HotSearchVO> getHotModels(Integer limit) {
        int actualLimit = limit != null ? limit : 10;
        
        LambdaQueryWrapper<Spu> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Spu::getStatus, 1)
                .orderByDesc(Spu::getMemberCount)
                .last("LIMIT " + actualLimit);
        
        List<Spu> spuList = spuMapper.selectList(wrapper);
        
        return spuList.stream().map(spu -> {
            HotSearchVO vo = new HotSearchVO();
            vo.setKeyword(spu.getName());
            vo.setCount(spu.getMemberCount());
            return vo;
        }).collect(Collectors.toList());
    }

    @Override
    public List<HotSearchVO> getHotCommunities(Integer limit) {
        int actualLimit = limit != null ? limit : 10;
        
        LambdaQueryWrapper<Community> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Community::getStatus, 1)
                .orderByDesc(Community::getMemberCount)
                .last("LIMIT " + actualLimit);
        
        List<Community> communityList = communityMapper.selectList(wrapper);
        
        return communityList.stream().map(community -> {
            HotSearchVO vo = new HotSearchVO();
            vo.setKeyword(community.getName());
            vo.setCount(community.getMemberCount());
            return vo;
        }).collect(Collectors.toList());
    }

    @Override
    public List<KeywordVO> getRecommendKeywords(Integer limit) {
        int actualLimit = limit != null ? limit : 10;
        
        LambdaQueryWrapper<Spu> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Spu::getStatus, 1)
                .orderByDesc(Spu::getViewCount)
                .last("LIMIT " + actualLimit);
        
        List<Spu> spuList = spuMapper.selectList(wrapper);
        
        return spuList.stream().map(spu -> {
            KeywordVO vo = new KeywordVO();
            vo.setKeyword(spu.getName());
            return vo;
        }).collect(Collectors.toList());
    }

    @Override
    public SearchAggregationVO getSearchFilters(String keyword) {
        return buildAggregations(keyword);
    }

    private List<SearchResultVO.SearchItemVO> searchGoods(SearchRequest request) {
        LambdaQueryWrapper<Goods> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Goods::getStatus, GoodsStatus.ON_SHELF);
        
        if (request.getKeyword() != null && !request.getKeyword().isEmpty()) {
            wrapper.like(Goods::getTitle, request.getKeyword());
        }
        wrapper.last("LIMIT " + request.getPageSize());
        
        List<Goods> goodsList = goodsMapper.selectList(wrapper);
        return goodsList.stream().map(this::convertGoodsToItem).collect(Collectors.toList());
    }

    private List<SearchResultVO.SearchItemVO> searchSpu(SearchRequest request) {
        LambdaQueryWrapper<Spu> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Spu::getStatus, 1);
        
        if (request.getKeyword() != null && !request.getKeyword().isEmpty()) {
            wrapper.like(Spu::getName, request.getKeyword());
        }
        wrapper.last("LIMIT " + request.getPageSize());
        
        List<Spu> spuList = spuMapper.selectList(wrapper);
        return spuList.stream().map(this::convertSpuToItem).collect(Collectors.toList());
    }

    private List<SearchResultVO.SearchItemVO> searchCommunity(SearchRequest request) {
        LambdaQueryWrapper<Community> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Community::getStatus, 1);
        
        if (request.getKeyword() != null && !request.getKeyword().isEmpty()) {
            wrapper.like(Community::getName, request.getKeyword());
        }
        wrapper.last("LIMIT " + request.getPageSize());
        
        List<Community> communityList = communityMapper.selectList(wrapper);
        return communityList.stream().map(this::convertCommunityToItem).collect(Collectors.toList());
    }

    private SearchAggregationVO buildAggregations(String keyword) {
        SearchAggregationVO aggregations = new SearchAggregationVO();
        
        LambdaQueryWrapper<Goods> goodsWrapper = new LambdaQueryWrapper<>();
        goodsWrapper.eq(Goods::getStatus, GoodsStatus.ON_SHELF);
        if (keyword != null && !keyword.isEmpty()) {
            goodsWrapper.like(Goods::getTitle, keyword);
        }
        aggregations.setProductCount(goodsMapper.selectCount(goodsWrapper));
        
        LambdaQueryWrapper<Spu> spuWrapper = new LambdaQueryWrapper<>();
        spuWrapper.eq(Spu::getStatus, 1);
        if (keyword != null && !keyword.isEmpty()) {
            spuWrapper.like(Spu::getName, keyword);
        }
        aggregations.setModelCount(spuMapper.selectCount(spuWrapper));
        
        LambdaQueryWrapper<Community> communityWrapper = new LambdaQueryWrapper<>();
        communityWrapper.eq(Community::getStatus, 1);
        if (keyword != null && !keyword.isEmpty()) {
            communityWrapper.like(Community::getName, keyword);
        }
        aggregations.setCommunityCount(communityMapper.selectCount(communityWrapper));
        
        return aggregations;
    }

    private SearchResultVO.SearchItemVO convertGoodsToItem(Goods goods) {
        SearchResultVO.SearchItemVO item = new SearchResultVO.SearchItemVO();
        item.setId(goods.getId());
        item.setType("product");
        item.setTitle(goods.getTitle());
        item.setPrice(goods.getPrice());
        item.setOriginalPrice(goods.getOriginalPrice());
        item.setCondition(getConditionText(goods.getConditionLevel()));
        item.setViewCount(goods.getViewCount());
        item.setLikeCount(goods.getLikeCount());
        
        if (goods.getImages() != null && !goods.getImages().isEmpty()) {
            String[] images = goods.getImages().split(",");
            item.setCover(images[0]);
        }
        
        return item;
    }

    private SearchResultVO.SearchItemVO convertSpuToItem(Spu spu) {
        SearchResultVO.SearchItemVO item = new SearchResultVO.SearchItemVO();
        item.setId(spu.getId());
        item.setType("model");
        item.setTitle(spu.getName());
        item.setMemberCount(spu.getMemberCount());
        item.setPostCount(spu.getPostCount());
        item.setProductCount(spu.getProductCount());
        item.setCover(spu.getCover());
        return item;
    }

    private SearchResultVO.SearchItemVO convertCommunityToItem(Community community) {
        SearchResultVO.SearchItemVO item = new SearchResultVO.SearchItemVO();
        item.setId(community.getId());
        item.setType("community");
        item.setTitle(community.getName());
        item.setMemberCount(community.getMemberCount());
        item.setPostCount(community.getPostCount());
        item.setCover(community.getCover());
        return item;
    }

    private String getConditionText(Integer conditionLevel) {
        if (conditionLevel == null) {
            return "未知";
        }
        return switch (conditionLevel) {
            case 10 -> "全新未拆封";
            case 9 -> "全新拆封";
            case 8 -> "99新";
            case 7 -> "95新";
            case 6 -> "9成新";
            case 5 -> "8成新";
            default -> "有使用痕迹";
        };
    }

    private Integer parseConditionLevel(String condition) {
        if (condition == null) return null;
        return switch (condition) {
            case "全新未拆封" -> 10;
            case "全新拆封" -> 9;
            case "99新" -> 8;
            case "95新" -> 7;
            case "9成新" -> 6;
            case "8成新" -> 5;
            default -> null;
        };
    }
}
