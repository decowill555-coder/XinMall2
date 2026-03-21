package com.example.xinmall.service.system.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.LambdaUpdateWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.example.xinmall.common.exception.BusinessException;
import com.example.xinmall.dto.system.request.ShopCreateRequest;
import com.example.xinmall.dto.system.response.ShopDashboardVO;
import com.example.xinmall.dto.system.response.ShopVO;
import com.example.xinmall.entity.system.Shop;
import com.example.xinmall.entity.system.enums.ShopStatus;
import com.example.xinmall.entity.trade.Aftersale;
import com.example.xinmall.entity.trade.Goods;
import com.example.xinmall.entity.trade.Order;
import com.example.xinmall.entity.trade.enums.AftersaleStatus;
import com.example.xinmall.entity.trade.enums.GoodsStatus;
import com.example.xinmall.entity.trade.enums.OrderStatus;
import com.example.xinmall.mapper.system.ShopMapper;
import com.example.xinmall.mapper.trade.AftersaleMapper;
import com.example.xinmall.mapper.trade.GoodsMapper;
import com.example.xinmall.mapper.trade.OrderMapper;
import com.example.xinmall.service.system.ShopService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ShopServiceImpl implements ShopService {

    private final ShopMapper shopMapper;
    private final OrderMapper orderMapper;
    private final AftersaleMapper aftersaleMapper;
    private final GoodsMapper goodsMapper;

    @Override
    @Transactional
    public Long createShop(ShopCreateRequest request) {
        Long userId = getCurrentUserId();

        Shop existShop = shopMapper.selectOne(
                new LambdaQueryWrapper<Shop>().eq(Shop::getUserId, userId)
        );
        if (existShop != null) {
            throw new BusinessException("您已有店铺，不能重复创建");
        }

        Shop shop = new Shop();
        shop.setUserId(userId);
        shop.setName(request.getName());
        shop.setAvatar(request.getAvatar());
        shop.setCover(request.getCover());
        shop.setDescription(request.getDescription());
        shop.setRating(BigDecimal.valueOf(5.0));
        shop.setFollowerCount(0);
        shop.setGoodsCount(0);
        shop.setSoldCount(0);
        shop.setStatus(ShopStatus.NORMAL);
        shop.setCreatedAt(LocalDateTime.now());
        shop.setUpdatedAt(LocalDateTime.now());

        shopMapper.insert(shop);
        return shop.getId();
    }

    @Override
    public ShopVO getMyShop() {
        Long userId = getCurrentUserId();
        Shop shop = shopMapper.selectOne(
                new LambdaQueryWrapper<Shop>().eq(Shop::getUserId, userId)
        );
        if (shop == null) {
            throw new BusinessException("您还没有店铺");
        }
        return convertToVO(shop);
    }

    @Override
    public ShopVO getById(Long id) {
        Shop shop = shopMapper.selectById(id);
        if (shop == null) {
            throw new BusinessException("店铺不存在");
        }
        return convertToVO(shop);
    }

    @Override
    @Transactional
    public void updateShop(Long id, ShopCreateRequest request) {
        Long userId = getCurrentUserId();
        Shop shop = shopMapper.selectById(id);
        if (shop == null) {
            throw new BusinessException("店铺不存在");
        }
        if (!shop.getUserId().equals(userId)) {
            throw new BusinessException("无权修改此店铺");
        }

        shop.setName(request.getName());
        shop.setAvatar(request.getAvatar());
        shop.setCover(request.getCover());
        shop.setDescription(request.getDescription());
        shop.setPhone(request.getPhone());
        shop.setWechat(request.getWechat());
        shop.setCategory(request.getCategory());
        shop.setAddress(request.getAddress());
        shop.setIsOpen(request.getIsOpen());
        shop.setAutoAccept(request.getAutoAccept());
        shop.setUpdatedAt(LocalDateTime.now());
        shopMapper.updateById(shop);
    }

    @Override
    @Transactional
    public void closeShop(Long id) {
        Long userId = getCurrentUserId();
        Shop shop = shopMapper.selectById(id);
        if (shop == null) {
            throw new BusinessException("店铺不存在");
        }
        if (!shop.getUserId().equals(userId)) {
            throw new BusinessException("无权操作此店铺");
        }

        shop.setStatus(ShopStatus.CLOSED);
        shop.setUpdatedAt(LocalDateTime.now());
        shopMapper.updateById(shop);
    }

    @Override
    @Transactional
    public void reopenShop(Long id) {
        Long userId = getCurrentUserId();
        Shop shop = shopMapper.selectById(id);
        if (shop == null) {
            throw new BusinessException("店铺不存在");
        }
        if (!shop.getUserId().equals(userId)) {
            throw new BusinessException("无权操作此店铺");
        }

        shop.setStatus(ShopStatus.NORMAL);
        shop.setUpdatedAt(LocalDateTime.now());
        shopMapper.updateById(shop);
    }

    @Override
    public IPage<ShopVO> getShopList(Integer page, Integer size) {
        Page<Shop> pageParam = new Page<>(page, size);
        Page<Shop> result = shopMapper.selectPage(pageParam,
                new LambdaQueryWrapper<Shop>()
                        .eq(Shop::getStatus, ShopStatus.NORMAL)
                        .orderByDesc(Shop::getSoldCount)
        );
        return result.convert(this::convertToVO);
    }

    @Override
    @Transactional
    public void incrementGoodsCount(Long shopId) {
        shopMapper.update(null,
                new LambdaUpdateWrapper<Shop>()
                        .eq(Shop::getId, shopId)
                        .setSql("goods_count = goods_count + 1")
        );
    }

    @Override
    @Transactional
    public void decrementGoodsCount(Long shopId) {
        shopMapper.update(null,
                new LambdaUpdateWrapper<Shop>()
                        .eq(Shop::getId, shopId)
                        .setSql("goods_count = GREATEST(0, goods_count - 1)")
        );
    }

    @Override
    @Transactional
    public void incrementSoldCount(Long shopId, Integer count) {
        shopMapper.update(null,
                new LambdaUpdateWrapper<Shop>()
                        .eq(Shop::getId, shopId)
                        .setSql("sold_count = sold_count + " + count)
        );
    }

    @Override
    @Transactional
    public void incrementFollowerCount(Long shopId) {
        shopMapper.update(null,
                new LambdaUpdateWrapper<Shop>()
                        .eq(Shop::getId, shopId)
                        .setSql("follower_count = follower_count + 1")
        );
    }

    @Override
    @Transactional
    public void decrementFollowerCount(Long shopId) {
        shopMapper.update(null,
                new LambdaUpdateWrapper<Shop>()
                        .eq(Shop::getId, shopId)
                        .setSql("follower_count = GREATEST(0, follower_count - 1)")
        );
    }

    @Override
    public ShopDashboardVO getShopDashboard() {
        Long userId = getCurrentUserId();

        // 获取店铺信息
        Shop shop = shopMapper.selectOne(
                new LambdaQueryWrapper<Shop>().eq(Shop::getUserId, userId)
        );
        if (shop == null) {
            throw new BusinessException("您还没有店铺");
        }

        ShopDashboardVO dashboard = new ShopDashboardVO();
        dashboard.setShop(convertToVO(shop));

        // 获取卖家订单统计
        Map<String, Long> orderCounts = new HashMap<>();
        for (OrderStatus status : OrderStatus.values()) {
            LambdaQueryWrapper<Order> wrapper = new LambdaQueryWrapper<Order>()
                    .eq(Order::getSellerId, userId)
                    .eq(Order::getStatus, status);
            orderCounts.put(status.name(), orderMapper.selectCount(wrapper));
        }
        dashboard.setOrderCounts(orderCounts);

        // 获取待处理售后数量
        Long aftersaleCount = aftersaleMapper.selectCount(
                new LambdaQueryWrapper<Aftersale>()
                        .eq(Aftersale::getSellerId, userId)
                        .eq(Aftersale::getStatus, AftersaleStatus.PENDING)
        );
        dashboard.setAftersaleCount(aftersaleCount);

        // 获取最近在售商品列表（最多5个）
        List<Goods> recentGoodsList = goodsMapper.selectList(
                new LambdaQueryWrapper<Goods>()
                        .eq(Goods::getSellerId, userId)
                        .eq(Goods::getStatus, GoodsStatus.ON_SHELF)
                        .orderByDesc(Goods::getCreatedAt)
                        .last("LIMIT 5")
        );
        List<ShopDashboardVO.RecentGoodsVO> recentGoods = new ArrayList<>();
        for (Goods goods : recentGoodsList) {
            ShopDashboardVO.RecentGoodsVO goodsVO = new ShopDashboardVO.RecentGoodsVO();
            goodsVO.setId(goods.getId());
            goodsVO.setTitle(goods.getTitle());
            goodsVO.setPrice(goods.getPrice());
            goodsVO.setStock(goods.getStock());
            goodsVO.setStatus(goods.getStatus().name());
            goodsVO.setCreatedAt(goods.getCreatedAt());
            // 获取封面图
            if (goods.getImages() != null && !goods.getImages().isEmpty()) {
                try {
                    com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
                    List<String> images = mapper.readValue(goods.getImages(), new com.fasterxml.jackson.core.type.TypeReference<List<String>>() {});
                    if (!images.isEmpty()) {
                        goodsVO.setCover(images.get(0));
                    }
                } catch (Exception e) {
                    // ignore
                }
            }
            recentGoods.add(goodsVO);
        }
        dashboard.setRecentGoods(recentGoods);

        return dashboard;
    }

    @Override
    public boolean hasShop() {
        Long userId = getCurrentUserId();
        Shop shop = shopMapper.selectOne(
                new LambdaQueryWrapper<Shop>().eq(Shop::getUserId, userId)
        );
        return shop != null;
    }

    private ShopVO convertToVO(Shop shop) {
        ShopVO vo = new ShopVO();
        BeanUtils.copyProperties(shop, vo);
        vo.setStatus(shop.getStatus().name());
        return vo;
    }

    private Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new BusinessException("用户未登录");
        }
        return Long.parseLong(authentication.getName());
    }
}
