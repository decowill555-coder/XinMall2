package com.example.xinmall.service.trade.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.example.xinmall.common.exception.BusinessException;
import com.example.xinmall.dto.trade.request.EvaluationRequest;
import com.example.xinmall.dto.trade.response.EvaluationVO;
import com.example.xinmall.entity.trade.Evaluation;
import com.example.xinmall.entity.trade.Order;
import com.example.xinmall.entity.trade.enums.OrderStatus;
import com.example.xinmall.mapper.trade.EvaluationMapper;
import com.example.xinmall.mapper.trade.OrderMapper;
import com.example.xinmall.service.trade.EvaluationService;
import com.example.xinmall.service.user.UserService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EvaluationServiceImpl implements EvaluationService {

    private final EvaluationMapper evaluationMapper;
    private final OrderMapper orderMapper;
    private final UserService userService;
    private final ObjectMapper objectMapper;

    @Override
    @Transactional
    public Long create(EvaluationRequest request) {
        Long userId = getCurrentUserId();

        Order order = orderMapper.selectById(request.getOrderId());
        if (order == null) {
            throw new BusinessException("订单不存在");
        }
        if (!order.getUserId().equals(userId)) {
            throw new BusinessException("无权评价此订单");
        }
        if (order.getStatus() != OrderStatus.COMPLETED) {
            throw new BusinessException("订单未完成，不能评价");
        }

        Long existCount = evaluationMapper.selectCount(
                new LambdaQueryWrapper<Evaluation>()
                        .eq(Evaluation::getOrderId, request.getOrderId())
                        .eq(Evaluation::getUserId, userId)
        );
        if (existCount > 0) {
            throw new BusinessException("已评价过此订单");
        }

        Evaluation evaluation = new Evaluation();
        evaluation.setOrderId(request.getOrderId());
        evaluation.setGoodsId(order.getGoodsId());
        evaluation.setUserId(userId);
        evaluation.setSellerId(order.getSellerId());
        evaluation.setRating(request.getRating());
        evaluation.setContent(request.getContent());
        try {
            evaluation.setImages(request.getImages() != null ? objectMapper.writeValueAsString(request.getImages()) : null);
        } catch (JsonProcessingException e) {
            evaluation.setImages(null);
        }
        evaluation.setIsAnonymous(request.getIsAnonymous() != null ? request.getIsAnonymous() : false);
        evaluation.setStatus(1);
        evaluation.setCreatedAt(LocalDateTime.now());
        evaluation.setUpdatedAt(LocalDateTime.now());

        evaluationMapper.insert(evaluation);
        return evaluation.getId();
    }

    @Override
    public Page<EvaluationVO> getByGoodsId(Long goodsId, Integer page, Integer size) {
        Page<Evaluation> pageParam = new Page<>(page, size);
        Page<Evaluation> result = evaluationMapper.selectPage(pageParam,
                new LambdaQueryWrapper<Evaluation>()
                        .eq(Evaluation::getGoodsId, goodsId)
                        .eq(Evaluation::getStatus, 1)
                        .orderByDesc(Evaluation::getCreatedAt)
        );
        return result.convert(this::convertToVO);
    }

    @Override
    public Page<EvaluationVO> getBySellerId(Long sellerId, Integer page, Integer size) {
        Page<Evaluation> pageParam = new Page<>(page, size);
        Page<Evaluation> result = evaluationMapper.selectPage(pageParam,
                new LambdaQueryWrapper<Evaluation>()
                        .eq(Evaluation::getSellerId, sellerId)
                        .eq(Evaluation::getStatus, 1)
                        .orderByDesc(Evaluation::getCreatedAt)
        );
        return result.convert(this::convertToVO);
    }

    @Override
    @Transactional
    public void reply(Long id, String content) {
        Long userId = getCurrentUserId();
        Evaluation evaluation = evaluationMapper.selectById(id);
        if (evaluation == null) {
            throw new BusinessException("评价不存在");
        }
        if (!evaluation.getSellerId().equals(userId)) {
            throw new BusinessException("无权回复此评价");
        }
        if (evaluation.getSellerReply() != null) {
            throw new BusinessException("已回复过此评价");
        }

        evaluation.setSellerReply(content);
        evaluation.setSellerReplyTime(LocalDateTime.now());
        evaluation.setUpdatedAt(LocalDateTime.now());
        evaluationMapper.updateById(evaluation);
    }

    private Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new BusinessException("用户未登录");
        }
        return Long.parseLong(authentication.getName());
    }

    private EvaluationVO convertToVO(Evaluation evaluation) {
        EvaluationVO vo = new EvaluationVO();
        BeanUtils.copyProperties(evaluation, vo);

        if (evaluation.getIsAnonymous()) {
            vo.setUserName("匿名用户");
            vo.setUserAvatar(null);
        } else {
            var user = userService.getById(evaluation.getUserId());
            if (user != null) {
                vo.setUserName(user.getNickname());
                vo.setUserAvatar(user.getAvatar());
            }
        }

        if (evaluation.getImages() != null) {
            try {
                List<String> images = objectMapper.readValue(evaluation.getImages(), new TypeReference<List<String>>() {});
                vo.setImages(images);
            } catch (JsonProcessingException e) {
                vo.setImages(List.of());
            }
        }

        return vo;
    }
}
