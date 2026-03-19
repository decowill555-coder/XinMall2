package com.example.xinmall.service.system.impl;

import org.springframework.beans.BeanUtils;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.example.xinmall.common.exception.BusinessException;
import com.example.xinmall.dto.system.request.CollectionRequest;
import com.example.xinmall.dto.trade.response.GoodsVO;
import com.example.xinmall.dto.community.response.PostVO;
import com.example.xinmall.entity.system.UserCollection;
import com.example.xinmall.entity.system.enums.CollectionType;
import com.example.xinmall.mapper.system.CollectionMapper;
import com.example.xinmall.service.system.CollectionService;
import com.example.xinmall.service.trade.GoodsService;
import com.example.xinmall.service.community.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class CollectionServiceImpl implements CollectionService {

    private final CollectionMapper collectionMapper;
    @Lazy
    private final GoodsService goodsService;
    @Lazy
    private final PostService postService;

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

        // 商品收藏
        if (targetType != null && targetType == 1) {
            return result.convert(c -> {
                var goods = goodsService.getById(c.getTargetId());
                if (goods != null) {
                    GoodsVO vo = new GoodsVO();
                    BeanUtils.copyProperties(goods, vo);
                    // 设置productId为商品id，方便前端跳转
                    vo.setProductId(goods.getId());
                    // 设置收藏记录的创建时间
                    vo.setCreatedAt(c.getCreatedAt());
                    return vo;
                }
                return null;
            });
        }

        // 帖子收藏
        if (targetType != null && targetType == 2) {
            return result.convert(c -> {
                var postDetail = postService.getDetailById(c.getTargetId());
                if (postDetail != null) {
                    PostVO vo = new PostVO();
                    vo.setId(postDetail.getId());
                    vo.setProductId(postDetail.getId()); // 设置productId为帖子id，方便前端跳转
                    vo.setTitle(postDetail.getTitle());
                    vo.setContent(postDetail.getContent());
                    vo.setImages(postDetail.getImages());
                    vo.setTags(postDetail.getTags());
                    vo.setViewCount(postDetail.getViewCount());
                    vo.setLikeCount(postDetail.getLikeCount());
                    vo.setCommentCount(postDetail.getCommentCount());
                    vo.setCollectCount(postDetail.getCollectCount());
                    vo.setIsLiked(postDetail.getIsLiked());
                    vo.setIsCollected(postDetail.getIsCollected());
                    vo.setIsPinned(postDetail.getIsPinned());
                    vo.setIsEssence(postDetail.getIsEssence());
                    vo.setCreatedAt(postDetail.getCreatedAt());
                    if (postDetail.getAuthor() != null) {
                        PostVO.AuthorVO authorVO = new PostVO.AuthorVO();
                        authorVO.setId(postDetail.getAuthor().getId());
                        authorVO.setName(postDetail.getAuthor().getName());
                        authorVO.setAvatar(postDetail.getAuthor().getAvatar());
                        vo.setAuthor(authorVO);
                    }
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
