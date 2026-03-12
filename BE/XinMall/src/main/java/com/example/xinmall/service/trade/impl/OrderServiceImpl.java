package com.example.xinmall.service.trade.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.example.xinmall.common.exception.BusinessException;
import com.example.xinmall.dto.trade.request.OrderCreateRequest;
import com.example.xinmall.dto.trade.response.OrderDetailVO;
import com.example.xinmall.dto.trade.response.OrderVO;
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
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.concurrent.ThreadLocalRandom;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderMapper orderMapper;
    private final GoodsMapper goodsMapper;
    private final UserAddressMapper userAddressMapper;
    private final UserService userService;
    private final ObjectMapper objectMapper;

    @Override
    @Transactional
    public Long create(OrderCreateRequest request) {
        Long userId = getCurrentUserId();

        Goods goods = goodsMapper.selectById(request.getGoodsId());
        if (goods == null) {
            throw new BusinessException("商品不存在");
        }
        if (goods.getStatus() != GoodsStatus.SOLD) {
            throw new BusinessException("商品已下架或已售出");
        }
        if (goods.getSellerId().equals(userId)) {
            throw new BusinessException("不能购买自己的商品");
        }
        if (goods.getStock() < request.getQuantity()) {
            throw new BusinessException("库存不足");
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

        goods.setStock(goods.getStock() - request.getQuantity());
        if (goods.getStock() == 0) {
            goods.setStatus(GoodsStatus.SOLD);
        }
        goodsMapper.updateById(goods);

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

        User buyer = userService.getById(order.getUserId());
        if (buyer != null) {
            vo.setUserName(buyer.getNickname());
        }

        User seller = userService.getById(order.getSellerId());
        if (seller != null) {
            vo.setSellerName(seller.getNickname());
        }

        return vo;
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

        Goods goods = goodsMapper.selectById(order.getGoodsId());
        if (goods != null) {
            goods.setStock(goods.getStock() + order.getQuantity());
            if (goods.getStatus() == GoodsStatus.SOLD) {
                goods.setStatus(GoodsStatus.ON_SHELF);
            }
            goodsMapper.updateById(goods);
        }
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
}
