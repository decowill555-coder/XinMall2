-- =====================================================
-- XinMall 数据修复脚本 - 商品状态和库存修复
-- 问题：部分商品 status 值不正确，库存为0，导致搜索无法找到
-- 解决：将所有有效商品设置为在售状态，补充库存
-- =====================================================

-- 查看当前商品状态分布
SELECT status,
       CASE status
           WHEN 0 THEN '下架'
           WHEN 1 THEN '在售'
           WHEN 2 THEN '已售'
           WHEN 3 THEN '审核中'
           ELSE '未知'
       END as status_name,
       COUNT(*) as count
FROM goods
WHERE deleted = 0
GROUP BY status;

-- 修复：将所有未删除的商品设置为在售状态 (status = 1)
-- 注意：如果商品确实是已售出状态，应该保持 status = 2
-- 这里假设测试数据都应该是在售状态

-- 方案1：将所有商品设为在售（适合测试环境）
UPDATE goods
SET status = 1
WHERE deleted = 0;

-- 方案2：仅将已售商品中有库存的设为在售（适合生产环境）
-- UPDATE goods
-- SET status = 1
-- WHERE deleted = 0
--   AND status = 2
--   AND stock > 0;

-- 修复：将库存为0或NULL的商品设置库存为10
UPDATE goods
SET stock = 10
WHERE deleted = 0
  AND (stock = 0 OR stock IS NULL);

-- 验证修复结果
SELECT '修复后的商品状态分布:' as info;
SELECT status,
       CASE status
           WHEN 0 THEN '下架'
           WHEN 1 THEN '在售'
           WHEN 2 THEN '已售'
           WHEN 3 THEN '审核中'
           ELSE '未知'
       END as status_name,
       COUNT(*) as count
FROM goods
WHERE deleted = 0
GROUP BY status;

-- 验证搜索功能
SELECT '验证搜索 - iPhone 商品:' as info;
SELECT id, title, status
FROM goods
WHERE deleted = 0
  AND status = 1
  AND title LIKE '%iPhone%'
LIMIT 10;

SELECT '验证搜索 - 华为 商品:' as info;
SELECT id, title, status
FROM goods
WHERE deleted = 0
  AND status = 1
  AND title LIKE '%华为%'
LIMIT 10;

SELECT '验证搜索 - MacBook 商品:' as info;
SELECT id, title, status
FROM goods
WHERE deleted = 0
  AND status = 1
  AND title LIKE '%MacBook%'
LIMIT 10;
