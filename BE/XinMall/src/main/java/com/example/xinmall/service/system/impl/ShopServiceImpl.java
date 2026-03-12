package com.example.xinmall.service.system.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.example.xinmall.common.exception.BusinessException;
import com.example.xinmall.dto.system.request.ShopCreateRequest;
import com.example.xinmall.dto.system.response.ShopVO;
import com.example.xinmall.entity.system.Shop;
import com.example.xinmall.entity.system.enums.ShopStatus;
import com.example.xinmall.mapper.system.ShopMapper;
import com.example.xinmall.service.system.ShopService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class ShopServiceImpl implements ShopService {

    private final ShopMapper shopMapper;

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
    public Page<ShopVO> getShopList(Integer page, Integer size) {
        Page<Shop> pageParam = new Page<>(page, size);
        Page<Shop> result = shopMapper.selectPage(pageParam,
                new LambdaQueryWrapper<Shop>()
                        .eq(Shop::getStatus, ShopStatus.NORMAL)
                        .orderByDesc(Shop::getSoldCount)
        );
        return result.convert(this::convertToVO);
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
