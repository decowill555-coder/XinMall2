package com.example.xinmall.service.trade.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.example.xinmall.common.exception.BusinessException;
import com.example.xinmall.dto.trade.request.OrderCreateRequest;
import com.example.xinmall.dto.trade.response.*;
import com.example.xinmall.entity.trade.Goods;
import com.example.xinmall.entity.trade.Order;
import com.example.xinmall.entity.trade.enums.GoodsStatus;
import com.example.xinmall.entity.trade.enums.OrderStatus;
import com.example.xinmall.entity.user.User;
import com.example.xinmall.entity.user.UserAddress;
import com.example.xinmall.mapper.trade.GoodsMapper;
import com.example.xinmall.mapper.trade.OrderMapper;
import com.example.xinmall.mapper.user.UserAddressMapper;
import com.example.xinmall.service.trade.OrderService;
import com.example.xinmall.service.user.UserService;
import com.example.xinmall.service.spu.SpuService;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ThreadLocalRandom;

@Service
public class OrderServiceImpl implements OrderService {

    private final OrderMapper orderMapper;
    private final GoodsMapper goodsMapper;
    private final UserAddressMapper userAddressMapper;
    private final UserService userService;
    private final ObjectMapper objectMapper;
    private final SpuService spuService;

    public OrderServiceImpl(OrderMapper orderMapper, GoodsMapper goodsMapper,
                           UserAddressMapper userAddressMapper, UserService userService,
                           ObjectMapper objectMapper, @Lazy SpuService spuService) {
        this.orderMapper = orderMapper;
        this.goodsMapper = goodsMapper;
        this.userAddressMapper = userAddressMapper;
        this.userService = userService;
        this.objectMapper = objectMapper;
        this.spuService = spuService;
    }

    @Override
    @Transactional
    public Long create(OrderCreateRequest request) {
        Long userId = getCurrentUserId();

        Goods goods = goodsMapper.selectById(request.getGoodsId());
        if (goods == null) {
            throw new BusinessException("商品不存在");
        }
        if (goods.getStatus() != GoodsStatus.ON_SHELF) {
            throw new BusinessException("商品已下架或已售出");
        }
        if (goods.getSellerId().equals(userId)) {
            throw new BusinessException("不能购买自己的商品");
        }
        if (goods.getStock() < request.getQuantity()) {
            throw new BusinessException("库存不足");
        }
        // 检查是否已有未支付的订单占用该商品库存
        LambdaQueryWrapper<Order> existingOrderWrapper = new LambdaQueryWrapper<Order>()
                .eq(Order::getGoodsId, goods.getId())
                .eq(Order::getStatus, OrderStatus.PENDING_PAYMENT);
        Long pendingOrderCount = orderMapper.selectCount(existingOrderWrapper);
        int availableStock = goods.getStock() - pendingOrderCount.intValue();
        if (availableStock < request.getQuantity()) {
            throw new BusinessException("商品库存已被占用，请稍后再试");
        }

        Order order = new Order();
        order.setOrderNo(generateOrderNo());
        order.setUserId(userId);
        order.setSellerId(goods.getSellerId());
        order.setGoodsId(goods.getId());
        try {
            order.setGoodsSnapshot(objectMapper.writeValueAsString(goods));
        } catch (Exception e) {
            throw new BusinessException("订单创建失败");
        }
        order.setQuantity(request.getQuantity());
        order.setTotalAmount(goods.getPrice().multiply(java.math.BigDecimal.valueOf(request.getQuantity())));
        order.setStatus(OrderStatus.PENDING_PAYMENT);
        order.setRemark(request.getRemark());

        if (request.getAddressId() != null) {
            UserAddress address = userAddressMapper.selectById(request.getAddressId());
            if (address != null && address.getUserId().equals(userId)) {
                try {
                    order.setAddressSnapshot(objectMapper.writeValueAsString(address));
                } catch (Exception e) {
                    // ignore
                }
            }
        }

        order.setCreatedAt(LocalDateTime.now());
        order.setUpdatedAt(LocalDateTime.now());
        orderMapper.insert(order);

        // 创建订单时不扣减库存，仅记录
        // 库存在支付成功后真正锁定，避免未支付订单占用库存
        // 有效库存 = 实际库存 - 待支付订单数量
        // 商品状态在支付成功后才变为SOLD

        return order.getId();
    }

    @Override
    public IPage<OrderVO> getMyOrders(OrderStatus status, Integer page, Integer size) {
        Long userId = getCurrentUserId();
        Page<Order> pageParam = new Page<>(page, size);

        LambdaQueryWrapper<Order> wrapper = new LambdaQueryWrapper<Order>()
                .eq(Order::getUserId, userId);
        if (status != null) {
            wrapper.eq(Order::getStatus, status);
        }
        wrapper.orderByDesc(Order::getCreatedAt);

        Page<Order> result = orderMapper.selectPage(pageParam, wrapper);
        return result.convert(this::convertToVO);
    }

    @Override
    public IPage<OrderVO> getMySales(OrderStatus status, Integer page, Integer size) {
        Long userId = getCurrentUserId();
        Page<Order> pageParam = new Page<>(page, size);

        LambdaQueryWrapper<Order> wrapper = new LambdaQueryWrapper<Order>()
                .eq(Order::getSellerId, userId);
        if (status != null) {
            wrapper.eq(Order::getStatus, status);
        }
        wrapper.orderByDesc(Order::getCreatedAt);

        Page<Order> result = orderMapper.selectPage(pageParam, wrapper);
        return result.convert(this::convertToVO);
    }

    @Override
    public OrderDetailVO getDetailById(Long id) {
        Long userId = getCurrentUserId();
        Order order = orderMapper.selectById(id);
        if (order == null) {
            throw new BusinessException("订单不存在");
        }
        if (!order.getUserId().equals(userId) && !order.getSellerId().equals(userId)) {
            throw new BusinessException("无权查看此订单");
        }

        OrderDetailVO vo = new OrderDetailVO();
        BeanUtils.copyProperties(order, vo);
        vo.setFreightAmount(BigDecimal.ZERO);

        User buyer = userService.getById(order.getUserId());
        if (buyer != null) {
            vo.setUserName(buyer.getNickname());
        }

        User seller = userService.getById(order.getSellerId());
        if (seller != null) {
            OrderSellerVO sellerVO = new OrderSellerVO();
            sellerVO.setId(seller.getId());
            sellerVO.setName(seller.getNickname());
            sellerVO.setAvatar(seller.getAvatar());
            sellerVO.setPhone(seller.getPhone());
            vo.setSeller(sellerVO);
        }

        if (StringUtils.hasText(order.getGoodsSnapshot())) {
            try {
                OrderProductVO productVO = new OrderProductVO();
                JsonNode goodsNode = objectMapper.readTree(order.getGoodsSnapshot());
                productVO.setId(goodsNode.has("id") ? goodsNode.get("id").asLong() : null);
                productVO.setTitle(goodsNode.has("title") ? goodsNode.get("title").asText() : null);
                productVO.setPrice(goodsNode.has("price") ? new BigDecimal(goodsNode.get("price").asText()) : null);
                productVO.setQuantity(order.getQuantity());

                if (goodsNode.has("images")) {
                    String imagesStr = goodsNode.get("images").asText();
                    if (StringUtils.hasText(imagesStr)) {
                        List<String> images = objectMapper.readValue(imagesStr, new TypeReference<List<String>>() {});
                        if (!images.isEmpty()) {
                            productVO.setCover(images.get(0));
                        }
                    }
                }

                if (goodsNode.has("conditionLevel")) {
                    productVO.setCondition(convertConditionToString(goodsNode.get("conditionLevel").asInt()));
                }

                vo.setProduct(productVO);
            } catch (Exception e) {
                // ignore
            }
        }

        if (StringUtils.hasText(order.getAddressSnapshot())) {
            try {
                OrderAddressVO addressVO = new OrderAddressVO();
                JsonNode addressNode = objectMapper.readTree(order.getAddressSnapshot());
                addressVO.setId(addressNode.has("id") ? addressNode.get("id").asLong() : null);
                addressVO.setName(addressNode.has("name") ? addressNode.get("name").asText() : null);
                addressVO.setPhone(addressNode.has("phone") ? addressNode.get("phone").asText() : null);
                addressVO.setProvince(addressNode.has("province") ? addressNode.get("province").asText() : null);
                addressVO.setCity(addressNode.has("city") ? addressNode.get("city").asText() : null);
                addressVO.setDistrict(addressNode.has("district") ? addressNode.get("district").asText() : null);
                addressVO.setDetail(addressNode.has("detail") ? addressNode.get("detail").asText() : null);
                vo.setAddress(addressVO);
            } catch (Exception e) {
                // ignore
            }
        }

        if (StringUtils.hasText(order.getExpressCompany()) || StringUtils.hasText(order.getExpressNo())) {
            LogisticsVO logisticsVO = new LogisticsVO();
            logisticsVO.setCompany(order.getExpressCompany());
            logisticsVO.setTrackingNo(order.getExpressNo());
            logisticsVO.setStatus(order.getStatus() == OrderStatus.COMPLETED ? "已签收" : "运输中");
            logisticsVO.setUpdateTime(order.getShipTime() != null ? order.getShipTime().toString() : null);
            vo.setLogistics(logisticsVO);
        }

        vo.setPaymentMethod("wechat");

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

    @Override
    @Transactional
    public void cancel(Long id, String reason) {
        Long userId = getCurrentUserId();
        Order order = orderMapper.selectById(id);
        if (order == null) {
            throw new BusinessException("订单不存在");
        }
        if (!order.getUserId().equals(userId)) {
            throw new BusinessException("无权操作此订单");
        }
        if (order.getStatus() != OrderStatus.PENDING_PAYMENT) {
            throw new BusinessException("当前状态不能取消");
        }

        order.setStatus(OrderStatus.CANCELLED);
        order.setCancelReason(reason);
        order.setCancelTime(LocalDateTime.now());
        order.setUpdatedAt(LocalDateTime.now());
        orderMapper.updateById(order);

        // 取消订单时无需恢复库存（因为创建订单时并未扣减库存）
        // 商品状态仍为ON_SHELF，无需修改
    }

    @Override
    @Transactional
    public void pay(Long id) {
        Long userId = getCurrentUserId();
        Order order = orderMapper.selectById(id);
        if (order == null) {
            throw new BusinessException("订单不存在");
        }
        if (!order.getUserId().equals(userId)) {
            throw new BusinessException("无权操作此订单");
        }
        if (order.getStatus() != OrderStatus.PENDING_PAYMENT) {
            throw new BusinessException("当前状态不能支付");
        }

        order.setStatus(OrderStatus.PENDING_SHIPMENT);
        order.setPayTime(LocalDateTime.now());
        order.setUpdatedAt(LocalDateTime.now());
        orderMapper.updateById(order);

        // 支付成功后，将商品状态改为已售出
        Goods goods = goodsMapper.selectById(order.getGoodsId());
        if (goods != null && goods.getStatus() == GoodsStatus.ON_SHELF) {
            goods.setStatus(GoodsStatus.SOLD);
            goodsMapper.updateById(goods);

            // 同步更新 SPU 的商品数量和价格范围
            if (goods.getModelId() != null) {
                spuService.syncProductCount(goods.getModelId());
                spuService.syncPriceRange(goods.getModelId());
            }
        }
    }

    @Override
    @Transactional
    public void ship(Long id, String expressCompany, String expressNo) {
        Long userId = getCurrentUserId();
        Order order = orderMapper.selectById(id);
        if (order == null) {
            throw new BusinessException("订单不存在");
        }
        if (!order.getSellerId().equals(userId)) {
            throw new BusinessException("无权操作此订单");
        }
        if (order.getStatus() != OrderStatus.PENDING_SHIPMENT) {
            throw new BusinessException("当前状态不能发货");
        }

        order.setStatus(OrderStatus.PENDING_RECEIPT);
        order.setExpressCompany(expressCompany);
        order.setExpressNo(expressNo);
        order.setShipTime(LocalDateTime.now());
        order.setUpdatedAt(LocalDateTime.now());
        orderMapper.updateById(order);
    }

    @Override
    @Transactional
    public void receive(Long id) {
        Long userId = getCurrentUserId();
        Order order = orderMapper.selectById(id);
        if (order == null) {
            throw new BusinessException("订单不存在");
        }
        if (!order.getUserId().equals(userId)) {
            throw new BusinessException("无权操作此订单");
        }
        if (order.getStatus() != OrderStatus.PENDING_RECEIPT) {
            throw new BusinessException("当前状态不能确认收货");
        }

        order.setStatus(OrderStatus.COMPLETED);
        order.setReceiveTime(LocalDateTime.now());
        order.setFinishTime(LocalDateTime.now());
        order.setUpdatedAt(LocalDateTime.now());
        orderMapper.updateById(order);
    }

    @Override
    @Transactional
    public void refund(Long id, String reason) {
        Long userId = getCurrentUserId();
        Order order = orderMapper.selectById(id);
        if (order == null) {
            throw new BusinessException("订单不存在");
        }
        if (!order.getUserId().equals(userId) && !order.getSellerId().equals(userId)) {
            throw new BusinessException("无权操作此订单");
        }
        if (order.getStatus() != OrderStatus.COMPLETED) {
            throw new BusinessException("只有已完成的订单才能申请退款");
        }

        order.setStatus(OrderStatus.REFUNDED);
        order.setCancelReason(reason);
        order.setCancelTime(LocalDateTime.now());
        order.setUpdatedAt(LocalDateTime.now());
        orderMapper.updateById(order);

        // 退款时重新上架商品（库存未被扣减，仅恢复状态）
        Goods goods = goodsMapper.selectById(order.getGoodsId());
        if (goods != null) {
            goods.setStatus(GoodsStatus.ON_SHELF);
            goodsMapper.updateById(goods);
        }
    }

    @Override
    public Order getById(Long id) {
        return orderMapper.selectById(id);
    }

    private Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new BusinessException("用户未登录");
        }
        return Long.parseLong(authentication.getName());
    }

    private String generateOrderNo() {
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        int random = ThreadLocalRandom.current().nextInt(100000, 999999);
        return "XM" + timestamp + random;
    }

    private OrderVO convertToVO(Order order) {
        OrderVO vo = new OrderVO();
        BeanUtils.copyProperties(order, vo);

        User seller = userService.getById(order.getSellerId());
        if (seller != null) {
            vo.setSellerName(seller.getNickname());
        }

        Goods goods = goodsMapper.selectById(order.getGoodsId());
        if (goods != null) {
            vo.setGoodsTitle(goods.getTitle());
            try {
                JsonNode images = objectMapper.readTree(goods.getImages());
                if (images.isArray() && images.size() > 0) {
                    vo.setGoodsCover(images.get(0).asText());
                }
            } catch (Exception e) {
                // ignore
            }
        }

        return vo;
    }

    @Override
    public Map<String, Long> getOrderCountByStatus() {
        Long userId = getCurrentUserId();

        Map<String, Long> counts = new HashMap<>();

        // 统计各状态订单数量
        for (OrderStatus status : OrderStatus.values()) {
            LambdaQueryWrapper<Order> wrapper = new LambdaQueryWrapper<Order>()
                    .eq(Order::getUserId, userId)
                    .eq(Order::getStatus, status);
            counts.put(status.name(), orderMapper.selectCount(wrapper));
        }

        return counts;
    }

    @Override
    public Map<String, Long> getSellerOrderCountByStatus() {
        Long userId = getCurrentUserId();

        Map<String, Long> counts = new HashMap<>();

        // 统计卖家各状态订单数量
        for (OrderStatus status : OrderStatus.values()) {
            LambdaQueryWrapper<Order> wrapper = new LambdaQueryWrapper<Order>()
                    .eq(Order::getSellerId, userId)
                    .eq(Order::getStatus, status);
            counts.put(status.name(), orderMapper.selectCount(wrapper));
        }

        return counts;
    }
}
