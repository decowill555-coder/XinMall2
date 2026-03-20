-- XinMall 图片修复脚本
-- 修复SPU表中的无效图片URL
-- 执行时间: 2026-03-20

-- 修复iPhone系列 (使用本地iPhone图片)
UPDATE `spu` SET `cover` = '/uploads/goods/iphone15pro_1.jpg' WHERE `id` = 1;  -- iPhone 15 Pro Max
UPDATE `spu` SET `cover` = '/uploads/goods/iphone15pro_1.jpg' WHERE `id` = 2;  -- iPhone 15 Pro
UPDATE `spu` SET `cover` = '/uploads/goods/iphone15_1.jpg' WHERE `id` = 3;     -- iPhone 15

-- 修复小米系列 (使用本地图片占位)
UPDATE `spu` SET `cover` = '/uploads/goods/mipad6max_1.jpg' WHERE `id` = 4;    -- 小米14 Ultra
UPDATE `spu` SET `cover` = '/uploads/goods/mipad6max_1.jpg' WHERE `id` = 5;    -- 小米14 Pro

-- 修复华为系列 (使用本地图片占位)
UPDATE `spu` SET `cover` = '/uploads/goods/huaweiwatchultimate_1.jpg' WHERE `id` = 6;  -- 华为Mate 60 Pro
UPDATE `spu` SET `cover` = '/uploads/goods/huaweiwatchultimate_1.jpg' WHERE `id` = 7;  -- 华为Mate 60

-- 修复MacBook系列 (使用本地MacBook图片)
UPDATE `spu` SET `cover` = '/uploads/goods/macbookpro16_1.jpg' WHERE `id` = 8;  -- MacBook Pro 14
UPDATE `spu` SET `cover` = '/uploads/goods/macbookairm3_1.jpg' WHERE `id` = 9;  -- MacBook Air 15

-- 修复Galaxy系列 (使用本地图片占位)
UPDATE `spu` SET `cover` = '/uploads/goods/tabs9ultra_1.jpg' WHERE `id` = 10;  -- Galaxy S24 Ultra

-- 验证更新
SELECT id, name, cover FROM spu WHERE id <= 10;
