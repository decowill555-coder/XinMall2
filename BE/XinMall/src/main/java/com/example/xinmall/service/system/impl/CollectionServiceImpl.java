package com.example.xinmall.service.system.impl;

import org.springframework.beans.BeanUtils;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.example.xinmall.common.exception.BusinessException;
import com.example.xinmall.dto.system.request.CollectionRequest;
import com.example.xinmall.dto.trade.response.GoodsVO;
import com.example.xinmall.entity.system.Collection;
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

        Collection exist = collectionMapper.selectOne(
                new LambdaQueryWrapper<Collection>()
                        .eq(Collection::getUserId, userId)
                        .eq(Collection::getTargetId, request.getTargetId())
                        .eq(Collection::getTargetType, CollectionType.values()[request.getTargetType() - 1])
        );
        if (exist != null) {
            throw new BusinessException("已收藏");
        }

        Collection collection = new Collection();
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
                new LambdaQueryWrapper<Collection>()
                        .eq(Collection::getUserId, userId)
                        .eq(Collection::getTargetId, request.getTargetId())
                        .eq(Collection::getTargetType, CollectionType.values()[request.getTargetType() - 1])
        );
    }

    @Override
    public boolean isCollected(Long targetId, Integer targetType) {
        Long userId = getCurrentUserId();
        Long count = collectionMapper.selectCount(
                new LambdaQueryWrapper<Collection>()
                        .eq(Collection::getUserId, userId)
                        .eq(Collection::getTargetId, targetId)
                        .eq(Collection::getTargetType, CollectionType.values()[targetType - 1])
        );
        return count > 0;
    }

    @Override
    public IPage<?> getMyCollections(Integer targetType, Integer page, Integer size) {
        Long userId = getCurrentUserId();
        Page<Collection> pageParam = new Page<>(page, size);

        LambdaQueryWrapper<Collection> wrapper = new LambdaQueryWrapper<Collection>()
                .eq(Collection::getUserId, userId)
                .orderByDesc(Collection::getCreatedAt);

        if (targetType != null) {
            wrapper.eq(Collection::getTargetType, CollectionType.values()[targetType - 1]);
        }

        Page<Collection> result = collectionMapper.selectPage(pageParam, wrapper);

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
                new LambdaQueryWrapper<Collection>()
                        .eq(Collection::getTargetId, targetId)
                        .eq(Collection::getTargetType, CollectionType.values()[targetType - 1])
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
