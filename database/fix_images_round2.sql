-- XinMall 商品图片修复脚本 - 第二轮
-- 修复goods表中无效的外部图片URL
-- 执行时间: 2026-03-20

-- 修复 iPhone 15 Pro Max 蓝色钛金属 (id=102)
UPDATE `goods` SET `images` = '["/uploads/goods/iphone15pro_1.jpg"]' WHERE `id` = 102;

-- 修复 小米14 Ultra (id=108, 109)
UPDATE `goods` SET `images` = '["/uploads/goods/mipad6max_1.jpg"]' WHERE `id` = 108;
UPDATE `goods` SET `images` = '["/uploads/goods/mipad6max_1.jpg"]' WHERE `id` = 109;

-- 修复 小米14 Pro (id=110)
UPDATE `goods` SET `images` = '["/uploads/goods/mipad6max_1.jpg"]' WHERE `id` = 110;

-- 修复 华为Mate 60 Pro (id=111, 112)
UPDATE `goods` SET `images` = '["/uploads/goods/huaweiwatchultimate_1.jpg"]' WHERE `id` = 111;
UPDATE `goods` SET `images` = '["/uploads/goods/huaweiwatchultimate_1.jpg"]' WHERE `id` = 112;

-- 修复 红魔9 Pro (id=115)
UPDATE `goods` SET `images` = '["/uploads/goods/tabs9ultra_1.jpg"]' WHERE `id` = 115;

-- 修复 vivo X100 Pro (id=116, 117)
UPDATE `goods` SET `images` = '["/uploads/goods/tabs9ultra_1.jpg"]' WHERE `id` = 116;
UPDATE `goods` SET `images` = '["/uploads/goods/tabs9ultra_1.jpg"]' WHERE `id` = 117;

-- 修复 OPPO Find X7 Ultra (id=118, 119)
UPDATE `goods` SET `images` = '["/uploads/goods/tabs9ultra_1.jpg"]' WHERE `id` = 118;
UPDATE `goods` SET `images` = '["/uploads/goods/tabs9ultra_1.jpg"]' WHERE `id` = 119;

-- 验证更新
SELECT id, title, images FROM goods WHERE id IN (102, 108, 109, 110, 111, 112, 115, 116, 117, 118, 119);
