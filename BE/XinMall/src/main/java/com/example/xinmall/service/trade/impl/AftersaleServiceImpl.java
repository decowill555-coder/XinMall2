package com.example.xinmall.service.trade.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.example.xinmall.common.exception.BusinessException;
import com.example.xinmall.dto.trade.request.AftersaleCreateRequest;
import com.example.xinmall.dto.trade.request.AftersaleLogisticsRequest;
import com.example.xinmall.dto.trade.response.*;
import com.example.xinmall.entity.trade.Aftersale;
import com.example.xinmall.entity.trade.AftersaleLog;
import com.example.xinmall.entity.trade.Order;
import com.example.xinmall.entity.trade.enums.AftersaleOperatorType;
import com.example.xinmall.entity.trade.enums.AftersaleStatus;
import com.example.xinmall.entity.trade.enums.AftersaleType;
import com.example.xinmall.entity.trade.enums.OrderStatus;
import com.example.xinmall.entity.user.User;
import com.example.xinmall.mapper.trade.AftersaleLogMapper;
import com.example.xinmall.mapper.trade.AftersaleMapper;
import com.example.xinmall.mapper.trade.OrderMapper;
import com.example.xinmall.service.trade.AftersaleService;
import com.example.xinmall.service.user.UserService;
import tools.jackson.core.JacksonException;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;

@Service
@RequiredArgsConstructor
public class AftersaleServiceImpl implements AftersaleService {

    private final AftersaleMapper aftersaleMapper;
    private final AftersaleLogMapper aftersaleLogMapper;
    private final OrderMapper orderMapper;
    private final UserService userService;
    private final ObjectMapper objectMapper;

    @Override
    @Transactional
    public Long create(AftersaleCreateRequest request) {
        Long userId = getCurrentUserId();

        Order order = orderMapper.selectById(request.getOrderId());
        if (order == null) {
            throw new BusinessException("订单不存在");
        }
        if (!order.getUserId().equals(userId)) {
            throw new BusinessException("无权申请此订单的售后");
        }
        // 已付款或已发货或已完成的订单可以申请售后（待付款状态不允许）
        // 注：这里需要根据实际业务状态判断，订单状态可能是中文或其他格式
        OrderStatus orderStatus = order.getStatus();
        if (orderStatus == null) {
            // 如果状态为空，允许申请（可能是模拟数据）
        } else if (orderStatus == OrderStatus.PENDING_PAYMENT) {
            throw new BusinessException("待付款订单不能申请售后，请先完成付款");
        } else if (orderStatus == OrderStatus.CANCELLED) {
            throw new BusinessException("已取消订单不能申请售后");
        } else if (orderStatus == OrderStatus.REFUNDED) {
            throw new BusinessException("已退款订单不能申请售后");
        }

        // 检查是否已存在售后申请
        Long existCount = aftersaleMapper.selectCount(
                new LambdaQueryWrapper<Aftersale>()
                        .eq(Aftersale::getOrderId, request.getOrderId())
                        .ne(Aftersale::getStatus, AftersaleStatus.CANCELLED)
                        .ne(Aftersale::getStatus, AftersaleStatus.REJECTED)
        );
        if (existCount > 0) {
            throw new BusinessException("该订单已存在售后申请");
        }

        Aftersale aftersale = new Aftersale();
        aftersale.setOrderId(order.getId());
        aftersale.setOrderNo(order.getOrderNo());
        aftersale.setUserId(userId);
        aftersale.setSellerId(order.getSellerId());
        aftersale.setType(request.getType());
        aftersale.setStatus(AftersaleStatus.PENDING);
        aftersale.setReason(request.getReason());
        aftersale.setDescription(request.getDescription());

        if (request.getImages() != null && !request.getImages().isEmpty()) {
            try {
                aftersale.setImages(objectMapper.writeValueAsString(request.getImages()));
            } catch (JacksonException e) {
                // ignore
            }
        }

        // 设置退款金额，默认为订单总金额
        if (request.getRefundAmount() != null) {
            aftersale.setRefundAmount(request.getRefundAmount());
        } else {
            aftersale.setRefundAmount(order.getTotalAmount());
        }

        aftersale.setCreatedAt(LocalDateTime.now());
        aftersale.setUpdatedAt(LocalDateTime.now());
        aftersaleMapper.insert(aftersale);

        // 记录售后日志
        createAftersaleLog(aftersale.getId(), AftersaleStatus.PENDING, "用户提交售后申请", AftersaleOperatorType.USER, userId);

        return aftersale.getId();
    }

    @Override
    public IPage<AftersaleVO> getList(AftersaleStatus status, Integer page, Integer size) {
        Long userId = getCurrentUserId();
        Page<Aftersale> pageParam = new Page<>(page, size);

        LambdaQueryWrapper<Aftersale> wrapper = new LambdaQueryWrapper<Aftersale>()
                .eq(Aftersale::getUserId, userId);
        if (status != null) {
            wrapper.eq(Aftersale::getStatus, status);
        }
        wrapper.orderByDesc(Aftersale::getCreatedAt);

        Page<Aftersale> result = aftersaleMapper.selectPage(pageParam, wrapper);
        return result.convert(this::convertToVO);
    }

    @Override
    public AftersaleDetailVO getDetail(Long id) {
        Long userId = getCurrentUserId();
        Aftersale aftersale = aftersaleMapper.selectById(id);
        if (aftersale == null) {
            throw new BusinessException("售后记录不存在");
        }
        if (!aftersale.getUserId().equals(userId) && !aftersale.getSellerId().equals(userId)) {
            throw new BusinessException("无权查看此售后记录");
        }

        return convertToDetailVO(aftersale);
    }

    @Override
    @Transactional
    public void cancel(Long id) {
        Long userId = getCurrentUserId();
        Aftersale aftersale = aftersaleMapper.selectById(id);
        if (aftersale == null) {
            throw new BusinessException("售后记录不存在");
        }
        if (!aftersale.getUserId().equals(userId)) {
            throw new BusinessException("无权操作此售后记录");
        }
        if (aftersale.getStatus() != AftersaleStatus.PENDING && aftersale.getStatus() != AftersaleStatus.PROCESSING) {
            throw new BusinessException("当前状态不能取消");
        }

        aftersale.setStatus(AftersaleStatus.CANCELLED);
        aftersale.setUpdatedAt(LocalDateTime.now());
        aftersaleMapper.updateById(aftersale);

        // 记录售后日志
        createAftersaleLog(id, AftersaleStatus.CANCELLED, "用户取消售后申请", AftersaleOperatorType.USER, userId);
    }

    @Override
    @Transactional
    public void submitLogistics(Long id, AftersaleLogisticsRequest request) {
        Long userId = getCurrentUserId();
        Aftersale aftersale = aftersaleMapper.selectById(id);
        if (aftersale == null) {
            throw new BusinessException("售后记录不存在");
        }
        if (!aftersale.getUserId().equals(userId)) {
            throw new BusinessException("无权操作此售后记录");
        }
        if (aftersale.getStatus() != AftersaleStatus.PROCESSING) {
            throw new BusinessException("当前状态不能提交物流信息");
        }
        if (aftersale.getType() == AftersaleType.REFUND_ONLY) {
            throw new BusinessException("仅退款类型无需提交物流信息");
        }

        aftersale.setLogisticsCompany(request.getCompany());
        aftersale.setLogisticsNo(request.getTrackingNo());
        aftersale.setUpdatedAt(LocalDateTime.now());
        aftersaleMapper.updateById(aftersale);

        // 记录售后日志
        createAftersaleLog(id, aftersale.getStatus(), "用户提交物流信息: " + request.getCompany() + " " + request.getTrackingNo(), AftersaleOperatorType.USER, userId);
    }

    @Override
    public List<String> getReasons(AftersaleType type) {
        if (type == AftersaleType.REFUND_ONLY) {
            return Arrays.asList(
                    "不想要了",
                    "商品与描述不符",
                    "商品有质量问题",
                    "收到商品损坏",
                    "其他原因"
            );
        } else if (type == AftersaleType.REFUND_RETURN) {
            return Arrays.asList(
                    "商品与描述不符",
                    "商品有质量问题",
                    "收到商品损坏",
                    "商品缺件/少件",
                    "其他原因"
            );
        } else if (type == AftersaleType.EXCHANGE) {
            return Arrays.asList(
                    "商品有质量问题",
                    "收到商品损坏",
                    "商品规格选错",
                    "其他原因"
            );
        }
        return new ArrayList<>();
    }

    @Override
    public Aftersale getById(Long id) {
        return aftersaleMapper.selectById(id);
    }

    private Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new BusinessException("用户未登录");
        }
        return Long.parseLong(authentication.getName());
    }

    private void createAftersaleLog(Long aftersaleId, AftersaleStatus status, String description, AftersaleOperatorType operatorType, Long operatorId) {
        AftersaleLog log = new AftersaleLog();
        log.setAftersaleId(aftersaleId);
        log.setAction(status.getValue());
        log.setContent(description);
        log.setOperatorType(operatorType);
        log.setOperatorId(operatorId);
        log.setCreatedAt(LocalDateTime.now());
        aftersaleLogMapper.insert(log);
    }

    private AftersaleVO convertToVO(Aftersale aftersale) {
        AftersaleVO vo = new AftersaleVO();
        BeanUtils.copyProperties(aftersale, vo);

        Order order = orderMapper.selectById(aftersale.getOrderId());
        if (order != null) {
            vo.setQuantity(order.getQuantity());

            // 解析商品快照
            if (StringUtils.hasText(order.getGoodsSnapshot())) {
                try {
                    JsonNode goodsNode = objectMapper.readTree(order.getGoodsSnapshot());
                    vo.setGoodsTitle(goodsNode.has("title") ? goodsNode.get("title").asText() : null);
                    vo.setGoodsPrice(goodsNode.has("price") ? new BigDecimal(goodsNode.get("price").asText()) : null);

                    if (goodsNode.has("images")) {
                        String imagesStr = goodsNode.get("images").asText();
                        if (StringUtils.hasText(imagesStr)) {
                            List<String> images = objectMapper.readValue(imagesStr, new TypeReference<List<String>>() {});
                            if (!images.isEmpty()) {
                                vo.setGoodsCover(images.get(0));
                            }
                        }
                    }
                } catch (Exception e) {
                    // ignore
                }
            }
        }

        vo.setCreatedAt(aftersale.getCreatedAt());
        vo.setUpdatedAt(aftersale.getUpdatedAt());

        return vo;
    }

    private AftersaleDetailVO convertToDetailVO(Aftersale aftersale) {
        AftersaleDetailVO vo = new AftersaleDetailVO();
        BeanUtils.copyProperties(aftersale, vo);

        // 解析图片
        if (StringUtils.hasText(aftersale.getImages())) {
            try {
                List<String> images = objectMapper.readValue(aftersale.getImages(), new TypeReference<List<String>>() {});
                vo.setImages(images);
            } catch (Exception e) {
                vo.setImages(new ArrayList<>());
            }
        }

        // 设置物流信息
        if (StringUtils.hasText(aftersale.getLogisticsCompany()) || StringUtils.hasText(aftersale.getLogisticsNo())) {
            AftersaleLogisticsVO logisticsVO = new AftersaleLogisticsVO();
            logisticsVO.setCompany(aftersale.getLogisticsCompany());
            logisticsVO.setTrackingNo(aftersale.getLogisticsNo());
            vo.setLogistics(logisticsVO);
        }

        // 查询售后时间线
        List<AftersaleLog> logs = aftersaleLogMapper.selectList(
                new LambdaQueryWrapper<AftersaleLog>()
                        .eq(AftersaleLog::getAftersaleId, aftersale.getId())
                        .orderByAsc(AftersaleLog::getCreatedAt)
        );
        List<AftersaleTimelineVO> timeline = new ArrayList<>();
        for (AftersaleLog log : logs) {
            AftersaleTimelineVO timelineVO = new AftersaleTimelineVO();
            timelineVO.setTime(log.getCreatedAt());
            timelineVO.setStatus(AftersaleStatus.fromValue(log.getAction()));
            timelineVO.setDescription(log.getContent());
            timelineVO.setOperator(log.getOperatorType().getDesc());
            timeline.add(timelineVO);
        }
        vo.setTimeline(timeline);

        // 设置订单信息
        Order order = orderMapper.selectById(aftersale.getOrderId());
        if (order != null) {
            AftersaleOrderVO orderVO = new AftersaleOrderVO();
            orderVO.setId(order.getId());
            orderVO.setOrderNo(order.getOrderNo());
            orderVO.setQuantity(order.getQuantity());
            orderVO.setTotalAmount(order.getTotalAmount());

            // 解析商品快照
            if (StringUtils.hasText(order.getGoodsSnapshot())) {
                try {
                    AftersaleProductVO productVO = new AftersaleProductVO();
                    JsonNode goodsNode = objectMapper.readTree(order.getGoodsSnapshot());
                    productVO.setId(goodsNode.has("id") ? goodsNode.get("id").asLong() : null);
                    productVO.setTitle(goodsNode.has("title") ? goodsNode.get("title").asText() : null);
                    productVO.setPrice(goodsNode.has("price") ? new BigDecimal(goodsNode.get("price").asText()) : null);

                    if (goodsNode.has("images")) {
                        String imagesStr = goodsNode.get("images").asText();
                        if (StringUtils.hasText(imagesStr)) {
                            List<String> images = objectMapper.readValue(imagesStr, new TypeReference<List<String>>() {});
                            if (!images.isEmpty()) {
                                productVO.setCover(images.get(0));
                            }
                        }
                    }

                    // 设置详情页商品信息
                    vo.setGoodsTitle(productVO.getTitle());
                    vo.setGoodsPrice(productVO.getPrice());
                    vo.setGoodsCover(productVO.getCover());
                    vo.setQuantity(order.getQuantity());

                    orderVO.setProduct(productVO);
                } catch (Exception e) {
                    // ignore
                }
            }

            vo.setOrder(orderVO);
        }

        // 设置卖家信息
        User seller = userService.getById(aftersale.getSellerId());
        if (seller != null) {
            AftersaleSellerVO sellerVO = new AftersaleSellerVO();
            sellerVO.setId(seller.getId());
            sellerVO.setName(seller.getNickname());
            sellerVO.setAvatar(seller.getAvatar());
            sellerVO.setPhone(seller.getPhone());
            vo.setSeller(sellerVO);
        }

        vo.setCreatedAt(aftersale.getCreatedAt());
        vo.setUpdatedAt(aftersale.getUpdatedAt());

        return vo;
    }
}
