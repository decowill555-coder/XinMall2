/*
 Goods测试数据脚本
 
 用途: 修复首页瀑布流无法展示问题
 执行方式: 在MySQL中执行此脚本
*/

USE xinmall;

-- 插入测试商品数据 (status=1 表示在售)
INSERT INTO `goods` (`title`, `seller_id`, `model_id`, `category_id`, `description`, `images`, `price`, `original_price`, `condition_level`, `condition_desc`, `warranty`, `invoice`, `can_bargain`, `location`, `stock`, `view_count`, `like_count`, `status`, `created_at`, `updated_at`) VALUES
('iPhone 15 Pro Max 256GB 原色钛金属', 1, 1, 1, '99新，无划痕，配件齐全', '["https://picsum.photos/400/400?random=1"]', 8999.00, 9999.00, 10, '全新未拆封', 1, 1, 1, '北京', 1, 156, 23, 1, NOW(), NOW()),
('华为 Mate 60 Pro+ 512GB', 2, 4, 1, '95新，轻微使用痕迹', '["https://picsum.photos/400/400?random=2"]', 7999.00, 8999.00, 9, '轻微划痕', 1, 0, 1, '上海', 1, 89, 12, 1, NOW(), NOW()),
('小米14 Ultra 16+512 黑色', 3, 6, 1, '99新，全套配件', '["https://picsum.photos/400/400?random=3"]', 5999.00, 6499.00, 10, '几乎全新', 1, 1, 0, '深圳', 1, 234, 45, 1, NOW(), NOW()),
('MacBook Pro 14 M3 Pro', 1, 12, 2, '95新，电池健康度98%', '["https://picsum.photos/400/400?random=4"]', 14999.00, 16999.00, 9, '正常使用痕迹', 1, 1, 1, '北京', 1, 67, 8, 1, NOW(), NOW()),
('iPad Pro 12.9 M2 256GB', 2, 16, 5, '99新，带Apple Pencil', '["https://picsum.photos/400/400?random=5"]', 7999.00, 9299.00, 10, '屏幕完美', 1, 1, 1, '广州', 1, 123, 19, 1, NOW(), NOW()),
('AirPods Pro 2 主动降噪', 3, 18, 4, '全新未拆封', '["https://picsum.photos/400/400?random=6"]', 1699.00, 1899.00, 10, '全新', 1, 1, 0, '深圳', 1, 456, 78, 1, NOW(), NOW()),
('索尼 WH-1000XM5 头戴式耳机', 1, 19, 4, '95新，降噪效果极佳', '["https://picsum.photos/400/400?random=7"]', 1999.00, 2499.00, 9, '耳罩轻微磨损', 1, 0, 1, '上海', 1, 89, 15, 1, NOW(), NOW()),
('三星 Galaxy S24 Ultra', 2, 9, 1, '99新，国行在保', '["https://picsum.photos/400/400?random=8"]', 8499.00, 9699.00, 10, '完美成色', 1, 1, 1, '北京', 1, 178, 32, 1, NOW(), NOW());

SELECT CONCAT('已插入 ', ROW_COUNT(), ' 条商品数据') AS message;
