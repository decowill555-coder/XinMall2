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
import com.example.xinmall.mapper.trade.GoodsMapper;
import com.example.xinmall.service.trade.GoodsService;
import com.example.xinmall.service.user.UserService;
import com.example.xinmall.service.system.CollectionService;
import com.example.xinmall.mapper.system.ShopMapper;
import com.example.xinmall.entity.system.Shop;
import tools.jackson.core.type.TypeReference;
import tools.jackson.core.JacksonException;
import tools.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GoodsServiceImpl implements GoodsService {

    private final GoodsMapper goodsMapper;
    private final UserService userService;
    private final CollectionService collectionService;
    private final ShopMapper shopMapper;
    private final ObjectMapper objectMapper;

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

        User seller = userService.getById(goods.getSellerId());
        if (seller != null) {
            ProductSellerVO sellerVO = new ProductSellerVO();
            sellerVO.setId(seller.getId());
            sellerVO.setName(seller.getNickname());
            sellerVO.setAvatar(seller.getAvatar());
            vo.setSeller(sellerVO);
        }

        if (goods.getModelId() != null) {
            ProductModelVO modelVO = new ProductModelVO();
            modelVO.setId(goods.getModelId());
            modelVO.setName(vo.getModel() != null ? vo.getModel().getName() : null);
            vo.setModel(modelVO);
        }

        String conditionStr = convertConditionToString(goods.getConditionLevel());
        vo.setCondition(conditionStr);

        String statusStr = convertStatusToString(goods.getStatus());
        vo.setStatus(statusStr);

        try {
            Long userId = getCurrentUserId();
            boolean isCollected = collectionService.isCollected(goods.getId(), 1);
            vo.setIsCollected(isCollected);
        } catch (Exception e) {
            vo.setIsCollected(false);
        }

        return vo;
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
