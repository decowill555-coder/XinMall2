package com.example.xinmall.task;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.example.xinmall.entity.spu.Spu;
import com.example.xinmall.entity.trade.Goods;
import com.example.xinmall.entity.trade.enums.GoodsStatus;
import com.example.xinmall.mapper.spu.SpuMapper;
import com.example.xinmall.mapper.trade.GoodsMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

/**
 * SPU 统计数据同步定时任务
 * <p>
 * 定期同步 SPU 表中的商品数量和价格范围统计数据
 * 确保统计数据与实际商品状态保持一致
 * </p>
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class SpuStatsSyncTask {

    private final SpuMapper spuMapper;
    private final GoodsMapper goodsMapper;

    /**
     * 每天凌晨 3 点执行 SPU 统计数据同步
     */
    @Scheduled(cron = "0 0 3 * * ?")
    @Transactional
    public void syncSpuStats() {
        log.info("开始同步 SPU 统计数据...");

        // 获取所有活跃的 SPU
        LambdaQueryWrapper<Spu> spuWrapper = new LambdaQueryWrapper<>();
        spuWrapper.eq(Spu::getStatus, 1); // 只处理活跃状态的 SPU
        List<Spu> spuList = spuMapper.selectList(spuWrapper);

        int successCount = 0;
        int errorCount = 0;

        for (Spu spu : spuList) {
            try {
                syncSingleSpuStats(spu);
                successCount++;
            } catch (Exception e) {
                log.error("同步 SPU {} 统计数据失败: {}", spu.getId(), e.getMessage());
                errorCount++;
            }
        }

        log.info("SPU 统计数据同步完成。成功: {}, 失败: {}", successCount, errorCount);
    }

    /**
     * 同步单个 SPU 的统计数据
     */
    private void syncSingleSpuStats(Spu spu) {
        Long spuId = spu.getId();

        // 统计在售商品数量
        LambdaQueryWrapper<Goods> goodsWrapper = new LambdaQueryWrapper<>();
        goodsWrapper.eq(Goods::getModelId, spuId)
                .eq(Goods::getStatus, GoodsStatus.ON_SHELF);

        Long productCount = goodsMapper.selectCount(goodsWrapper);

        // 计算价格范围
        LambdaQueryWrapper<Goods> priceWrapper = new LambdaQueryWrapper<>();
        priceWrapper.eq(Goods::getModelId, spuId)
                .eq(Goods::getStatus, GoodsStatus.ON_SHELF)
                .select(Goods::getPrice);

        List<Goods> goodsList = goodsMapper.selectList(priceWrapper);

        BigDecimal minPrice = null;
        BigDecimal maxPrice = null;

        for (Goods goods : goodsList) {
            if (goods.getPrice() != null) {
                if (minPrice == null || goods.getPrice().compareTo(minPrice) < 0) {
                    minPrice = goods.getPrice();
                }
                if (maxPrice == null || goods.getPrice().compareTo(maxPrice) > 0) {
                    maxPrice = goods.getPrice();
                }
            }
        }

        // 更新 SPU 统计数据
        spu.setProductCount(productCount != null ? productCount.intValue() : 0);
        spu.setPriceMin(minPrice);
        spu.setPriceMax(maxPrice);
        spuMapper.updateById(spu);
    }
}
