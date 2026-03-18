package com.example.xinmall.service.trade.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.LambdaUpdateWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.example.xinmall.common.exception.BusinessException;
import com.example.xinmall.dto.trade.request.GoodsPublishRequest;
import com.example.xinmall.dto.trade.request.GoodsQueryRequest;
import com.example.xinmall.dto.trade.response.GoodsDetailVO;
import com.example.xinmall.dto.trade.response.GoodsVO;
import com.example.xinmall.dto.trade.response.ProductSellerVO;
import com.example.xinmall.dto.trade.response.ProductModelVO;
import com.example.xinmall.entity.trade.Goods;
import com.example.xinmall.entity.trade.enums.GoodsStatus;
import com.example.xinmall.entity.user.User;
import com.example.xinmall.entity.user.UserFollow;
import com.example.xinmall.entity.product.ProductModel;
import com.example.xinmall.entity.product.Brand;
import com.example.xinmall.entity.product.ProductModelAttribute;
import com.example.xinmall.entity.product.Attribute;
import com.example.xinmall.mapper.trade.GoodsMapper;
import com.example.xinmall.mapper.user.UserFollowMapper;
import com.example.xinmall.mapper.product.ProductModelMapper;
import com.example.xinmall.mapper.product.BrandMapper;
import com.example.xinmall.mapper.product.ProductModelAttributeMapper;
import com.example.xinmall.mapper.product.AttributeMapper;
import com.example.xinmall.service.trade.GoodsService;
import com.example.xinmall.service.user.UserService;
import com.example.xinmall.service.system.CollectionService;
import com.example.xinmall.mapper.system.ShopMapper;
import com.example.xinmall.entity.system.Shop;
import tools.jackson.core.type.TypeReference;
import tools.jackson.core.JacksonException;
import tools.jackson.databind.ObjectMapper;
import org.springframework.beans.BeanUtils;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class GoodsServiceImpl implements GoodsService {

    private final GoodsMapper goodsMapper;
    private final UserService userService;
    private final CollectionService collectionService;
    private final ShopMapper shopMapper;
    private final ObjectMapper objectMapper;
    private final UserFollowMapper userFollowMapper;
    private final ProductModelMapper productModelMapper;
    private final BrandMapper brandMapper;
    private final ProductModelAttributeMapper productModelAttributeMapper;
    private final AttributeMapper attributeMapper;

    private static final int COLLECTION_TYPE_GOODS = 1;
    private static final int COLLECTION_TYPE_SHOP = 3;
    private static final int COLLECTION_TYPE_USER = 2;

    public GoodsServiceImpl(GoodsMapper goodsMapper, UserService userService,
                           @Lazy CollectionService collectionService,
                           ShopMapper shopMapper, ObjectMapper objectMapper,
                           UserFollowMapper userFollowMapper,
                           ProductModelMapper productModelMapper,
                           BrandMapper brandMapper,
                           ProductModelAttributeMapper productModelAttributeMapper,
                           AttributeMapper attributeMapper) {
        this.goodsMapper = goodsMapper;
        this.userService = userService;
        this.collectionService = collectionService;
        this.shopMapper = shopMapper;
        this.objectMapper = objectMapper;
        this.userFollowMapper = userFollowMapper;
        this.productModelMapper = productModelMapper;
        this.brandMapper = brandMapper;
        this.productModelAttributeMapper = productModelAttributeMapper;
        this.attributeMapper = attributeMapper;
    }

    @Override
    @Transactional
    public Long publish(GoodsPublishRequest request) {
        Long userId = getCurrentUserId();

        Goods goods = new Goods();
        goods.setTitle(request.getTitle());
        goods.setSellerId(userId);
        goods.setModelId(request.getModelId());
        goods.setCategoryId(request.getCategoryId());
        goods.setDescription(request.getDescription());
        try {
            goods.setImages(objectMapper.writeValueAsString(request.getImages()));
        } catch (JacksonException e) {
            throw new BusinessException("图片数据格式错误");
        }
        goods.setPrice(request.getPrice());
        goods.setOriginalPrice(request.getOriginalPrice());
        goods.setConditionLevel(request.getConditionLevel());
        goods.setConditionDesc(request.getConditionDesc());
        goods.setWarranty(request.getWarranty() != null ? request.getWarranty() : false);
        goods.setInvoice(request.getInvoice() != null ? request.getInvoice() : false);
        goods.setCanBargain(request.getCanBargain() != null ? request.getCanBargain() : false);
        goods.setLocation(request.getLocation());
        goods.setStock(request.getStock() != null ? request.getStock() : 1);
        goods.setViewCount(0);
        goods.setLikeCount(0);
        goods.setStatus(GoodsStatus.AUDITING);
        goods.setCreatedAt(LocalDateTime.now());
        goods.setUpdatedAt(LocalDateTime.now());

        goodsMapper.insert(goods);
        return goods.getId();
    }

    @Override
    public IPage<GoodsVO> search(GoodsQueryRequest request) {
        Page<Goods> page = new Page<>(request.getPage(), request.getSize());

        LambdaQueryWrapper<Goods> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Goods::getStatus, GoodsStatus.ON_SHELF);

        if (StringUtils.hasText(request.getKeyword())) {
            wrapper.like(Goods::getTitle, request.getKeyword());
        }
        if (request.getCategoryId() != null) {
            wrapper.eq(Goods::getCategoryId, request.getCategoryId());
        }
        if (request.getModelId() != null) {
            wrapper.eq(Goods::getModelId, request.getModelId());
        }
        if (request.getSellerId() != null) {
            wrapper.eq(Goods::getSellerId, request.getSellerId());
        }
        if (request.getConditionMin() != null) {
            wrapper.ge(Goods::getConditionLevel, request.getConditionMin());
        }
        if (request.getConditionMax() != null) {
            wrapper.le(Goods::getConditionLevel, request.getConditionMax());
        }
        if (request.getMinPrice() != null) {
            wrapper.ge(Goods::getPrice, request.getMinPrice());
        }
        if (request.getMaxPrice() != null) {
            wrapper.le(Goods::getPrice, request.getMaxPrice());
        }
        if (StringUtils.hasText(request.getLocation())) {
            wrapper.like(Goods::getLocation, request.getLocation());
        }

        if ("price".equals(request.getSortBy())) {
            wrapper.orderBy(true, "asc".equalsIgnoreCase(request.getSortOrder()), Goods::getPrice);
        } else if ("time".equals(request.getSortBy())) {
            wrapper.orderByDesc(Goods::getCreatedAt);
        } else {
            wrapper.orderByDesc(Goods::getViewCount);
        }

        Page<Goods> result = goodsMapper.selectPage(page, wrapper);
        return result.convert(this::convertToVO);
    }

    @Override
    public GoodsDetailVO getDetailById(Long id) {
        Goods goods = goodsMapper.selectById(id);
        if (goods == null) {
            throw new BusinessException("商品不存在");
        }

        GoodsDetailVO vo = new GoodsDetailVO();
        BeanUtils.copyProperties(goods, vo);

        if (StringUtils.hasText(goods.getImages())) {
            try {
                List<String> images = objectMapper.readValue(goods.getImages(), new TypeReference<List<String>>() {});
                vo.setImages(images);
            } catch (JacksonException e) {
                vo.setImages(List.of());
            }
        }

        // 构建卖家信息
        User seller = userService.getById(goods.getSellerId());
        if (seller != null) {
            ProductSellerVO sellerVO = buildSellerVO(seller, goods.getSellerId());
            vo.setSeller(sellerVO);
        }

        // 构建商品型号信息
        if (goods.getModelId() != null) {
            ProductModelVO modelVO = buildModelVO(goods.getModelId());
            vo.setModel(modelVO);
        }

        String conditionStr = convertConditionToString(goods.getConditionLevel());
        vo.setCondition(conditionStr);

        String statusStr = convertStatusToString(goods.getStatus());
        vo.setStatus(statusStr);

        try {
            Long userId = getCurrentUserId();
            boolean isCollected = collectionService.isCollected(goods.getId(), COLLECTION_TYPE_GOODS);
            vo.setIsCollected(isCollected);
        } catch (Exception e) {
            vo.setIsCollected(false);
        }

        return vo;
    }

    /**
     * 构建卖家VO信息
     */
    private ProductSellerVO buildSellerVO(User seller, Long sellerId) {
        ProductSellerVO sellerVO = new ProductSellerVO();
        sellerVO.setId(seller.getId());
        sellerVO.setName(seller.getNickname());
        sellerVO.setAvatar(seller.getAvatar());
        sellerVO.setSignature(seller.getSignature());

        // 检查是否是商家
        Shop shop = shopMapper.selectOne(
                new LambdaQueryWrapper<Shop>().eq(Shop::getUserId, sellerId)
        );
        sellerVO.setType(shop != null ? "merchant" : "personal");

        // 获取等级名称 (简单实现：根据交易量或注册时间)
        sellerVO.setLevelName(calculateLevelName(sellerId));

        // 获取在售商品数量
        Long sellingCountLong = goodsMapper.selectCount(
                new LambdaQueryWrapper<Goods>()
                        .eq(Goods::getSellerId, sellerId)
                        .eq(Goods::getStatus, GoodsStatus.ON_SHELF)
        );
        sellerVO.setSellingCount(sellingCountLong != null ? sellingCountLong.intValue() : 0);

        // 获取粉丝数量
        if (shop != null) {
            sellerVO.setFollowerCount(shop.getFollowerCount());
            sellerVO.setRating(shop.getRating());
        } else {
            // 个人卖家从用户关注表获取粉丝数
            Integer followerCount = userFollowMapper.countFollowers(sellerId);
            sellerVO.setFollowerCount(followerCount != null ? followerCount : 0);
            sellerVO.setRating(null); // 个人卖家没有评分
        }

        // 检查当前用户是否关注了该卖家
        try {
            Long userId = getCurrentUserId();
            if (shop != null) {
                // 商家关注状态
                boolean isFollowed = collectionService.isCollected(shop.getId(), COLLECTION_TYPE_SHOP);
                sellerVO.setIsFollowed(isFollowed);
            } else {
                // 个人用户关注状态
                UserFollow userFollow = userFollowMapper.selectOne(
                        new LambdaQueryWrapper<UserFollow>()
                                .eq(UserFollow::getUserId, userId)
                                .eq(UserFollow::getFollowedId, sellerId)
                );
                sellerVO.setIsFollowed(userFollow != null);
            }
        } catch (Exception e) {
            sellerVO.setIsFollowed(false);
        }

        return sellerVO;
    }

    /**
     * 计算用户等级名称
     */
    private String calculateLevelName(Long userId) {
        // 简单实现：根据发布商品数量计算等级
        Long goodsCountLong = goodsMapper.selectCount(
                new LambdaQueryWrapper<Goods>()
                        .eq(Goods::getSellerId, userId)
                        .in(Goods::getStatus, GoodsStatus.ON_SHELF, GoodsStatus.SOLD)
        );
        int goodsCount = goodsCountLong != null ? goodsCountLong.intValue() : 0;
        if (goodsCount >= 100) {
            return "钻石卖家";
        } else if (goodsCount >= 50) {
            return "金牌卖家";
        } else if (goodsCount >= 20) {
            return "银牌卖家";
        } else if (goodsCount >= 5) {
            return "铜牌卖家";
        } else {
            return "新手上路";
        }
    }

    /**
     * 构建商品型号VO信息
     */
    private ProductModelVO buildModelVO(Long modelId) {
        ProductModelVO modelVO = new ProductModelVO();
        modelVO.setId(modelId);

        ProductModel model = productModelMapper.selectById(modelId);
        if (model != null) {
            modelVO.setName(model.getName());
            modelVO.setBrandId(model.getBrandId());

            // 获取品牌信息
            if (model.getBrandId() != null) {
                Brand brand = brandMapper.selectById(model.getBrandId());
                if (brand != null) {
                    modelVO.setBrandName(brand.getName());
                }
            }

            // 获取型号规格属性
            Map<String, String> specs = new HashMap<>();
            List<ProductModelAttribute> modelAttributes = productModelAttributeMapper.selectList(
                    new LambdaQueryWrapper<ProductModelAttribute>()
                            .eq(ProductModelAttribute::getModelId, modelId)
            );

            for (ProductModelAttribute modelAttr : modelAttributes) {
                Attribute attribute = attributeMapper.selectById(modelAttr.getAttributeId());
                if (attribute != null && modelAttr.getValue() != null) {
                    String displayValue = modelAttr.getValue();
                    if (attribute.getUnit() != null && !attribute.getUnit().isEmpty()) {
                        displayValue += attribute.getUnit();
                    }
                    specs.put(attribute.getName(), displayValue);
                }
            }
            modelVO.setSpecs(specs);
        }

        return modelVO;
    }

    private String convertConditionToString(Integer conditionLevel) {
        if (conditionLevel == null) return "未知";
        return switch (conditionLevel) {
            case 100 -> "全新";
            case 99 -> "99新";
            case 95 -> "95新";
            case 90 -> "9成新";
            case 80 -> "8成新";
            default -> "未知";
        };
    }

    private String convertStatusToString(GoodsStatus status) {
        if (status == null) return "off_sale";
        return switch (status) {
            case ON_SHELF -> "on_sale";
            case SOLD -> "sold";
            case OFF_SHELF, AUDITING -> "off_sale";
        };
    }

    @Override
    @Transactional
    public void update(Long id, GoodsPublishRequest request) {
        Long userId = getCurrentUserId();
        Goods goods = goodsMapper.selectById(id);
        if (goods == null) {
            throw new BusinessException("商品不存在");
        }
        if (!goods.getSellerId().equals(userId)) {
            throw new BusinessException("无权修改此商品");
        }

        goods.setTitle(request.getTitle());
        goods.setModelId(request.getModelId());
        goods.setCategoryId(request.getCategoryId());
        goods.setDescription(request.getDescription());
        try {
            goods.setImages(objectMapper.writeValueAsString(request.getImages()));
        } catch (JacksonException e) {
            throw new BusinessException("图片数据格式错误");
        }
        goods.setPrice(request.getPrice());
        goods.setOriginalPrice(request.getOriginalPrice());
        goods.setConditionLevel(request.getConditionLevel());
        goods.setConditionDesc(request.getConditionDesc());
        goods.setWarranty(request.getWarranty());
        goods.setInvoice(request.getInvoice());
        goods.setCanBargain(request.getCanBargain());
        goods.setLocation(request.getLocation());
        goods.setStock(request.getStock());
        goods.setUpdatedAt(LocalDateTime.now());

        goodsMapper.updateById(goods);
    }

    @Override
    @Transactional
    public void offShelf(Long id) {
        Long userId = getCurrentUserId();
        Goods goods = goodsMapper.selectById(id);
        if (goods == null) {
            throw new BusinessException("商品不存在");
        }
        if (!goods.getSellerId().equals(userId)) {
            throw new BusinessException("无权操作此商品");
        }

        goods.setStatus(GoodsStatus.OFF_SHELF);
        goods.setUpdatedAt(LocalDateTime.now());
        goodsMapper.updateById(goods);
    }

    @Override
    @Transactional
    public void onShelf(Long id) {
        Long userId = getCurrentUserId();
        Goods goods = goodsMapper.selectById(id);
        if (goods == null) {
            throw new BusinessException("商品不存在");
        }
        if (!goods.getSellerId().equals(userId)) {
            throw new BusinessException("无权操作此商品");
        }

        goods.setStatus(GoodsStatus.AUDITING);
        goods.setUpdatedAt(LocalDateTime.now());
        goodsMapper.updateById(goods);
    }

    @Override
    public IPage<GoodsVO> getMyGoods(Integer page, Integer size) {
        Long userId = getCurrentUserId();
        Page<Goods> pageParam = new Page<>(page, size);

        Page<Goods> result = goodsMapper.selectPage(pageParam,
                new LambdaQueryWrapper<Goods>()
                        .eq(Goods::getSellerId, userId)
                        .orderByDesc(Goods::getCreatedAt)
        );

        return result.convert(this::convertToVO);
    }

    @Override
    public void incrementViewCount(Long id) {
        goodsMapper.update(null,
                new LambdaUpdateWrapper<Goods>()
                        .eq(Goods::getId, id)
                        .setSql("view_count = view_count + 1")
        );
    }

    @Override
    public void incrementLikeCount(Long id) {
        goodsMapper.update(null,
                new LambdaUpdateWrapper<Goods>()
                        .eq(Goods::getId, id)
                        .setSql("like_count = like_count + 1")
        );
    }

    @Override
    public void decrementLikeCount(Long id) {
        goodsMapper.update(null,
                new LambdaUpdateWrapper<Goods>()
                        .eq(Goods::getId, id)
                        .setSql("like_count = GREATEST(0, like_count - 1)")
        );
    }

    @Override
    public Goods getById(Long id) {
        return goodsMapper.selectById(id);
    }

    private Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new BusinessException("用户未登录");
        }
        return Long.parseLong(authentication.getName());
    }

    private GoodsVO convertToVO(Goods goods) {
        GoodsVO vo = new GoodsVO();
        BeanUtils.copyProperties(goods, vo);

        if (StringUtils.hasText(goods.getImages())) {
            try {
                List<String> images = objectMapper.readValue(goods.getImages(), new TypeReference<List<String>>() {});
                if (!images.isEmpty()) {
                    vo.setCover(images.get(0));
                }
            } catch (JacksonException e) {
                // ignore
            }
        }

        User seller = userService.getById(goods.getSellerId());
        if (seller != null) {
            vo.setSellerName(seller.getNickname());
            vo.setSellerAvatar(seller.getAvatar());
        }

        Shop shop = shopMapper.selectOne(
                new LambdaQueryWrapper<Shop>().eq(Shop::getUserId, goods.getSellerId())
        );
        vo.setSellerType(shop != null ? "merchant" : "personal");

        return vo;
    }
}
