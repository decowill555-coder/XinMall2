-- 修复SPU表中brand_id不匹配的问题
-- 问题：小米产品的brand_id指向华为(2)，华为产品的brand_id指向小米(3)

-- 修复小米产品的brand_id (从2改为3)
UPDATE `spu` SET `brand_id` = 3 WHERE `id` IN (4, 5);

-- 修复华为产品的brand_id (从3改为2)
UPDATE `spu` SET `brand_id` = 2 WHERE `id` IN (6, 7);

-- 验证修复结果
-- SELECT s.id, s.name, s.brand_id, b.name as brand_name
-- FROM spu s
-- LEFT JOIN brand b ON s.brand_id = b.id;
