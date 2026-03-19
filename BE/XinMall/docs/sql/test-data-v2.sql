-- XinMall 测试数据SQL脚本
-- 执行前请确保已执行 init.sql 和 spu_community_tables.sql
-- 创建时间：2026-03-14

-- =============================================
-- 一、品牌和分类数据（如果尚未存在）
-- =============================================

-- 确保分类数据存在
INSERT IGNORE INTO category (id, name, parent_id, level, icon, image, sort, status, created_at, updated_at) VALUES
(1, '手机', 0, 1, 'https://example.com/icons/phone.png', 'https://example.com/images/phone.jpg', 1, 1, NOW(), NOW()),
(2, '电脑', 0, 1, 'https://example.com/icons/computer.png', 'https://example.com/images/computer.jpg', 2, 1, NOW(), NOW()),
(3, '平板', 0, 1, 'https://example.com/icons/tablet.png', 'https://example.com/images/tablet.jpg', 3, 1, NOW(), NOW()),
(4, '耳机', 0, 1, 'https://example.com/icons/headphone.png', 'https://example.com/images/headphone.jpg', 4, 1, NOW(), NOW()),
(5, '手表', 0, 1, 'https://example.com/icons/watch.png', 'https://example.com/images/watch.jpg', 5, 1, NOW(), NOW());

-- 手机二级分类
INSERT IGNORE INTO category (id, name, parent_id, level, icon, sort, status, created_at, updated_at) VALUES
(11, '游戏手机', 1, 2, NULL, 1, 1, NOW(), NOW()),
(12, '拍照手机', 1, 2, NULL, 2, 1, NOW(), NOW()),
(13, '商务手机', 1, 2, NULL, 3, 1, NOW(), NOW());

-- 确保品牌数据存在
INSERT IGNORE INTO brand (id, name, logo, description, sort, status, created_at, updated_at) VALUES
(1, 'Apple', 'https://example.com/brands/apple.png', '苹果公司', 1, 1, NOW(), NOW()),
(2, '小米', 'https://example.com/brands/xiaomi.png', '小米科技', 2, 1, NOW(), NOW()),
(3, '华为', 'https://example.com/brands/huawei.png', '华为技术', 3, 1, NOW(), NOW()),
(4, '三星', 'https://example.com/brands/samsung.png', '三星电子', 4, 1, NOW(), NOW()),
(5, 'OPPO', 'https://example.com/brands/oppo.png', 'OPPO广东移动通信', 5, 1, NOW(), NOW()),
(6, 'vivo', 'https://example.com/brands/vivo.png', 'vivo移动通信', 6, 1, NOW(), NOW());

-- 品牌分类关联
INSERT IGNORE INTO brand_category (brand_id, category_id, created_at) VALUES
(1, 1, NOW()), (1, 2, NOW()), (1, 3, NOW()), (1, 4, NOW()), (1, 5, NOW()),
(2, 1, NOW()), (2, 2, NOW()), (2, 3, NOW()), (2, 4, NOW()), (2, 5, NOW()),
(3, 1, NOW()), (3, 2, NOW()), (3, 3, NOW()), (3, 4, NOW()), (3, 5, NOW()),
(4, 1, NOW()), (4, 2, NOW()), (4, 3, NOW()), (4, 4, NOW()),
(5, 1, NOW()), (5, 4, NOW()),
(6, 1, NOW()), (6, 4, NOW());

-- =============================================
-- 二、测试用户数据
-- =============================================

-- 密码都是 123456 的BCrypt加密结果
INSERT IGNORE INTO user (id, phone, password, nickname, avatar, gender, signature, status, created_at, updated_at) VALUES
(1, '13800138001', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6v0lqQjXhZGvKxJ3v0lqQjXh', '数码达人', 'https://randomuser.me/api/portraits/men/1.jpg', 1, '热爱数码，分享生活', 1, NOW(), NOW()),
(2, '13800138002', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6v0lqQjXhZGvKxJ3v0lqQjXh', '小米粉丝', 'https://randomuser.me/api/portraits/men/2.jpg', 1, '为发烧而生', 1, NOW(), NOW()),
(3, '13800138003', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6v0lqQjXhZGvKxJ3v0lqQjXh', '果粉小王', 'https://randomuser.me/api/portraits/women/1.jpg', 2, 'Apple全家桶用户', 1, NOW(), NOW()),
(4, '13800138004', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6v0lqQjXhZGvKxJ3v0lqQjXh', '华为铁粉', 'https://randomuser.me/api/portraits/men/3.jpg', 1, '支持国货', 1, NOW(), NOW()),
(5, '13800138005', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6v0lqQjXhZGvKxJ3v0lqQjXh', '二手交易商', 'https://randomuser.me/api/portraits/men/4.jpg', 1, '诚信交易', 1, NOW(), NOW());

-- =============================================
-- 三、SPU测试数据
-- =============================================

INSERT IGNORE INTO spu (id, name, brand_id, category_id, cover, description, product_count, member_count, post_count, avg_rating, price_min, price_max, status, view_count, created_at, updated_at) VALUES
(1, 'iPhone 15 Pro Max', 1, 1, 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-finish-select-202309-6-7inch_GEO_EMEA?wid=400', '苹果2023年旗舰手机，A17 Pro芯片，钛金属边框，5倍光学变焦', 15, 2500, 80, 4.90, 9999.00, 13999.00, 1, 150000, NOW(), NOW()),
(2, 'iPhone 15 Pro', 1, 1, 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-finish-select-202309-6-1inch_GEO_EMEA?wid=400', '苹果Pro系列，A17 Pro芯片，钛金属设计', 12, 2000, 60, 4.85, 7999.00, 10999.00, 1, 120000, NOW(), NOW()),
(3, 'iPhone 15', 1, 1, 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-finish-select-202309-6-1inch?wid=400', '苹果标准版，A16芯片，灵动岛设计', 10, 1500, 40, 4.70, 5999.00, 7999.00, 1, 80000, NOW(), NOW()),
(4, '小米14 Ultra', 2, 1, 'https://cdn.cnbj1.fds.api.mi-img.com/product-images/mi14ultra/1.jpg', '小米影像旗舰，徕卡光学镜头，骁龙8 Gen3', 8, 1200, 45, 4.75, 5999.00, 6999.00, 1, 60000, NOW(), NOW()),
(5, '小米14 Pro', 2, 1, 'https://cdn.cnbj1.fds.api.mi-img.com/product-images/mi14pro/1.jpg', '小米高端旗舰，骁龙8 Gen3，徕卡影像', 6, 800, 30, 4.70, 4999.00, 5999.00, 1, 40000, NOW(), NOW()),
(6, '华为Mate 60 Pro', 3, 1, 'https://consumer.huawei.com/content/dam/huawei-cbg-site/common/mkt/pdp/phones/mate60-pro/images/prod-color@2x.png', '华为旗舰手机，麒麟芯片，卫星通话', 5, 1800, 55, 4.80, 6499.00, 7999.00, 1, 100000, NOW(), NOW()),
(7, '华为Mate 60', 3, 1, 'https://consumer.huawei.com/content/dam/huawei-cbg-site/common/mkt/pdp/phones/mate60/images/prod-color@2x.png', '华为高端手机，麒麟芯片回归', 4, 1000, 35, 4.75, 5499.00, 6499.00, 1, 50000, NOW(), NOW()),
(8, 'MacBook Pro 14 M3 Pro', 1, 2, 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mbp14-spacegray-select-202310?wid=400', '苹果专业笔记本，M3 Pro芯片，14英寸', 3, 500, 20, 4.95, 14999.00, 19999.00, 1, 30000, NOW(), NOW()),
(9, 'MacBook Air 15 M3', 1, 2, 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/macbook-air-midnight-select-20220606?wid=400', '苹果轻薄笔记本，M3芯片，15英寸大屏', 4, 600, 25, 4.85, 10499.00, 12999.00, 1, 25000, NOW(), NOW()),
(10, 'Galaxy S24 Ultra', 4, 1, 'https://images.samsung.com/is/image/samsung/p6pim/uk/2401/gallery/uk-galaxy-s24-ultra-sm-s928-sm-s928bztpeub-thumb-539573169?$300_300_PNG$', '三星旗舰手机，骁龙8 Gen3，S Pen', 5, 700, 25, 4.70, 8999.00, 11999.00, 1, 35000, NOW(), NOW());

-- =============================================
-- 四、社区测试数据
-- =============================================

INSERT IGNORE INTO community (id, name, type, description, cover, model_id, is_official, creator_id, member_count, post_count, status, created_at, updated_at) VALUES
(1, 'iPhone 15 Pro Max 圈子', 'model', 'iPhone 15 Pro Max 用户交流社区，分享使用心得、技巧和问题', 'https://example.com/community/iphone15pm.jpg', 1, 1, 1, 2500, 80, 1, NOW(), NOW()),
(2, 'iPhone 15 Pro 圈子', 'model', 'iPhone 15 Pro 用户交流社区', 'https://example.com/community/iphone15p.jpg', 2, 1, 1, 2000, 60, 1, NOW(), NOW()),
(3, '小米发烧友', 'model', '小米手机爱好者社区，分享MIUI技巧和玩机心得', 'https://example.com/community/xiaomi.jpg', 4, 0, 2, 1200, 45, 1, NOW(), NOW()),
(4, '华为Mate60 圈子', 'model', '华为Mate60系列用户交流', 'https://example.com/community/mate60.jpg', 6, 0, 4, 1800, 55, 1, NOW(), NOW()),
(5, '数码交易交流', 'user', '二手数码交易交流社区，诚信交易', 'https://example.com/community/trade.jpg', NULL, 0, 5, 500, 100, 1, NOW(), NOW()),
(6, 'MacBook 用户群', 'model', 'MacBook 用户交流社区', 'https://example.com/community/macbook.jpg', 8, 1, 1, 500, 20, 1, NOW(), NOW()),
(7, '摄影爱好者', 'user', '手机摄影爱好者交流社区', 'https://example.com/community/photo.jpg', NULL, 0, 3, 800, 50, 1, NOW(), NOW());

-- =============================================
-- 五、社区成员数据
-- =============================================

INSERT IGNORE INTO community_member (community_id, user_id, level, exp, is_admin, created_at) VALUES
(1, 1, 10, 5000, 1, NOW()),
(1, 2, 5, 1500, 0, NOW()),
(1, 3, 8, 3000, 0, NOW()),
(2, 3, 10, 6000, 1, NOW()),
(3, 2, 10, 8000, 1, NOW()),
(3, 4, 6, 2000, 0, NOW()),
(4, 4, 10, 7000, 1, NOW()),
(5, 5, 10, 5000, 1, NOW()),
(5, 1, 3, 500, 0, NOW()),
(6, 1, 8, 4000, 1, NOW()),
(6, 3, 5, 1500, 0, NOW()),
(7, 3, 10, 6000, 1, NOW()),
(7, 1, 4, 1000, 0, NOW());

-- =============================================
-- 六、帖子测试数据
-- =============================================

INSERT IGNORE INTO post (id, title, content, author_id, forum_id, spu_id, images, tags, view_count, like_count, comment_count, collect_count, is_pinned, is_essence, status, created_at, updated_at) VALUES
(1, 'iPhone 15 Pro Max 开箱体验，钛金属质感太棒了！', '今天收到了新手机，分享一下开箱体验。包装很简洁，手机拿在手里的质感真的很好，钛金属边框摸起来很舒服。屏幕显示效果非常棒，A17 Pro芯片运行流畅，拍照效果也很出色。', 1, 1, 1, '["https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800", "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800", "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800"]', '["开箱", "iPhone15", "体验"]', 5000, 250, 50, 100, 0, 1, 1, NOW(), NOW()),
(2, '小米14 Ultra 拍照测评，徕卡色彩真的很德味', '分享一下这款手机的拍照效果，徕卡色彩调教真的很棒，人像模式效果很好，夜景拍摄也很出色。', 2, 3, 4, '["https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800", "https://images.unsplash.com/photo-1606986628253-e0e8e2e5c6e3?w=800", "https://images.unsplash.com/photo-1502920917128-1aa5f9d5d24f?w=800"]', '["拍照", "徕卡", "测评"]', 3000, 150, 30, 60, 0, 0, 1, NOW(), NOW()),
(3, '二手交易注意事项，总结一些经验', '总结一些二手交易的经验，希望大家都能顺利交易，避免被骗。1. 尽量当面交易 2. 检查机器是否有锁 3. 核对序列号...', 5, 5, NULL, '["https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800", "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800"]', '["交易", "经验", "注意事项"]', 2000, 100, 40, 80, 1, 1, 1, NOW(), NOW()),
(4, '华为Mate 60 Pro 卫星通话体验', '测试了一下卫星通话功能，虽然平时用不上，但是关键时刻真的能救命。分享一下使用体验...', 4, 4, 6, '["https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800", "https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=800"]', '["卫星通话", "华为", "体验"]', 4000, 200, 35, 70, 0, 0, 1, NOW(), NOW()),
(5, 'MacBook Pro M3 Pro 开发体验', '作为开发者，分享一下M3 Pro MacBook的开发体验，编译速度很快，续航也很给力...', 1, 6, 8, '["https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800", "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800"]', '["MacBook", "开发", "M3"]', 2500, 120, 25, 50, 0, 0, 1, NOW(), NOW()),
(6, 'iPhone 15 Pro vs 小米14 Ultra 拍照对比', '两款手机拍照对比，各有特色，分享一下我的使用感受...', 3, 7, NULL, '["https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800", "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800", "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800"]', '["对比", "拍照", "iPhone", "小米"]', 6000, 300, 60, 120, 0, 1, 1, NOW(), NOW());

-- =============================================
-- 七、评论测试数据
-- =============================================

INSERT IGNORE INTO comment (id, post_id, content, author_id, parent_id, reply_to_id, reply_to_user_id, like_count, reply_count, status, created_at, updated_at) VALUES
(1, 1, '钛金属确实很棒，手感比以前好多了！', 2, NULL, NULL, NULL, 30, 2, 1, NOW(), NOW()),
(2, 1, '多少钱入手的？', 3, NULL, NULL, NULL, 10, 1, 1, NOW(), NOW()),
(3, 1, '我花了10999，256G版本', 1, 2, 2, 3, 15, 0, 1, NOW(), NOW()),
(4, 1, '拍照效果怎么样？', 4, NULL, NULL, NULL, 8, 1, 1, NOW(), NOW()),
(5, 2, '徕卡色彩确实很德味，我也很喜欢！', 4, NULL, NULL, NULL, 20, 0, 1, NOW(), NOW()),
(6, 3, '很实用的经验，感谢分享！', 1, NULL, NULL, NULL, 15, 0, 1, NOW(), NOW()),
(7, 4, '卫星通话功能确实很实用，户外爱好者必备', 1, NULL, NULL, NULL, 25, 0, 1, NOW(), NOW()),
(8, 6, '两款都很强，看个人喜好选择', 2, NULL, NULL, NULL, 18, 0, 1, NOW(), NOW());

-- =============================================
-- 八、帖子点赞数据
-- =============================================

INSERT IGNORE INTO post_like (post_id, user_id, created_at) VALUES
(1, 2, NOW()), (1, 3, NOW()), (1, 4, NOW()),
(2, 1, NOW()), (2, 4, NOW()),
(3, 1, NOW()), (3, 2, NOW()), (3, 3, NOW()),
(4, 1, NOW()), (4, 2, NOW()),
(5, 2, NOW()), (5, 3, NOW()),
(6, 1, NOW()), (6, 2, NOW()), (6, 4, NOW());

-- =============================================
-- 九、评论点赞数据
-- =============================================

INSERT IGNORE INTO comment_like (comment_id, user_id, created_at) VALUES
(1, 1, NOW()), (1, 3, NOW()),
(2, 1, NOW()),
(3, 2, NOW()), (3, 4, NOW()),
(5, 1, NOW()), (5, 2, NOW()),
(6, 2, NOW()), (6, 5, NOW());

-- =============================================
-- 十、SPU关注数据
-- =============================================

INSERT IGNORE INTO spu_follow (spu_id, user_id, created_at) VALUES
(1, 1, NOW()), (1, 2, NOW()), (1, 3, NOW()),
(2, 3, NOW()), (2, 4, NOW()),
(4, 2, NOW()), (4, 4, NOW()),
(6, 4, NOW()), (6, 1, NOW()),
(8, 1, NOW()), (8, 3, NOW());

-- =============================================
-- 十一、热门搜索数据
-- =============================================

INSERT IGNORE INTO hot_search (keyword, search_type, search_count, status, created_at, updated_at) VALUES
('iPhone 15', 1, 50000, 1, NOW(), NOW()),
('小米14', 1, 35000, 1, NOW(), NOW()),
('华为Mate60', 1, 40000, 1, NOW(), NOW()),
('MacBook', 1, 20000, 1, NOW(), NOW()),
('二手手机', 1, 15000, 1, NOW(), NOW()),
('Galaxy S24', 1, 10000, 1, NOW(), NOW()),
('AirPods', 1, 12000, 1, NOW(), NOW()),
('iPad', 1, 8000, 1, NOW(), NOW()),
('Apple Watch', 1, 6000, 1, NOW(), NOW()),
('充电宝', 1, 5000, 1, NOW(), NOW());

-- =============================================
-- 十二、商品测试数据
-- =============================================

INSERT IGNORE INTO goods (id, title, seller_id, model_id, category_id, description, images, price, original_price, condition_level, condition_desc, warranty, invoice, can_bargain, location, stock, view_count, like_count, status, created_at, updated_at) VALUES
(1, 'iPhone 15 Pro Max 256G 原色钛金属 国行在保', 1, 1, 1, '自用手机，成色99新，无划痕，电池健康度98%，国行在保到明年3月，配件齐全', 'https://example.com/goods/1-1.jpg,https://example.com/goods/1-2.jpg', 9500.00, 9999.00, 9, '轻微使用痕迹，屏幕完美', 1, 1, 1, '北京朝阳', 1, 500, 30, 1, NOW(), NOW()),
(2, '小米14 Ultra 16+512 黑色 全套在保', 2, 4, 1, '小米14 Ultra，黑色版本，16+512G，购买两个月，成色完美，送保护壳', 'https://example.com/goods/2-1.jpg', 5500.00, 6499.00, 9, '几乎全新', 1, 1, 0, '上海浦东', 1, 300, 20, 1, NOW(), NOW()),
(3, '华为Mate 60 Pro 雅丹黑 12+512', 4, 6, 1, '华为Mate 60 Pro，雅丹黑配色，12+512G，国行正品，卫星通话功能正常', 'https://example.com/goods/3-1.jpg,https://example.com/goods/3-2.jpg', 6200.00, 6999.00, 8, '有轻微划痕', 1, 1, 1, '深圳南山', 1, 400, 25, 1, NOW(), NOW()),
(4, 'MacBook Pro 14 M3 Pro 18+512 深空黑', 1, 8, 2, 'MacBook Pro 14英寸，M3 Pro芯片，18+512G，深空黑色，购买一个月', 'https://example.com/goods/4-1.jpg', 16500.00, 17999.00, 10, '全新未拆封', 1, 1, 0, '北京海淀', 1, 200, 15, 1, NOW(), NOW()),
(5, 'iPhone 15 128G 粉色 国行', 3, 3, 1, 'iPhone 15 粉色，128G，国行版本，成色95新，电池健康96%', 'https://example.com/goods/5-1.jpg', 4800.00, 5999.00, 7, '边框有轻微磕碰', 1, 0, 1, '广州天河', 1, 350, 18, 1, NOW(), NOW());

-- =============================================
-- 完成
-- =============================================

SELECT '测试数据插入完成！' AS message;
