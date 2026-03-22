package com.example.xinmall.service.search.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.example.xinmall.dto.product.response.BrandVO;
import com.example.xinmall.dto.search.request.SearchRequest;
import com.example.xinmall.dto.search.response.*;
import com.example.xinmall.entity.community.Community;
import com.example.xinmall.entity.product.ProductModel;
import com.example.xinmall.entity.spu.Spu;
import com.example.xinmall.entity.system.Shop;
import com.example.xinmall.entity.trade.Goods;
import com.example.xinmall.entity.trade.enums.GoodsStatus;
import com.example.xinmall.mapper.community.CommunityMapper;
import com.example.xinmall.mapper.product.ProductModelMapper;
import com.example.xinmall.mapper.spu.SpuMapper;
import com.example.xinmall.mapper.system.ShopMapper;
import com.example.xinmall.mapper.trade.GoodsMapper;
import com.example.xinmall.service.product.BrandService;
import com.example.xinmall.service.product.CategoryService;
import com.example.xinmall.service.search.SearchService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class SearchServiceImpl implements SearchService {

    private final SpuMapper spuMapper;
    private final ProductModelMapper productModelMapper;
    private final CommunityMapper communityMapper;
    private final GoodsMapper goodsMapper;
    private final ShopMapper shopMapper;
    private final BrandService brandService;
    private final CategoryService categoryService;

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
                .last("ORDER BY RAND() LIMIT " + actualLimit);
        
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

        // 关键词搜索 - 扩展到多字段匹配
        if (request.getKeyword() != null && !request.getKeyword().isEmpty()) {
            String keyword = request.getKeyword().trim();

            wrapper.and(w -> {
                // 1. 搜索商品标题
                w.like(Goods::getTitle, keyword);

                // 2. 搜索商品描述
                w.or().like(Goods::getDescription, keyword);
            });


        }

        // 品牌筛选
        if (request.getBrandId() != null) {
            LambdaQueryWrapper<ProductModel> modelWrapper = new LambdaQueryWrapper<>();
            modelWrapper.eq(ProductModel::getBrandId, request.getBrandId());
            List<ProductModel> models = productModelMapper.selectList(modelWrapper);
            if (models != null && !models.isEmpty()) {
                List<Long> modelIds = models.stream().map(ProductModel::getId).collect(Collectors.toList());
                wrapper.in(Goods::getModelId, modelIds);
            } else {
                wrapper.eq(Goods::getId, -1L);
            }
        }

        // 价格区间筛选
        if (request.getPriceMin() != null) {
            wrapper.ge(Goods::getPrice, request.getPriceMin());
        }
        if (request.getPriceMax() != null) {
            wrapper.le(Goods::getPrice, request.getPriceMax());
        }

        // 成色筛选 - 支持多选（逗号分隔）
        if (request.getCondition() != null && !request.getCondition().isEmpty()) {
            String[] conditions = request.getCondition().split(",");
            List<Integer> conditionLevels = new ArrayList<>();
            for (String cond : conditions) {
                Integer level = parseConditionLevel(cond.trim());
                if (level != null) {
                    conditionLevels.add(level);
                }
            }
            if (!conditionLevels.isEmpty()) {
                wrapper.in(Goods::getConditionLevel, conditionLevels);
            }
        }

        // 发票筛选
        if (request.getHasInvoice() != null) {
            wrapper.eq(Goods::getInvoice, request.getHasInvoice() ? 1 : 0);
        }

        // 保修筛选
        if (request.getHasWarranty() != null) {
            wrapper.eq(Goods::getWarranty, request.getHasWarranty() ? 1 : 0);
        }

        // 发布时间筛选
        if (request.getPublishTime() != null && !request.getPublishTime().isEmpty()) {
            LocalDateTime startTime = parsePublishTime(request.getPublishTime());
            if (startTime != null) {
                wrapper.ge(Goods::getCreatedAt, startTime);
            }
        }

        // 交易方式筛选 - 支持多选（逗号分隔）
        if (request.getTradeMethod() != null && !request.getTradeMethod().isEmpty()) {
            String[] methods = request.getTradeMethod().split(",");
            if (methods.length == 1) {
                wrapper.eq(Goods::getTradeMethod, methods[0].trim());
            } else {
                wrapper.in(Goods::getTradeMethod, Arrays.asList(methods));
            }
        }

        // 包邮筛选
        if (request.getFreeShipping() != null && request.getFreeShipping()) {
            wrapper.eq(Goods::getFreeShipping, 1);
        }

        // 支持验货筛选
        if (request.getCanInspect() != null && request.getCanInspect()) {
            wrapper.eq(Goods::getCanInspect, 1);
        }

        // 存储容量筛选 - 支持多选（逗号分隔）
        if (request.getStorage() != null && !request.getStorage().isEmpty()) {
            String[] storages = request.getStorage().split(",");
            wrapper.and(w -> {
                for (int i = 0; i < storages.length; i++) {
                    String storageValue = storages[i].trim();
                    if (i > 0) {
                        w.or();
                    }
                    if ("1024".equals(storageValue)) {
                        w.like(Goods::getTitle, "1TB");
                    } else if ("2048".equals(storageValue)) {
                        w.like(Goods::getTitle, "2TB").or().like(Goods::getTitle, "2048GB");
                    } else {
                        w.like(Goods::getTitle, storageValue + "GB");
                    }
                }
            });
        }

        // 卖家类型筛选 - 通过shop表判断是否为商家
        if (request.getSellerType() != null && !request.getSellerType().isEmpty()) {
            if ("merchant".equals(request.getSellerType())) {
                // 商家卖家：查找有店铺的卖家
                LambdaQueryWrapper<Shop> shopWrapper = new LambdaQueryWrapper<>();
                shopWrapper.eq(Shop::getStatus, 1);
                List<Shop> shops = shopMapper.selectList(shopWrapper);
                if (shops != null && !shops.isEmpty()) {
                    List<Long> merchantIds = shops.stream()
                            .map(Shop::getUserId)
                            .collect(Collectors.toList());
                    wrapper.in(Goods::getSellerId, merchantIds);
                } else {
                    wrapper.eq(Goods::getId, -1L);
                }
            } else if ("personal".equals(request.getSellerType())) {
                // 个人卖家：查找没有店铺的卖家
                LambdaQueryWrapper<Shop> shopWrapper = new LambdaQueryWrapper<>();
                shopWrapper.eq(Shop::getStatus, 1);
                List<Shop> shops = shopMapper.selectList(shopWrapper);
                if (shops != null && !shops.isEmpty()) {
                    List<Long> merchantIds = shops.stream()
                            .map(Shop::getUserId)
                            .collect(Collectors.toList());
                    wrapper.notIn(Goods::getSellerId, merchantIds);
                }
            }
        }

        // 设备类型筛选
        if (request.getDeviceTypeId() != null) {
            wrapper.eq(Goods::getCategoryId, request.getDeviceTypeId());
        }

        // 排序处理
        if ("price_asc".equals(request.getSort())) {
            wrapper.orderByAsc(Goods::getPrice);
        } else if ("price_desc".equals(request.getSort())) {
            wrapper.orderByDesc(Goods::getPrice);
        } else if ("sales".equals(request.getSort())) {
            wrapper.orderByDesc(Goods::getViewCount);
        } else if ("new".equals(request.getSort())) {
            wrapper.orderByDesc(Goods::getCreatedAt);
        } else {
            // 默认综合排序
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
                .last("ORDER BY RAND() LIMIT " + actualLimit);
        
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
                .last("ORDER BY RAND() LIMIT " + actualLimit);
        
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
                .last("ORDER BY RAND() LIMIT " + actualLimit);
        
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

        buildGoodsAggregations(aggregations, keyword);

        return aggregations;
    }

    private void buildGoodsAggregations(SearchAggregationVO aggregations, String keyword) {
        LambdaQueryWrapper<Goods> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Goods::getStatus, GoodsStatus.ON_SHELF);
        if (keyword != null && !keyword.isEmpty()) {
            wrapper.like(Goods::getTitle, keyword);
        }

        List<Goods> goodsList = goodsMapper.selectList(wrapper);

        if (goodsList.isEmpty()) {
            return;
        }

        java.math.BigDecimal minPrice = goodsList.stream()
                .map(Goods::getPrice)
                .filter(p -> p != null)
                .min(java.math.BigDecimal::compareTo)
                .orElse(null);
        java.math.BigDecimal maxPrice = goodsList.stream()
                .map(Goods::getPrice)
                .filter(p -> p != null)
                .max(java.math.BigDecimal::compareTo)
                .orElse(null);

        if (minPrice != null && maxPrice != null) {
            SearchAggregationVO.PriceRange priceRange = new SearchAggregationVO.PriceRange();
            priceRange.setMin(minPrice);
            priceRange.setMax(maxPrice);
            aggregations.setPriceRange(priceRange);
        }

        Map<Integer, Long> conditionCounts = goodsList.stream()
                .filter(g -> g.getConditionLevel() != null)
                .collect(Collectors.groupingBy(Goods::getConditionLevel, Collectors.counting()));

        List<SearchAggregationVO.ConditionAggregation> conditionAggs = new ArrayList<>();
        conditionCounts.forEach((level, count) -> {
            SearchAggregationVO.ConditionAggregation ca = new SearchAggregationVO.ConditionAggregation();
            ca.setValue(getConditionValue(level));
            ca.setName(getConditionText(level));
            ca.setCount(count.intValue());
            conditionAggs.add(ca);
        });
        aggregations.setConditions(conditionAggs);

        buildBrandAggregations(aggregations, goodsList);
    }

    private void buildBrandAggregations(SearchAggregationVO aggregations, List<Goods> goodsList) {
        if (goodsList == null || goodsList.isEmpty()) {
            return;
        }

        Set<Long> modelIds = goodsList.stream()
                .map(Goods::getModelId)
                .filter(id -> id != null)
                .collect(Collectors.toSet());

        if (modelIds.isEmpty()) {
            return;
        }

        LambdaQueryWrapper<ProductModel> modelWrapper = new LambdaQueryWrapper<>();
        modelWrapper.in(ProductModel::getId, modelIds);
        List<ProductModel> models = productModelMapper.selectList(modelWrapper);

        if (models == null || models.isEmpty()) {
            return;
        }

        Map<Long, List<ProductModel>> brandModelMap = models.stream()
                .filter(m -> m.getBrandId() != null)
                .collect(Collectors.groupingBy(ProductModel::getBrandId));

        List<SearchAggregationVO.BrandAggregation> brandAggs = new ArrayList<>();
        brandModelMap.forEach((brandId, brandModels) -> {
            long count = goodsList.stream()
                    .filter(g -> g.getModelId() != null)
                    .filter(g -> brandModels.stream().anyMatch(m -> m.getId().equals(g.getModelId())))
                    .count();

            if (count > 0) {
                SearchAggregationVO.BrandAggregation ba = new SearchAggregationVO.BrandAggregation();
                ba.setId(brandId);
                ba.setCount((int) count);
                var brand = brandService.getById(brandId);
                if (brand != null) {
                    ba.setName(brand.getName());
                }
                brandAggs.add(ba);
            }
        });

        aggregations.setBrands(brandAggs);

        buildStorageAggregations(aggregations, goodsList);
    }

    private void buildStorageAggregations(SearchAggregationVO aggregations, List<Goods> goodsList) {
        if (goodsList == null || goodsList.isEmpty()) {
            return;
        }

        List<SearchAggregationVO.StorageAggregation> storageAggs = new ArrayList<>();
        String[] storageValues = {"64", "128", "256", "512", "1024", "2048"};

        for (String storageValue : storageValues) {
            final String storageLabel;
            if ("1024".equals(storageValue)) {
                storageLabel = "1TB";
            } else if ("2048".equals(storageValue)) {
                storageLabel = "2TB及以上";
            } else {
                storageLabel = storageValue + "GB";
            }

            long count;
            if ("2048".equals(storageValue)) {
                count = goodsList.stream()
                        .filter(g -> g.getTitle() != null)
                        .filter(g -> g.getTitle().contains("2TB") || g.getTitle().contains("2048GB"))
                        .count();
            } else if ("1024".equals(storageValue)) {
                count = goodsList.stream()
                        .filter(g -> g.getTitle() != null)
                        .filter(g -> g.getTitle().contains("1TB"))
                        .count();
            } else {
                count = goodsList.stream()
                        .filter(g -> g.getTitle() != null)
                        .filter(g -> g.getTitle().contains(storageLabel))
                        .count();
            }

            if (count > 0) {
                SearchAggregationVO.StorageAggregation sa = new SearchAggregationVO.StorageAggregation();
                sa.setValue(storageValue);
                sa.setName(storageLabel);
                sa.setCount((int) count);
                storageAggs.add(sa);
            }
        }

        aggregations.setStorages(storageAggs);
    }

    private String getConditionValue(Integer level) {
        if (level == null) return null;
        return switch (level) {
            case 10 -> "new";
            case 9 -> "99new";
            case 8 -> "95new";
            case 7 -> "9new";
            case 6 -> "8new";
            case 5 -> "7new";
            default -> "other";
        };
    }

    private String getConditionText(Integer level) {
        if (level == null) return null;
        return switch (level) {
            case 10 -> "全新";
            case 9 -> "99新";
            case 8 -> "95新";
            case 7 -> "9新";
            case 6 -> "8新";
            case 5 -> "7新及以下";
            default -> "其他";
        };
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
            String imagesStr = goods.getImages().trim();
            if (imagesStr.startsWith("[")) {
                // JSON数组格式: ["url1", "url2"]
                imagesStr = imagesStr.substring(1, imagesStr.length() - 1);
                String[] parts = imagesStr.split(",");
                if (parts.length > 0) {
                    item.setCover(parts[0].trim().replace("\"", ""));
                }
            } else {
                // 普通逗号分隔格式
                String[] images = imagesStr.split(",");
                item.setCover(images[0].trim());
            }
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

        item.setBrandId(spu.getBrandId());
        if (spu.getBrandId() != null) {
            var brand = brandService.getById(spu.getBrandId());
            if (brand != null) {
                item.setBrandName(brand.getName());
            }
        }

        item.setDeviceTypeId(spu.getCategoryId());
        if (spu.getCategoryId() != null) {
            var category = categoryService.getById(spu.getCategoryId());
            if (category != null) {
                item.setDeviceTypeName(category.getName());
            }
        }

        if (spu.getSpecs() != null) {
            Map<String, String> specsMap = new HashMap<>();
            for (Spu.SpuSpec spec : spu.getSpecs()) {
                if (spec.getName() != null && spec.getOptions() != null && !spec.getOptions().isEmpty()) {
                    specsMap.put(spec.getName(), spec.getOptions().get(0));
                }
            }
            item.setSpecs(specsMap);
        }

        item.setTags(spu.getTags());

        SearchResultVO.SearchItemVO.PriceRange priceRange = new SearchResultVO.SearchItemVO.PriceRange();
        priceRange.setMin(spu.getPriceMin());
        priceRange.setMax(spu.getPriceMax());
        item.setPriceRange(priceRange);

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

    private Integer parseConditionLevel(String condition) {
        if (condition == null) return null;
        return switch (condition) {
            case "new" -> 10;
            case "99new" -> 9;
            case "95new" -> 8;
            case "9new" -> 7;
            case "8new" -> 6;
            case "7new" -> 5;
            default -> null;
        };
    }

    private LocalDateTime parsePublishTime(String publishTime) {
        if (publishTime == null) return null;
        return switch (publishTime) {
            case "today" -> LocalDateTime.now().toLocalDate().atStartOfDay();
            case "3days" -> LocalDateTime.now().minusDays(3);
            case "week" -> LocalDateTime.now().minusWeeks(1);
            case "month" -> LocalDateTime.now().minusMonths(1);
            case "quarter" -> LocalDateTime.now().minusMonths(3);
            default -> null;
        };
    }
}
