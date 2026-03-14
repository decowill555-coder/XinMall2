/*
 XinMall 测试数据脚本
 
 版本: v1.0
 更新时间: 2026-03-12
 说明: 插入基础测试数据
*/

USE xinmall;

-- ============================================================
-- 一、分类数据
-- ============================================================

INSERT INTO `category` (`id`, `name`, `parent_id`, `level`, `icon`, `sort`, `status`) VALUES
(1, '手机', 0, 1, '/icons/phone.png', 1, 1),
(2, '电脑', 0, 1, '/icons/computer.png', 2, 1),
(3, '相机', 0, 1, '/icons/camera.png', 3, 1),
(4, '耳机', 0, 1, '/icons/headphone.png', 4, 1),
(5, '平板', 0, 1, '/icons/tablet.png', 5, 1),
(6, '智能手表', 0, 1, '/icons/watch.png', 6, 1),
(7, '游戏手机', 1, 2, NULL, 1, 1),
(8, '轻薄手机', 1, 2, NULL, 2, 1),
(9, '拍照手机', 1, 2, NULL, 3, 1);

-- ============================================================
-- 二、品牌数据
-- ============================================================

INSERT INTO `brand` (`id`, `name`, `logo`, `description`, `sort`, `status`) VALUES
(1, '苹果', '/brands/apple.png', 'Apple Inc.', 1, 1),
(2, '华为', '/brands/huawei.png', 'Huawei', 2, 1),
(3, '小米', '/brands/xiaomi.png', 'Xiaomi', 3, 1),
(4, '三星', '/brands/samsung.png', 'Samsung', 4, 1),
(5, 'OPPO', '/brands/oppo.png', 'OPPO', 5, 1),
(6, 'vivo', '/brands/vivo.png', 'vivo', 6, 1),
(7, '索尼', '/brands/sony.png', 'Sony', 7, 1),
(8, '联想', '/brands/lenovo.png', 'Lenovo', 8, 1),
(9, '华硕', '/brands/asus.png', 'ASUS', 9, 1),
(10, '戴尔', '/brands/dell.png', 'Dell', 10, 1);

-- ============================================================
-- 三、品牌分类关联
-- ============================================================

INSERT INTO `brand_category` (`brand_id`, `category_id`) VALUES
(1, 1), (1, 2), (1, 5), (1, 6), (1, 4),
(2, 1), (2, 2), (2, 5), (2, 6), (2, 4),
(3, 1), (3, 2), (3, 5), (3, 6), (3, 4),
(4, 1), (4, 2), (4, 5), (4, 6), (4, 4),
(5, 1), (5, 6), (5, 4),
(6, 1), (6, 6), (6, 4),
(7, 1), (7, 3), (7, 4), (7, 5),
(8, 2), (8, 5),
(9, 2), (9, 5),
(10, 2), (10, 5);

-- ============================================================
-- 四、属性模板
-- ============================================================

INSERT INTO `attribute` (`id`, `name`, `unit`, `input_type`, `sort`, `status`) VALUES
(1, '屏幕尺寸', '英寸', 2, 1, 1),
(2, '处理器型号', NULL, 1, 2, 1),
(3, '屏幕类型', NULL, 3, 3, 1),
(4, '电池容量', 'mAh', 2, 4, 1),
(5, '是否支持快充', NULL, 5, 5, 1),
(6, '网络制式', NULL, 4, 6, 1),
(7, '运行内存', 'GB', 2, 7, 1),
(8, '存储容量', 'GB', 2, 8, 1),
(9, '后置摄像头', '万像素', 2, 9, 1),
(10, '前置摄像头', '万像素', 2, 10, 1),
(11, '屏幕分辨率', NULL, 1, 11, 1),
(12, '刷新率', 'Hz', 2, 12, 1),
(13, 'CPU型号', NULL, 1, 13, 1),
(14, '显卡型号', NULL, 1, 14, 1),
(15, '硬盘容量', 'GB', 2, 15, 1),
(16, '有效像素', '万像素', 2, 16, 1),
(17, '传感器尺寸', NULL, 1, 17, 1),
(18, '镜头卡口', NULL, 1, 18, 1),
(19, '续航时间', '小时', 2, 19, 1),
(20, '降噪功能', NULL, 5, 20, 1),
(21, '佩戴方式', NULL, 3, 21, 1),
(22, '连接方式', NULL, 4, 22, 1),
(23, '防水等级', NULL, 1, 23, 1),
(24, '重量', 'g', 2, 24, 1),
(25, '操作系统', NULL, 1, 25, 1);

-- ============================================================
-- 五、属性选项值
-- ============================================================

INSERT INTO `attribute_option` (`attribute_id`, `value`, `sort`) VALUES
(3, 'OLED', 1),
(3, 'LCD', 2),
(3, 'AMOLED', 3),
(3, 'LTPO', 4),
(6, '5G', 1),
(6, '4G', 2),
(6, '3G', 3),
(21, '入耳式', 1),
(21, '头戴式', 2),
(21, '挂耳式', 3),
(21, '颈挂式', 4),
(22, '蓝牙', 1),
(22, '有线', 2),
(22, '2.4G无线', 3);

-- ============================================================
-- 六、分类属性关联（手机分类）
-- ============================================================

INSERT INTO `category_attribute` (`category_id`, `attribute_id`, `is_required`, `is_filter`, `is_show`, `sort`) VALUES
(1, 1, 1, 1, 1, 1),
(1, 2, 1, 1, 1, 2),
(1, 3, 0, 1, 1, 3),
(1, 4, 1, 1, 1, 4),
(1, 5, 0, 0, 1, 5),
(1, 6, 0, 1, 1, 6),
(1, 7, 1, 1, 1, 7),
(1, 8, 1, 1, 1, 8),
(1, 9, 0, 0, 1, 9),
(1, 10, 0, 0, 1, 10),
(1, 11, 0, 0, 1, 11),
(1, 12, 0, 1, 1, 12),
(1, 24, 0, 0, 1, 13),
(1, 25, 0, 0, 1, 14);

-- ============================================================
-- 七、产品型号数据
-- ============================================================

INSERT INTO `product_model` (`id`, `name`, `brand_id`, `category_id`, `cover`, `description`, `release_date`, `reference_price`, `status`, `sort`) VALUES
(1, 'iPhone 15 Pro Max', 1, 1, '/products/iphone15pm.jpg', 'iPhone 15 Pro Max', '2023-09-22', 9999.00, 1, 1),
(2, 'iPhone 15 Pro', 1, 1, '/products/iphone15p.jpg', 'iPhone 15 Pro', '2023-09-22', 7999.00, 1, 2),
(3, 'iPhone 15', 1, 1, '/products/iphone15.jpg', 'iPhone 15', '2023-09-22', 5999.00, 1, 3),
(4, 'Mate 60 Pro+', 2, 1, '/products/mate60pro.jpg', 'Huawei Mate 60 Pro+', '2023-08-29', 8999.00, 1, 4),
(5, 'Mate 60 Pro', 2, 1, '/products/mate60pro.jpg', 'Huawei Mate 60 Pro', '2023-08-29', 6999.00, 1, 5),
(6, 'Xiaomi 14 Ultra', 3, 1, '/products/mi14ultra.jpg', 'Xiaomi 14 Ultra', '2024-02-22', 6499.00, 1, 6),
(7, 'Xiaomi 14 Pro', 3, 1, '/products/mi14pro.jpg', 'Xiaomi 14 Pro', '2023-10-26', 4999.00, 1, 7),
(8, 'Xiaomi 14', 3, 1, '/products/mi14.jpg', 'Xiaomi 14', '2023-10-26', 3999.00, 1, 8),
(9, 'Galaxy S24 Ultra', 4, 1, '/products/s24ultra.jpg', 'Samsung Galaxy S24 Ultra', '2024-01-17', 9699.00, 1, 9),
(10, 'Find X7 Ultra', 5, 1, '/products/findx7ultra.jpg', 'OPPO Find X7 Ultra', '2024-01-08', 5999.00, 1, 10),
(11, 'X100 Pro', 6, 1, '/products/x100pro.jpg', 'vivo X100 Pro', '2023-11-13', 4999.00, 1, 11),
(12, 'MacBook Pro 14', 1, 2, '/products/mbp14.jpg', 'MacBook Pro 14 M3 Pro', '2023-11-07', 16999.00, 1, 1),
(13, 'MacBook Air 15', 1, 2, '/products/mba15.jpg', 'MacBook Air 15 M3', '2023-06-05', 10999.00, 1, 2),
(14, 'ThinkPad X1 Carbon', 8, 2, '/products/x1carbon.jpg', 'ThinkPad X1 Carbon', '2023-06-01', 12999.00, 1, 3),
(15, 'ROG Zephyrus G16', 9, 2, '/products/rog16.jpg', 'ROG Zephyrus G16', '2024-01-01', 15999.00, 1, 4),
(16, 'iPad Pro 12.9', 1, 5, '/products/ipadpro.jpg', 'iPad Pro 12.9 M2', '2022-10-26', 9299.00, 1, 1),
(17, 'iPad Air 5', 1, 5, '/products/ipadair.jpg', 'iPad Air 5 M1', '2022-03-18', 4799.00, 1, 2),
(18, 'AirPods Pro 2', 1, 4, '/products/app2.jpg', 'AirPods Pro 2nd Gen', '2022-09-23', 1899.00, 1, 1),
(19, 'WH-1000XM5', 7, 4, '/products/xm5.jpg', 'Sony WH-1000XM5', '2022-05-20', 2499.00, 1, 2),
(20, 'Apple Watch Ultra 2', 1, 6, '/products/awultra.jpg', 'Apple Watch Ultra 2', '2023-09-22', 6499.00, 1, 1);

-- ============================================================
-- 八、产品型号属性值
-- ============================================================

INSERT INTO `product_model_attribute` (`model_id`, `attribute_id`, `value`) VALUES
(1, 1, '6.7'),
(1, 2, 'A17 Pro'),
(1, 3, '1'),
(1, 4, '4422'),
(1, 5, '1'),
(1, 6, '4,5'),
(1, 7, '8'),
(1, 8, '256'),
(1, 9, '4800'),
(1, 10, '1200'),
(1, 11, '2796x1290'),
(1, 12, '120'),
(1, 24, '221'),
(1, 25, 'iOS'),
(2, 1, '6.1'),
(2, 2, 'A17 Pro'),
(2, 3, '1'),
(2, 4, '3274'),
(2, 5, '1'),
(2, 6, '4,5'),
(2, 7, '8'),
(2, 8, '128'),
(2, 24, '187'),
(2, 25, 'iOS'),
(3, 1, '6.1'),
(3, 2, 'A16'),
(3, 3, '1'),
(3, 4, '3349'),
(3, 5, '1'),
(3, 6, '4,5'),
(3, 7, '6'),
(3, 8, '128'),
(3, 24, '171'),
(3, 25, 'iOS'),
(4, 1, '6.82'),
(4, 2, 'Kirin 9000S'),
(4, 3, '3'),
(4, 4, '5000'),
(4, 5, '1'),
(4, 6, '4,5'),
(4, 7, '16'),
(4, 8, '512'),
(4, 24, '225'),
(4, 25, 'HarmonyOS'),
(5, 1, '6.82'),
(5, 2, 'Kirin 9000S'),
(5, 3, '3'),
(5, 4, '5000'),
(5, 5, '1'),
(5, 6, '4,5'),
(5, 7, '12'),
(5, 8, '256'),
(5, 24, '225'),
(5, 25, 'HarmonyOS'),
(6, 1, '6.73'),
(6, 2, 'Snapdragon 8 Gen 3'),
(6, 3, '4'),
(6, 4, '5000'),
(6, 5, '1'),
(6, 6, '4,5'),
(6, 7, '16'),
(6, 8, '512'),
(6, 24, '219'),
(6, 25, 'Android'),
(7, 1, '6.73'),
(7, 2, 'Snapdragon 8 Gen 3'),
(7, 3, '4'),
(7, 4, '4880'),
(7, 5, '1'),
(7, 6, '4,5'),
(7, 7, '16'),
(7, 8, '256'),
(7, 24, '223'),
(7, 25, 'Android'),
(8, 1, '6.36'),
(8, 2, 'Snapdragon 8 Gen 3'),
(8, 3, '3'),
(8, 4, '4610'),
(8, 5, '1'),
(8, 6, '4,5'),
(8, 7, '16'),
(8, 8, '256'),
(8, 24, '193'),
(8, 25, 'Android');

-- ============================================================
-- 九、测试用户数据
-- ============================================================

INSERT INTO `user` (`id`, `phone`, `password`, `nickname`, `avatar`, `gender`, `status`) VALUES
(1, '13800138001', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5EH', 'user01', '/avatars/user1.jpg', 1, 1),
(2, '13800138002', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5EH', 'user02', '/avatars/user2.jpg', 1, 1),
(3, '13800138003', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5EH', 'user03', '/avatars/user3.jpg', 2, 1);

INSERT INTO `user_profile` (`user_id`, `real_name_status`, `shop_auth_status`) VALUES
(1, 2, 2),
(2, 2, 0),
(3, 2, 2);

INSERT INTO `user_address` (`user_id`, `name`, `phone`, `province`, `city`, `district`, `detail`, `is_default`) VALUES
(1, 'Wang Ming', '13800138001', 'Beijing', 'Beijing', 'Haidian', 'Zhongguancun Street 1', 1),
(2, 'Li Hua', '13800138002', 'Shanghai', 'Shanghai', 'Pudong', 'Zhangjiang Hi-Tech Park', 1),
(3, 'Zhang Fang', '13800138003', 'Guangdong', 'Shenzhen', 'Nanshan', 'Science Park South', 1);

-- ============================================================
-- 十、测试店铺数据
-- ============================================================

INSERT INTO `shop` (`id`, `user_id`, `name`, `avatar`, `description`, `rating`, `status`) VALUES
(1, 1, 'Digital Store', '/shops/shop1.jpg', 'Quality digital products', 4.8, 1),
(2, 3, 'Camera Shop', '/shops/shop2.jpg', 'Professional camera equipment', 4.9, 1);

SELECT 'Test data inserted!' AS message;
