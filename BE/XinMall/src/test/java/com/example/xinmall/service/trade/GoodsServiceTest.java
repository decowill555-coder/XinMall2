package com.example.xinmall.service.trade;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.example.xinmall.common.exception.BusinessException;
import com.example.xinmall.dto.trade.request.GoodsPublishRequest;
import com.example.xinmall.dto.trade.response.GoodsVO;
import com.example.xinmall.entity.trade.Goods;
import com.example.xinmall.entity.trade.enums.GoodsStatus;
import com.example.xinmall.mapper.trade.GoodsMapper;
import com.example.xinmall.service.trade.impl.GoodsServiceImpl;
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
class GoodsServiceTest {

    @Mock
    private GoodsMapper goodsMapper;

    @InjectMocks
    private GoodsServiceImpl goodsService;

    private Goods testGoods;

    @BeforeEach
    void setUp() {
        testGoods = new Goods();
        testGoods.setId(1L);
        testGoods.setUserId(1L);
        testGoods.setTitle("测试商品");
        testGoods.setPrice(new BigDecimal("99.99"));
        testGoods.setConditionLevel(9);
        testGoods.setConditionDesc("几乎全新");
        testGoods.setDescription("这是一个测试商品");
        testGoods.setStatus(GoodsStatus.ON_SHELF);
        testGoods.setStock(1);
        testGoods.setViewCount(0);
        testGoods.setCreatedAt(LocalDateTime.now());
        testGoods.setUpdatedAt(LocalDateTime.now());
    }

    @Test
    @DisplayName("发布商品 - 成功")
    void testPublishSuccess() {
        mockSecurityContext();

        GoodsPublishRequest request = new GoodsPublishRequest();
        request.setTitle("新商品");
        request.setPrice(new BigDecimal("199.99"));
        request.setConditionLevel(9);
        request.setConditionDesc("全新");
        request.setDescription("商品描述");
        request.setImages(Arrays.asList("image1.jpg", "image2.jpg"));

        when(goodsMapper.insert(any(Goods.class))).thenAnswer(invocation -> {
            Goods goods = invocation.getArgument(0);
            goods.setId(1L);
            return 1;
        });

        Long result = goodsService.publish(request);

        assertNotNull(result);
        verify(goodsMapper).insert(any(Goods.class));
    }

    @Test
    @DisplayName("发布商品 - 标题为空")
    void testPublishEmptyTitle() {
        mockSecurityContext();

        GoodsPublishRequest request = new GoodsPublishRequest();
        request.setTitle("");
        request.setPrice(new BigDecimal("199.99"));
        request.setConditionLevel(9);

        assertThrows(BusinessException.class, () -> goodsService.publish(request));
    }

    @Test
    @DisplayName("商品列表查询 - 成功")
    void testSearchSuccess() {
        Page<Goods> page = new Page<>(1, 10);
        page.setRecords(Arrays.asList(testGoods));
        page.setTotal(1);

        when(goodsMapper.selectPage(any(Page.class), any(LambdaQueryWrapper.class))).thenReturn(page);

        IPage<GoodsVO> result = goodsService.search(null, null, null, null, 1, 10);

        assertNotNull(result);
        assertEquals(1, result.getTotal());
        assertEquals(1, result.getRecords().size());
    }

    @Test
    @DisplayName("商品详情 - 成功")
    void testGetDetailSuccess() {
        when(goodsMapper.selectById(1L)).thenReturn(testGoods);

        Goods result = goodsService.getById(1L);

        assertNotNull(result);
        assertEquals("测试商品", result.getTitle());
    }

    @Test
    @DisplayName("下架商品 - 成功")
    void testOffShelfSuccess() {
        mockSecurityContext();

        when(goodsMapper.selectById(1L)).thenReturn(testGoods);
        when(goodsMapper.updateById(any(Goods.class))).thenReturn(1);

        assertDoesNotThrow(() -> goodsService.offShelf(1L));
    }

    @Test
    @DisplayName("下架商品 - 商品不存在")
    void testOffShelfNotFound() {
        mockSecurityContext();

        when(goodsMapper.selectById(1L)).thenReturn(null);

        BusinessException exception = assertThrows(BusinessException.class,
                () -> goodsService.offShelf(1L));
        assertEquals("商品不存在", exception.getMessage());
    }

    @Test
    @DisplayName("上架商品 - 成功")
    void testOnShelfSuccess() {
        mockSecurityContext();
        testGoods.setStatus(GoodsStatus.OFF_SHELF);

        when(goodsMapper.selectById(1L)).thenReturn(testGoods);
        when(goodsMapper.updateById(any(Goods.class))).thenReturn(1);

        assertDoesNotThrow(() -> goodsService.onShelf(1L));
    }

    @Test
    @DisplayName("上架商品 - 商品已售出")
    void testOnShelfSold() {
        mockSecurityContext();
        testGoods.setStatus(GoodsStatus.SOLD);

        when(goodsMapper.selectById(1L)).thenReturn(testGoods);

        BusinessException exception = assertThrows(BusinessException.class,
                () -> goodsService.onShelf(1L));
        assertEquals("商品已售出，无法上架", exception.getMessage());
    }

    private void mockSecurityContext() {
        Authentication authentication = mock(Authentication.class);
        when(authentication.isAuthenticated()).thenReturn(true);
        when(authentication.getName()).thenReturn("1");

        SecurityContext securityContext = mock(SecurityContext.class);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);
    }
}
