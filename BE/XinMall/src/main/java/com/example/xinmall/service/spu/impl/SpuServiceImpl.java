package com.example.xinmall.service.spu.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.LambdaUpdateWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.example.xinmall.common.exception.BusinessException;
import com.example.xinmall.dto.spu.request.SpuQueryRequest;
import com.example.xinmall.dto.spu.response.*;
import com.example.xinmall.entity.community.Post;
import com.example.xinmall.entity.spu.Spu;
import com.example.xinmall.entity.spu.SpuFollow;
import com.example.xinmall.entity.spu.SpuPriceTrend;
import com.example.xinmall.entity.trade.Evaluation;
import com.example.xinmall.entity.trade.Goods;
import com.example.xinmall.entity.trade.enums.GoodsStatus;
import com.example.xinmall.entity.user.User;
import com.example.xinmall.mapper.community.PostLikeMapper;
import com.example.xinmall.mapper.community.PostMapper;
import com.example.xinmall.mapper.spu.SpuFollowMapper;
import com.example.xinmall.mapper.spu.SpuMapper;
import com.example.xinmall.mapper.spu.SpuPriceTrendMapper;
import com.example.xinmall.mapper.trade.EvaluationMapper;
import com.example.xinmall.mapper.trade.GoodsMapper;
import com.example.xinmall.mapper.user.UserMapper;
import com.example.xinmall.service.spu.SpuService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class SpuServiceImpl implements SpuService {

    private final SpuMapper spuMapper;
    private final SpuFollowMapper spuFollowMapper;
    private final SpuPriceTrendMapper spuPriceTrendMapper;
    private final GoodsMapper goodsMapper;
    private final UserMapper userMapper;
    private final PostMapper postMapper;
    private final PostLikeMapper postLikeMapper;
    private final EvaluationMapper evaluationMapper;

    @Override
    public SpuDetailVO getDetailById(Long id) {
        Spu spu = spuMapper.selectById(id);
        if (spu == null) {
            throw new BusinessException("SPU不存在");
        }

        SpuDetailVO vo = new SpuDetailVO();
        BeanUtils.copyProperties(spu, vo);

        vo.setDeviceTypeId(spu.getCategoryId());
        vo.setDeviceTypeName(spu.getCategoryName());

        if (spu.getPriceMin() != null || spu.getPriceMax() != null) {
            SpuDetailVO.PriceRangeVO priceRange = new SpuDetailVO.PriceRangeVO();
            priceRange.setMin(spu.getPriceMin());
            priceRange.setMax(spu.getPriceMax());
            vo.setPriceRange(priceRange);
        }

        vo.setIsFollowed(checkIsFollowed(id));
        return vo;
    }

    @Override
    public IPage<SpuListVO> search(SpuQueryRequest request) {
        Page<Spu> page = new Page<>(request.getPage(), request.getPageSize());
        LambdaQueryWrapper<Spu> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Spu::getStatus, 1);

        if (request.getDeviceTypeId() != null) {
            wrapper.eq(Spu::getCategoryId, request.getDeviceTypeId());
        }
        if (request.getBrandId() != null) {
            wrapper.eq(Spu::getBrandId, request.getBrandId());
        }
        if (request.getKeyword() != null && !request.getKeyword().isEmpty()) {
            wrapper.like(Spu::getName, request.getKeyword());
        }

        if ("hot".equals(request.getSort())) {
            wrapper.orderByDesc(Spu::getMemberCount);
        } else if ("new".equals(request.getSort())) {
            wrapper.orderByDesc(Spu::getCreatedAt);
        } else if ("product_count".equals(request.getSort())) {
            wrapper.orderByDesc(Spu::getProductCount);
        } else {
            wrapper.orderByDesc(Spu::getCreatedAt);
        }

        IPage<Spu> spuPage = spuMapper.selectPage(page, wrapper);

        return spuPage.convert(this::convertToListVO);
    }

    @Override
    public List<SpuListVO> searchByKeyword(String keyword, Integer limit) {
        LambdaQueryWrapper<Spu> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Spu::getStatus, 1)
                .like(Spu::getName, keyword)
                .last("LIMIT " + (limit != null ? limit : 10));

        List<Spu> spuList = spuMapper.selectList(wrapper);
        return spuList.stream().map(this::convertToListVO).collect(Collectors.toList());
    }

    @Override
    public IPage<SpuProductVO> getProducts(Long spuId, Integer page, Integer pageSize) {
        Spu spu = spuMapper.selectById(spuId);
        if (spu == null) {
            Page<SpuProductVO> emptyPage = new Page<>(page, pageSize);
            emptyPage.setRecords(new ArrayList<>());
            emptyPage.setTotal(0);
            return emptyPage;
        }

        Page<Goods> goodsPage = new Page<>(page, pageSize);
        LambdaQueryWrapper<Goods> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Goods::getModelId, spuId)
                .eq(Goods::getStatus, GoodsStatus.ON_SHELF)
                .orderByDesc(Goods::getCreatedAt);

        IPage<Goods> result = goodsMapper.selectPage(goodsPage, wrapper);

        return result.convert(goods -> {
            SpuProductVO vo = new SpuProductVO();
            vo.setId(goods.getId());
            vo.setTitle(goods.getTitle());
            vo.setPrice(goods.getPrice());
            vo.setOriginalPrice(goods.getOriginalPrice());
            vo.setViewCount(goods.getViewCount());
            vo.setLikeCount(goods.getLikeCount());
            vo.setCreatedAt(goods.getCreatedAt() != null ? goods.getCreatedAt().toString() : null);
            
            if (goods.getImages() != null && !goods.getImages().isEmpty()) {
                String[] images = goods.getImages().split(",");
                vo.setCover(images[0]);
            }
            
            if (goods.getConditionLevel() != null) {
                vo.setCondition(getConditionText(goods.getConditionLevel()));
            }
            
            vo.setSellerId(goods.getSellerId());
            User seller = userMapper.selectById(goods.getSellerId());
            if (seller != null) {
                vo.setSellerName(seller.getNickname());
                vo.setSellerAvatar(seller.getAvatar());
            }
            
            return vo;
        });
    }

    @Override
    public IPage<SpuPostVO> getPosts(Long spuId, String type, String sort, Integer page, Integer pageSize) {
        Page<Post> postPage = new Page<>(page, pageSize);
        LambdaQueryWrapper<Post> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Post::getSpuId, spuId)
                .eq(Post::getStatus, 1);

        if ("hot".equals(sort)) {
            wrapper.orderByDesc(Post::getLikeCount);
        } else {
            wrapper.orderByDesc(Post::getCreatedAt);
        }

        IPage<Post> result = postMapper.selectPage(postPage, wrapper);

        Long currentUserId = getCurrentUserId();

        return result.convert(post -> {
            SpuPostVO vo = new SpuPostVO();
            vo.setId(post.getId());
            vo.setTitle(post.getTitle());
            vo.setContent(post.getContent());
            vo.setImages(post.getImages());
            vo.setLikeCount(post.getLikeCount());
            vo.setCommentCount(post.getCommentCount());
            vo.setIsPinned(post.getIsPinned() != null && post.getIsPinned() == 1);
            vo.setIsEssence(post.getIsEssence() != null && post.getIsEssence() == 1);
            vo.setCreatedAt(post.getCreatedAt() != null ? post.getCreatedAt().toString() : null);

            SpuPostVO.AuthorVO authorVO = new SpuPostVO.AuthorVO();
            User author = userMapper.selectById(post.getAuthorId());
            if (author != null) {
                authorVO.setId(author.getId());
                authorVO.setName(author.getNickname());
                authorVO.setAvatar(author.getAvatar());
            }
            vo.setAuthor(authorVO);

            if (currentUserId != null) {
                LambdaQueryWrapper<com.example.xinmall.entity.community.PostLike> likeWrapper = new LambdaQueryWrapper<>();
                likeWrapper.eq(com.example.xinmall.entity.community.PostLike::getPostId, post.getId())
                        .eq(com.example.xinmall.entity.community.PostLike::getUserId, currentUserId);
                vo.setIsLiked(postLikeMapper.selectCount(likeWrapper) > 0);
            } else {
                vo.setIsLiked(false);
            }

            return vo;
        });
    }

    @Override
    public IPage<SpuEvaluationVO> getEvaluations(Long spuId, Integer page, Integer pageSize) {
        Spu spu = spuMapper.selectById(spuId);
        if (spu == null) {
            Page<SpuEvaluationVO> emptyPage = new Page<>(page, pageSize);
            emptyPage.setRecords(new ArrayList<>());
            emptyPage.setTotal(0);
            return emptyPage;
        }

        LambdaQueryWrapper<Goods> goodsWrapper = new LambdaQueryWrapper<>();
        goodsWrapper.eq(Goods::getModelId, spuId)
                .select(Goods::getId);
        List<Goods> goodsList = goodsMapper.selectList(goodsWrapper);
        
        if (goodsList.isEmpty()) {
            Page<SpuEvaluationVO> emptyPage = new Page<>(page, pageSize);
            emptyPage.setRecords(new ArrayList<>());
            emptyPage.setTotal(0);
            return emptyPage;
        }

        List<Long> goodsIds = goodsList.stream()
                .map(Goods::getId)
                .collect(Collectors.toList());

        Page<Evaluation> evalPage = new Page<>(page, pageSize);
        LambdaQueryWrapper<Evaluation> wrapper = new LambdaQueryWrapper<>();
        wrapper.in(Evaluation::getGoodsId, goodsIds)
                .eq(Evaluation::getStatus, 1)
                .orderByDesc(Evaluation::getCreatedAt);

        IPage<Evaluation> result = evaluationMapper.selectPage(evalPage, wrapper);

        return result.convert(evaluation -> {
            SpuEvaluationVO vo = new SpuEvaluationVO();
            vo.setId(evaluation.getId());
            vo.setRating(evaluation.getRating());
            vo.setContent(evaluation.getContent());
            vo.setCreatedAt(evaluation.getCreatedAt() != null ? evaluation.getCreatedAt().toString() : null);
            
            vo.setProductId(evaluation.getGoodsId());
            Goods goods = goodsMapper.selectById(evaluation.getGoodsId());
            if (goods != null) {
                vo.setProductTitle(goods.getTitle());
                if (goods.getImages() != null && !goods.getImages().isEmpty()) {
                    String[] images = goods.getImages().split(",");
                    vo.setProductCover(images[0]);
                }
            }

            SpuEvaluationVO.AuthorVO authorVO = new SpuEvaluationVO.AuthorVO();
            User author = userMapper.selectById(evaluation.getUserId());
            if (author != null) {
                authorVO.setId(author.getId());
                authorVO.setName(author.getNickname());
                authorVO.setAvatar(author.getAvatar());
            }
            vo.setAuthor(authorVO);

            return vo;
        });
    }

    @Override
    @Transactional
    public void follow(Long spuId) {
        Long userId = getCurrentUserId();
        if (userId == null) {
            throw new BusinessException("请先登录");
        }

        Spu spu = spuMapper.selectById(spuId);
        if (spu == null) {
            throw new BusinessException("SPU不存在");
        }

        LambdaQueryWrapper<SpuFollow> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(SpuFollow::getSpuId, spuId).eq(SpuFollow::getUserId, userId);
        if (spuFollowMapper.selectCount(wrapper) > 0) {
            return;
        }

        SpuFollow follow = new SpuFollow();
        follow.setSpuId(spuId);
        follow.setUserId(userId);
        follow.setCreatedAt(LocalDateTime.now());
        spuFollowMapper.insert(follow);

        spuMapper.update(null, new LambdaUpdateWrapper<Spu>()
                .eq(Spu::getId, spuId)
                .setSql("member_count = member_count + 1"));
    }

    @Override
    @Transactional
    public void unfollow(Long spuId) {
        Long userId = getCurrentUserId();
        if (userId == null) {
            throw new BusinessException("请先登录");
        }

        LambdaQueryWrapper<SpuFollow> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(SpuFollow::getSpuId, spuId).eq(SpuFollow::getUserId, userId);
        if (spuFollowMapper.delete(wrapper) > 0) {
            spuMapper.update(null, new LambdaUpdateWrapper<Spu>()
                    .eq(Spu::getId, spuId)
                    .setSql("member_count = GREATEST(member_count - 1, 0)"));
        }
    }

    @Override
    public List<SpuListVO> getHotSpus(Long deviceTypeId, Integer limit) {
        LambdaQueryWrapper<Spu> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Spu::getStatus, 1)
                .eq(deviceTypeId != null, Spu::getCategoryId, deviceTypeId)
                .orderByDesc(Spu::getMemberCount)
                .last("LIMIT " + (limit != null ? limit : 10));

        List<Spu> spuList = spuMapper.selectList(wrapper);
        return spuList.stream().map(this::convertToListVO).collect(Collectors.toList());
    }

    @Override
    public List<SpuPriceTrendVO> getPriceTrend(Long spuId, Integer days) {
        int queryDays = days != null ? days : 30;
        LocalDate endDate = LocalDate.now();
        LocalDate startDate = endDate.minusDays(queryDays);

        LambdaQueryWrapper<SpuPriceTrend> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(SpuPriceTrend::getSpuId, spuId)
                .between(SpuPriceTrend::getDate, startDate, endDate)
                .orderByAsc(SpuPriceTrend::getDate);

        List<SpuPriceTrend> trends = spuPriceTrendMapper.selectList(wrapper);
        return trends.stream().map(trend -> {
            SpuPriceTrendVO vo = new SpuPriceTrendVO();
            BeanUtils.copyProperties(trend, vo);
            vo.setDate(trend.getDate().toString());
            return vo;
        }).collect(Collectors.toList());
    }

    @Override
    public List<SpuSpecOptionVO> getSpecOptions(Long spuId) {
        return Collections.emptyList();
    }

    @Override
    public List<SpuListVO> getRelatedSpus(Long spuId, Integer limit) {
        Spu spu = spuMapper.selectById(spuId);
        if (spu == null) {
            return Collections.emptyList();
        }

        LambdaQueryWrapper<Spu> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Spu::getStatus, 1)
                .eq(Spu::getCategoryId, spu.getCategoryId())
                .ne(Spu::getId, spuId)
                .orderByDesc(Spu::getMemberCount)
                .last("LIMIT " + (limit != null ? limit : 6));

        List<Spu> spuList = spuMapper.selectList(wrapper);
        return spuList.stream().map(this::convertToListVO).collect(Collectors.toList());
    }

    @Override
    public IPage<SpuListVO> getFollowedSpus(Integer page, Integer pageSize) {
        Long userId = getCurrentUserId();
        if (userId == null) {
            Page<SpuListVO> emptyPage = new Page<>(page, pageSize);
            emptyPage.setRecords(new ArrayList<>());
            emptyPage.setTotal(0);
            return emptyPage;
        }

        LambdaQueryWrapper<SpuFollow> followWrapper = new LambdaQueryWrapper<>();
        followWrapper.eq(SpuFollow::getUserId, userId);
        List<SpuFollow> follows = spuFollowMapper.selectList(followWrapper);

        if (follows.isEmpty()) {
            Page<SpuListVO> emptyPage = new Page<>(page, pageSize);
            emptyPage.setRecords(new ArrayList<>());
            emptyPage.setTotal(0);
            return emptyPage;
        }

        List<Long> spuIds = follows.stream()
                .map(SpuFollow::getSpuId)
                .collect(Collectors.toList());
        if (spuIds.isEmpty()) {
            Page<SpuListVO> emptyPage = new Page<>(page, pageSize);
            emptyPage.setRecords(new ArrayList<>());
            emptyPage.setTotal(0);
            return emptyPage;
        }

        Page<Spu> spuPage = new Page<>(page, pageSize);
        LambdaQueryWrapper<Spu> wrapper = new LambdaQueryWrapper<>();
        wrapper.in(Spu::getId, spuIds)
                .eq(Spu::getStatus, 1)
                .orderByDesc(Spu::getCreatedAt);

        IPage<Spu> result = spuMapper.selectPage(spuPage, wrapper);
        return result.convert(this::convertToListVO);
    }

    @Override
    public void incrementViewCount(Long id) {
        spuMapper.update(null, new LambdaUpdateWrapper<Spu>()
                .eq(Spu::getId, id)
                .setSql("view_count = view_count + 1"));
    }

    @Override
    public Long getMemberCount(Long spuId) {
        LambdaQueryWrapper<SpuFollow> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(SpuFollow::getSpuId, spuId);
        return spuFollowMapper.selectCount(wrapper);
    }

    private SpuListVO convertToListVO(Spu spu) {
        SpuListVO vo = new SpuListVO();
        BeanUtils.copyProperties(spu, vo);

        vo.setDeviceTypeId(spu.getCategoryId());
        vo.setDeviceTypeName(spu.getCategoryName());

        if (spu.getPriceMin() != null || spu.getPriceMax() != null) {
            SpuListVO.PriceRangeVO priceRange = new SpuListVO.PriceRangeVO();
            priceRange.setMin(spu.getPriceMin());
            priceRange.setMax(spu.getPriceMax());
            vo.setPriceRange(priceRange);
        }

        vo.setIsFollowed(checkIsFollowed(spu.getId()));
        Spu spuDetail = spuMapper.selectById(spu.getId());
        if (spuDetail != null) {
            vo.setPriceMin(spuDetail.getPriceMin());
            vo.setPriceMax(spuDetail.getPriceMax());
        }
        return vo;
    }

    private Boolean checkIsFollowed(Long spuId) {
        Long userId = getCurrentUserId();
        if (userId == null) {
            return false;
        }
        LambdaQueryWrapper<SpuFollow> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(SpuFollow::getSpuId, spuId).eq(SpuFollow::getUserId, userId);
        return spuFollowMapper.selectCount(wrapper) > 0;
    }

    private Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return null;
        }
        try {
            return Long.parseLong(authentication.getName());
        } catch (Exception e) {
            return null;
        }
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
}
