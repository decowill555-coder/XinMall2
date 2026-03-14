package com.example.xinmall.service.system.impl;

import org.springframework.beans.BeanUtils;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.example.xinmall.common.exception.BusinessException;
import com.example.xinmall.dto.system.request.CollectionRequest;
import com.example.xinmall.dto.trade.response.GoodsVO;
import com.example.xinmall.entity.system.UserCollection;
import com.example.xinmall.entity.system.enums.CollectionType;
import com.example.xinmall.mapper.system.CollectionMapper;
import com.example.xinmall.service.system.CollectionService;
import com.example.xinmall.service.trade.GoodsService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class CollectionServiceImpl implements CollectionService {

    private final CollectionMapper collectionMapper;
    private final GoodsService goodsService;

    @Override
    @Transactional
    public void add(CollectionRequest request) {
        Long userId = getCurrentUserId();

        UserCollection exist = collectionMapper.selectOne(
                new LambdaQueryWrapper<UserCollection>()
                        .eq(UserCollection::getUserId, userId)
                        .eq(UserCollection::getTargetId, request.getTargetId())
                        .eq(UserCollection::getTargetType, CollectionType.values()[request.getTargetType() - 1])
        );
        if (exist != null) {
            throw new BusinessException("已收藏");
        }

        UserCollection collection = new UserCollection();
        collection.setUserId(userId);
        collection.setTargetId(request.getTargetId());
        collection.setTargetType(CollectionType.values()[request.getTargetType() - 1]);
        collection.setCreatedAt(LocalDateTime.now());
        collectionMapper.insert(collection);
    }

    @Override
    @Transactional
    public void remove(CollectionRequest request) {
        Long userId = getCurrentUserId();
        collectionMapper.delete(
                new LambdaQueryWrapper<UserCollection>()
                        .eq(UserCollection::getUserId, userId)
                        .eq(UserCollection::getTargetId, request.getTargetId())
                        .eq(UserCollection::getTargetType, CollectionType.values()[request.getTargetType() - 1])
        );
    }

    @Override
    public boolean isCollected(Long targetId, Integer targetType) {
        Long userId = getCurrentUserId();
        Long count = collectionMapper.selectCount(
                new LambdaQueryWrapper<UserCollection>()
                        .eq(UserCollection::getUserId, userId)
                        .eq(UserCollection::getTargetId, targetId)
                        .eq(UserCollection::getTargetType, CollectionType.values()[targetType - 1])
        );
        return count > 0;
    }

    @Override
    public IPage<?> getMyCollections(Integer targetType, Integer page, Integer size) {
        Long userId = getCurrentUserId();
        Page<UserCollection> pageParam = new Page<>(page, size);

        LambdaQueryWrapper<UserCollection> wrapper = new LambdaQueryWrapper<UserCollection>()
                .eq(UserCollection::getUserId, userId)
                .orderByDesc(UserCollection::getCreatedAt);

        if (targetType != null) {
            wrapper.eq(UserCollection::getTargetType, CollectionType.values()[targetType - 1]);
        }

        Page<UserCollection> result = collectionMapper.selectPage(pageParam, wrapper);

        if (targetType != null && targetType == 1) {
            return result.convert(c -> {
                var goods = goodsService.getById(c.getTargetId());
                if (goods != null) {
                    GoodsVO vo = new GoodsVO();
                    BeanUtils.copyProperties(goods, vo);
                    return vo;
                }
                return null;
            });
        }

        return result;
    }

    @Override
    public Long getCollectionCount(Long targetId, Integer targetType) {
        return collectionMapper.selectCount(
                new LambdaQueryWrapper<UserCollection>()
                        .eq(UserCollection::getTargetId, targetId)
                        .eq(UserCollection::getTargetType, CollectionType.values()[targetType - 1])
        );
    }

    private Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new BusinessException("用户未登录");
        }
        return Long.parseLong(authentication.getName());
    }
}
