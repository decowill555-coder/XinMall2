package com.example.xinmall.service.system.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.example.xinmall.common.exception.BusinessException;
import com.example.xinmall.dto.system.request.ShopAuthRequest;
import com.example.xinmall.dto.system.response.ShopAuthVO;
import com.example.xinmall.entity.system.ShopAuth;
import com.example.xinmall.entity.system.enums.ShopAuthStatus;
import com.example.xinmall.mapper.system.ShopAuthMapper;
import com.example.xinmall.service.system.ShopAuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class ShopAuthServiceImpl implements ShopAuthService {

    private final ShopAuthMapper shopAuthMapper;

    @Override
    @Transactional
    public Long submitAuth(ShopAuthRequest request) {
        Long userId = getCurrentUserId();

        // 检查是否已有待审核或已通过的认证
        ShopAuth existAuth = shopAuthMapper.selectOne(
                new LambdaQueryWrapper<ShopAuth>()
                        .eq(ShopAuth::getUserId, userId)
                        .in(ShopAuth::getStatus, ShopAuthStatus.PENDING, ShopAuthStatus.APPROVED)
        );
        if (existAuth != null) {
            if (existAuth.getStatus() == ShopAuthStatus.PENDING) {
                throw new BusinessException("您已提交认证申请，请等待审核");
            }
            if (existAuth.getStatus() == ShopAuthStatus.APPROVED) {
                throw new BusinessException("您已完成店铺认证");
            }
        }

        ShopAuth shopAuth = new ShopAuth();
        shopAuth.setUserId(userId);
        shopAuth.setShopName(request.getShopName());
        shopAuth.setShopDesc(request.getShopDesc());
        shopAuth.setCategory(request.getCategory());
        shopAuth.setLicenseImage(request.getLicenseImage());
        shopAuth.setLegalPerson(request.getLegalPerson());
        shopAuth.setPhone(request.getPhone());
        shopAuth.setAddress(request.getAddress());
        shopAuth.setStatus(ShopAuthStatus.PENDING);
        shopAuth.setCreatedAt(LocalDateTime.now());
        shopAuth.setUpdatedAt(LocalDateTime.now());

        shopAuthMapper.insert(shopAuth);
        return shopAuth.getId();
    }

    @Override
    public ShopAuthVO getAuthStatus() {
        Long userId = getCurrentUserId();

        ShopAuth shopAuth = shopAuthMapper.selectOne(
                new LambdaQueryWrapper<ShopAuth>()
                        .eq(ShopAuth::getUserId, userId)
                        .orderByDesc(ShopAuth::getCreatedAt)
                        .last("LIMIT 1")
        );

        if (shopAuth == null) {
            return null;
        }

        return convertToVO(shopAuth);
    }

    private ShopAuthVO convertToVO(ShopAuth shopAuth) {
        ShopAuthVO vo = new ShopAuthVO();
        BeanUtils.copyProperties(shopAuth, vo);
        vo.setStatus(shopAuth.getStatus().name());
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
