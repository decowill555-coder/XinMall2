-- 订单测试数据
-- 生成时间: 2026-03-15
-- 说明: 包含各种状态的订单数据

SET NAMES utf8mb4;

-- 清空现有订单数据
DELETE FROM `order` WHERE id > 0;

-- 用户1 (user01) 作为买家的订单
-- 订单1: 待付款状态 - 购买 user02 的商品
INSERT INTO `order` VALUES (1, 'ORD202603150001', 1, 2, 2, 
  '{"title":"华为 Mate 60 Pro+ 512GB","cover":"https://picsum.photos/400/400?random=2","price":7999.00,"condition":"95新，轻微使用痕迹"}', 
  1, 7999.00, 1, '希望能快点发货', 
  '{"name":"Wang Ming","phone":"13800138001","province":"Beijing","city":"Beijing","district":"Haidian","detail":"Zhongguancun Street 1"}', 
  NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 
  '2026-03-15 10:00:00', '2026-03-15 10:00:00', 0);

-- 订单2: 待发货状态 - 购买 user03 的商品 (已付款)
INSERT INTO `order` VALUES (2, 'ORD202603150002', 1, 3, 6, 
  '{"title":"AirPods Pro 2 主动降噪","cover":"https://picsum.photos/400/400?random=6","price":1699.00,"condition":"全新未拆封"}', 
  1, 1699.00, 2, '送人的，包装好一点', 
  '{"name":"Wang Ming","phone":"13800138001","province":"Beijing","city":"Beijing","district":"Haidian","detail":"Zhongguancun Street 1"}', 
  NULL, NULL, '2026-03-14 15:30:00', NULL, NULL, NULL, NULL, 
  '2026-03-14 14:00:00', '2026-03-14 15:30:00', 0);

-- 订单3: 待收货状态 - 购买 user02 的商品 (已付款已发货)
INSERT INTO `order` VALUES (3, 'ORD202603150003', 1, 2, 8, 
  '{"title":"三星 Galaxy S24 Ultra","cover":"https://picsum.photos/400/400?random=8","price":8499.00,"condition":"99新，国行在保"}', 
  1, 8499.00, 3, NULL, 
  '{"name":"Wang Ming","phone":"13800138001","province":"Beijing","city":"Beijing","district":"Haidian","detail":"Zhongguancun Street 1"}', 
  '顺丰速运', 'SF1234567890', '2026-03-13 10:00:00', '2026-03-13 16:00:00', NULL, NULL, NULL, 
  '2026-03-12 09:00:00', '2026-03-13 16:00:00', 0);

-- 订单4: 已完成状态 - 购买 user01 自己的商品 (测试用)
INSERT INTO `order` VALUES (4, 'ORD202603150004', 1, 1, 4, 
  '{"title":"MacBook Pro 14 M3 Pro","cover":"https://picsum.photos/400/400?random=4","price":14999.00,"condition":"95新，电池健康度98%"}', 
  1, 14999.00, 4, '自测订单', 
  '{"name":"Wang Ming","phone":"13800138001","province":"Beijing","city":"Beijing","district":"Haidian","detail":"Zhongguancun Street 1"}', 
  '京东物流', 'JD9876543210', '2026-03-10 09:00:00', '2026-03-10 14:00:00', '2026-03-12 10:00:00', '2026-03-12 10:00:00', NULL, 
  '2026-03-09 20:00:00', '2026-03-12 10:00:00', 0);

-- 订单5: 已取消状态
INSERT INTO `order` VALUES (5, 'ORD202603150005', 1, 3, 3, 
  '{"title":"小米14 Ultra 16+512 黑色","cover":"https://picsum.photos/400/400?random=3","price":5999.00,"condition":"99新，全套配件"}', 
  1, 5999.00, 5, NULL, 
  '{"name":"Wang Ming","phone":"13800138001","province":"Beijing","city":"Beijing","district":"Haidian","detail":"Zhongguancun Street 1"}', 
  NULL, NULL, NULL, NULL, NULL, NULL, '2026-03-08 12:00:00', '不想买了', 
  '2026-03-08 10:00:00', '2026-03-08 12:00:00', 0);

-- 用户2 (user02) 作为买家的订单
-- 订单6: 待付款状态
INSERT INTO `order` VALUES (6, 'ORD202603150006', 2, 1, 1, 
  '{"title":"iPhone 15 Pro Max 256GB 原色钛金属","cover":"https://picsum.photos/400/400?random=1","price":8999.00,"condition":"99新，无划痕，配件齐全"}', 
  1, 8999.00, 1, '有发票吗？', 
  '{"name":"Li Hua","phone":"13800138002","province":"Shanghai","city":"Shanghai","district":"Pudong","detail":"Zhangjiang Hi-Tech Park"}', 
  NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 
  '2026-03-15 09:30:00', '2026-03-15 09:30:00', 0);

-- 订单7: 待发货状态
INSERT INTO `order` VALUES (7, 'ORD202603150007', 2, 3, 6, 
  '{"title":"AirPods Pro 2 主动降噪","cover":"https://picsum.photos/400/400?random=6","price":1699.00,"condition":"全新未拆封"}', 
  2, 3398.00, 2, '买两个', 
  '{"name":"Li Hua","phone":"13800138002","province":"Shanghai","city":"Shanghai","district":"Pudong","detail":"Zhangjiang Hi-Tech Park"}', 
  NULL, NULL, '2026-03-14 20:00:00', NULL, NULL, NULL, NULL, 
  '2026-03-14 18:00:00', '2026-03-14 20:00:00', 0);

-- 订单8: 待收货状态
INSERT INTO `order` VALUES (8, 'ORD202603150008', 2, 1, 7, 
  '{"title":"索尼 WH-1000XM5 头戴式耳机","cover":"https://picsum.photos/400/400?random=7","price":1999.00,"condition":"95新，降噪效果极佳"}', 
  1, 1999.00, 3, NULL, 
  '{"name":"Li Hua","phone":"13800138002","province":"Shanghai","city":"Shanghai","district":"Pudong","detail":"Zhangjiang Hi-Tech Park"}', 
  '中通快递', 'ZT2026031508', '2026-03-12 11:00:00', '2026-03-12 15:00:00', NULL, NULL, NULL, 
  '2026-03-11 16:00:00', '2026-03-12 15:00:00', 0);

-- 订单9: 已完成状态
INSERT INTO `order` VALUES (9, 'ORD202603150009', 2, 1, 4, 
  '{"title":"MacBook Pro 14 M3 Pro","cover":"https://picsum.photos/400/400?random=4","price":14999.00,"condition":"95新，电池健康度98%"}', 
  1, 14999.00, 4, '工作用', 
  '{"name":"Li Hua","phone":"13800138002","province":"Shanghai","city":"Shanghai","district":"Pudong","detail":"Zhangjiang Hi-Tech Park"}', 
  '顺丰速运', 'SF2026030909', '2026-03-05 14:00:00', '2026-03-05 18:00:00', '2026-03-07 09:00:00', '2026-03-07 09:00:00', NULL, 
  '2026-03-05 10:00:00', '2026-03-07 09:00:00', 0);

-- 用户3 (user03) 作为买家的订单
-- 订单10: 待付款状态
INSERT INTO `order` VALUES (10, 'ORD202603150010', 3, 2, 5, 
  '{"title":"iPad Pro 12.9 M2 256GB","cover":"https://picsum.photos/400/400?random=5","price":7999.00,"condition":"99新，带Apple Pencil"}', 
  1, 7999.00, 1, 'Pencil是二代吗？', 
  '{"name":"Zhang Fang","phone":"13800138003","province":"Guangdong","city":"Shenzhen","district":"Nanshan","detail":"Science Park South"}', 
  NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 
  '2026-03-15 11:00:00', '2026-03-15 11:00:00', 0);

-- 订单11: 待发货状态
INSERT INTO `order` VALUES (11, 'ORD202603150011', 3, 1, 1, 
  '{"title":"iPhone 15 Pro Max 256GB 原色钛金属","cover":"https://picsum.photos/400/400?random=1","price":8999.00,"condition":"99新，无划痕，配件齐全"}', 
  1, 8999.00, 2, '送朋友的生日礼物', 
  '{"name":"Zhang Fang","phone":"13800138003","province":"Guangdong","city":"Shenzhen","district":"Nanshan","detail":"Science Park South"}', 
  NULL, NULL, '2026-03-14 22:00:00', NULL, NULL, NULL, NULL, 
  '2026-03-14 21:00:00', '2026-03-14 22:00:00', 0);

-- 订单12: 待收货状态
INSERT INTO `order` VALUES (12, 'ORD202603150012', 3, 2, 2, 
  '{"title":"华为 Mate 60 Pro+ 512GB","cover":"https://picsum.photos/400/400?random=2","price":7999.00,"condition":"95新，轻微使用痕迹"}', 
  1, 7999.00, 3, NULL, 
  '{"name":"Zhang Fang","phone":"13800138003","province":"Guangdong","city":"Shenzhen","district":"Nanshan","detail":"Science Park South"}', 
  '韵达快递', 'YD2026031201', '2026-03-11 09:00:00', '2026-03-11 14:00:00', NULL, NULL, NULL, 
  '2026-03-10 15:00:00', '2026-03-11 14:00:00', 0);

-- 订单13: 已完成状态
INSERT INTO `order` VALUES (13, 'ORD202603150013', 3, 1, 7, 
  '{"title":"索尼 WH-1000XM5 头戴式耳机","cover":"https://picsum.photos/400/400?random=7","price":1999.00,"condition":"95新，降噪效果极佳"}', 
  1, 1999.00, 4, NULL, 
  '{"name":"Zhang Fang","phone":"13800138003","province":"Guangdong","city":"Shenzhen","district":"Nanshan","detail":"Science Park South"}', 
  '顺丰速运', 'SF2026030101', '2026-03-01 10:00:00', '2026-03-01 15:00:00', '2026-03-03 11:00:00', '2026-03-03 11:00:00', NULL, 
  '2026-03-01 08:00:00', '2026-03-03 11:00:00', 0);

-- 订单14: 已退款状态
INSERT INTO `order` VALUES (14, 'ORD202603150014', 3, 2, 8, 
  '{"title":"三星 Galaxy S24 Ultra","cover":"https://picsum.photos/400/400?random=8","price":8499.00,"condition":"99新，国行在保"}', 
  1, 8499.00, 6, NULL, 
  '{"name":"Zhang Fang","phone":"13800138003","province":"Guangdong","city":"Shenzhen","district":"Nanshan","detail":"Science Park South"}', 
  NULL, NULL, '2026-03-02 10:00:00', NULL, NULL, NULL, '2026-03-03 09:00:00', '商品描述不符', 
  '2026-03-02 08:00:00', '2026-03-03 09:00:00', 0);

-- 卖家视角订单（用户1作为卖家）
-- 订单15: 用户1卖出的订单 - 待付款
INSERT INTO `order` VALUES (15, 'ORD202603150015', 2, 1, 4, 
  '{"title":"MacBook Pro 14 M3 Pro","cover":"https://picsum.photos/400/400?random=4","price":14999.00,"condition":"95新，电池健康度98%"}', 
  1, 14999.00, 1, '电池健康度确认一下', 
  '{"name":"Li Hua","phone":"13800138002","province":"Shanghai","city":"Shanghai","district":"Pudong","detail":"Zhangjiang Hi-Tech Park"}', 
  NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 
  '2026-03-15 08:00:00', '2026-03-15 08:00:00', 0);

-- 订单16: 用户1卖出的订单 - 待发货 (已付款)
INSERT INTO `order` VALUES (16, 'ORD202603150016', 3, 1, 1, 
  '{"title":"iPhone 15 Pro Max 256GB 原色钛金属","cover":"https://picsum.photos/400/400?random=1","price":8999.00,"condition":"99新，无划痕，配件齐全"}', 
  1, 8999.00, 2, '急用，尽快发货', 
  '{"name":"Zhang Fang","phone":"13800138003","province":"Guangdong","city":"Shenzhen","district":"Nanshan","detail":"Science Park South"}', 
  NULL, NULL, '2026-03-15 07:00:00', NULL, NULL, NULL, NULL, 
  '2026-03-15 06:00:00', '2026-03-15 07:00:00', 0);

-- 订单17: 用户1卖出的订单 - 待收货 (已发货)
INSERT INTO `order` VALUES (17, 'ORD202603150017', 2, 1, 7, 
  '{"title":"索尼 WH-1000XM5 头戴式耳机","cover":"https://picsum.photos/400/400?random=7","price":1999.00,"condition":"95新，降噪效果极佳"}', 
  1, 1999.00, 3, NULL, 
  '{"name":"Li Hua","phone":"13800138002","province":"Shanghai","city":"Shanghai","district":"Pudong","detail":"Zhangjiang Hi-Tech Park"}', 
  '顺丰速运', 'SF2026031401', '2026-03-13 11:00:00', '2026-03-13 16:00:00', NULL, NULL, NULL, 
  '2026-03-13 09:00:00', '2026-03-13 16:00:00', 0);

-- 订单18: 用户1卖出的订单 - 已完成
INSERT INTO `order` VALUES (18, 'ORD202603150018', 3, 1, 4, 
  '{"title":"MacBook Pro 14 M3 Pro","cover":"https://picsum.photos/400/400?random=4","price":14999.00,"condition":"95新，电池健康度98%"}', 
  1, 14999.00, 4, '工作用', 
  '{"name":"Zhang Fang","phone":"13800138003","province":"Guangdong","city":"Shenzhen","district":"Nanshan","detail":"Science Park South"}', 
  '京东物流', 'JD2026030501', '2026-03-05 14:00:00', '2026-03-05 18:00:00', '2026-03-07 10:00:00', '2026-03-07 10:00:00', NULL, 
  '2026-03-05 10:00:00', '2026-03-07 10:00:00', 0);

-- 订单统计
SELECT '订单数据插入完成' AS message;
SELECT 
  status,
  CASE status
    WHEN 1 THEN '待付款'
    WHEN 2 THEN '待发货'
    WHEN 3 THEN '待收货'
    WHEN 4 THEN '已完成'
    WHEN 5 THEN '已取消'
    WHEN 6 THEN '已退款'
  END AS status_name,
  COUNT(*) AS count
FROM `order`
GROUP BY status
ORDER BY status;
