-- 图片URL更新脚本
-- 执行此脚本前请确保uploads目录中有对应的图片文件

-- 更新Banner图片 (数据库中使用1-4.jpg, 文件实际命名为banner1-4.jpg)
UPDATE `banner` SET `image` = '/uploads/banners/banner1.jpg' WHERE `id` = 1;
UPDATE `banner` SET `image` = '/uploads/banners/banner2.jpg' WHERE `id` = 2;
UPDATE `banner` SET `image` = '/uploads/banners/banner3.jpg' WHERE `id` = 3;
UPDATE `banner` SET `image` = '/uploads/banners/banner4.jpg' WHERE `id` = 4;

-- 品牌Logo已经正确指向 /uploads/brands/*.png (apple.png, huawei.png, xiaomi.png, samsung.png, oppo.png, vivo.png, sony.png, lenovo.png, asus.png, dell.png)
-- 分类图标已经正确指向 /uploads/icons/*.png (phone.png, computer.png, camera.png, headphone.png, tablet.png, watch.png)
-- 产品图片已经正确指向 /uploads/products/*.jpg (1.jpg - 20.jpg)
-- 商品图片已经正确指向 /uploads/goods/*.jpg (1.jpg - 8.jpg)

-- 注意：以上数据在 xinmall_real_data.sql 中已经正确设置
-- 如果数据库中已有旧数据需要更新，请执行以下语句:

-- 更新商品图片 (使用实际存在的图片)
UPDATE `goods` SET `images` = '["/uploads/goods/1.jpg"]' WHERE `id` = 1;
UPDATE `goods` SET `images` = '["/uploads/goods/2.jpg"]' WHERE `id` = 2;
UPDATE `goods` SET `images` = '["/uploads/goods/3.jpg"]' WHERE `id` = 3;
UPDATE `goods` SET `images` = '["/uploads/goods/4.jpg"]' WHERE `id` = 4;
UPDATE `goods` SET `images` = '["/uploads/goods/5.jpg"]' WHERE `id` = 5;
UPDATE `goods` SET `images` = '["/uploads/goods/6.jpg"]' WHERE `id` = 6;
UPDATE `goods` SET `images` = '["/uploads/goods/7.jpg"]' WHERE `id` = 7;
UPDATE `goods` SET `images` = '["/uploads/goods/8.jpg"]' WHERE `id` = 8;

-- 执行完成
SELECT '图片URL更新完成!' AS message;
