package com.example.xinmall.service.trade;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.example.xinmall.common.exception.BusinessException;
import com.example.xinmall.dto.trade.request.OrderCreateRequest;
import com.example.xinmall.dto.trade.response.OrderVO;
import com.example.xinmall.entity.trade.Goods;
import com.example.xinmall.entity.trade.Order;
import com.example.xinmall.entity.trade.enums.GoodsStatus;
import com.example.xinmall.entity.trade.enums.OrderStatus;
import com.example.xinmall.mapper.trade.GoodsMapper;
import com.example.xinmall.mapper.trade.OrderMapper;
import com.example.xinmall.mapper.user.UserAddressMapper;
import com.example.xinmall.service.trade.impl.OrderServiceImpl;
import com.example.xinmall.service.user.UserService;
import tools.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Arrays;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class OrderServiceTest {

    @Mock
    private OrderMapper orderMapper;

    @Mock
    private GoodsMapper goodsMapper;

    @Mock
    private UserAddressMapper userAddressMapper;

    @Mock
    private UserService userService;

    @Mock
    private ObjectMapper objectMapper;

    @InjectMocks
    private OrderServiceImpl orderService;

    private Goods testGoods;
    private Order testOrder;

    @BeforeEach
    void setUp() {
        testGoods = new Goods();
        testGoods.setId(1L);
        testGoods.setSellerId(2L);
        testGoods.setTitle("测试商品");
        testGoods.setPrice(new BigDecimal("99.99"));
        testGoods.setStatus(GoodsStatus.ON_SHELF);
        testGoods.setStock(1);

        testOrder = new Order();
        testOrder.setId(1L);
        testOrder.setOrderNo("ORD202603140001");
        testOrder.setUserId(1L);
        testOrder.setSellerId(2L);
        testOrder.setGoodsId(1L);
        testOrder.setTotalAmount(new BigDecimal("99.99"));
        testOrder.setStatus(OrderStatus.PENDING_PAYMENT);
        testOrder.setQuantity(1);
        testOrder.setCreatedAt(LocalDateTime.now());
        testOrder.setUpdatedAt(LocalDateTime.now());
    }

    @Test
    @DisplayName("创建订单 - 成功")
    void testCreateOrderSuccess() {
        mockSecurityContext(1L);

        OrderCreateRequest request = new OrderCreateRequest();
        request.setGoodsId(1L);
        request.setQuantity(1);
        request.setAddressId(1L);

        when(goodsMapper.selectById(1L)).thenReturn(testGoods);
        when(orderMapper.insert(any(Order.class))).thenAnswer(invocation -> {
            Order order = invocation.getArgument(0);
            order.setId(1L);
            return 1;
        });
        when(goodsMapper.updateById(any(Goods.class))).thenReturn(1);

        Long result = orderService.create(request);

        assertNotNull(result);
        verify(orderMapper).insert(any(Order.class));
    }

    @Test
    @DisplayName("创建订单 - 商品不存在")
    void testCreateOrderGoodsNotFound() {
        mockSecurityContext(1L);

        OrderCreateRequest request = new OrderCreateRequest();
        request.setGoodsId(1L);
        request.setQuantity(1);

        when(goodsMapper.selectById(1L)).thenReturn(null);

        BusinessException exception = assertThrows(BusinessException.class,
                () -> orderService.create(request));
        assertEquals("商品不存在", exception.getMessage());
    }

    @Test
    @DisplayName("创建订单 - 不能购买自己的商品")
    void testCreateOrderOwnGoods() {
        mockSecurityContext(2L);

        OrderCreateRequest request = new OrderCreateRequest();
        request.setGoodsId(1L);
        request.setQuantity(1);

        when(goodsMapper.selectById(1L)).thenReturn(testGoods);

        BusinessException exception = assertThrows(BusinessException.class,
                () -> orderService.create(request));
        assertEquals("不能购买自己的商品", exception.getMessage());
    }

    @Test
    @DisplayName("创建订单 - 商品已下架")
    void testCreateOrderGoodsOffShelf() {
        mockSecurityContext(1L);
        testGoods.setStatus(GoodsStatus.OFF_SHELF);

        OrderCreateRequest request = new OrderCreateRequest();
        request.setGoodsId(1L);
        request.setQuantity(1);

        when(goodsMapper.selectById(1L)).thenReturn(testGoods);

        BusinessException exception = assertThrows(BusinessException.class,
                () -> orderService.create(request));
        assertEquals("商品已下架或已售出", exception.getMessage());
    }

    @Test
    @DisplayName("取消订单 - 成功")
    void testCancelOrderSuccess() {
        mockSecurityContext(1L);

        when(orderMapper.selectById(1L)).thenReturn(testOrder);
        when(orderMapper.updateById(any(Order.class))).thenReturn(1);
        when(goodsMapper.selectById(1L)).thenReturn(testGoods);
        when(goodsMapper.updateById(any(Goods.class))).thenReturn(1);

        assertDoesNotThrow(() -> orderService.cancel(1L, "不想要了"));
    }

    @Test
    @DisplayName("取消订单 - 订单不存在")
    void testCancelOrderNotFound() {
        mockSecurityContext(1L);

        when(orderMapper.selectById(1L)).thenReturn(null);

        BusinessException exception = assertThrows(BusinessException.class,
                () -> orderService.cancel(1L, "不想要了"));
        assertEquals("订单不存在", exception.getMessage());
    }

    @Test
    @DisplayName("取消订单 - 状态不允许取消")
    void testCancelOrderInvalidStatus() {
        mockSecurityContext(1L);
        testOrder.setStatus(OrderStatus.COMPLETED);

        when(orderMapper.selectById(1L)).thenReturn(testOrder);

        BusinessException exception = assertThrows(BusinessException.class,
                () -> orderService.cancel(1L, "不想要了"));
        assertEquals("当前状态不能取消", exception.getMessage());
    }

    @Test
    @DisplayName("发货 - 成功")
    void testShipSuccess() {
        mockSecurityContext(2L);
        testOrder.setStatus(OrderStatus.PENDING_SHIPMENT);

        when(orderMapper.selectById(1L)).thenReturn(testOrder);
        when(orderMapper.updateById(any(Order.class))).thenReturn(1);

        assertDoesNotThrow(() -> orderService.ship(1L, "SF1234567890", "顺丰快递"));
    }

    @Test
    @DisplayName("发货 - 非卖家操作")
    void testShipNotSeller() {
        mockSecurityContext(1L);
        testOrder.setStatus(OrderStatus.PENDING_SHIPMENT);

        when(orderMapper.selectById(1L)).thenReturn(testOrder);

        BusinessException exception = assertThrows(BusinessException.class,
                () -> orderService.ship(1L, "SF1234567890", "顺丰快递"));
        assertEquals("无权操作此订单", exception.getMessage());
    }

    @Test
    @DisplayName("确认收货 - 成功")
    void testReceiveSuccess() {
        mockSecurityContext(1L);
        testOrder.setStatus(OrderStatus.PENDING_RECEIPT);

        when(orderMapper.selectById(1L)).thenReturn(testOrder);
        when(orderMapper.updateById(any(Order.class))).thenReturn(1);

        assertDoesNotThrow(() -> orderService.receive(1L));
    }

    @Test
    @DisplayName("确认收货 - 非买家操作")
    void testReceiveNotBuyer() {
        mockSecurityContext(2L);
        testOrder.setStatus(OrderStatus.PENDING_RECEIPT);

        when(orderMapper.selectById(1L)).thenReturn(testOrder);

        BusinessException exception = assertThrows(BusinessException.class,
                () -> orderService.receive(1L));
        assertEquals("无权操作此订单", exception.getMessage());
    }

    @Test
    @DisplayName("退款 - 成功")
    void testRefundSuccess() {
        mockSecurityContext(1L);
        testOrder.setStatus(OrderStatus.COMPLETED);

        when(orderMapper.selectById(1L)).thenReturn(testOrder);
        when(orderMapper.updateById(any(Order.class))).thenReturn(1);
        when(goodsMapper.selectById(1L)).thenReturn(testGoods);
        when(goodsMapper.updateById(any(Goods.class))).thenReturn(1);

        assertDoesNotThrow(() -> orderService.refund(1L, "不想要了"));
    }

    @Test
    @DisplayName("退款 - 订单未完成")
    void testRefundNotCompleted() {
        mockSecurityContext(1L);
        testOrder.setStatus(OrderStatus.PENDING_PAYMENT);

        when(orderMapper.selectById(1L)).thenReturn(testOrder);

        BusinessException exception = assertThrows(BusinessException.class,
                () -> orderService.refund(1L, "不想要了"));
        assertEquals("只有已完成的订单才能申请退款", exception.getMessage());
    }

    @Test
    @DisplayName("订单列表查询 - 成功")
    void testGetOrderListSuccess() {
        mockSecurityContext(1L);

        Page<Order> page = new Page<>(1, 10);
        page.setRecords(Arrays.asList(testOrder));
        page.setTotal(1);

        when(orderMapper.selectPage(any(Page.class), any(LambdaQueryWrapper.class))).thenReturn(page);

        IPage<OrderVO> result = orderService.getMyOrders(null, 1, 10);

        assertNotNull(result);
        assertEquals(1, result.getTotal());
    }

    private void mockSecurityContext(Long userId) {
        Authentication authentication = mock(Authentication.class);
        when(authentication.isAuthenticated()).thenReturn(true);
        when(authentication.getName()).thenReturn(userId.toString());

        SecurityContext securityContext = mock(SecurityContext.class);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);
    }
}
