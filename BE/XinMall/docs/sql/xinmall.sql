/*
 Navicat Premium Dump SQL

 Source Server         : XinMall
 Source Server Type    : MySQL
 Source Server Version : 80044 (8.0.44)
 Source Host           : localhost:3306
 Source Schema         : xinmall

 Target Server Type    : MySQL
 Target Server Version : 80044 (8.0.44)
 File Encoding         : 65001

 Date: 22/03/2026 16:49:29
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for aftersale
-- ----------------------------
DROP TABLE IF EXISTS `aftersale`;
CREATE TABLE `aftersale`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '售后ID',
  `order_id` bigint NOT NULL COMMENT '订单ID',
  `order_no` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '订单编号',
  `user_id` bigint NOT NULL COMMENT '用户ID（买家）',
  `seller_id` bigint NULL DEFAULT NULL COMMENT '卖家ID',
  `type` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '类型：refund_only-仅退款 refund_return-退货退款 exchange-换货',
  `reason` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '申请原因',
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL COMMENT '问题描述',
  `images` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL COMMENT '凭证图片(JSON数组)',
  `refund_amount` decimal(10, 2) NULL DEFAULT NULL COMMENT '退款金额',
  `status` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT 'pending' COMMENT '状态：pending-待处理 processing-处理中 waiting_return-待退货 waiting_receive-待收货 completed-已完成 rejected-已拒绝 closed-已关闭',
  `reject_reason` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '拒绝原因',
  `logistics_company` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '物流公司',
  `logistics_no` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '物流单号',
  `created_at` datetime NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` datetime NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted` tinyint NULL DEFAULT 0 COMMENT '逻辑删除 0-未删除 1-已删除',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_order_id`(`order_id` ASC) USING BTREE,
  INDEX `idx_user_id`(`user_id` ASC) USING BTREE,
  INDEX `idx_seller_id`(`seller_id` ASC) USING BTREE,
  INDEX `idx_status`(`status` ASC) USING BTREE,
  INDEX `idx_created_at`(`created_at` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '售后主表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of aftersale
-- ----------------------------
INSERT INTO `aftersale` VALUES (2, 1, 'ORD202603150001', 1, 2, 'refund_only', '不想要了', '测试售后申请：商品质量有问题，申请退款处理。', NULL, 7999.00, 'pending', NULL, NULL, NULL, '2026-03-17 14:36:35', '2026-03-17 14:36:35', 0);

-- ----------------------------
-- Table structure for aftersale_log
-- ----------------------------
DROP TABLE IF EXISTS `aftersale_log`;
CREATE TABLE `aftersale_log`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '日志ID',
  `aftersale_id` bigint NOT NULL COMMENT '售后ID',
  `operator_type` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '操作人类型：user-用户 seller-卖家 admin-管理员 system-系统',
  `operator_id` bigint NULL DEFAULT NULL COMMENT '操作人ID',
  `action` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '操作动作：create-创建 agree-同意 reject-拒绝 return_ship-退货发货 return_receive-退货收货 refund-退款 complete-完成 close-关闭',
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL COMMENT '操作内容/备注',
  `created_at` datetime NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_aftersale_id`(`aftersale_id` ASC) USING BTREE,
  INDEX `idx_created_at`(`created_at` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '售后日志表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of aftersale_log
-- ----------------------------
INSERT INTO `aftersale_log` VALUES (2, 2, '1', 1, 'pending', '用户提交售后申请', '2026-03-17 14:36:35');

-- ----------------------------
-- Table structure for attribute
-- ----------------------------
DROP TABLE IF EXISTS `attribute`;
CREATE TABLE `attribute`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '属性ID',
  `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '属性名称',
  `unit` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '单位',
  `input_type` tinyint NULL DEFAULT 1 COMMENT '输入类型 1-文本 2-数字 3-单选 4-多选 5-布尔',
  `sort` int NULL DEFAULT 0 COMMENT '排序',
  `status` tinyint NULL DEFAULT 1 COMMENT '状态',
  `created_at` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 26 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '属性模板表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of attribute
-- ----------------------------
INSERT INTO `attribute` VALUES (1, '屏幕尺寸', '英寸', 2, 1, 1, '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `attribute` VALUES (2, '处理器型号', NULL, 1, 2, 1, '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `attribute` VALUES (3, '屏幕类型', NULL, 3, 3, 1, '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `attribute` VALUES (4, '电池容量', 'mAh', 2, 4, 1, '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `attribute` VALUES (5, '是否支持快充', NULL, 5, 5, 1, '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `attribute` VALUES (6, '网络制式', NULL, 4, 6, 1, '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `attribute` VALUES (7, '运行内存', 'GB', 2, 7, 1, '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `attribute` VALUES (8, '存储容量', 'GB', 2, 8, 1, '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `attribute` VALUES (9, '后置摄像头', '万像素', 2, 9, 1, '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `attribute` VALUES (10, '前置摄像头', '万像素', 2, 10, 1, '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `attribute` VALUES (11, '屏幕分辨率', NULL, 1, 11, 1, '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `attribute` VALUES (12, '刷新率', 'Hz', 2, 12, 1, '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `attribute` VALUES (13, 'CPU型号', NULL, 1, 13, 1, '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `attribute` VALUES (14, '显卡型号', NULL, 1, 14, 1, '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `attribute` VALUES (15, '硬盘容量', 'GB', 2, 15, 1, '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `attribute` VALUES (16, '有效像素', '万像素', 2, 16, 1, '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `attribute` VALUES (17, '传感器尺寸', NULL, 1, 17, 1, '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `attribute` VALUES (18, '镜头卡口', NULL, 1, 18, 1, '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `attribute` VALUES (19, '续航时间', '小时', 2, 19, 1, '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `attribute` VALUES (20, '降噪功能', NULL, 5, 20, 1, '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `attribute` VALUES (21, '佩戴方式', NULL, 3, 21, 1, '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `attribute` VALUES (22, '连接方式', NULL, 4, 22, 1, '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `attribute` VALUES (23, '防水等级', NULL, 1, 23, 1, '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `attribute` VALUES (24, '重量', 'g', 2, 24, 1, '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `attribute` VALUES (25, '操作系统', NULL, 1, 25, 1, '2026-03-16 14:00:35', '2026-03-16 14:00:35');

-- ----------------------------
-- Table structure for attribute_option
-- ----------------------------
DROP TABLE IF EXISTS `attribute_option`;
CREATE TABLE `attribute_option`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `attribute_id` bigint NOT NULL COMMENT '属性ID',
  `value` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '选项值',
  `sort` int NULL DEFAULT 0 COMMENT '排序',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_attribute_id`(`attribute_id` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 15 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '属性选项值表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of attribute_option
-- ----------------------------
INSERT INTO `attribute_option` VALUES (1, 3, 'OLED', 1);
INSERT INTO `attribute_option` VALUES (2, 3, 'LCD', 2);
INSERT INTO `attribute_option` VALUES (3, 3, 'AMOLED', 3);
INSERT INTO `attribute_option` VALUES (4, 3, 'LTPO', 4);
INSERT INTO `attribute_option` VALUES (5, 6, '5G', 1);
INSERT INTO `attribute_option` VALUES (6, 6, '4G', 2);
INSERT INTO `attribute_option` VALUES (7, 6, '3G', 3);
INSERT INTO `attribute_option` VALUES (8, 21, '入耳式', 1);
INSERT INTO `attribute_option` VALUES (9, 21, '头戴式', 2);
INSERT INTO `attribute_option` VALUES (10, 21, '挂耳式', 3);
INSERT INTO `attribute_option` VALUES (11, 21, '颈挂式', 4);
INSERT INTO `attribute_option` VALUES (12, 22, '蓝牙', 1);
INSERT INTO `attribute_option` VALUES (13, 22, '有线', 2);
INSERT INTO `attribute_option` VALUES (14, 22, '2.4G无线', 3);

-- ----------------------------
-- Table structure for banner
-- ----------------------------
DROP TABLE IF EXISTS `banner`;
CREATE TABLE `banner`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT 'Banner ID',
  `image` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Image URL',
  `title` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT 'Title',
  `link` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT 'Link',
  `sort` int NULL DEFAULT 0 COMMENT 'Sort',
  `status` tinyint NULL DEFAULT 1 COMMENT 'Status',
  `created_at` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 14 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = 'Banner table' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of banner
-- ----------------------------
INSERT INTO `banner` VALUES (9, '/uploads/banners/banner1.jpg', 'iPhone 16 Pro New Arrival', '/goods/1', 1, 1, '2026-03-16 17:47:11', '2026-03-16 17:47:11');
INSERT INTO `banner` VALUES (10, '/uploads/banners/banner2.jpg', 'MacBook Pro M3 Series', '/goods?category=2', 2, 1, '2026-03-16 17:47:11', '2026-03-16 17:47:11');
INSERT INTO `banner` VALUES (11, '/uploads/banners/banner3.jpg', 'Camera Special Sale', '/goods?category=3', 3, 1, '2026-03-16 17:47:11', '2026-03-16 17:47:11');
INSERT INTO `banner` VALUES (12, '/uploads/banners/banner4.jpg', 'Premium Audio Experience', '/goods?category=4', 4, 1, '2026-03-16 17:47:11', '2026-03-16 17:47:11');
INSERT INTO `banner` VALUES (13, '/uploads/banners/banner5.jpg', 'iPad Pro M4 Launch', '/goods?category=5', 5, 1, '2026-03-16 17:47:11', '2026-03-16 17:47:11');

-- ----------------------------
-- Table structure for brand
-- ----------------------------
DROP TABLE IF EXISTS `brand`;
CREATE TABLE `brand`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '品牌ID',
  `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '品牌名称',
  `logo` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '品牌Logo',
  `description` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '品牌描述',
  `sort` int NULL DEFAULT 0 COMMENT '排序',
  `status` tinyint NULL DEFAULT 1 COMMENT '状态 1-启用 0-禁用',
  `created_at` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 27 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '品牌表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of brand
-- ----------------------------
INSERT INTO `brand` VALUES (1, '苹果', '/brands/apple.png', 'Apple Inc. - 全球领先的消费电子产品制造商', 1, 1, '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `brand` VALUES (2, '华为', '/brands/huawei.png', 'Huawei - 全球领先的ICT解决方案提供商', 2, 1, '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `brand` VALUES (3, '小米', '/brands/xiaomi.png', 'Xiaomi - 让每个人都能享受科技的乐趣', 3, 1, '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `brand` VALUES (4, '三星', '/brands/samsung.png', 'Samsung - 全球领先的电子产品制造商', 4, 1, '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `brand` VALUES (5, 'OPPO', '/brands/oppo.png', 'OPPO - 拍照手机专家', 5, 1, '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `brand` VALUES (6, 'vivo', '/brands/vivo.png', 'vivo - 专业音质与拍照体验', 6, 1, '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `brand` VALUES (7, '索尼', '/brands/sony.png', 'Sony - 创新科技，感动人心', 7, 1, '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `brand` VALUES (8, '联想', '/brands/lenovo.png', 'Lenovo - 全球PC领导品牌', 8, 1, '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `brand` VALUES (9, '华硕', '/brands/asus.png', 'ASUS - 追求无与伦比', 9, 1, '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `brand` VALUES (10, '戴尔', '/brands/dell.png', 'Dell - 让科技更简单', 10, 1, '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `brand` VALUES (11, 'Canon', NULL, NULL, 0, 1, '2026-03-16 17:12:18', '2026-03-16 17:12:18');
INSERT INTO `brand` VALUES (12, 'Fujifilm', NULL, NULL, 0, 1, '2026-03-16 17:12:18', '2026-03-16 17:12:18');
INSERT INTO `brand` VALUES (13, 'DJI', NULL, NULL, 0, 1, '2026-03-16 17:12:18', '2026-03-16 17:12:18');
INSERT INTO `brand` VALUES (14, 'Bose', NULL, NULL, 0, 1, '2026-03-16 17:12:18', '2026-03-16 17:12:18');
INSERT INTO `brand` VALUES (15, 'Sennheiser', NULL, NULL, 0, 1, '2026-03-16 17:12:18', '2026-03-16 17:12:18');
INSERT INTO `brand` VALUES (16, 'Beyerdynamic', NULL, NULL, 0, 1, '2026-03-16 17:12:18', '2026-03-16 17:12:18');
INSERT INTO `brand` VALUES (17, 'Focal', NULL, NULL, 0, 1, '2026-03-16 17:12:18', '2026-03-16 17:12:18');
INSERT INTO `brand` VALUES (18, 'Garmin', NULL, NULL, 0, 1, '2026-03-16 17:12:18', '2026-03-16 17:12:18');
INSERT INTO `brand` VALUES (19, 'Canon', NULL, NULL, 0, 1, '2026-03-16 17:13:03', '2026-03-16 17:13:03');
INSERT INTO `brand` VALUES (20, 'Fujifilm', NULL, NULL, 0, 1, '2026-03-16 17:13:03', '2026-03-16 17:13:03');
INSERT INTO `brand` VALUES (21, 'DJI', NULL, NULL, 0, 1, '2026-03-16 17:13:03', '2026-03-16 17:13:03');
INSERT INTO `brand` VALUES (22, 'Bose', NULL, NULL, 0, 1, '2026-03-16 17:13:03', '2026-03-16 17:13:03');
INSERT INTO `brand` VALUES (23, 'Sennheiser', NULL, NULL, 0, 1, '2026-03-16 17:13:03', '2026-03-16 17:13:03');
INSERT INTO `brand` VALUES (24, 'Beyerdynamic', NULL, NULL, 0, 1, '2026-03-16 17:13:03', '2026-03-16 17:13:03');
INSERT INTO `brand` VALUES (25, 'Focal', NULL, NULL, 0, 1, '2026-03-16 17:13:03', '2026-03-16 17:13:03');
INSERT INTO `brand` VALUES (26, 'Garmin', NULL, NULL, 0, 1, '2026-03-16 17:13:03', '2026-03-16 17:13:03');

-- ----------------------------
-- Table structure for brand_category
-- ----------------------------
DROP TABLE IF EXISTS `brand_category`;
CREATE TABLE `brand_category`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `brand_id` bigint NOT NULL COMMENT '品牌ID',
  `category_id` bigint NOT NULL COMMENT '分类ID',
  `created_at` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_brand_category`(`brand_id` ASC, `category_id` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 84 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '品牌分类关联表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of brand_category
-- ----------------------------
INSERT INTO `brand_category` VALUES (1, 1, 1, '2026-03-12 20:47:36');
INSERT INTO `brand_category` VALUES (2, 1, 2, '2026-03-12 20:47:36');
INSERT INTO `brand_category` VALUES (3, 1, 5, '2026-03-12 20:47:36');
INSERT INTO `brand_category` VALUES (4, 1, 6, '2026-03-12 20:47:36');
INSERT INTO `brand_category` VALUES (5, 1, 4, '2026-03-12 20:47:36');
INSERT INTO `brand_category` VALUES (6, 2, 1, '2026-03-12 20:47:36');
INSERT INTO `brand_category` VALUES (7, 2, 2, '2026-03-12 20:47:36');
INSERT INTO `brand_category` VALUES (8, 2, 5, '2026-03-12 20:47:36');
INSERT INTO `brand_category` VALUES (9, 2, 6, '2026-03-12 20:47:36');
INSERT INTO `brand_category` VALUES (10, 2, 4, '2026-03-12 20:47:36');
INSERT INTO `brand_category` VALUES (11, 3, 1, '2026-03-12 20:47:36');
INSERT INTO `brand_category` VALUES (12, 3, 2, '2026-03-12 20:47:36');
INSERT INTO `brand_category` VALUES (13, 3, 5, '2026-03-12 20:47:36');
INSERT INTO `brand_category` VALUES (14, 3, 6, '2026-03-12 20:47:36');
INSERT INTO `brand_category` VALUES (15, 3, 4, '2026-03-12 20:47:36');
INSERT INTO `brand_category` VALUES (16, 4, 1, '2026-03-12 20:47:36');
INSERT INTO `brand_category` VALUES (17, 4, 2, '2026-03-12 20:47:36');
INSERT INTO `brand_category` VALUES (18, 4, 5, '2026-03-12 20:47:36');
INSERT INTO `brand_category` VALUES (19, 4, 6, '2026-03-12 20:47:36');
INSERT INTO `brand_category` VALUES (20, 4, 4, '2026-03-12 20:47:36');
INSERT INTO `brand_category` VALUES (21, 5, 1, '2026-03-12 20:47:36');
INSERT INTO `brand_category` VALUES (22, 5, 6, '2026-03-12 20:47:36');
INSERT INTO `brand_category` VALUES (23, 5, 4, '2026-03-12 20:47:36');
INSERT INTO `brand_category` VALUES (24, 6, 1, '2026-03-12 20:47:36');
INSERT INTO `brand_category` VALUES (25, 6, 6, '2026-03-12 20:47:36');
INSERT INTO `brand_category` VALUES (26, 6, 4, '2026-03-12 20:47:36');
INSERT INTO `brand_category` VALUES (27, 7, 1, '2026-03-12 20:47:36');
INSERT INTO `brand_category` VALUES (28, 7, 3, '2026-03-12 20:47:36');
INSERT INTO `brand_category` VALUES (29, 7, 4, '2026-03-12 20:47:36');
INSERT INTO `brand_category` VALUES (30, 7, 5, '2026-03-12 20:47:36');
INSERT INTO `brand_category` VALUES (31, 8, 2, '2026-03-12 20:47:36');
INSERT INTO `brand_category` VALUES (32, 8, 5, '2026-03-12 20:47:36');
INSERT INTO `brand_category` VALUES (33, 9, 2, '2026-03-12 20:47:36');
INSERT INTO `brand_category` VALUES (34, 9, 5, '2026-03-12 20:47:36');
INSERT INTO `brand_category` VALUES (35, 10, 2, '2026-03-12 20:47:36');
INSERT INTO `brand_category` VALUES (36, 10, 5, '2026-03-12 20:47:36');
INSERT INTO `brand_category` VALUES (37, 1, 3, '2026-03-14 18:13:46');
INSERT INTO `brand_category` VALUES (38, 2, 3, '2026-03-14 18:13:46');
INSERT INTO `brand_category` VALUES (39, 3, 3, '2026-03-14 18:13:46');
INSERT INTO `brand_category` VALUES (40, 4, 3, '2026-03-14 18:13:46');

-- ----------------------------
-- Table structure for category
-- ----------------------------
DROP TABLE IF EXISTS `category`;
CREATE TABLE `category`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '分类ID',
  `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '分类名称',
  `parent_id` bigint NULL DEFAULT 0 COMMENT '父分类ID',
  `level` tinyint NULL DEFAULT 1 COMMENT '层级',
  `icon` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '分类图标',
  `image` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '分类图片',
  `description` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `sort` int NULL DEFAULT 0 COMMENT '排序',
  `status` tinyint NULL DEFAULT 1 COMMENT '状态',
  `created_at` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_parent_id`(`parent_id` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 59 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '设备分类表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of category
-- ----------------------------
INSERT INTO `category` VALUES (1, '手机', 0, 1, '/icons/phone.png', NULL, NULL, 1, 1, '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `category` VALUES (2, '电脑', 0, 1, '/icons/computer.png', NULL, NULL, 2, 1, '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `category` VALUES (3, '相机', 0, 1, '/icons/camera.png', NULL, NULL, 3, 1, '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `category` VALUES (4, '耳机', 0, 1, '/icons/headphone.png', NULL, NULL, 4, 1, '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `category` VALUES (5, '平板', 0, 1, '/icons/tablet.png', NULL, NULL, 5, 1, '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `category` VALUES (6, '智能手表', 0, 1, '/icons/watch.png', NULL, NULL, 6, 1, '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `category` VALUES (7, '游戏手机', 1, 2, NULL, NULL, NULL, 1, 1, '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `category` VALUES (8, '轻薄手机', 1, 2, NULL, NULL, NULL, 2, 1, '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `category` VALUES (9, '拍照手机', 1, 2, NULL, NULL, NULL, 3, 1, '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `category` VALUES (11, '游戏手机', 1, 2, NULL, NULL, NULL, 1, 1, '2026-03-18 21:33:06', '2026-03-18 21:33:06');
INSERT INTO `category` VALUES (12, '拍照手机', 1, 2, NULL, NULL, NULL, 2, 1, '2026-03-18 21:33:06', '2026-03-18 21:33:06');
INSERT INTO `category` VALUES (13, '商务手机', 1, 2, NULL, NULL, NULL, 3, 1, '2026-03-18 21:33:06', '2026-03-18 21:33:06');
INSERT INTO `category` VALUES (14, 'Folding Phone', 1, 2, NULL, NULL, NULL, 4, 1, '2026-03-16 17:12:18', '2026-03-16 17:12:18');
INSERT INTO `category` VALUES (15, 'Gaming Laptop', 2, 2, NULL, NULL, NULL, 5, 1, '2026-03-16 17:12:18', '2026-03-16 17:12:18');
INSERT INTO `category` VALUES (16, 'Mirrorless Camera', 3, 2, NULL, NULL, NULL, 4, 1, '2026-03-16 17:12:18', '2026-03-16 17:12:18');
INSERT INTO `category` VALUES (17, 'Action Camera', 3, 2, NULL, NULL, NULL, 5, 1, '2026-03-16 17:12:18', '2026-03-16 17:12:18');
INSERT INTO `category` VALUES (18, 'TWS Earphone', 4, 2, NULL, NULL, NULL, 5, 1, '2026-03-16 17:12:18', '2026-03-16 17:12:18');
INSERT INTO `category` VALUES (19, 'Android Tablet', 5, 2, NULL, NULL, NULL, 6, 1, '2026-03-16 17:12:18', '2026-03-16 17:12:18');
INSERT INTO `category` VALUES (20, 'Smart Band', 6, 2, NULL, NULL, NULL, 7, 1, '2026-03-16 17:12:18', '2026-03-16 17:12:18');
INSERT INTO `category` VALUES (28, '无人机', 0, 1, '/icons/drone.png', NULL, NULL, 7, 1, '2026-03-20 12:00:00', '2026-03-20 12:00:00');
INSERT INTO `category` VALUES (29, '音箱', 0, 1, '/icons/speaker.png', NULL, NULL, 8, 1, '2026-03-20 12:00:00', '2026-03-20 12:00:00');
INSERT INTO `category` VALUES (30, '游戏机', 0, 1, '/icons/gamepad.png', NULL, NULL, 9, 1, '2026-03-20 12:00:00', '2026-03-20 12:00:00');
INSERT INTO `category` VALUES (31, '路由器', 0, 1, '/icons/router.png', NULL, NULL, 10, 1, '2026-03-20 12:00:00', '2026-03-20 12:00:00');
INSERT INTO `category` VALUES (32, '键盘鼠标', 0, 1, '/icons/keyboard.png', NULL, NULL, 11, 1, '2026-03-20 12:00:00', '2026-03-20 12:00:00');
INSERT INTO `category` VALUES (33, '移动电源', 0, 1, '/icons/powerbank.png', NULL, NULL, 12, 1, '2026-03-20 12:00:00', '2026-03-20 12:00:00');
INSERT INTO `category` VALUES (39, '航拍无人机', 28, 2, NULL, NULL, NULL, 1, 1, '2026-03-20 12:00:00', '2026-03-20 12:00:00');
INSERT INTO `category` VALUES (40, '穿越机', 28, 2, NULL, NULL, NULL, 2, 1, '2026-03-20 12:00:00', '2026-03-20 12:00:00');
INSERT INTO `category` VALUES (41, '手持云台', 28, 2, NULL, NULL, NULL, 3, 1, '2026-03-20 12:00:00', '2026-03-20 12:00:00');
INSERT INTO `category` VALUES (42, '家用音箱', 29, 2, NULL, NULL, NULL, 1, 1, '2026-03-20 12:00:00', '2026-03-20 12:00:00');
INSERT INTO `category` VALUES (43, '便携音箱', 29, 2, NULL, NULL, NULL, 2, 1, '2026-03-20 12:00:00', '2026-03-20 12:00:00');
INSERT INTO `category` VALUES (44, '条形音箱', 29, 2, NULL, NULL, NULL, 3, 1, '2026-03-20 12:00:00', '2026-03-20 12:00:00');
INSERT INTO `category` VALUES (45, 'PlayStation', 30, 2, NULL, NULL, NULL, 1, 1, '2026-03-20 12:00:00', '2026-03-20 12:00:00');
INSERT INTO `category` VALUES (46, 'Xbox', 30, 2, NULL, NULL, NULL, 2, 1, '2026-03-20 12:00:00', '2026-03-20 12:00:00');
INSERT INTO `category` VALUES (47, 'Nintendo Switch', 30, 2, NULL, NULL, NULL, 3, 1, '2026-03-20 12:00:00', '2026-03-20 12:00:00');
INSERT INTO `category` VALUES (48, '游戏掌机', 30, 2, NULL, NULL, NULL, 4, 1, '2026-03-20 12:00:00', '2026-03-20 12:00:00');
INSERT INTO `category` VALUES (49, 'WiFi6路由器', 31, 2, NULL, NULL, NULL, 1, 1, '2026-03-20 12:00:00', '2026-03-20 12:00:00');
INSERT INTO `category` VALUES (50, 'WiFi7路由器', 31, 2, NULL, NULL, NULL, 2, 1, '2026-03-20 12:00:00', '2026-03-20 12:00:00');
INSERT INTO `category` VALUES (51, 'Mesh组网', 31, 2, NULL, NULL, NULL, 3, 1, '2026-03-20 12:00:00', '2026-03-20 12:00:00');
INSERT INTO `category` VALUES (52, '机械键盘', 32, 2, NULL, NULL, NULL, 1, 1, '2026-03-20 12:00:00', '2026-03-20 12:00:00');
INSERT INTO `category` VALUES (53, '游戏鼠标', 32, 2, NULL, NULL, NULL, 2, 1, '2026-03-20 12:00:00', '2026-03-20 12:00:00');
INSERT INTO `category` VALUES (54, '无线键盘', 32, 2, NULL, NULL, NULL, 3, 1, '2026-03-20 12:00:00', '2026-03-20 12:00:00');
INSERT INTO `category` VALUES (55, '人体工学键盘', 32, 2, NULL, NULL, NULL, 4, 1, '2026-03-20 12:00:00', '2026-03-20 12:00:00');
INSERT INTO `category` VALUES (56, '充电宝', 33, 2, NULL, NULL, NULL, 1, 1, '2026-03-20 12:00:00', '2026-03-20 12:00:00');
INSERT INTO `category` VALUES (57, '无线充电器', 33, 2, NULL, NULL, NULL, 2, 1, '2026-03-20 12:00:00', '2026-03-20 12:00:00');
INSERT INTO `category` VALUES (58, '快充充电器', 33, 2, NULL, NULL, NULL, 3, 1, '2026-03-20 12:00:00', '2026-03-20 12:00:00');

-- ----------------------------
-- Table structure for category_attribute
-- ----------------------------
DROP TABLE IF EXISTS `category_attribute`;
CREATE TABLE `category_attribute`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `category_id` bigint NOT NULL COMMENT '分类ID',
  `attribute_id` bigint NOT NULL COMMENT '属性ID',
  `is_required` tinyint NULL DEFAULT 0 COMMENT '是否必填 0-否 1-是',
  `is_filter` tinyint NULL DEFAULT 0 COMMENT '是否作为筛选条件 0-否 1-是',
  `is_show` tinyint NULL DEFAULT 1 COMMENT '是否在详情页显示 0-否 1-是',
  `sort` int NULL DEFAULT 0 COMMENT '排序',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_category_attribute`(`category_id` ASC, `attribute_id` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 15 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '分类属性关联表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of category_attribute
-- ----------------------------
INSERT INTO `category_attribute` VALUES (1, 1, 1, 1, 1, 1, 1);
INSERT INTO `category_attribute` VALUES (2, 1, 2, 1, 1, 1, 2);
INSERT INTO `category_attribute` VALUES (3, 1, 3, 0, 1, 1, 3);
INSERT INTO `category_attribute` VALUES (4, 1, 4, 1, 1, 1, 4);
INSERT INTO `category_attribute` VALUES (5, 1, 5, 0, 0, 1, 5);
INSERT INTO `category_attribute` VALUES (6, 1, 6, 0, 1, 1, 6);
INSERT INTO `category_attribute` VALUES (7, 1, 7, 1, 1, 1, 7);
INSERT INTO `category_attribute` VALUES (8, 1, 8, 1, 1, 1, 8);
INSERT INTO `category_attribute` VALUES (9, 1, 9, 0, 0, 1, 9);
INSERT INTO `category_attribute` VALUES (10, 1, 10, 0, 0, 1, 10);
INSERT INTO `category_attribute` VALUES (11, 1, 11, 0, 0, 1, 11);
INSERT INTO `category_attribute` VALUES (12, 1, 12, 0, 1, 1, 12);
INSERT INTO `category_attribute` VALUES (13, 1, 24, 0, 0, 1, 13);
INSERT INTO `category_attribute` VALUES (14, 1, 25, 0, 0, 1, 14);

-- ----------------------------
-- Table structure for collection
-- ----------------------------
DROP TABLE IF EXISTS `collection`;
CREATE TABLE `collection`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '收藏ID',
  `user_id` bigint NOT NULL COMMENT '用户ID',
  `target_id` bigint NOT NULL COMMENT '目标ID',
  `target_type` tinyint NOT NULL COMMENT '目标类型 1-商品 2-帖子 3-型号 4-店铺 5-话题',
  `created_at` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_user_target`(`user_id` ASC, `target_id` ASC, `target_type` ASC) USING BTREE,
  INDEX `idx_target`(`target_id` ASC, `target_type` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 8 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '收藏表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of collection
-- ----------------------------
INSERT INTO `collection` VALUES (1, 1, 2, 1, '2026-03-17 15:13:24');
INSERT INTO `collection` VALUES (2, 1, 111, 1, '2026-03-19 20:20:38');
INSERT INTO `collection` VALUES (5, 1, 8, 2, '2026-03-19 21:07:09');
INSERT INTO `collection` VALUES (6, 1, 106, 1, '2026-03-19 21:07:18');
INSERT INTO `collection` VALUES (7, 4, 111, 1, '2026-03-20 12:38:14');

-- ----------------------------
-- Table structure for comment
-- ----------------------------
DROP TABLE IF EXISTS `comment`;
CREATE TABLE `comment`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `post_id` bigint NOT NULL COMMENT '帖子ID',
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '内容',
  `author_id` bigint NOT NULL COMMENT '作者ID',
  `parent_id` bigint NULL DEFAULT NULL COMMENT '父评论ID',
  `reply_to_id` bigint NULL DEFAULT NULL COMMENT '回复的评论ID',
  `reply_to_user_id` bigint NULL DEFAULT NULL COMMENT '回复的用户ID',
  `images` json NULL COMMENT '图片列表',
  `like_count` int NULL DEFAULT 0 COMMENT '点赞数',
  `reply_count` int NULL DEFAULT 0 COMMENT '回复数',
  `status` tinyint NULL DEFAULT 1 COMMENT '状态: 0-删除 1-正常',
  `created_at` datetime NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` datetime NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_post_id`(`post_id` ASC) USING BTREE,
  INDEX `idx_author_id`(`author_id` ASC) USING BTREE,
  INDEX `idx_parent_id`(`parent_id` ASC) USING BTREE,
  INDEX `idx_status`(`status` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 38 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '评论表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of comment
-- ----------------------------
INSERT INTO `comment` VALUES (1, 1, '钛金属确实很棒，手感比以前好多了！', 2, NULL, NULL, NULL, NULL, 30, 2, 1, '2026-03-14 18:13:46', '2026-03-14 18:13:46');
INSERT INTO `comment` VALUES (2, 1, '多少钱入手的？', 3, NULL, NULL, NULL, NULL, 10, 1, 1, '2026-03-14 18:13:46', '2026-03-14 18:13:46');
INSERT INTO `comment` VALUES (3, 1, '我花了10999，256G版本', 1, 2, 2, 3, NULL, 15, 0, 1, '2026-03-14 18:13:46', '2026-03-14 18:13:46');
INSERT INTO `comment` VALUES (4, 1, '拍照效果怎么样？', 4, NULL, NULL, NULL, NULL, 8, 1, 1, '2026-03-14 18:13:46', '2026-03-14 18:13:46');
INSERT INTO `comment` VALUES (5, 2, '徕卡色彩确实很德味，我也很喜欢！', 4, NULL, NULL, NULL, NULL, 20, 0, 1, '2026-03-14 18:13:46', '2026-03-14 18:13:46');
INSERT INTO `comment` VALUES (6, 3, '很实用的经验，感谢分享！', 1, NULL, NULL, NULL, NULL, 15, 0, 1, '2026-03-14 18:13:46', '2026-03-14 18:13:46');
INSERT INTO `comment` VALUES (7, 4, '卫星通话功能确实很实用，户外爱好者必备', 1, NULL, NULL, NULL, NULL, 25, 0, 1, '2026-03-14 18:13:46', '2026-03-14 18:13:46');
INSERT INTO `comment` VALUES (8, 6, '两款都很强，看个人喜好选择', 2, NULL, NULL, NULL, NULL, 18, 0, 1, '2026-03-14 18:13:46', '2026-03-14 18:13:46');
INSERT INTO `comment` VALUES (9, 7, '感谢分享，我也在考虑入手这款手机！', 2, NULL, NULL, NULL, NULL, 25, 0, 1, '2026-03-13 19:46:31', '2026-03-18 19:46:31');
INSERT INTO `comment` VALUES (10, 7, '钛金属边框确实轻了很多，之前用14 Pro Max手都快断了', 3, NULL, NULL, NULL, NULL, 45, 1, 1, '2026-03-14 19:46:31', '2026-03-18 19:46:31');
INSERT INTO `comment` VALUES (11, 7, '续航真的有那么大提升吗？我现在的手机一天两充', 4, NULL, NULL, NULL, NULL, 12, 0, 1, '2026-03-15 19:46:31', '2026-03-18 19:46:31');
INSERT INTO `comment` VALUES (12, 7, 'A17 Pro玩原神全开画质真的不卡吗？', 2, NULL, NULL, NULL, NULL, 18, 1, 1, '2026-03-16 19:46:31', '2026-03-18 19:46:31');
INSERT INTO `comment` VALUES (13, 7, '5倍长焦确实好用，拍远景太方便了', 4, NULL, NULL, NULL, NULL, 30, 0, 1, '2026-03-17 19:46:31', '2026-03-18 19:46:31');
INSERT INTO `comment` VALUES (14, 7, '是的，中度使用一天完全没问题', 1, 10, 10, 4, NULL, 8, 0, 1, '2026-03-16 19:46:31', '2026-03-18 19:46:31');
INSERT INTO `comment` VALUES (15, 7, '全开画质稳定60帧，稍微有点发热但能接受', 1, 12, 12, 2, NULL, 15, 0, 1, '2026-03-17 19:46:31', '2026-03-18 19:46:31');
INSERT INTO `comment` VALUES (16, 8, '我也遇到过这个问题，玩游戏时确实会发热，特别是夏天', 1, NULL, NULL, NULL, NULL, 35, 0, 1, '2026-03-12 19:47:04', '2026-03-18 19:47:04');
INSERT INTO `comment` VALUES (17, 8, '正常的，A17 Pro性能强，发热也比以前大', 3, NULL, NULL, NULL, NULL, 28, 0, 1, '2026-03-13 19:47:04', '2026-03-18 19:47:04');
INSERT INTO `comment` VALUES (18, 8, '建议买个散热背夹，玩游戏的时候用', 4, NULL, NULL, NULL, NULL, 20, 0, 1, '2026-03-14 19:47:04', '2026-03-18 19:47:04');
INSERT INTO `comment` VALUES (19, 9, '对比很详细！我也有14 Pro Max，考虑要不要升级', 2, NULL, NULL, NULL, NULL, 40, 0, 1, '2026-03-15 19:47:04', '2026-03-18 19:47:04');
INSERT INTO `comment` VALUES (20, 9, 'Type-C接口终于来了，这才是最大的升级点', 1, NULL, NULL, NULL, NULL, 55, 1, 1, '2026-03-16 19:47:04', '2026-03-18 19:47:04');
INSERT INTO `comment` VALUES (21, 9, '钛金属版本轻了约19g，手感确实好很多', 3, NULL, NULL, NULL, NULL, 32, 0, 1, '2026-03-17 19:47:04', '2026-03-18 19:47:04');
INSERT INTO `comment` VALUES (22, 9, '同意，Type-C可以直接连相机导照片，太方便了', 4, 20, 20, 1, NULL, 18, 0, 1, '2026-03-17 19:47:04', '2026-03-18 19:47:04');
INSERT INTO `comment` VALUES (23, 1, '非常详细的开箱分享！钛金属确实很有质感', 3, NULL, NULL, NULL, NULL, 45, 1, 1, '2026-03-08 19:50:09', '2026-03-18 19:50:09');
INSERT INTO `comment` VALUES (24, 1, '我也想入手，哪个颜色好看？', 4, NULL, NULL, NULL, NULL, 20, 1, 1, '2026-03-09 19:50:09', '2026-03-18 19:50:09');
INSERT INTO `comment` VALUES (25, 1, '原色钛金属最好看，低调又有质感', 1, 23, 23, 4, NULL, 35, 0, 1, '2026-03-09 19:50:09', '2026-03-18 19:50:09');
INSERT INTO `comment` VALUES (26, 1, '同意，原色确实好看', 2, 23, 23, 4, NULL, 15, 0, 1, '2026-03-10 19:50:09', '2026-03-18 19:50:09');
INSERT INTO `comment` VALUES (27, 5, 'haoa', 1, NULL, NULL, NULL, NULL, 0, 0, 1, '2026-03-19 00:42:25', '2026-03-19 00:42:25');
INSERT INTO `comment` VALUES (28, 8, '这是一条测试评论', 1, NULL, NULL, NULL, NULL, 0, 0, 1, '2026-03-19 16:11:32', '2026-03-19 16:11:32');
INSERT INTO `comment` VALUES (29, 3, 'duid', 1, NULL, NULL, NULL, NULL, 0, 0, 1, '2026-03-21 14:48:50', '2026-03-21 14:48:50');
INSERT INTO `comment` VALUES (30, 9, '好耶', 1, NULL, NULL, NULL, NULL, 0, 0, 1, '2026-03-21 15:08:49', '2026-03-21 15:08:49');
INSERT INTO `comment` VALUES (31, 9, '好耶', 1, NULL, NULL, NULL, NULL, 0, 0, 1, '2026-03-21 15:08:51', '2026-03-21 15:08:51');
INSERT INTO `comment` VALUES (32, 9, '好耶', 1, NULL, NULL, NULL, NULL, 0, 1, 1, '2026-03-21 15:09:10', '2026-03-21 15:49:55');
INSERT INTO `comment` VALUES (33, 9, '不对', 1, NULL, NULL, NULL, NULL, 0, 0, 1, '2026-03-21 15:49:46', '2026-03-21 15:49:46');
INSERT INTO `comment` VALUES (34, 9, '对的', 1, 32, NULL, 1, NULL, 0, 0, 1, '2026-03-21 15:49:56', '2026-03-21 15:49:56');
INSERT INTO `comment` VALUES (35, 9, '不对', 1, NULL, NULL, NULL, NULL, 0, 0, 1, '2026-03-21 15:50:11', '2026-03-21 15:50:11');
INSERT INTO `comment` VALUES (36, 9, '就是这个', 1, NULL, NULL, NULL, NULL, 0, 0, 1, '2026-03-21 15:57:28', '2026-03-21 15:57:28');

-- ----------------------------
-- Table structure for comment_like
-- ----------------------------
DROP TABLE IF EXISTS `comment_like`;
CREATE TABLE `comment_like`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `comment_id` bigint NOT NULL COMMENT '评论ID',
  `user_id` bigint NOT NULL COMMENT '用户ID',
  `created_at` datetime NULL DEFAULT CURRENT_TIMESTAMP COMMENT '点赞时间',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_comment_user`(`comment_id` ASC, `user_id` ASC) USING BTREE,
  INDEX `idx_user_id`(`user_id` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 20 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '评论点赞表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of comment_like
-- ----------------------------
INSERT INTO `comment_like` VALUES (1, 1, 1, '2026-03-14 18:13:46');
INSERT INTO `comment_like` VALUES (2, 1, 3, '2026-03-14 18:13:46');
INSERT INTO `comment_like` VALUES (3, 2, 1, '2026-03-14 18:13:46');
INSERT INTO `comment_like` VALUES (4, 3, 2, '2026-03-14 18:13:46');
INSERT INTO `comment_like` VALUES (5, 3, 4, '2026-03-14 18:13:46');
INSERT INTO `comment_like` VALUES (6, 5, 1, '2026-03-14 18:13:46');
INSERT INTO `comment_like` VALUES (7, 5, 2, '2026-03-14 18:13:46');
INSERT INTO `comment_like` VALUES (8, 6, 2, '2026-03-14 18:13:46');
INSERT INTO `comment_like` VALUES (9, 6, 5, '2026-03-14 18:13:46');

-- ----------------------------
-- Table structure for community
-- ----------------------------
DROP TABLE IF EXISTS `community`;
CREATE TABLE `community`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '社区名称',
  `type` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '类型: model/user',
  `description` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '描述',
  `cover` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '封面图',
  `model_id` bigint NULL DEFAULT NULL COMMENT '关联型号ID',
  `is_official` tinyint NULL DEFAULT 0 COMMENT '是否官方: 0-否 1-是',
  `creator_id` bigint NULL DEFAULT NULL COMMENT '创建者ID',
  `member_count` int NULL DEFAULT 0 COMMENT '成员数',
  `post_count` int NULL DEFAULT 0 COMMENT '帖子数',
  `tags` json NULL COMMENT '标签列表',
  `status` tinyint NULL DEFAULT 1 COMMENT '状态: 0-禁用 1-正常',
  `created_at` datetime NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` datetime NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_name`(`name` ASC) USING BTREE,
  INDEX `idx_type`(`type` ASC) USING BTREE,
  INDEX `idx_model_id`(`model_id` ASC) USING BTREE,
  INDEX `idx_creator_id`(`creator_id` ASC) USING BTREE,
  INDEX `idx_status`(`status` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 8 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '社区表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of community
-- ----------------------------
INSERT INTO `community` VALUES (1, 'iPhone 15 Pro Max 圈子', 'model', 'iPhone 15 Pro Max 用户交流社区，分享使用心得、技巧和问题', 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400', 1, 1, 1, 2500, 80, NULL, 1, '2026-03-14 18:13:46', '2026-03-18 21:40:10');
INSERT INTO `community` VALUES (2, 'iPhone 15 Pro 圈子', 'model', 'iPhone 15 Pro 用户交流社区', 'https://images.unsplash.com/photo-1591331653864-aa9c5e8b6bf4?w=400', 2, 1, 1, 2000, 60, NULL, 1, '2026-03-14 18:13:46', '2026-03-18 21:40:10');
INSERT INTO `community` VALUES (3, '小米发烧友', 'model', '小米手机爱好者社区，分享MIUI技巧和玩机心得', 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400', 4, 0, 2, 1200, 45, NULL, 1, '2026-03-14 18:13:46', '2026-03-18 21:40:10');
INSERT INTO `community` VALUES (4, '华为Mate60 圈子', 'model', '华为Mate60系列用户交流', 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400', 6, 0, 4, 1800, 55, NULL, 1, '2026-03-14 18:13:46', '2026-03-18 21:40:10');
INSERT INTO `community` VALUES (5, '数码交易交流', 'user', '二手数码交易交流社区，诚信交易', 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400', NULL, 0, 5, 500, 100, NULL, 1, '2026-03-14 18:13:46', '2026-03-18 21:40:10');
INSERT INTO `community` VALUES (6, 'MacBook 用户群', 'model', 'MacBook 用户交流社区', 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400', 8, 1, 1, 500, 20, NULL, 1, '2026-03-14 18:13:46', '2026-03-18 21:40:10');
INSERT INTO `community` VALUES (7, '摄影爱好者', 'user', '手机摄影爱好者交流社区', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400', NULL, 0, 3, 800, 50, NULL, 1, '2026-03-14 18:13:46', '2026-03-18 21:40:10');

-- ----------------------------
-- Table structure for community_member
-- ----------------------------
DROP TABLE IF EXISTS `community_member`;
CREATE TABLE `community_member`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `community_id` bigint NOT NULL COMMENT '社区ID',
  `user_id` bigint NOT NULL COMMENT '用户ID',
  `level` int NULL DEFAULT 1 COMMENT '等级',
  `exp` int NULL DEFAULT 0 COMMENT '经验值',
  `is_admin` tinyint NULL DEFAULT 0 COMMENT '是否管理员: 0-否 1-是',
  `created_at` datetime NULL DEFAULT CURRENT_TIMESTAMP COMMENT '加入时间',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_community_user`(`community_id` ASC, `user_id` ASC) USING BTREE,
  INDEX `idx_user_id`(`user_id` ASC) USING BTREE,
  INDEX `idx_community_id`(`community_id` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 28 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '社区成员表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of community_member
-- ----------------------------
INSERT INTO `community_member` VALUES (1, 1, 1, 10, 5000, 1, '2026-03-14 18:13:46');
INSERT INTO `community_member` VALUES (2, 1, 2, 5, 1500, 0, '2026-03-14 18:13:46');
INSERT INTO `community_member` VALUES (3, 1, 3, 8, 3000, 0, '2026-03-14 18:13:46');
INSERT INTO `community_member` VALUES (4, 2, 3, 10, 6000, 1, '2026-03-14 18:13:46');
INSERT INTO `community_member` VALUES (5, 3, 2, 10, 8000, 1, '2026-03-14 18:13:46');
INSERT INTO `community_member` VALUES (6, 3, 4, 6, 2000, 0, '2026-03-14 18:13:46');
INSERT INTO `community_member` VALUES (7, 4, 4, 10, 7000, 1, '2026-03-14 18:13:46');
INSERT INTO `community_member` VALUES (8, 5, 5, 10, 5000, 1, '2026-03-14 18:13:46');
INSERT INTO `community_member` VALUES (9, 5, 1, 3, 500, 0, '2026-03-14 18:13:46');
INSERT INTO `community_member` VALUES (10, 6, 1, 8, 4000, 1, '2026-03-14 18:13:46');
INSERT INTO `community_member` VALUES (11, 6, 3, 5, 1500, 0, '2026-03-14 18:13:46');
INSERT INTO `community_member` VALUES (12, 7, 3, 10, 6000, 1, '2026-03-14 18:13:46');
INSERT INTO `community_member` VALUES (13, 7, 1, 4, 1000, 0, '2026-03-14 18:13:46');

-- ----------------------------
-- Table structure for conversation
-- ----------------------------
DROP TABLE IF EXISTS `conversation`;
CREATE TABLE `conversation`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '会话ID',
  `user_id` bigint NOT NULL COMMENT '用户ID（当前用户）',
  `target_id` bigint NOT NULL COMMENT '对方用户ID',
  `last_message` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '最后一条消息内容',
  `last_message_type` tinyint NULL DEFAULT 1 COMMENT '最后消息类型 1-文本 2-图片 3-商品卡片 4-订单卡片',
  `last_message_time` datetime NULL DEFAULT NULL COMMENT '最后消息时间',
  `unread_count` int NULL DEFAULT 0 COMMENT '未读消息数',
  `is_pinned` tinyint NULL DEFAULT 0 COMMENT '是否置顶 0-否 1-是',
  `is_muted` tinyint NULL DEFAULT 0 COMMENT '是否免打扰 0-否 1-是',
  `is_deleted` tinyint NULL DEFAULT 0 COMMENT '当前用户是否删除会话 0-否 1-是',
  `created_at` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_user_target`(`user_id` ASC, `target_id` ASC) USING BTREE,
  INDEX `idx_target_id`(`target_id` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 15 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '会话表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of conversation
-- ----------------------------
INSERT INTO `conversation` VALUES (1, 1, 2, '{\"totalAmount\":7999.00,\"orderNo\":\"ORD202603150001\",\"quantity\":1,\"orderId\":1,\"message\":\"买家已确认收货，交易完成\",\"status\":\"COMPLETED\",\"timestamp\":1773934337240}', 4, '2026-03-19 23:32:17', 0, 0, 0, 0, '2026-03-14 09:00:00', '2026-03-21 12:04:40');
INSERT INTO `conversation` VALUES (2, 1, 3, 'http://localhost:8080/uploads/2026/03/15/91ec7047f2544f0cb55454e7168d2400.jpg', 2, '2026-03-15 16:52:16', 0, 0, 0, 0, '2026-03-13 14:00:00', '2026-03-15 21:42:24');
INSERT INTO `conversation` VALUES (3, 1, 5, 'http://localhost:8080/uploads/2026/03/17/2f6784c83fcd42d6a3ee3bdb6ff30510.jpg', 2, '2026-03-17 18:17:10', 0, 1, 0, 0, '2026-03-10 11:00:00', '2026-03-19 19:29:51');
INSERT INTO `conversation` VALUES (4, 2, 1, '{\"totalAmount\":7999.00,\"orderNo\":\"ORD202603150001\",\"quantity\":1,\"orderId\":1,\"message\":\"买家已确认收货，交易完成\",\"status\":\"COMPLETED\",\"timestamp\":1773934337240}', 4, '2026-03-19 23:32:17', 3, 0, 0, 0, '2026-03-14 09:00:00', '2026-03-19 23:32:17');
INSERT INTO `conversation` VALUES (5, 2, 3, '请问这个相机还在吗？', 1, '2026-03-14 15:00:00', 0, 0, 1, 0, '2026-03-12 10:00:00', '2026-03-15 19:48:14');
INSERT INTO `conversation` VALUES (6, 3, 1, 'http://localhost:8080/uploads/2026/03/15/91ec7047f2544f0cb55454e7168d2400.jpg', 2, '2026-03-15 16:52:16', 3, 0, 0, 0, '2026-03-13 14:00:00', '2026-03-15 16:52:15');
INSERT INTO `conversation` VALUES (7, 3, 2, '请问这个相机还在吗？', 1, '2026-03-14 15:00:00', 0, 0, 0, 0, '2026-03-12 10:00:00', '2026-03-14 15:00:00');
INSERT INTO `conversation` VALUES (8, 3, 5, '好的，已收到款项', 1, '2026-03-13 11:30:00', 0, 0, 0, 0, '2026-03-11 09:00:00', '2026-03-13 11:30:00');
INSERT INTO `conversation` VALUES (9, 5, 1, 'http://localhost:8080/uploads/2026/03/17/2f6784c83fcd42d6a3ee3bdb6ff30510.jpg', 2, '2026-03-17 18:17:10', 7, 0, 0, 0, '2026-03-10 11:00:00', '2026-03-17 18:17:10');
INSERT INTO `conversation` VALUES (10, 5, 3, '好的，已收到款项', 1, '2026-03-13 11:30:00', 2, 0, 0, 0, '2026-03-11 09:00:00', '2026-03-13 11:30:00');
INSERT INTO `conversation` VALUES (11, 1, 8, '{\"totalAmount\":22999.00,\"orderNo\":\"XM20260321003552271013\",\"quantity\":1,\"orderId\":12,\"message\":\"买家已付款，请尽快发货\",\"status\":\"PENDING_SHIPMENT\",\"timestamp\":1774024556791}', 4, '2026-03-21 00:35:57', 0, 0, 0, 0, '2026-03-19 11:20:18', '2026-03-21 00:35:57');
INSERT INTO `conversation` VALUES (12, 8, 1, '{\"totalAmount\":22999.00,\"orderNo\":\"XM20260321003552271013\",\"quantity\":1,\"orderId\":12,\"message\":\"买家已付款，请尽快发货\",\"status\":\"PENDING_SHIPMENT\",\"timestamp\":1774024556791}', 4, '2026-03-21 00:35:57', 3, 0, 0, 0, '2026-03-19 11:20:18', '2026-03-21 00:35:57');
INSERT INTO `conversation` VALUES (13, 4, 1, '{\"totalAmount\":6999.00,\"orderNo\":\"XM20260320004818224670\",\"quantity\":1,\"orderId\":11,\"message\":\"买家已下单，请等待付款\",\"status\":\"PENDING_PAYMENT\",\"timestamp\":1773938898419}', 4, '2026-03-20 00:48:18', 0, 0, 0, 0, '2026-03-20 00:48:18', '2026-03-20 13:25:48');
INSERT INTO `conversation` VALUES (14, 1, 4, '{\"totalAmount\":6999.00,\"orderNo\":\"XM20260320004818224670\",\"quantity\":1,\"orderId\":11,\"message\":\"买家已下单，请等待付款\",\"status\":\"PENDING_PAYMENT\",\"timestamp\":1773938898419}', 4, '2026-03-20 00:48:18', 0, 0, 0, 0, '2026-03-20 00:48:18', '2026-03-20 18:08:30');

-- ----------------------------
-- Table structure for evaluation
-- ----------------------------
DROP TABLE IF EXISTS `evaluation`;
CREATE TABLE `evaluation`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '评价ID',
  `order_id` bigint NOT NULL COMMENT '订单ID',
  `goods_id` bigint NOT NULL COMMENT '商品ID',
  `user_id` bigint NOT NULL COMMENT '评价人ID（买家）',
  `seller_id` bigint NOT NULL COMMENT '卖家ID',
  `rating` tinyint NOT NULL COMMENT '评分 1-5',
  `content` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '评价内容',
  `images` json NULL COMMENT '评价图片',
  `seller_reply` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '卖家回复',
  `seller_reply_time` datetime NULL DEFAULT NULL COMMENT '卖家回复时间',
  `is_anonymous` tinyint NULL DEFAULT 0 COMMENT '是否匿名 0-否 1-是',
  `status` tinyint NULL DEFAULT 1 COMMENT '状态 1-正常 0-删除',
  `created_at` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_order_id`(`order_id` ASC) USING BTREE,
  INDEX `idx_goods_id`(`goods_id` ASC) USING BTREE,
  INDEX `idx_seller_id`(`seller_id` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 19 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '评价表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of evaluation
-- ----------------------------
INSERT INTO `evaluation` VALUES (1, 1001, 101, 2, 1, 5, '全新未拆封，发货很快，包装完好。手机质感很好，钛金属边框确实很轻。', '[]', NULL, NULL, 0, 1, '2026-03-16 19:27:36', '2026-03-18 19:27:36');
INSERT INTO `evaluation` VALUES (2, 1002, 102, 3, 1, 5, '成色确实99新，卖家描述准确。电池健康度很高，用起来很流畅。', '[]', NULL, NULL, 0, 1, '2026-03-15 19:27:36', '2026-03-18 19:27:36');
INSERT INTO `evaluation` VALUES (3, 1003, 103, 1, 2, 4, '手机整体不错，但是有一点点小划痕，不影响使用。性价比很高。', '[]', NULL, NULL, 0, 1, '2026-03-14 19:27:36', '2026-03-18 19:27:36');
INSERT INTO `evaluation` VALUES (4, 1004, 104, 2, 1, 5, '正品，比官网便宜一点，全新未激活。推荐购买！', '[]', NULL, NULL, 0, 1, '2026-03-17 19:27:36', '2026-03-18 19:27:36');
INSERT INTO `evaluation` VALUES (5, 1005, 105, 3, 3, 4, '手机不错，但是快递有点慢。电池健康100%，很满意。', '[]', NULL, NULL, 0, 1, '2026-03-16 19:27:36', '2026-03-18 19:27:36');
INSERT INTO `evaluation` VALUES (6, 1006, 106, 1, 1, 5, '性价比很高，粉色很好看。灵动岛功能很有趣。', '[]', NULL, NULL, 0, 1, '2026-03-17 19:27:36', '2026-03-18 19:27:36');
INSERT INTO `evaluation` VALUES (7, 1007, 107, 2, 2, 4, '成色符合描述，蓝色很漂亮。整体满意。', '[]', NULL, NULL, 0, 1, '2026-03-16 19:27:36', '2026-03-18 19:27:36');
INSERT INTO `evaluation` VALUES (8, 1008, 108, 3, 1, 5, '徕卡影像太强了，随手一拍就是大片。物流很快。', '[]', NULL, NULL, 0, 1, '2026-03-18 19:27:36', '2026-03-18 19:27:36');
INSERT INTO `evaluation` VALUES (9, 1009, 109, 1, 2, 5, '拍照效果一流，夜景表现惊艳。推荐摄影爱好者入手。', '[]', NULL, NULL, 0, 1, '2026-03-17 19:27:36', '2026-03-18 19:27:36');
INSERT INTO `evaluation` VALUES (10, 1010, 110, 2, 1, 5, '性价比很高，徕卡加持拍照很棒。日常使用流畅。', '[]', NULL, NULL, 0, 1, '2026-03-18 19:27:36', '2026-03-18 19:27:36');
INSERT INTO `evaluation` VALUES (11, 1011, 111, 3, 1, 5, '卫星通信功能很安心，昆仑玻璃耐摔。鸿蒙系统很流畅。', '[]', NULL, NULL, 0, 1, '2026-03-18 19:27:36', '2026-03-18 19:27:36');
INSERT INTO `evaluation` VALUES (12, 1012, 112, 1, 2, 4, '成色很好，配件齐全。信号比苹果好很多。', '[]', NULL, NULL, 0, 1, '2026-03-17 19:27:36', '2026-03-18 19:27:36');
INSERT INTO `evaluation` VALUES (13, 1013, 113, 2, 1, 5, '游戏神器，玩原神60帧稳定。RGB灯效很炫酷。', '[]', NULL, NULL, 0, 1, '2026-03-18 19:27:36', '2026-03-18 19:27:36');
INSERT INTO `evaluation` VALUES (14, 1014, 114, 3, 2, 4, '电竞手机果然不一样，散热很好，长时间玩游戏也不烫。', '[]', NULL, NULL, 0, 1, '2026-03-17 19:27:36', '2026-03-18 19:27:36');
INSERT INTO `evaluation` VALUES (15, 1015, 116, 1, 1, 5, '蔡司影像名不虚传，人像模式很好看。夜景拍摄很强。', '[]', NULL, NULL, 0, 1, '2026-03-18 19:27:36', '2026-03-18 19:27:36');
INSERT INTO `evaluation` VALUES (16, 1016, 117, 2, 2, 5, '拍照效果超出预期，成色也符合描述。很满意这次购物。', '[]', NULL, NULL, 0, 1, '2026-03-17 19:27:36', '2026-03-18 19:27:36');
INSERT INTO `evaluation` VALUES (17, 1017, 118, 3, 1, 5, '双潜望镜头太强了，拍远景人像非常给力。哈苏色彩很喜欢。', '[]', NULL, NULL, 0, 1, '2026-03-18 19:27:36', '2026-03-18 19:27:36');
INSERT INTO `evaluation` VALUES (18, 1018, 119, 1, 3, 4, '影像旗舰实至名归，成色95新描述准确。推荐入手。', '[]', NULL, NULL, 0, 1, '2026-03-17 19:27:36', '2026-03-18 19:27:36');

-- ----------------------------
-- Table structure for goods
-- ----------------------------
DROP TABLE IF EXISTS `goods`;
CREATE TABLE `goods`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '商品ID',
  `title` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '商品标题',
  `seller_id` bigint NOT NULL COMMENT '卖家ID',
  `model_id` bigint NULL DEFAULT NULL COMMENT '关联产品型号ID',
  `category_id` bigint NULL DEFAULT NULL COMMENT '分类ID',
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL COMMENT '商品描述',
  `images` json NULL COMMENT '图片列表',
  `price` decimal(10, 2) NOT NULL COMMENT '售价',
  `original_price` decimal(10, 2) NULL DEFAULT NULL COMMENT '原价',
  `condition_level` tinyint NULL DEFAULT 10 COMMENT '成色',
  `condition_desc` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '成色描述',
  `warranty` tinyint NULL DEFAULT 0 COMMENT '是否保修',
  `invoice` tinyint NULL DEFAULT 0 COMMENT '是否有发票',
  `can_bargain` tinyint NULL DEFAULT 1 COMMENT '是否可议价',
  `location` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '发货地',
  `trade_method` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '交易方式:local,express,pickup',
  `free_shipping` tinyint(1) NULL DEFAULT 0 COMMENT '是否包邮:0否,1是',
  `can_inspect` tinyint(1) NULL DEFAULT 0 COMMENT '是否支持验货:0否,1是',
  `stock` int NULL DEFAULT 1 COMMENT '库存',
  `view_count` int NULL DEFAULT 0 COMMENT '浏览量',
  `like_count` int NULL DEFAULT 0 COMMENT '收藏数',
  `status` tinyint NULL DEFAULT 1 COMMENT '状态',
  `reject_reason` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '审核拒绝原因',
  `created_at` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted` tinyint NULL DEFAULT 0 COMMENT '逻辑删除',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_seller_id`(`seller_id` ASC) USING BTREE,
  INDEX `idx_model_id`(`model_id` ASC) USING BTREE,
  INDEX `idx_category_id`(`category_id` ASC) USING BTREE,
  INDEX `idx_status`(`status` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 123 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '商品表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of goods
-- ----------------------------
INSERT INTO `goods` VALUES (1, 'iPhone 15 Pro Max 256GB 原色钛金属', 1, 1, 1, '99新，无划痕，配件齐全，电池健康度100%，支持验机', '[\"https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600\", \"https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600\", \"https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=600\"]', 8999.00, 9999.00, 100, '全新未拆封', 1, 1, 1, '北京', 'express', 0, 1, 10, 314, 34, 1, NULL, '2026-03-16 14:00:35', '2026-03-21 12:08:15', 0);
INSERT INTO `goods` VALUES (2, '华为 Mate 60 Pro+ 512GB 雅丹黑', 2, 4, 1, '95新，轻微使用痕迹，卫星通话功能正常，配件齐全', '[\"https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600\", \"https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=600\"]', 7999.00, 8999.00, 95, '轻微划痕', 1, 0, 1, '上海', 'express', 0, 1, 10, 529, 74, 1, NULL, '2026-03-16 14:00:35', '2026-03-21 00:34:24', 0);
INSERT INTO `goods` VALUES (3, '小米14 Ultra 16+512 黑色', 3, 6, 1, '99新，全套配件，徕卡影像系统，摄影爱好者必入', '[\"https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600\", \"https://images.unsplash.com/photo-1606986628253-e0e8e2e5c6e3?w=600\"]', 5999.00, 6499.00, 100, '几乎全新', 1, 1, 0, '深圳', 'local', 1, 0, 10, 470, 20, 1, NULL, '2026-03-16 14:00:35', '2026-03-21 00:34:24', 0);
INSERT INTO `goods` VALUES (4, 'MacBook Pro 14 M3 Pro 18+512 深空黑', 1, 12, 2, '95新，电池健康度98%，屏幕完美无划痕，开发利器', '[\"https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600\", \"https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=600\"]', 14999.00, 16999.00, 95, '正常使用痕迹', 1, 1, 1, '北京', 'express', 1, 1, 10, 291, 34, 1, NULL, '2026-03-16 14:00:35', '2026-03-21 12:08:17', 0);
INSERT INTO `goods` VALUES (5, 'iPad Pro 12.9 M2 256GB 深空灰', 2, 16, 5, '99新，带Apple Pencil二代，屏幕完美，生产力工具', '[\"https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600\", \"https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?w=600\"]', 7999.00, 9299.00, 100, '屏幕完美', 1, 1, 1, '广州', 'express', 1, 1, 10, 230, 85, 1, NULL, '2026-03-16 14:00:35', '2026-03-21 00:34:24', 0);
INSERT INTO `goods` VALUES (6, 'AirPods Pro 2 主动降噪版', 3, 18, 4, '全新未拆封，H2芯片，降噪效果一流', '[\"https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=600\", \"https://images.unsplash.com/photo-1608156639585-b3a7a6e98dcb?w=600\"]', 1699.00, 1899.00, 100, '全新', 1, 1, 0, '深圳', 'express', 0, 0, 10, 298, 48, 1, NULL, '2026-03-16 14:00:35', '2026-03-21 00:34:24', 0);
INSERT INTO `goods` VALUES (7, '索尼 WH-1000XM5 头戴式降噪耳机 黑色', 1, 19, 4, '95新，降噪效果极佳，30小时续航，音质出众', '[\"https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600\", \"https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600\"]', 1999.00, 2499.00, 95, '耳罩轻微磨损', 1, 0, 1, '上海', 'express', 1, 1, 10, 67, 20, 1, NULL, '2026-03-16 14:00:35', '2026-03-21 00:34:24', 0);
INSERT INTO `goods` VALUES (8, '三星 Galaxy S24 Ultra 12+256 钛灰色', 2, 9, 1, '99新，国行在保，S Pen书写流畅，2亿像素相机', '[\"https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600\", \"https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=600\"]', 8499.00, 9699.00, 100, '完美成色', 1, 1, 1, '北京', 'express', 0, 1, 10, 291, 40, 1, NULL, '2026-03-16 14:00:35', '2026-03-22 13:50:55', 0);
INSERT INTO `goods` VALUES (9, 'MacBook Air M3 15inch 16+512 Starlight Brand New', 6, 60, 2, 'Brand new sealed M3 chip', '[\"https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600\", \"https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=600\"]', 10999.00, 11999.00, 100, 'Brand new sealed', 1, 1, 0, 'Beijing', 'express', 1, 0, 10, 1, 0, 1, NULL, '2026-03-16 17:29:15', '2026-03-21 01:15:00', 0);
INSERT INTO `goods` VALUES (10, 'MacBook Pro 16 M3 Max 36+1TB Space Black 95pct New', 7, 61, 2, '95pct new top specs video editing', '[\"https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600\", \"https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=600\"]', 25999.00, 29999.00, 95, 'Minor usage marks', 1, 1, 1, 'Shanghai', 'express', 1, 1, 10, 0, 0, 1, NULL, '2026-03-16 17:29:15', '2026-03-21 00:34:24', 0);
INSERT INTO `goods` VALUES (11, 'ThinkPad X1 Carbon Gen12 32+512 Black Like New', 8, 62, 2, '99pct new business flagship', '[\"/uploads/goods/thinkpadx1_1.jpg\"]', 12999.00, 14999.00, 100, 'Like new', 1, 1, 1, 'Shenzhen', 'local', 1, 1, 10, 0, 0, 1, NULL, '2026-03-16 17:29:15', '2026-03-21 00:34:24', 0);
INSERT INTO `goods` VALUES (12, 'Dell XPS 15 i7 32+1TB RTX4060 95pct New', 9, 63, 2, '95pct new OLED screen creative tool', '[\"/uploads/goods/dellxps15_1.jpg\"]', 11999.00, 13999.00, 95, 'Minor usage marks', 1, 0, 1, 'Hangzhou', 'express', 1, 1, 10, 1, 0, 1, NULL, '2026-03-16 17:29:15', '2026-03-21 01:15:31', 0);
INSERT INTO `goods` VALUES (13, 'ROG Zephyrus G16 2024 i9 32+1TB RTX4080', 10, 64, 2, 'Brand new gaming and creation', '[\"/uploads/goods/rogzephyrus16_1.jpg\"]', 18999.00, 20999.00, 100, 'Brand new sealed', 1, 1, 0, 'Chengdu', 'express', 0, 0, 10, 0, 0, 1, NULL, '2026-03-16 17:29:15', '2026-03-21 00:34:24', 0);
INSERT INTO `goods` VALUES (14, 'Sony A7M4 Full Frame Mirrorless Brand New', 6, 65, 3, 'Brand new 33MP 4K60p', '[\"/uploads/goods/sonya7m4_1.jpg\"]', 15999.00, 16999.00, 100, 'Brand new sealed', 1, 1, 0, 'Shanghai', 'express', 0, 0, 10, 0, 0, 1, NULL, '2026-03-16 17:29:55', '2026-03-21 00:34:24', 0);
INSERT INTO `goods` VALUES (15, 'Canon R6 Mark II Full Frame Like New', 7, 66, 3, '99pct new shutter count under 5000', '[\"/uploads/goods/canonr6mk2_1.jpg\"]', 15999.00, 17999.00, 100, 'Like new', 1, 1, 1, 'Beijing', 'local', 1, 1, 10, 0, 0, 1, NULL, '2026-03-16 17:29:55', '2026-03-21 00:34:24', 0);
INSERT INTO `goods` VALUES (16, 'Nikon Z8 Full Frame 95pct New', 8, 67, 3, '95pct new 45MP professional body', '[\"/uploads/goods/nikonz8_1.jpg\"]', 22999.00, 25999.00, 95, 'Minor usage marks', 1, 1, 1, 'Guangzhou', 'express', 1, 1, 10, 3, 0, 2, NULL, '2026-03-16 17:29:55', '2026-03-21 00:34:24', 0);
INSERT INTO `goods` VALUES (17, 'Fujifilm X-T5 APS-C Silver Like New', 9, 68, 3, '99pct new retro design film simulation', '[\"/uploads/goods/fujixt5_1.jpg\"]', 12999.00, 13999.00, 100, 'Like new', 1, 1, 0, 'Shenzhen', 'local', 1, 0, 10, 0, 0, 1, NULL, '2026-03-16 17:29:55', '2026-03-21 00:34:24', 0);
INSERT INTO `goods` VALUES (18, 'DJI Osmo Pocket 3 Brand New', 10, 69, 3, 'Brand new vlog tool rotating screen', '[\"/uploads/goods/osmopocket3_1.jpg\"]', 3999.00, 4499.00, 100, 'Brand new sealed', 1, 1, 0, 'Hangzhou', 'express', 0, 0, 10, 0, 0, 1, NULL, '2026-03-16 17:29:55', '2026-03-21 00:34:24', 0);
INSERT INTO `goods` VALUES (19, 'MacBook Air M3 15inch 16+512 Starlight Brand New', 6, 60, 2, 'Brand new sealed M3 chip amazing battery', '[\"/uploads/goods/macbookairm3_1.jpg\"]', 10999.00, 11999.00, 100, 'Brand new sealed', 1, 1, 0, 'Beijing', 'express', 1, 0, 10, 1, 0, 1, NULL, '2026-03-16 17:40:10', '2026-03-21 01:09:48', 0);
INSERT INTO `goods` VALUES (20, 'MacBook Pro 16 M3 Max 36+1TB Space Black 95pct', 7, 61, 2, '95pct new top specs video editing beast', '[\"/uploads/goods/macbookpro16_1.jpg\"]', 25999.00, 29999.00, 95, 'Minor usage marks', 1, 1, 1, 'Shanghai', 'express', 1, 1, 10, 0, 0, 1, NULL, '2026-03-16 17:40:10', '2026-03-21 00:34:24', 0);
INSERT INTO `goods` VALUES (21, 'ThinkPad X1 Carbon Gen12 32+512 Black Like New', 8, 62, 2, '99pct new business flagship best keyboard', '[\"/uploads/goods/thinkpadx1_1.jpg\"]', 12999.00, 14999.00, 100, 'Like new', 1, 1, 1, 'Shenzhen', 'local', 1, 1, 10, 0, 0, 1, NULL, '2026-03-16 17:40:10', '2026-03-21 00:34:24', 0);
INSERT INTO `goods` VALUES (22, 'Dell XPS 15 i7 32+1TB RTX4060 95pct New', 9, 63, 2, '95pct new OLED screen creative tool', '[\"/uploads/goods/dellxps15_1.jpg\"]', 11999.00, 13999.00, 95, 'Minor usage marks', 1, 0, 1, 'Hangzhou', 'express', 1, 1, 10, 0, 0, 1, NULL, '2026-03-16 17:40:25', '2026-03-21 00:34:24', 0);
INSERT INTO `goods` VALUES (23, 'ROG Zephyrus G16 2024 i9 32+1TB RTX4080', 10, 64, 2, 'Brand new gaming and creation', '[\"/uploads/goods/rogzephyrus16_1.jpg\"]', 18999.00, 20999.00, 100, 'Brand new sealed', 1, 1, 0, 'Chengdu', 'express', 0, 0, 10, 0, 0, 1, NULL, '2026-03-16 17:40:25', '2026-03-21 00:34:24', 0);
INSERT INTO `goods` VALUES (24, 'Sony A7M4 Full Frame Mirrorless Brand New', 6, 65, 3, 'Brand new 33MP 4K60p', '[\"/uploads/goods/sonya7m4_1.jpg\"]', 15999.00, 16999.00, 100, 'Brand new sealed', 1, 1, 0, 'Shanghai', 'express', 0, 0, 10, 0, 0, 1, NULL, '2026-03-16 17:40:44', '2026-03-21 00:34:24', 0);
INSERT INTO `goods` VALUES (25, 'Canon R6 Mark II Full Frame Like New', 7, 66, 3, '99pct new shutter count under 5000 video beast', '[\"/uploads/goods/canonr6mk2_1.jpg\"]', 15999.00, 17999.00, 100, 'Like new', 1, 1, 1, 'Beijing', 'local', 1, 1, 10, 0, 0, 1, NULL, '2026-03-16 17:40:44', '2026-03-21 00:34:24', 0);
INSERT INTO `goods` VALUES (26, 'Nikon Z8 Full Frame 95pct New', 8, 67, 3, '95pct new 45MP professional body', '[\"/uploads/goods/nikonz8_1.jpg\"]', 22999.00, 25999.00, 95, 'Minor usage marks', 1, 1, 1, 'Guangzhou', 'express', 1, 1, 10, 0, 0, 1, NULL, '2026-03-16 17:40:44', '2026-03-21 00:34:24', 0);
INSERT INTO `goods` VALUES (27, 'Fujifilm X-T5 APS-C Silver Like New', 9, 68, 3, '99pct new retro design film simulation', '[\"/uploads/goods/fujixt5_1.jpg\"]', 12999.00, 13999.00, 100, 'Like new', 1, 1, 0, 'Shenzhen', 'local', 1, 0, 10, 0, 0, 1, NULL, '2026-03-16 17:40:44', '2026-03-21 00:34:24', 0);
INSERT INTO `goods` VALUES (28, 'DJI Osmo Pocket 3 Brand New', 10, 69, 3, 'Brand new vlog tool rotating screen', '[\"/uploads/goods/osmopocket3_1.jpg\"]', 3999.00, 4499.00, 100, 'Brand new sealed', 1, 1, 0, 'Hangzhou', 'express', 0, 0, 10, 0, 0, 1, NULL, '2026-03-16 17:40:44', '2026-03-21 00:34:24', 0);
INSERT INTO `goods` VALUES (29, 'AirPods Max Silver 95pct New', 6, 70, 4, '95pct new active noise cancellation spatial audio', '[\"/uploads/goods/airpodsmax_1.jpg\"]', 3299.00, 4399.00, 95, 'Minor usage marks', 1, 1, 1, 'Beijing', 'express', 1, 1, 10, 0, 0, 1, NULL, '2026-03-16 17:41:07', '2026-03-21 00:34:24', 0);
INSERT INTO `goods` VALUES (30, 'Bose QC Ultra Headphone Black Brand New', 7, 71, 4, 'Brand new top noise cancellation comfortable', '[\"/uploads/goods/boseqcultra_1.jpg\"]', 2999.00, 3499.00, 100, 'Brand new sealed', 1, 1, 0, 'Shanghai', 'express', 0, 0, 10, 0, 0, 1, NULL, '2026-03-16 17:41:07', '2026-03-21 00:34:24', 0);
INSERT INTO `goods` VALUES (31, 'Sennheiser HD800S Open-back Like New', 8, 72, 4, '99pct new flagship HIFI wide soundstage', '[\"/uploads/goods/hd800s_1.jpg\"]', 8999.00, 10999.00, 100, 'Like new', 1, 1, 1, 'Chengdu', 'express', 1, 1, 10, 0, 0, 1, NULL, '2026-03-16 17:41:07', '2026-03-21 00:34:24', 0);
INSERT INTO `goods` VALUES (32, 'Beyerdynamic DT1990 PRO Monitor Headphone', 9, 73, 4, 'Brand new professional monitor studio choice', '[\"/uploads/goods/dt1990pro_1.jpg\"]', 3999.00, 4499.00, 100, 'Brand new sealed', 1, 1, 0, 'Guangzhou', 'express', 1, 0, 10, 0, 0, 1, NULL, '2026-03-16 17:41:07', '2026-03-21 00:34:24', 0);
INSERT INTO `goods` VALUES (33, 'Focal Utopia Flagship Headphone 95pct New', 10, 74, 4, '95pct new beryllium driver top HIFI experience', '[\"/uploads/goods/utopia_1.jpg\"]', 28999.00, 35999.00, 95, 'Minor usage marks', 1, 1, 1, 'Shenzhen', 'express', 1, 1, 10, 0, 0, 1, NULL, '2026-03-16 17:41:07', '2026-03-21 00:34:24', 0);
INSERT INTO `goods` VALUES (120, '火腿肠', 20, NULL, 1, '火腿肠', '[\"blob:http://localhost:5173/5eb6b249-c504-4131-9654-d4c38751b6ce\", \"blob:http://localhost:5173/c7cc5969-a42a-4177-89aa-9baadb7617bb\"]', 12.00, NULL, 100, NULL, 0, 0, 0, '', NULL, 0, 0, 15, 6, 0, 3, NULL, '2026-03-22 13:26:59', '2026-03-22 13:49:05', 0);
INSERT INTO `goods` VALUES (121, '火腿肠好吃', 19, NULL, 1, '火腿肠', '[\"/uploads/2026/03/22/213adceac29e47bc8acfdb92dd50b77c.jpg\"]', 12.00, NULL, 100, NULL, 0, 0, 0, '', NULL, 0, 0, 14, 25, 0, 1, NULL, '2026-03-22 14:09:03', '2026-03-22 16:46:29', 0);
INSERT INTO `goods` VALUES (122, '油', 19, NULL, 2, '好多油', '[\"/uploads/2026/03/22/1399e448d1e94c43aa88537fef2cdbdf.jpg\", \"/uploads/2026/03/22/48da4ace14394f97b72aa863d318b7d8.jpg\"]', 80.00, NULL, 10, NULL, 0, 0, 0, '', NULL, 0, 0, 10, 1, 0, 1, NULL, '2026-03-22 16:48:01', '2026-03-22 16:48:08', 0);

-- ----------------------------
-- Table structure for interaction_message
-- ----------------------------
DROP TABLE IF EXISTS `interaction_message`;
CREATE TABLE `interaction_message`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `user_id` bigint NOT NULL COMMENT '接收用户ID（被互动的用户）',
  `actor_id` bigint NOT NULL COMMENT '发起互动的用户ID',
  `type` tinyint NOT NULL COMMENT '互动类型：1-点赞帖子, 2-评论帖子, 3-回复评论, 4-关注用户, 5-收藏帖子',
  `post_id` bigint NULL DEFAULT NULL COMMENT '关联帖子ID',
  `comment_id` bigint NULL DEFAULT NULL COMMENT '关联评论ID',
  `content` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '互动内容（如评论内容）',
  `is_read` tinyint NULL DEFAULT 0 COMMENT '是否已读：0-未读, 1-已读',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_user_id`(`user_id` ASC) USING BTREE,
  INDEX `idx_actor_id`(`actor_id` ASC) USING BTREE,
  INDEX `idx_is_read`(`is_read` ASC) USING BTREE,
  INDEX `idx_created_at`(`created_at` ASC) USING BTREE,
  INDEX `idx_post_id`(`post_id` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '互动消息表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of interaction_message
-- ----------------------------
INSERT INTO `interaction_message` VALUES (1, 1, 19, 4, NULL, NULL, NULL, 0, '2026-03-22 14:07:09');
INSERT INTO `interaction_message` VALUES (2, 1, 19, 4, NULL, NULL, NULL, 0, '2026-03-22 14:07:11');
INSERT INTO `interaction_message` VALUES (3, 3, 19, 4, NULL, NULL, NULL, 0, '2026-03-22 14:19:13');

-- ----------------------------
-- Table structure for message
-- ----------------------------
DROP TABLE IF EXISTS `message`;
CREATE TABLE `message`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '消息ID',
  `conversation_id` bigint NOT NULL COMMENT '会话ID',
  `sender_id` bigint NOT NULL COMMENT '发送者ID',
  `receiver_id` bigint NOT NULL COMMENT '接收者ID',
  `type` tinyint NULL DEFAULT 1 COMMENT '消息类型 1-文本 2-图片 3-商品卡片 4-订单卡片',
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL COMMENT '消息内容（文本/图片URL/JSON）',
  `status` tinyint NULL DEFAULT 1 COMMENT '状态 1-已发送 2-已送达 3-已读',
  `created_at` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_conversation_id`(`conversation_id` ASC) USING BTREE,
  INDEX `idx_sender_id`(`sender_id` ASC) USING BTREE,
  INDEX `idx_receiver_id`(`receiver_id` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 172 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '消息表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of message
-- ----------------------------
INSERT INTO `message` VALUES (1, 1, 2, 1, 1, '您好，请问这个商品还在吗？', 3, '2026-03-14 09:00:00');
INSERT INTO `message` VALUES (2, 1, 1, 2, 1, '在的，您想要吗？', 3, '2026-03-14 09:02:00');
INSERT INTO `message` VALUES (3, 1, 2, 1, 1, '请问可以便宜点吗？原价有点贵', 3, '2026-03-14 09:05:00');
INSERT INTO `message` VALUES (4, 1, 1, 2, 1, '这款已经很优惠了，包邮可以吗？', 3, '2026-03-14 09:08:00');
INSERT INTO `message` VALUES (5, 1, 2, 1, 1, '好的，包邮的话我可以接受', 3, '2026-03-14 09:10:00');
INSERT INTO `message` VALUES (6, 1, 1, 2, 1, '太好了！那您什么时候方便付款呢？', 3, '2026-03-14 09:12:00');
INSERT INTO `message` VALUES (7, 1, 2, 1, 1, '我现在就可以付款，请问发货地址在哪里修改？', 3, '2026-03-14 09:15:00');
INSERT INTO `message` VALUES (8, 1, 1, 2, 1, '您下单后可以在订单详情里修改收货地址', 3, '2026-03-14 09:18:00');
INSERT INTO `message` VALUES (9, 1, 2, 1, 3, '{\"productId\":1,\"productName\":\"iPhone 15 Pro Max 256GB 原色钛金属\",\"productCover\":\"/uploads/products/iphone15.jpg\",\"productPrice\":8999}', 3, '2026-03-14 09:20:00');
INSERT INTO `message` VALUES (10, 1, 2, 1, 1, '是这个商品对吧？', 3, '2026-03-14 09:22:00');
INSERT INTO `message` VALUES (11, 1, 1, 2, 1, '对的，就是这个！全新未拆封的', 3, '2026-03-14 09:25:00');
INSERT INTO `message` VALUES (12, 1, 2, 1, 1, '好的，我已经下单了，麻烦尽快发货哦', 3, '2026-03-14 09:30:00');
INSERT INTO `message` VALUES (13, 1, 1, 2, 1, '收到！我明天一早就给您发货', 3, '2026-03-14 09:32:00');
INSERT INTO `message` VALUES (14, 1, 2, 1, 1, '好的，谢谢！请问发什么快递呢？', 3, '2026-03-14 09:35:00');
INSERT INTO `message` VALUES (15, 1, 1, 2, 1, '顺丰快递，速度比较快，一般2-3天就能到', 3, '2026-03-14 09:38:00');
INSERT INTO `message` VALUES (16, 1, 2, 1, 1, '太好了！顺丰很靠谱', 3, '2026-03-14 09:40:00');
INSERT INTO `message` VALUES (17, 1, 1, 2, 1, '是的，有任何问题随时联系我', 3, '2026-03-14 09:42:00');
INSERT INTO `message` VALUES (18, 1, 2, 1, 1, '对了，请问有发票吗？', 3, '2026-03-14 09:45:00');
INSERT INTO `message` VALUES (19, 1, 1, 2, 1, '有的，电子发票会随订单一起发送到您的邮箱', 3, '2026-03-14 09:48:00');
INSERT INTO `message` VALUES (20, 1, 2, 1, 1, '完美！那我就放心了', 3, '2026-03-14 09:50:00');
INSERT INTO `message` VALUES (21, 1, 1, 2, 1, '好的，明天发货', 3, '2026-03-15 10:30:00');
INSERT INTO `message` VALUES (22, 4, 2, 1, 1, '您好，请问这个商品还在吗？', 3, '2026-03-14 09:00:00');
INSERT INTO `message` VALUES (23, 4, 1, 2, 1, '在的，您想要吗？', 3, '2026-03-14 09:02:00');
INSERT INTO `message` VALUES (24, 4, 2, 1, 1, '请问可以便宜点吗？原价有点贵', 3, '2026-03-14 09:05:00');
INSERT INTO `message` VALUES (25, 4, 1, 2, 1, '这款已经很优惠了，包邮可以吗？', 3, '2026-03-14 09:08:00');
INSERT INTO `message` VALUES (26, 4, 2, 1, 1, '好的，包邮的话我可以接受', 3, '2026-03-14 09:10:00');
INSERT INTO `message` VALUES (27, 4, 1, 2, 1, '太好了！那您什么时候方便付款呢？', 3, '2026-03-14 09:12:00');
INSERT INTO `message` VALUES (28, 4, 2, 1, 1, '我现在就可以付款，请问发货地址在哪里修改？', 3, '2026-03-14 09:15:00');
INSERT INTO `message` VALUES (29, 4, 1, 2, 1, '您下单后可以在订单详情里修改收货地址', 3, '2026-03-14 09:18:00');
INSERT INTO `message` VALUES (30, 4, 2, 1, 3, '{\"productId\":1,\"productName\":\"iPhone 15 Pro Max 256GB 原色钛金属\",\"productCover\":\"/uploads/products/iphone15.jpg\",\"productPrice\":8999}', 3, '2026-03-14 09:20:00');
INSERT INTO `message` VALUES (31, 4, 2, 1, 1, '是这个商品对吧？', 3, '2026-03-14 09:22:00');
INSERT INTO `message` VALUES (32, 4, 1, 2, 1, '对的，就是这个！全新未拆封的', 3, '2026-03-14 09:25:00');
INSERT INTO `message` VALUES (33, 4, 2, 1, 1, '好的，我已经下单了，麻烦尽快发货哦', 3, '2026-03-14 09:30:00');
INSERT INTO `message` VALUES (34, 4, 1, 2, 1, '收到！我明天一早就给您发货', 3, '2026-03-14 09:32:00');
INSERT INTO `message` VALUES (35, 4, 2, 1, 1, '好的，谢谢！请问发什么快递呢？', 3, '2026-03-14 09:35:00');
INSERT INTO `message` VALUES (36, 4, 1, 2, 1, '顺丰快递，速度比较快，一般2-3天就能到', 3, '2026-03-14 09:38:00');
INSERT INTO `message` VALUES (37, 4, 2, 1, 1, '太好了！顺丰很靠谱', 3, '2026-03-14 09:40:00');
INSERT INTO `message` VALUES (38, 4, 1, 2, 1, '是的，有任何问题随时联系我', 3, '2026-03-14 09:42:00');
INSERT INTO `message` VALUES (39, 4, 2, 1, 1, '对了，请问有发票吗？', 3, '2026-03-14 09:45:00');
INSERT INTO `message` VALUES (40, 4, 1, 2, 1, '有的，电子发票会随订单一起发送到您的邮箱', 3, '2026-03-14 09:48:00');
INSERT INTO `message` VALUES (41, 4, 2, 1, 1, '完美！那我就放心了', 3, '2026-03-14 09:50:00');
INSERT INTO `message` VALUES (42, 4, 1, 2, 1, '好的，明天发货', 3, '2026-03-15 10:30:00');
INSERT INTO `message` VALUES (43, 2, 3, 1, 1, '您好，看到您发布的二手书籍，请问还在吗？', 3, '2026-03-13 14:00:00');
INSERT INTO `message` VALUES (44, 2, 1, 3, 1, '在的，您对哪本书感兴趣？', 3, '2026-03-13 14:05:00');
INSERT INTO `message` VALUES (45, 2, 3, 1, 1, '《深入理解计算机系统》这本还在吗？', 3, '2026-03-13 14:08:00');
INSERT INTO `message` VALUES (46, 2, 1, 3, 1, '在的，这本书很新，只看了前几章', 3, '2026-03-13 14:10:00');
INSERT INTO `message` VALUES (47, 2, 3, 1, 1, '请问多少钱？', 3, '2026-03-13 14:12:00');
INSERT INTO `message` VALUES (48, 2, 1, 3, 1, '原价139，现在80出', 3, '2026-03-13 14:15:00');
INSERT INTO `message` VALUES (49, 2, 3, 1, 1, '可以便宜点吗？60可以吗？', 3, '2026-03-13 14:18:00');
INSERT INTO `message` VALUES (50, 2, 1, 3, 1, '70吧，书真的很新', 3, '2026-03-13 14:20:00');
INSERT INTO `message` VALUES (51, 2, 3, 1, 1, '好的，成交！请问怎么交易？', 3, '2026-03-13 14:22:00');
INSERT INTO `message` VALUES (52, 2, 1, 3, 1, '您可以在平台上下单，我明天发货', 3, '2026-03-13 14:25:00');
INSERT INTO `message` VALUES (53, 2, 3, 1, 1, '好的，我已经下单了', 3, '2026-03-13 14:30:00');
INSERT INTO `message` VALUES (54, 2, 1, 3, 1, '收到，明天给您发顺丰', 3, '2026-03-13 14:32:00');
INSERT INTO `message` VALUES (55, 2, 3, 1, 1, '这本书还有吗？', 3, '2026-03-15 08:20:00');
INSERT INTO `message` VALUES (56, 6, 3, 1, 1, '您好，看到您发布的二手书籍，请问还在吗？', 3, '2026-03-13 14:00:00');
INSERT INTO `message` VALUES (57, 6, 1, 3, 1, '在的，您对哪本书感兴趣？', 3, '2026-03-13 14:05:00');
INSERT INTO `message` VALUES (58, 6, 3, 1, 1, '《深入理解计算机系统》这本还在吗？', 3, '2026-03-13 14:08:00');
INSERT INTO `message` VALUES (59, 6, 1, 3, 1, '在的，这本书很新，只看了前几章', 3, '2026-03-13 14:10:00');
INSERT INTO `message` VALUES (60, 6, 3, 1, 1, '请问多少钱？', 3, '2026-03-13 14:12:00');
INSERT INTO `message` VALUES (61, 6, 1, 3, 1, '原价139，现在80出', 3, '2026-03-13 14:15:00');
INSERT INTO `message` VALUES (62, 6, 3, 1, 1, '可以便宜点吗？60可以吗？', 3, '2026-03-13 14:18:00');
INSERT INTO `message` VALUES (63, 6, 1, 3, 1, '70吧，书真的很新', 3, '2026-03-13 14:20:00');
INSERT INTO `message` VALUES (64, 6, 3, 1, 1, '好的，成交！请问怎么交易？', 3, '2026-03-13 14:22:00');
INSERT INTO `message` VALUES (65, 6, 1, 3, 1, '您可以在平台上下单，我明天发货', 3, '2026-03-13 14:25:00');
INSERT INTO `message` VALUES (66, 6, 3, 1, 1, '好的，我已经下单了', 3, '2026-03-13 14:30:00');
INSERT INTO `message` VALUES (67, 6, 1, 3, 1, '收到，明天给您发顺丰', 3, '2026-03-13 14:32:00');
INSERT INTO `message` VALUES (68, 6, 3, 1, 1, '这本书还有吗？', 3, '2026-03-15 08:20:00');
INSERT INTO `message` VALUES (69, 3, 5, 1, 1, '您好，PS5还在吗？', 3, '2026-03-10 11:00:00');
INSERT INTO `message` VALUES (70, 3, 1, 5, 1, '在的，光驱版，使用半年', 3, '2026-03-10 11:05:00');
INSERT INTO `message` VALUES (71, 3, 5, 1, 1, '请问多少钱出？', 3, '2026-03-10 11:08:00');
INSERT INTO `message` VALUES (72, 3, 1, 5, 1, '3200，送两个手柄', 3, '2026-03-10 11:10:00');
INSERT INTO `message` VALUES (73, 3, 5, 1, 1, '能便宜点吗？', 3, '2026-03-10 11:12:00');
INSERT INTO `message` VALUES (74, 3, 1, 5, 1, '最低3000', 3, '2026-03-10 11:15:00');
INSERT INTO `message` VALUES (75, 3, 5, 1, 1, '好的，我考虑一下', 3, '2026-03-10 11:18:00');
INSERT INTO `message` VALUES (76, 3, 1, 5, 1, '好的，有问题随时问', 3, '2026-03-10 11:20:00');
INSERT INTO `message` VALUES (77, 3, 5, 1, 1, '请问有发票吗？', 3, '2026-03-12 10:00:00');
INSERT INTO `message` VALUES (78, 3, 1, 5, 1, '有的，购买时的电子发票', 3, '2026-03-12 10:05:00');
INSERT INTO `message` VALUES (79, 3, 5, 1, 1, '好的，PS5 能便宜点吗？', 3, '2026-03-14 16:45:00');
INSERT INTO `message` VALUES (80, 9, 5, 1, 1, '您好，PS5还在吗？', 3, '2026-03-10 11:00:00');
INSERT INTO `message` VALUES (81, 9, 1, 5, 1, '在的，光驱版，使用半年', 3, '2026-03-10 11:05:00');
INSERT INTO `message` VALUES (82, 9, 5, 1, 1, '请问多少钱出？', 3, '2026-03-10 11:08:00');
INSERT INTO `message` VALUES (83, 9, 1, 5, 1, '3200，送两个手柄', 3, '2026-03-10 11:10:00');
INSERT INTO `message` VALUES (84, 9, 5, 1, 1, '能便宜点吗？', 3, '2026-03-10 11:12:00');
INSERT INTO `message` VALUES (85, 9, 1, 5, 1, '最低3000', 3, '2026-03-10 11:15:00');
INSERT INTO `message` VALUES (86, 9, 5, 1, 1, '好的，我考虑一下', 3, '2026-03-10 11:18:00');
INSERT INTO `message` VALUES (87, 9, 1, 5, 1, '好的，有问题随时问', 3, '2026-03-10 11:20:00');
INSERT INTO `message` VALUES (88, 9, 5, 1, 1, '请问有发票吗？', 3, '2026-03-12 10:00:00');
INSERT INTO `message` VALUES (89, 9, 1, 5, 1, '有的，购买时的电子发票', 3, '2026-03-12 10:05:00');
INSERT INTO `message` VALUES (90, 9, 5, 1, 1, '好的，PS5 能便宜点吗？', 3, '2026-03-14 16:45:00');
INSERT INTO `message` VALUES (91, 5, 2, 3, 1, '您好，请问这个相机还在吗？', 3, '2026-03-12 10:00:00');
INSERT INTO `message` VALUES (92, 5, 3, 2, 1, '在的，索尼A7M4，使用一年', 3, '2026-03-12 10:05:00');
INSERT INTO `message` VALUES (93, 5, 2, 3, 1, '请问快门次数多少？', 3, '2026-03-12 10:08:00');
INSERT INTO `message` VALUES (94, 5, 3, 2, 1, '大概5000次左右', 3, '2026-03-12 10:10:00');
INSERT INTO `message` VALUES (95, 5, 2, 3, 1, '多少钱出？', 3, '2026-03-12 10:12:00');
INSERT INTO `message` VALUES (96, 5, 3, 2, 1, '12000', 3, '2026-03-12 10:15:00');
INSERT INTO `message` VALUES (97, 5, 2, 3, 1, '能便宜点吗？10000可以吗？', 3, '2026-03-12 10:18:00');
INSERT INTO `message` VALUES (98, 5, 3, 2, 1, '最低11000', 3, '2026-03-12 10:20:00');
INSERT INTO `message` VALUES (99, 5, 2, 3, 1, '好的，我考虑一下', 3, '2026-03-12 10:22:00');
INSERT INTO `message` VALUES (100, 5, 3, 2, 1, '好的，有问题随时联系', 3, '2026-03-12 10:25:00');
INSERT INTO `message` VALUES (101, 5, 2, 3, 2, '/uploads/images/camera_sample.jpg', 3, '2026-03-13 09:00:00');
INSERT INTO `message` VALUES (102, 5, 3, 2, 1, '这是实拍样张，效果很好', 3, '2026-03-13 09:02:00');
INSERT INTO `message` VALUES (103, 5, 2, 3, 1, '请问这个相机还在吗？', 3, '2026-03-14 15:00:00');
INSERT INTO `message` VALUES (104, 7, 2, 3, 1, '您好，请问这个相机还在吗？', 3, '2026-03-12 10:00:00');
INSERT INTO `message` VALUES (105, 7, 3, 2, 1, '在的，索尼A7M4，使用一年', 3, '2026-03-12 10:05:00');
INSERT INTO `message` VALUES (106, 7, 2, 3, 1, '请问快门次数多少？', 3, '2026-03-12 10:08:00');
INSERT INTO `message` VALUES (107, 7, 3, 2, 1, '大概5000次左右', 3, '2026-03-12 10:10:00');
INSERT INTO `message` VALUES (108, 7, 2, 3, 1, '多少钱出？', 3, '2026-03-12 10:12:00');
INSERT INTO `message` VALUES (109, 7, 3, 2, 1, '12000', 3, '2026-03-12 10:15:00');
INSERT INTO `message` VALUES (110, 7, 2, 3, 1, '能便宜点吗？10000可以吗？', 3, '2026-03-12 10:18:00');
INSERT INTO `message` VALUES (111, 7, 3, 2, 1, '最低11000', 3, '2026-03-12 10:20:00');
INSERT INTO `message` VALUES (112, 7, 2, 3, 1, '好的，我考虑一下', 3, '2026-03-12 10:22:00');
INSERT INTO `message` VALUES (113, 7, 3, 2, 1, '好的，有问题随时联系', 3, '2026-03-12 10:25:00');
INSERT INTO `message` VALUES (114, 7, 2, 3, 2, '/uploads/images/camera_sample.jpg', 3, '2026-03-13 09:00:00');
INSERT INTO `message` VALUES (115, 7, 3, 2, 1, '这是实拍样张，效果很好', 3, '2026-03-13 09:02:00');
INSERT INTO `message` VALUES (116, 7, 2, 3, 1, '请问这个相机还在吗？', 3, '2026-03-14 15:00:00');
INSERT INTO `message` VALUES (117, 8, 5, 3, 1, '您好，请问这个商品还在吗？', 3, '2026-03-11 09:00:00');
INSERT INTO `message` VALUES (118, 8, 3, 5, 1, '在的，您想要吗？', 3, '2026-03-11 09:05:00');
INSERT INTO `message` VALUES (119, 8, 5, 3, 1, '是的，请问多少钱？', 3, '2026-03-11 09:08:00');
INSERT INTO `message` VALUES (120, 8, 3, 5, 1, '500元', 3, '2026-03-11 09:10:00');
INSERT INTO `message` VALUES (121, 8, 5, 3, 1, '好的，我下单了', 3, '2026-03-11 09:15:00');
INSERT INTO `message` VALUES (122, 8, 3, 5, 1, '收到，马上给您发货', 3, '2026-03-11 09:18:00');
INSERT INTO `message` VALUES (123, 8, 5, 3, 1, '好的，已付款', 3, '2026-03-11 09:20:00');
INSERT INTO `message` VALUES (124, 8, 3, 5, 1, '好的，已收到款项', 3, '2026-03-13 11:30:00');
INSERT INTO `message` VALUES (125, 10, 5, 3, 1, '您好，请问这个商品还在吗？', 3, '2026-03-11 09:00:00');
INSERT INTO `message` VALUES (126, 10, 3, 5, 1, '在的，您想要吗？', 3, '2026-03-11 09:05:00');
INSERT INTO `message` VALUES (127, 10, 5, 3, 1, '是的，请问多少钱？', 3, '2026-03-11 09:08:00');
INSERT INTO `message` VALUES (128, 10, 3, 5, 1, '500元', 3, '2026-03-11 09:10:00');
INSERT INTO `message` VALUES (129, 10, 5, 3, 1, '好的，我下单了', 3, '2026-03-11 09:15:00');
INSERT INTO `message` VALUES (130, 10, 3, 5, 1, '收到，马上给您发货', 3, '2026-03-11 09:18:00');
INSERT INTO `message` VALUES (131, 10, 5, 3, 1, '好的，已付款', 3, '2026-03-11 09:20:00');
INSERT INTO `message` VALUES (132, 10, 3, 5, 1, '好的，已收到款项', 3, '2026-03-13 11:30:00');
INSERT INTO `message` VALUES (133, 1, 2, 1, 2, '/uploads/images/product_photo1.jpg', 3, '2026-03-14 10:00:00');
INSERT INTO `message` VALUES (134, 4, 2, 1, 2, '/uploads/images/product_photo1.jpg', 3, '2026-03-14 10:00:00');
INSERT INTO `message` VALUES (135, 1, 1, 2, 4, '{\"orderId\":\"ORD20260314001\",\"orderStatus\":\"待发货\"}', 3, '2026-03-14 11:00:00');
INSERT INTO `message` VALUES (136, 4, 1, 2, 4, '{\"orderId\":\"ORD20260314001\",\"orderStatus\":\"待发货\"}', 3, '2026-03-14 11:00:00');
INSERT INTO `message` VALUES (137, 3, 1, 5, 1, 'okok', 1, '2026-03-15 16:11:25');
INSERT INTO `message` VALUES (138, 3, 1, 5, 1, '对的', 1, '2026-03-15 16:11:33');
INSERT INTO `message` VALUES (139, 3, 1, 5, 1, '你好', 1, '2026-03-15 16:13:43');
INSERT INTO `message` VALUES (140, 3, 1, 5, 1, '操作成功', 1, '2026-03-15 16:24:50');
INSERT INTO `message` VALUES (141, 2, 1, 3, 1, '还有', 1, '2026-03-15 16:25:30');
INSERT INTO `message` VALUES (142, 2, 1, 3, 2, 'blob:http://localhost:5173/e2662b9a-db6c-4a91-b939-f96caac2460d', 1, '2026-03-15 16:25:36');
INSERT INTO `message` VALUES (143, 3, 1, 5, 1, '你好', 1, '2026-03-15 16:44:40');
INSERT INTO `message` VALUES (144, 3, 1, 5, 2, 'http://localhost:8080/uploads/2026/03/15/824ac90c169f4276a4e430cd87efb9d7.jpg', 1, '2026-03-15 16:44:45');
INSERT INTO `message` VALUES (145, 2, 1, 3, 2, 'http://localhost:8080/uploads/2026/03/15/91ec7047f2544f0cb55454e7168d2400.jpg', 1, '2026-03-15 16:52:16');
INSERT INTO `message` VALUES (146, 4, 2, 1, 2, 'http://localhost:8080/uploads/2026/03/15/bc4a25de7af0452986d459c6042f5ce9.jpg', 1, '2026-03-15 19:44:30');
INSERT INTO `message` VALUES (147, 1, 1, 2, 1, 'nihao', 1, '2026-03-15 19:46:35');
INSERT INTO `message` VALUES (148, 1, 1, 2, 1, 'duiduidui', 1, '2026-03-15 19:48:29');
INSERT INTO `message` VALUES (149, 1, 1, 2, 1, 'lll', 1, '2026-03-15 21:10:29');
INSERT INTO `message` VALUES (150, 4, 2, 1, 1, 'daf', 1, '2026-03-15 21:13:21');
INSERT INTO `message` VALUES (151, 4, 2, 1, 1, '不对', 1, '2026-03-15 21:13:29');
INSERT INTO `message` VALUES (152, 4, 2, 1, 1, '没错', 1, '2026-03-15 21:13:35');
INSERT INTO `message` VALUES (153, 1, 1, 2, 1, 'nihoa', 1, '2026-03-15 21:21:39');
INSERT INTO `message` VALUES (154, 1, 1, 2, 1, 'hello', 1, '2026-03-15 21:32:44');
INSERT INTO `message` VALUES (155, 4, 2, 1, 1, 'duilou', 1, '2026-03-15 21:32:58');
INSERT INTO `message` VALUES (156, 4, 2, 1, 1, 'mmimi', 1, '2026-03-15 21:33:09');
INSERT INTO `message` VALUES (157, 4, 2, 1, 1, 'dhafdh', 1, '2026-03-15 21:33:21');
INSERT INTO `message` VALUES (158, 4, 2, 1, 1, 'dafda', 1, '2026-03-15 21:33:32');
INSERT INTO `message` VALUES (159, 4, 2, 1, 1, 'fdsaf', 1, '2026-03-15 21:33:35');
INSERT INTO `message` VALUES (160, 4, 2, 1, 1, 'd', 1, '2026-03-15 21:40:32');
INSERT INTO `message` VALUES (161, 1, 1, 2, 1, '觉得法兰克', 1, '2026-03-15 21:44:12');
INSERT INTO `message` VALUES (162, 1, 1, 2, 1, 'fdsf', 1, '2026-03-15 21:44:16');
INSERT INTO `message` VALUES (163, 1, 1, 2, 1, 'dsfdf', 1, '2026-03-15 21:44:19');
INSERT INTO `message` VALUES (164, 3, 1, 5, 2, 'http://localhost:8080/uploads/2026/03/17/2f6784c83fcd42d6a3ee3bdb6ff30510.jpg', 1, '2026-03-17 18:17:10');
INSERT INTO `message` VALUES (165, 11, 1, 8, 1, 'hello', 1, '2026-03-19 11:28:35');
INSERT INTO `message` VALUES (166, 1, 1, 2, 4, '{\"totalAmount\":4999.00,\"orderNo\":\"XM20260319224511288314\",\"quantity\":1,\"orderId\":10,\"message\":\"买家已下单，请等待付款\",\"status\":\"PENDING_PAYMENT\",\"timestamp\":1773931511194}', 1, '2026-03-19 22:45:11');
INSERT INTO `message` VALUES (167, 1, 1, 2, 4, '{\"totalAmount\":4999.00,\"orderNo\":\"XM20260319224511288314\",\"quantity\":1,\"orderId\":10,\"message\":\"买家已付款，请尽快发货\",\"status\":\"PENDING_SHIPMENT\",\"timestamp\":1773931537964}', 1, '2026-03-19 22:45:38');
INSERT INTO `message` VALUES (168, 1, 1, 2, 4, '{\"totalAmount\":7999.00,\"orderNo\":\"ORD202603150001\",\"quantity\":1,\"orderId\":1,\"message\":\"买家已确认收货，交易完成\",\"status\":\"COMPLETED\",\"timestamp\":1773934337240}', 1, '2026-03-19 23:32:17');
INSERT INTO `message` VALUES (169, 13, 4, 1, 4, '{\"totalAmount\":6999.00,\"orderNo\":\"XM20260320004818224670\",\"quantity\":1,\"orderId\":11,\"message\":\"买家已下单，请等待付款\",\"status\":\"PENDING_PAYMENT\",\"timestamp\":1773938898419}', 1, '2026-03-20 00:48:18');
INSERT INTO `message` VALUES (170, 11, 1, 8, 4, '{\"totalAmount\":22999.00,\"orderNo\":\"XM20260321003552271013\",\"quantity\":1,\"orderId\":12,\"message\":\"买家已下单，请等待付款\",\"status\":\"PENDING_PAYMENT\",\"timestamp\":1774024552846}', 1, '2026-03-21 00:35:53');
INSERT INTO `message` VALUES (171, 11, 1, 8, 4, '{\"totalAmount\":22999.00,\"orderNo\":\"XM20260321003552271013\",\"quantity\":1,\"orderId\":12,\"message\":\"买家已付款，请尽快发货\",\"status\":\"PENDING_SHIPMENT\",\"timestamp\":1774024556791}', 1, '2026-03-21 00:35:57');

-- ----------------------------
-- Table structure for order
-- ----------------------------
DROP TABLE IF EXISTS `order`;
CREATE TABLE `order`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '订单ID',
  `order_no` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '订单编号',
  `user_id` bigint NOT NULL COMMENT '买家ID',
  `seller_id` bigint NOT NULL COMMENT '卖家ID',
  `goods_id` bigint NOT NULL COMMENT '商品ID',
  `goods_snapshot` json NULL COMMENT '商品快照（下单时的商品信息）',
  `quantity` int NULL DEFAULT 1 COMMENT '数量',
  `total_amount` decimal(10, 2) NOT NULL COMMENT '订单金额',
  `status` tinyint NULL DEFAULT 1 COMMENT '状态 1-待付款 2-待发货 3-待收货 4-已完成 5-已取消 6-已退款',
  `remark` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '买家备注',
  `address_snapshot` json NULL COMMENT '收货地址快照',
  `express_company` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '快递公司',
  `express_no` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '快递单号',
  `pay_time` datetime NULL DEFAULT NULL COMMENT '支付时间',
  `ship_time` datetime NULL DEFAULT NULL COMMENT '发货时间',
  `receive_time` datetime NULL DEFAULT NULL COMMENT '收货时间',
  `finish_time` datetime NULL DEFAULT NULL COMMENT '完成时间',
  `cancel_time` datetime NULL DEFAULT NULL COMMENT '取消时间',
  `cancel_reason` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '取消原因',
  `created_at` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted` tinyint NULL DEFAULT 0 COMMENT '逻辑删除',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_order_no`(`order_no` ASC) USING BTREE,
  INDEX `idx_user_id`(`user_id` ASC) USING BTREE,
  INDEX `idx_seller_id`(`seller_id` ASC) USING BTREE,
  INDEX `idx_goods_id`(`goods_id` ASC) USING BTREE,
  INDEX `idx_status`(`status` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 13 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '订单表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of order
-- ----------------------------
INSERT INTO `order` VALUES (1, 'ORD202603150001', 1, 2, 2, '{\"cover\": \"https://picsum.photos/400/400?random=2\", \"price\": 7999.0, \"title\": \"华为 Mate 60 Pro+ 512GB\", \"condition\": \"95新，轻微使用痕迹\"}', 1, 7999.00, 4, '希望能快点发货', '{\"city\": \"Beijing\", \"name\": \"Wang Ming\", \"phone\": \"13800138001\", \"detail\": \"Zhongguancun Street 1\", \"district\": \"Haidian\", \"province\": \"Beijing\"}', NULL, NULL, NULL, NULL, '2026-03-19 23:32:17', '2026-03-19 23:32:17', NULL, NULL, '2026-03-15 10:00:00', '2026-03-19 23:32:17', 0);
INSERT INTO `order` VALUES (2, 'XM20260317152031173742', 1, 2, 2, '{\"id\": 2, \"price\": 7999.0, \"stock\": 1, \"title\": \"华为 Mate 60 Pro+ 512GB 雅丹黑\", \"images\": \"[\\\"https://source.unsplash.com/400x400/?huawei&sig=184e02a0\\\"]\", \"status\": \"在售\", \"deleted\": 0, \"invoice\": false, \"modelId\": 4, \"location\": \"上海\", \"sellerId\": 2, \"warranty\": true, \"createdAt\": \"2026-03-16T14:00:35\", \"likeCount\": 74, \"updatedAt\": \"2026-03-17T15:20:07\", \"viewCount\": 526, \"canBargain\": true, \"categoryId\": 1, \"description\": \"95新，轻微使用痕迹，卫星通话功能正常，配件齐全\", \"rejectReason\": null, \"conditionDesc\": \"轻微划痕\", \"originalPrice\": 8999.0, \"conditionLevel\": 9}', 1, 7999.00, 2, '', '{\"id\": 14, \"city\": \"Shenzhen\", \"name\": \"WillDC\", \"phone\": \"13800138001\", \"detail\": \"Tech Park Building A 1001\", \"userId\": 1, \"deleted\": 0, \"district\": \"Nanshan\", \"province\": \"Guangdong\", \"createdAt\": \"2026-03-16T17:12:56\", \"isDefault\": 1, \"updatedAt\": \"2026-03-16T17:12:56\"}', NULL, NULL, '2026-03-17 18:24:39', NULL, NULL, NULL, NULL, NULL, '2026-03-17 15:20:32', '2026-03-17 18:24:39', 0);
INSERT INTO `order` VALUES (3, 'XM20260317152555284881', 1, 3, 3, '{\"id\": 3, \"price\": 5999.0, \"stock\": 1, \"title\": \"小米14 Ultra 16+512 黑色\", \"images\": \"[\\\"https://source.unsplash.com/400x400/?technology&sig=64111f89\\\"]\", \"status\": \"在售\", \"deleted\": 0, \"invoice\": true, \"modelId\": 6, \"location\": \"深圳\", \"sellerId\": 3, \"warranty\": true, \"createdAt\": \"2026-03-16T14:00:35\", \"likeCount\": 20, \"updatedAt\": \"2026-03-17T15:25:33\", \"viewCount\": 467, \"canBargain\": false, \"categoryId\": 1, \"description\": \"99新，全套配件，徕卡影像系统，摄影爱好者必入\", \"rejectReason\": null, \"conditionDesc\": \"几乎全新\", \"originalPrice\": 6499.0, \"conditionLevel\": 10}', 1, 5999.00, 5, '', '{\"id\": 14, \"city\": \"Shenzhen\", \"name\": \"WillDC\", \"phone\": \"13800138001\", \"detail\": \"Tech Park Building A 1001\", \"userId\": 1, \"deleted\": 0, \"district\": \"Nanshan\", \"province\": \"Guangdong\", \"createdAt\": \"2026-03-16T17:12:56\", \"isDefault\": 1, \"updatedAt\": \"2026-03-16T17:12:56\"}', NULL, NULL, NULL, NULL, NULL, NULL, '2026-03-19 10:29:02', '支付超时，系统自动取消', '2026-03-17 15:25:55', '2026-03-19 10:29:02', 0);
INSERT INTO `order` VALUES (4, 'XM20260317153741434754', 1, 2, 8, '{\"id\": 8, \"price\": 8499.0, \"stock\": 1, \"title\": \"三星 Galaxy S24 Ultra 12+256 钛灰色\", \"images\": \"[\\\"https://source.unsplash.com/400x400/?samsung&sig=c1fc36a9\\\"]\", \"status\": \"在售\", \"deleted\": 0, \"invoice\": true, \"modelId\": 9, \"location\": \"北京\", \"sellerId\": 2, \"warranty\": true, \"createdAt\": \"2026-03-16T14:00:35\", \"likeCount\": 40, \"updatedAt\": \"2026-03-17T15:37:17\", \"viewCount\": 287, \"canBargain\": true, \"categoryId\": 1, \"description\": \"99新，国行在保，S Pen书写流畅，2亿像素相机\", \"rejectReason\": null, \"conditionDesc\": \"完美成色\", \"originalPrice\": 9699.0, \"conditionLevel\": 10}', 1, 8499.00, 2, '', '{\"id\": 14, \"city\": \"Shenzhen\", \"name\": \"WillDC\", \"phone\": \"13800138001\", \"detail\": \"Tech Park Building A 1001\", \"userId\": 1, \"deleted\": 0, \"district\": \"Nanshan\", \"province\": \"Guangdong\", \"createdAt\": \"2026-03-16T17:12:56\", \"isDefault\": 1, \"updatedAt\": \"2026-03-16T17:12:56\"}', NULL, NULL, '2026-03-17 15:41:47', NULL, NULL, NULL, NULL, NULL, '2026-03-17 15:37:41', '2026-03-17 15:41:47', 0);
INSERT INTO `order` VALUES (5, 'XM20260317165937148330', 1, 3, 6, '{\"id\": 6, \"price\": 1699.0, \"stock\": 1, \"title\": \"AirPods Pro 2 主动降噪版\", \"images\": \"[\\\"https://source.unsplash.com/400x400/?airpods&sig=aefef5c1\\\"]\", \"status\": \"在售\", \"deleted\": 0, \"invoice\": true, \"modelId\": 18, \"location\": \"深圳\", \"sellerId\": 3, \"warranty\": true, \"createdAt\": \"2026-03-16T14:00:35\", \"likeCount\": 48, \"updatedAt\": \"2026-03-17T16:59:34\", \"viewCount\": 295, \"canBargain\": false, \"categoryId\": 4, \"description\": \"全新未拆封，H2芯片，降噪效果一流\", \"rejectReason\": null, \"conditionDesc\": \"全新\", \"originalPrice\": 1899.0, \"conditionLevel\": 10}', 1, 1699.00, 2, '', '{\"id\": 14, \"city\": \"Shenzhen\", \"name\": \"WillDC\", \"phone\": \"13800138001\", \"detail\": \"Tech Park Building A 1001\", \"userId\": 1, \"deleted\": 0, \"district\": \"Nanshan\", \"province\": \"Guangdong\", \"createdAt\": \"2026-03-16T17:12:56\", \"isDefault\": 1, \"updatedAt\": \"2026-03-16T17:12:56\"}', NULL, NULL, '2026-03-17 16:59:42', NULL, NULL, NULL, NULL, NULL, '2026-03-17 16:59:37', '2026-03-17 16:59:42', 0);
INSERT INTO `order` VALUES (6, 'XM20260318124914796480', 4, 1, 1, '{\"id\": 1, \"price\": 8999.0, \"stock\": 1, \"title\": \"iPhone 15 Pro Max 256GB 原色钛金属\", \"images\": \"[\\\"/uploads/goods/1.jpg\\\"]\", \"status\": \"在售\", \"deleted\": 0, \"invoice\": true, \"modelId\": 1, \"location\": \"北京\", \"sellerId\": 1, \"warranty\": true, \"createdAt\": \"2026-03-16T14:00:35\", \"likeCount\": 34, \"updatedAt\": \"2026-03-18T12:48:31\", \"viewCount\": 285, \"canBargain\": true, \"categoryId\": 1, \"description\": \"99新，无划痕，配件齐全，电池健康度100%，支持验机\", \"rejectReason\": null, \"conditionDesc\": \"全新未拆封\", \"originalPrice\": 9999.0, \"conditionLevel\": 10}', 1, 8999.00, 5, '', '{\"id\": 18, \"city\": \"Hangzhou\", \"name\": \"user4\", \"phone\": \"13900000001\", \"detail\": \"Wensan Road\", \"userId\": 4, \"deleted\": 0, \"district\": \"Xihu\", \"province\": \"Zhejiang\", \"createdAt\": \"2026-03-16T17:12:56\", \"isDefault\": 1, \"updatedAt\": \"2026-03-16T17:12:56\"}', NULL, NULL, NULL, NULL, NULL, NULL, '2026-03-19 10:29:02', '支付超时，系统自动取消', '2026-03-18 12:49:15', '2026-03-19 10:29:02', 0);
INSERT INTO `order` VALUES (7, 'XM20260318153109141155', 1, 8, 90, '{\"id\": 90, \"price\": 3999.0, \"stock\": 1, \"title\": \"Apple Watch Series 9 GPS+Cell 45mm Brand New\", \"images\": \"[\\\"/uploads/goods/applewatch9_1.jpg\\\"]\", \"status\": \"在售\", \"deleted\": 0, \"invoice\": true, \"modelId\": 80, \"location\": \"Shenzhen\", \"sellerId\": 8, \"warranty\": true, \"createdAt\": \"2026-03-16T18:00:22\", \"likeCount\": 0, \"updatedAt\": \"2026-03-18T15:30:43\", \"viewCount\": 3, \"canBargain\": false, \"categoryId\": 6, \"description\": \"Brand new cellular model\", \"rejectReason\": null, \"conditionDesc\": \"Brand new sealed\", \"originalPrice\": 4499.0, \"conditionLevel\": 10}', 1, 3999.00, 2, '', '{\"id\": 14, \"city\": \"Shenzhen\", \"name\": \"WillDC\", \"phone\": \"13800138001\", \"detail\": \"Tech Park Building A 1001\", \"userId\": 1, \"deleted\": 0, \"district\": \"Nanshan\", \"province\": \"Guangdong\", \"createdAt\": \"2026-03-16T17:12:56\", \"isDefault\": 1, \"updatedAt\": \"2026-03-16T17:12:56\"}', NULL, NULL, '2026-03-18 15:31:24', NULL, NULL, NULL, NULL, NULL, '2026-03-18 15:31:10', '2026-03-18 15:31:24', 0);
INSERT INTO `order` VALUES (8, 'XM20260318174521332297', 18, 1, 100, '{\"id\": 100, \"price\": 99.99, \"stock\": 1, \"title\": \"Test Product for Order Flow\", \"images\": \"[\\\"https://example.com/test.jpg\\\"]\", \"status\": \"在售\", \"deleted\": 0, \"invoice\": true, \"modelId\": 1, \"location\": \"Beijing\", \"sellerId\": 1, \"warranty\": true, \"createdAt\": \"2026-03-18T17:43:10\", \"likeCount\": 0, \"updatedAt\": \"2026-03-18T17:43:59\", \"viewCount\": 2, \"canBargain\": false, \"categoryId\": 1, \"description\": \"Test product for order flow testing\", \"rejectReason\": null, \"conditionDesc\": null, \"originalPrice\": 149.99, \"conditionLevel\": 9}', 1, 99.99, 4, 'test order from automation', NULL, 'SF Express', 'SF1234567890', '2026-03-18 17:46:07', '2026-03-18 17:52:15', '2026-03-18 17:52:43', '2026-03-18 17:52:43', NULL, NULL, '2026-03-18 17:45:22', '2026-03-18 17:52:43', 0);
INSERT INTO `order` VALUES (9, 'XM20260319110803532335', 1, 2, 112, '{\"id\": 112, \"price\": 6299.0, \"stock\": 1, \"title\": \"华为Mate 60 Pro 12+256 南糯紫 99新\", \"images\": \"[\\\"https://consumer.huawei.com/content/dam/huawei-cbg-site/common/mkt/pdp/phones/mate60-pro/images/detail-kv@2x.png\\\"]\", \"status\": \"在售\", \"deleted\": 0, \"invoice\": false, \"modelId\": 6, \"location\": \"武汉\", \"sellerId\": 2, \"warranty\": false, \"createdAt\": \"2026-03-18T19:20:16\", \"likeCount\": 56, \"updatedAt\": \"2026-03-19T11:07:58\", \"viewCount\": 995, \"canBargain\": true, \"categoryId\": 1, \"description\": \"自用转让，配件齐全\", \"rejectReason\": null, \"conditionDesc\": null, \"originalPrice\": 6999.0, \"conditionLevel\": 8}', 1, 6299.00, 2, '', '{\"id\": 14, \"city\": \"Shenzhen\", \"name\": \"WillDC\", \"phone\": \"13800138001\", \"detail\": \"Tech Park Building A 1001\", \"userId\": 1, \"deleted\": 0, \"district\": \"Nanshan\", \"province\": \"Guangdong\", \"createdAt\": \"2026-03-16T17:12:56\", \"isDefault\": 1, \"updatedAt\": \"2026-03-16T17:12:56\"}', NULL, NULL, '2026-03-19 11:08:27', NULL, NULL, NULL, NULL, NULL, '2026-03-19 11:08:03', '2026-03-19 11:08:27', 0);
INSERT INTO `order` VALUES (10, 'XM20260319224511288314', 1, 2, 107, '{\"id\": 107, \"price\": 4999.0, \"stock\": 1, \"title\": \"iPhone 15 256GB 蓝色 95新\", \"images\": \"[\\\"https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-finish-select-202309-6-1inch-blue?wid=400\\\"]\", \"status\": \"在售\", \"deleted\": 0, \"invoice\": false, \"modelId\": 3, \"location\": \"杭州\", \"sellerId\": 2, \"warranty\": false, \"createdAt\": \"2026-03-18T19:20:16\", \"likeCount\": 38, \"updatedAt\": \"2026-03-19T22:44:56\", \"viewCount\": 680, \"canBargain\": true, \"categoryId\": 1, \"description\": \"使用半年，整体成色良好\", \"rejectReason\": null, \"conditionDesc\": null, \"originalPrice\": 7499.0, \"conditionLevel\": 7}', 1, 4999.00, 2, '', '{\"id\": 14, \"city\": \"Shenzhen\", \"name\": \"WillDC\", \"phone\": \"13800138001\", \"detail\": \"Tech Park Building A 1001\", \"userId\": 1, \"deleted\": 0, \"district\": \"Nanshan\", \"province\": \"Guangdong\", \"createdAt\": \"2026-03-16T17:12:56\", \"isDefault\": 1, \"updatedAt\": \"2026-03-19T20:20:20\"}', NULL, NULL, '2026-03-19 22:45:38', NULL, NULL, NULL, NULL, NULL, '2026-03-19 22:45:11', '2026-03-19 22:45:38', 0);
INSERT INTO `order` VALUES (11, 'XM20260320004818224670', 4, 1, 111, '{\"id\": 111, \"price\": 6999.0, \"stock\": 1, \"title\": \"华为Mate 60 Pro 12+512 雅丹黑 全新\", \"images\": \"[\\\"https://consumer.huawei.com/content/dam/huawei-cbg-site/common/mkt/pdp/phones/mate60-pro/images/prod-color@2x.png\\\"]\", \"status\": \"在售\", \"deleted\": 0, \"invoice\": true, \"modelId\": 6, \"location\": \"北京\", \"sellerId\": 1, \"warranty\": true, \"createdAt\": \"2026-03-18T19:20:16\", \"likeCount\": 78, \"updatedAt\": \"2026-03-20T00:47:05\", \"viewCount\": 1468, \"canBargain\": true, \"categoryId\": 1, \"description\": \"全新未拆封，支持卫星通信\", \"rejectReason\": null, \"conditionDesc\": null, \"originalPrice\": 7999.0, \"conditionLevel\": 10}', 1, 6999.00, 5, '', '{\"id\": 18, \"city\": \"Hangzhou\", \"name\": \"user4\", \"phone\": \"13900000001\", \"detail\": \"Wensan Road\", \"userId\": 4, \"deleted\": 0, \"district\": \"Xihu\", \"province\": \"Zhejiang\", \"createdAt\": \"2026-03-16T17:12:56\", \"isDefault\": 1, \"updatedAt\": \"2026-03-16T17:12:56\"}', NULL, NULL, NULL, NULL, NULL, NULL, '2026-03-20 01:21:56', '支付超时，系统自动取消', '2026-03-20 00:48:18', '2026-03-20 01:21:56', 0);
INSERT INTO `order` VALUES (12, 'XM20260321003552271013', 1, 8, 16, '{\"id\": 16, \"price\": 22999.0, \"stock\": 10, \"title\": \"Nikon Z8 Full Frame 95pct New\", \"images\": \"[\\\"/uploads/goods/nikonz8_1.jpg\\\"]\", \"status\": \"在售\", \"deleted\": 0, \"invoice\": true, \"modelId\": 67, \"location\": \"Guangzhou\", \"sellerId\": 8, \"warranty\": true, \"createdAt\": \"2026-03-16T17:29:55\", \"likeCount\": 0, \"updatedAt\": \"2026-03-21T00:34:24\", \"viewCount\": 3, \"canBargain\": true, \"canInspect\": true, \"categoryId\": 3, \"description\": \"95pct new 45MP professional body\", \"tradeMethod\": \"express\", \"freeShipping\": true, \"rejectReason\": null, \"conditionDesc\": \"Minor usage marks\", \"originalPrice\": 25999.0, \"conditionLevel\": 95}', 1, 22999.00, 2, '', '{\"id\": 14, \"city\": \"Shenzhen\", \"name\": \"WillDC\", \"phone\": \"13800138001\", \"detail\": \"Tech Park Building A 1001\", \"userId\": 1, \"deleted\": 0, \"district\": \"Nanshan\", \"province\": \"Guangdong\", \"createdAt\": \"2026-03-16T17:12:56\", \"isDefault\": 1, \"updatedAt\": \"2026-03-20T18:07:18\"}', NULL, NULL, '2026-03-21 00:35:57', NULL, NULL, NULL, NULL, NULL, '2026-03-21 00:35:53', '2026-03-21 00:35:57', 0);

-- ----------------------------
-- Table structure for post
-- ----------------------------
DROP TABLE IF EXISTS `post`;
CREATE TABLE `post`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `title` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '标题',
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '内容',
  `author_id` bigint NOT NULL COMMENT '作者ID',
  `forum_id` bigint NULL DEFAULT NULL COMMENT '所属社区ID',
  `spu_id` bigint NULL DEFAULT NULL COMMENT '关联SPU ID',
  `images` json NULL COMMENT '图片列表',
  `tags` json NULL COMMENT '标签列表',
  `view_count` int NULL DEFAULT 0 COMMENT '浏览数',
  `like_count` int NULL DEFAULT 0 COMMENT '点赞数',
  `comment_count` int NULL DEFAULT 0 COMMENT '评论数',
  `collect_count` int NULL DEFAULT 0 COMMENT '收藏数',
  `is_pinned` tinyint NULL DEFAULT 0 COMMENT '是否置顶: 0-否 1-是',
  `is_essence` tinyint NULL DEFAULT 0 COMMENT '是否精华: 0-否 1-是',
  `status` tinyint NULL DEFAULT 1 COMMENT '状态: 0-删除 1-正常',
  `created_at` datetime NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` datetime NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_author_id`(`author_id` ASC) USING BTREE,
  INDEX `idx_forum_id`(`forum_id` ASC) USING BTREE,
  INDEX `idx_spu_id`(`spu_id` ASC) USING BTREE,
  INDEX `idx_status`(`status` ASC) USING BTREE,
  INDEX `idx_is_pinned`(`is_pinned` ASC) USING BTREE,
  INDEX `idx_is_essence`(`is_essence` ASC) USING BTREE,
  INDEX `idx_created_at`(`created_at` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 19 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '帖子表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of post
-- ----------------------------
INSERT INTO `post` VALUES (1, 'iPhone 15 Pro Max 开箱体验，钛金属质感太棒了！', '今天收到了新手机，分享一下开箱体验。包装很简洁，手机拿在手里的质感真的很好，钛金属边框摸起来很舒服。屏幕显示效果非常棒，A17 Pro芯片运行流畅，拍照效果也很出色。', 1, 1, 1, '[\"https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800\", \"https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800\", \"https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800\"]', '[\"开箱\", \"iPhone15\", \"体验\"]', 5007, 250, 50, 100, 0, 1, 1, '2026-03-14 18:13:46', '2026-03-20 01:43:14');
INSERT INTO `post` VALUES (2, '小米14 Ultra 拍照测评，徕卡色彩真的很德味', '分享一下这款手机的拍照效果，徕卡色彩调教真的很棒，人像模式效果很好，夜景拍摄也很出色。', 2, 3, 4, '[\"https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800\", \"https://images.unsplash.com/photo-1606986628253-e0e8e2e5c6e3?w=800\", \"https://images.unsplash.com/photo-1502920917128-1aa5f9d5d24f?w=800\"]', '[\"拍照\", \"徕卡\", \"测评\"]', 3001, 150, 30, 60, 0, 0, 1, '2026-03-14 18:13:46', '2026-03-18 21:38:34');
INSERT INTO `post` VALUES (3, '二手交易注意事项，总结一些经验', '总结一些二手交易的经验，希望大家都能顺利交易，避免被骗。1. 尽量当面交易 2. 检查机器是否有锁 3. 核对序列号...', 5, 5, NULL, '[\"https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800\", \"https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800\"]', '[\"交易\", \"经验\", \"注意事项\"]', 2003, 100, 41, 80, 1, 1, 1, '2026-03-14 18:13:46', '2026-03-21 14:51:10');
INSERT INTO `post` VALUES (4, '华为Mate 60 Pro 卫星通话体验', '测试了一下卫星通话功能，虽然平时用不上，但是关键时刻真的能救命。分享一下使用体验...', 4, 4, 6, '[\"https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800\", \"https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=800\"]', '[\"卫星通话\", \"华为\", \"体验\"]', 4000, 200, 35, 70, 0, 0, 1, '2026-03-14 18:13:46', '2026-03-18 21:38:34');
INSERT INTO `post` VALUES (5, 'MacBook Pro M3 Pro 开发体验', '作为开发者，分享一下M3 Pro MacBook的开发体验，编译速度很快，续航也很给力...', 1, 6, 8, '[\"https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800\", \"https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800\"]', '[\"MacBook\", \"开发\", \"M3\"]', 2501, 120, 26, 50, 0, 0, 1, '2026-03-14 18:13:46', '2026-03-19 00:42:24');
INSERT INTO `post` VALUES (6, 'iPhone 15 Pro vs 小米14 Ultra 拍照对比', '两款手机拍照对比，各有特色，分享一下我的使用感受...', 3, 7, NULL, '[\"https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800\", \"https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800\", \"https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800\"]', '[\"对比\", \"拍照\", \"iPhone\", \"小米\"]', 6003, 300, 60, 120, 0, 1, 1, '2026-03-14 18:13:46', '2026-03-19 16:26:09');
INSERT INTO `post` VALUES (7, 'iPhone 15 Pro Max 使用一周感受分享', '入手一周了，钛金属边框真的很有质感，A17 Pro性能强劲，玩游戏完全不卡。5倍光学变焦拍远景很清晰。电池续航也比上一代好很多。', 1, NULL, 1, '[\"https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800\", \"https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800\"]', NULL, 2347, 356, 45, 0, 0, 1, 1, '2026-03-18 19:26:23', '2026-03-22 13:51:17');
INSERT INTO `post` VALUES (8, '关于iPhone 15 Pro Max发热问题的讨论', '大家有遇到发热问题吗？我玩原神的时候感觉挺热的，不知道是不是正常现象。', 2, NULL, 1, '[\"https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800\", \"https://images.unsplash.com/photo-1591331653864-aa9c5e8b6bf4?w=800\"]', NULL, 1590, 189, 68, 0, 0, 0, 1, '2026-03-17 19:26:23', '2026-03-20 18:07:06');
INSERT INTO `post` VALUES (9, 'iPhone 15 Pro Max vs iPhone 14 Pro Max 对比', '作为14 Pro Max用户，聊聊升级感受。钛金属轻了不少，Type-C接口终于来了，相机提升明显。', 3, NULL, 1, '[\"https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800\", \"https://images.unsplash.com/photo-1591331653864-aa9c5e8b6bf4?w=800\", \"https://images.unsplash.com/photo-1605236453808-623a4b8a719e?w=800\"]', NULL, 3482, 423, 96, 0, 1, 1, 1, '2026-03-16 19:26:23', '2026-03-22 14:19:12');
INSERT INTO `post` VALUES (10, 'iPhone 15 Pro 日常使用体验', '比Pro Max轻很多，单手操作舒适。A17 Pro性能完全够用，拍照效果很满意。', 1, NULL, 2, '[\"https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800\", \"https://images.unsplash.com/photo-1591331653864-aa9c5e8b6bf4?w=800\"]', NULL, 1234, 234, 34, 0, 0, 0, 1, '2026-03-18 19:26:23', '2026-03-18 21:38:34');
INSERT INTO `post` VALUES (11, 'iPhone 15 Pro 配件推荐', '分享一下我买的配件，保护壳、充电器、MagSafe等，附购买链接。', 2, NULL, 2, '[\"https://example.com/post/acc1.jpg\"]', NULL, 996, 167, 56, 0, 0, 0, 1, '2026-03-17 19:26:23', '2026-03-18 21:58:00');
INSERT INTO `post` VALUES (12, '小米14 Ultra 徕卡影像体验', '徕卡色彩真的很有味道，随手一拍就是大片。夜景表现也非常出色。', 1, NULL, 4, '[\"https://example.com/post/mi-photo1.jpg\"]', NULL, 1876, 289, 43, 0, 0, 1, 1, '2026-03-18 19:26:23', '2026-03-18 19:26:23');
INSERT INTO `post` VALUES (13, '小米14 Ultra vs iPhone 15 Pro Max 拍照对比', '两台机器都有，做了一个拍照对比，各有特色。徕卡色彩讨喜，iPhone更真实。', 2, NULL, 4, '[\"https://example.com/post/compare2.jpg\"]', NULL, 2570, 345, 78, 0, 0, 0, 1, '2026-03-17 19:26:23', '2026-03-21 12:55:56');
INSERT INTO `post` VALUES (14, 'Mate 60 Pro 卫星通信实测', '今天试了卫星通信功能，虽然平时用不上，但关键时刻能救命。昆仑玻璃也很耐摔。', 1, NULL, 6, '[\"https://example.com/post/hw-sat.jpg\"]', NULL, 3456, 456, 67, 0, 0, 1, 1, '2026-03-18 19:26:23', '2026-03-18 19:26:23');
INSERT INTO `post` VALUES (15, '鸿蒙系统使用感受', '从iOS转过来，说说鸿蒙的体验。系统流畅，分布式功能很实用。', 2, NULL, 6, '[]', NULL, 1568, 234, 45, 0, 0, 0, 1, '2026-03-16 19:26:23', '2026-03-18 21:57:58');
INSERT INTO `post` VALUES (16, 'ROG Phone 8 Pro 游戏体验', '电竞手机果然不一样，玩原神、王者荣耀帧率稳定，散热也很好。AirTrigger很实用。', 1, NULL, 11, '[\"https://example.com/post/rog-game.jpg\"]', NULL, 1234, 198, 34, 0, 0, 0, 1, '2026-03-18 19:26:23', '2026-03-18 19:26:23');
INSERT INTO `post` VALUES (17, 'vivo X100 Pro 蔡司影像体验', '蔡司镀膜确实厉害，逆光拍摄几乎没有鬼影。人像模式也很好看。', 1, NULL, 13, '[\"https://example.com/post/vivo-photo.jpg\"]', NULL, 1678, 267, 38, 0, 0, 0, 1, '2026-03-18 19:26:23', '2026-03-18 19:26:23');
INSERT INTO `post` VALUES (18, 'OPPO Find X7 Ultra 双潜望体验', '双潜望镜头太强了，3倍和6倍光学变焦都有，拍远景人像非常给力。', 1, NULL, 14, '[\"https://example.com/post/oppo-photo.jpg\"]', NULL, 1456, 234, 29, 0, 0, 0, 1, '2026-03-18 19:26:23', '2026-03-18 19:26:23');

-- ----------------------------
-- Table structure for post_collect
-- ----------------------------
DROP TABLE IF EXISTS `post_collect`;
CREATE TABLE `post_collect`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '收藏ID',
  `post_id` bigint NOT NULL COMMENT '帖子ID',
  `user_id` bigint NOT NULL COMMENT '用户ID',
  `created_at` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_post_user`(`post_id` ASC, `user_id` ASC) USING BTREE,
  INDEX `idx_user_id`(`user_id` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '帖子收藏表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of post_collect
-- ----------------------------

-- ----------------------------
-- Table structure for post_like
-- ----------------------------
DROP TABLE IF EXISTS `post_like`;
CREATE TABLE `post_like`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `post_id` bigint NOT NULL COMMENT '帖子ID',
  `user_id` bigint NOT NULL COMMENT '用户ID',
  `created_at` datetime NULL DEFAULT CURRENT_TIMESTAMP COMMENT '点赞时间',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_post_user`(`post_id` ASC, `user_id` ASC) USING BTREE,
  INDEX `idx_user_id`(`user_id` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 32 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '帖子点赞表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of post_like
-- ----------------------------
INSERT INTO `post_like` VALUES (1, 1, 2, '2026-03-14 18:13:46');
INSERT INTO `post_like` VALUES (2, 1, 3, '2026-03-14 18:13:46');
INSERT INTO `post_like` VALUES (3, 1, 4, '2026-03-14 18:13:46');
INSERT INTO `post_like` VALUES (4, 2, 1, '2026-03-14 18:13:46');
INSERT INTO `post_like` VALUES (5, 2, 4, '2026-03-14 18:13:46');
INSERT INTO `post_like` VALUES (6, 3, 1, '2026-03-14 18:13:46');
INSERT INTO `post_like` VALUES (7, 3, 2, '2026-03-14 18:13:46');
INSERT INTO `post_like` VALUES (8, 3, 3, '2026-03-14 18:13:46');
INSERT INTO `post_like` VALUES (9, 4, 1, '2026-03-14 18:13:46');
INSERT INTO `post_like` VALUES (10, 4, 2, '2026-03-14 18:13:46');
INSERT INTO `post_like` VALUES (11, 5, 2, '2026-03-14 18:13:46');
INSERT INTO `post_like` VALUES (12, 5, 3, '2026-03-14 18:13:46');
INSERT INTO `post_like` VALUES (13, 6, 1, '2026-03-14 18:13:46');
INSERT INTO `post_like` VALUES (14, 6, 2, '2026-03-14 18:13:46');
INSERT INTO `post_like` VALUES (15, 6, 4, '2026-03-14 18:13:46');

-- ----------------------------
-- Table structure for product_model
-- ----------------------------
DROP TABLE IF EXISTS `product_model`;
CREATE TABLE `product_model`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '型号ID',
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '型号名称',
  `brand_id` bigint NOT NULL COMMENT '品牌ID',
  `category_id` bigint NOT NULL COMMENT '分类ID',
  `cover` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '封面图',
  `images` json NULL COMMENT '图片列表',
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL COMMENT '简介',
  `release_date` date NULL DEFAULT NULL COMMENT '发布日期',
  `reference_price` decimal(10, 2) NULL DEFAULT NULL COMMENT '参考价格',
  `status` tinyint NULL DEFAULT 1 COMMENT '状态',
  `sort` int NULL DEFAULT 0 COMMENT '排序',
  `view_count` int NULL DEFAULT 0 COMMENT '浏览量',
  `follow_count` int NULL DEFAULT 0 COMMENT '关注人数',
  `post_count` int NULL DEFAULT 0 COMMENT '帖子数',
  `goods_count` int NULL DEFAULT 0 COMMENT '在售商品数',
  `created_at` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted` tinyint NULL DEFAULT 0 COMMENT '逻辑删除',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_brand_id`(`brand_id` ASC) USING BTREE,
  INDEX `idx_category_id`(`category_id` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 82 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '产品型号表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of product_model
-- ----------------------------
INSERT INTO `product_model` VALUES (1, 'iPhone 15 Pro Max', 1, 1, '/uploads/products/1.jpg', NULL, 'iPhone 15 Pro Max，A17 Pro芯片，钛金属边框，4800万像素主摄，5倍光学变焦', '2023-09-22', 9999.00, 1, 1, 0, 0, 0, 0, '2026-03-16 14:00:35', '2026-03-16 14:00:35', 0);
INSERT INTO `product_model` VALUES (2, 'iPhone 15 Pro', 1, 1, '/uploads/products/2.jpg', NULL, 'iPhone 15 Pro，A17 Pro芯片，钛金属设计，4800万像素主摄，3倍光学变焦', '2023-09-22', 7999.00, 1, 2, 0, 0, 0, 0, '2026-03-16 14:00:35', '2026-03-16 14:00:35', 0);
INSERT INTO `product_model` VALUES (3, 'iPhone 15', 1, 1, '/uploads/products/3.jpg', NULL, 'iPhone 15，A16芯片，灵动岛设计，4800万像素主摄', '2023-09-22', 5999.00, 1, 3, 0, 0, 0, 0, '2026-03-16 14:00:35', '2026-03-16 14:00:35', 0);
INSERT INTO `product_model` VALUES (4, 'Mate 60 Pro+', 2, 1, '/uploads/products/4.jpg', NULL, '华为Mate 60 Pro+，麒麟9000S芯片，卫星通话，玄武架构，5000万像素超感知影像', '2023-08-29', 8999.00, 1, 4, 0, 0, 0, 0, '2026-03-16 14:00:35', '2026-03-16 14:00:35', 0);
INSERT INTO `product_model` VALUES (5, 'Mate 60 Pro', 2, 1, '/uploads/products/5.jpg', NULL, '华为Mate 60 Pro，麒麟9000S芯片，卫星通话，昆仑玻璃', '2023-08-29', 6999.00, 1, 5, 0, 0, 0, 0, '2026-03-16 14:00:35', '2026-03-16 14:00:35', 0);
INSERT INTO `product_model` VALUES (6, 'Xiaomi 14 Ultra', 3, 1, '/uploads/products/6.jpg', NULL, '小米14 Ultra，骁龙8 Gen3，徕卡光学镜头，一英寸大底传感器', '2024-02-22', 6499.00, 1, 6, 0, 0, 0, 0, '2026-03-16 14:00:35', '2026-03-16 14:00:35', 0);
INSERT INTO `product_model` VALUES (7, 'Xiaomi 14 Pro', 3, 1, '/uploads/products/7.jpg', NULL, '小米14 Pro，骁龙8 Gen3，徕卡影像，光影猎人900传感器', '2023-10-26', 4999.00, 1, 7, 0, 0, 0, 0, '2026-03-16 14:00:35', '2026-03-16 14:00:35', 0);
INSERT INTO `product_model` VALUES (8, 'Xiaomi 14', 3, 1, '/uploads/products/8.jpg', NULL, '小米14，骁龙8 Gen3，徕卡光学镜头，小尺寸旗舰', '2023-10-26', 3999.00, 1, 8, 0, 0, 0, 0, '2026-03-16 14:00:35', '2026-03-16 14:00:35', 0);
INSERT INTO `product_model` VALUES (9, 'Galaxy S24 Ultra', 4, 1, '/uploads/products/9.jpg', NULL, '三星Galaxy S24 Ultra，骁龙8 Gen3，S Pen，2亿像素，钛金属边框', '2024-01-17', 9699.00, 1, 9, 0, 0, 0, 0, '2026-03-16 14:00:35', '2026-03-16 14:00:35', 0);
INSERT INTO `product_model` VALUES (10, 'Find X7 Ultra', 5, 1, '/uploads/products/10.jpg', NULL, 'OPPO Find X7 Ultra，双潜望长焦，哈苏影像，一英寸大底', '2024-01-08', 5999.00, 1, 10, 0, 0, 0, 0, '2026-03-16 14:00:35', '2026-03-16 14:00:35', 0);
INSERT INTO `product_model` VALUES (11, 'X100 Pro', 6, 1, '/uploads/products/11.jpg', NULL, 'vivo X100 Pro，天玑9300，蔡司影像，一英寸主摄', '2023-11-13', 4999.00, 1, 11, 0, 0, 0, 0, '2026-03-16 14:00:35', '2026-03-16 14:00:35', 0);
INSERT INTO `product_model` VALUES (12, 'MacBook Pro 14', 1, 2, '/uploads/products/12.jpg', NULL, 'MacBook Pro 14英寸，M3 Pro芯片，18小时续航，Liquid Retina XDR显示屏', '2023-11-07', 16999.00, 1, 12, 0, 0, 0, 0, '2026-03-16 14:00:35', '2026-03-16 14:00:35', 0);
INSERT INTO `product_model` VALUES (13, 'MacBook Air 15', 1, 2, '/uploads/products/13.jpg', NULL, 'MacBook Air 15英寸，M3芯片，轻薄设计，18小时续航', '2023-06-05', 10999.00, 1, 13, 0, 0, 0, 0, '2026-03-16 14:00:35', '2026-03-16 14:00:35', 0);
INSERT INTO `product_model` VALUES (14, 'ThinkPad X1 Carbon', 8, 2, '/uploads/products/14.jpg', NULL, 'ThinkPad X1 Carbon Gen 11，轻薄商务本，14英寸2.8K OLED屏', '2023-06-01', 12999.00, 1, 14, 0, 0, 0, 0, '2026-03-16 14:00:35', '2026-03-16 14:00:35', 0);
INSERT INTO `product_model` VALUES (15, 'ROG Zephyrus G16', 9, 2, '/uploads/products/15.jpg', NULL, 'ROG幻16，RTX 4070，16英寸星云屏，电竞游戏本', '2024-01-01', 15999.00, 1, 15, 0, 0, 0, 0, '2026-03-16 14:00:35', '2026-03-16 14:00:35', 0);
INSERT INTO `product_model` VALUES (16, 'iPad Pro 12.9', 1, 5, '/uploads/products/16.jpg', NULL, 'iPad Pro 12.9英寸，M2芯片，Liquid Retina XDR显示屏，ProMotion自适应刷新率', '2022-10-26', 9299.00, 1, 16, 0, 0, 0, 0, '2026-03-16 14:00:35', '2026-03-16 14:00:35', 0);
INSERT INTO `product_model` VALUES (17, 'iPad Air 5', 1, 5, '/uploads/products/17.jpg', NULL, 'iPad Air 5，M1芯片，10.9英寸全面屏，支持Apple Pencil', '2022-03-18', 4799.00, 1, 17, 0, 0, 0, 0, '2026-03-16 14:00:35', '2026-03-16 14:00:35', 0);
INSERT INTO `product_model` VALUES (18, 'AirPods Pro 2', 1, 4, '/uploads/products/18.jpg', NULL, 'AirPods Pro第二代，H2芯片，主动降噪，自适应通透模式', '2022-09-23', 1899.00, 1, 18, 0, 0, 0, 0, '2026-03-16 14:00:35', '2026-03-16 14:00:35', 0);
INSERT INTO `product_model` VALUES (19, 'WH-1000XM5', 7, 4, '/uploads/products/19.jpg', NULL, '索尼WH-1000XM5，业界领先降噪，30小时续航，Hi-Res音质', '2022-05-20', 2499.00, 1, 19, 0, 0, 0, 0, '2026-03-16 14:00:35', '2026-03-16 14:00:35', 0);
INSERT INTO `product_model` VALUES (20, 'Apple Watch Ultra 2', 1, 6, '/uploads/products/20.jpg', NULL, 'Apple Watch Ultra 2，钛金属表壳，双频GPS，100米防水', '2023-09-22', 6499.00, 1, 20, 0, 0, 0, 0, '2026-03-16 14:00:35', '2026-03-16 14:00:35', 0);
INSERT INTO `product_model` VALUES (21, 'iPhone 14 Pro Max', 1, 1, NULL, NULL, NULL, NULL, NULL, 1, 0, 0, 0, 0, 0, '2026-03-16 17:12:18', '2026-03-16 17:12:18', 0);
INSERT INTO `product_model` VALUES (22, 'Mate 60 RS', 2, 1, NULL, NULL, NULL, NULL, NULL, 1, 0, 0, 0, 0, 0, '2026-03-16 17:12:18', '2026-03-16 17:12:18', 0);
INSERT INTO `product_model` VALUES (23, 'Xiaomi 14 Pro', 3, 1, NULL, NULL, NULL, NULL, NULL, 1, 0, 0, 0, 0, 0, '2026-03-16 17:12:18', '2026-03-16 17:12:18', 0);
INSERT INTO `product_model` VALUES (24, 'Find X6 Pro', 5, 1, NULL, NULL, NULL, NULL, NULL, 1, 0, 0, 0, 0, 0, '2026-03-16 17:12:18', '2026-03-16 17:12:18', 0);
INSERT INTO `product_model` VALUES (25, 'X100 Pro', 6, 1, NULL, NULL, NULL, NULL, NULL, 1, 0, 0, 0, 0, 0, '2026-03-16 17:12:18', '2026-03-16 17:12:18', 0);
INSERT INTO `product_model` VALUES (26, 'OnePlus 12', 7, 1, NULL, NULL, NULL, NULL, NULL, 1, 0, 0, 0, 0, 0, '2026-03-16 17:12:18', '2026-03-16 17:12:18', 0);
INSERT INTO `product_model` VALUES (27, 'Magic6 Pro', 8, 1, NULL, NULL, NULL, NULL, NULL, 1, 0, 0, 0, 0, 0, '2026-03-16 17:12:18', '2026-03-16 17:12:18', 0);
INSERT INTO `product_model` VALUES (28, 'Z60 Ultra', 9, 1, NULL, NULL, NULL, NULL, NULL, 1, 0, 0, 0, 0, 0, '2026-03-16 17:12:18', '2026-03-16 17:12:18', 0);
INSERT INTO `product_model` VALUES (29, 'RedMagic 9 Pro', 9, 1, NULL, NULL, NULL, NULL, NULL, 1, 0, 0, 0, 0, 0, '2026-03-16 17:12:18', '2026-03-16 17:12:18', 0);
INSERT INTO `product_model` VALUES (30, 'ROG Phone 8 Pro', 10, 1, NULL, NULL, NULL, NULL, NULL, 1, 0, 0, 0, 0, 0, '2026-03-16 17:12:18', '2026-03-16 17:12:18', 0);
INSERT INTO `product_model` VALUES (31, 'MacBook Air M3 15', 1, 2, NULL, NULL, NULL, NULL, NULL, 1, 0, 0, 0, 0, 0, '2026-03-16 17:12:18', '2026-03-16 17:12:18', 0);
INSERT INTO `product_model` VALUES (32, 'MacBook Pro 16 M3 Max', 1, 2, NULL, NULL, NULL, NULL, NULL, 1, 0, 0, 0, 0, 0, '2026-03-16 17:12:18', '2026-03-16 17:12:18', 0);
INSERT INTO `product_model` VALUES (33, 'ThinkPad X1 Carbon Gen12', 2, 2, NULL, NULL, NULL, NULL, NULL, 1, 0, 0, 0, 0, 0, '2026-03-16 17:12:18', '2026-03-16 17:12:18', 0);
INSERT INTO `product_model` VALUES (34, 'Dell XPS 15', 4, 2, NULL, NULL, NULL, NULL, NULL, 1, 0, 0, 0, 0, 0, '2026-03-16 17:12:18', '2026-03-16 17:12:18', 0);
INSERT INTO `product_model` VALUES (35, 'ROG Zephyrus G16', 10, 2, NULL, NULL, NULL, NULL, NULL, 1, 0, 0, 0, 0, 0, '2026-03-16 17:12:18', '2026-03-16 17:12:18', 0);
INSERT INTO `product_model` VALUES (36, 'A7M4', 4, 3, NULL, NULL, NULL, NULL, NULL, 1, 0, 0, 0, 0, 0, '2026-03-16 17:12:18', '2026-03-16 17:12:18', 0);
INSERT INTO `product_model` VALUES (37, 'R6 Mark II', 11, 3, NULL, NULL, NULL, NULL, NULL, 1, 0, 0, 0, 0, 0, '2026-03-16 17:12:18', '2026-03-16 17:12:18', 0);
INSERT INTO `product_model` VALUES (38, 'Z8', 4, 3, NULL, NULL, NULL, NULL, NULL, 1, 0, 0, 0, 0, 0, '2026-03-16 17:12:18', '2026-03-16 17:12:18', 0);
INSERT INTO `product_model` VALUES (39, 'X-T5', 12, 3, NULL, NULL, NULL, NULL, NULL, 1, 0, 0, 0, 0, 0, '2026-03-16 17:12:18', '2026-03-16 17:12:18', 0);
INSERT INTO `product_model` VALUES (40, 'Osmo Pocket 3', 13, 3, NULL, NULL, NULL, NULL, NULL, 1, 0, 0, 0, 0, 0, '2026-03-16 17:12:18', '2026-03-16 17:12:18', 0);
INSERT INTO `product_model` VALUES (41, 'AirPods Max', 1, 4, NULL, NULL, NULL, NULL, NULL, 1, 0, 0, 0, 0, 0, '2026-03-16 17:12:18', '2026-03-16 17:12:18', 0);
INSERT INTO `product_model` VALUES (42, 'QC Ultra', 14, 4, NULL, NULL, NULL, NULL, NULL, 1, 0, 0, 0, 0, 0, '2026-03-16 17:12:18', '2026-03-16 17:12:18', 0);
INSERT INTO `product_model` VALUES (43, 'HD800S', 15, 4, NULL, NULL, NULL, NULL, NULL, 1, 0, 0, 0, 0, 0, '2026-03-16 17:12:18', '2026-03-16 17:12:18', 0);
INSERT INTO `product_model` VALUES (44, 'DT1990 PRO', 16, 4, NULL, NULL, NULL, NULL, NULL, 1, 0, 0, 0, 0, 0, '2026-03-16 17:12:18', '2026-03-16 17:12:18', 0);
INSERT INTO `product_model` VALUES (45, 'Utopia', 17, 4, NULL, NULL, NULL, NULL, NULL, 1, 0, 0, 0, 0, 0, '2026-03-16 17:12:18', '2026-03-16 17:12:18', 0);
INSERT INTO `product_model` VALUES (46, 'iPad Pro 13 M4', 1, 5, NULL, NULL, NULL, NULL, NULL, 1, 0, 0, 0, 0, 0, '2026-03-16 17:12:18', '2026-03-16 17:12:18', 0);
INSERT INTO `product_model` VALUES (47, 'Galaxy Tab S9 Ultra', 4, 5, NULL, NULL, NULL, NULL, NULL, 1, 0, 0, 0, 0, 0, '2026-03-16 17:12:18', '2026-03-16 17:12:18', 0);
INSERT INTO `product_model` VALUES (48, 'MatePad Pro 13.2', 2, 5, NULL, NULL, NULL, NULL, NULL, 1, 0, 0, 0, 0, 0, '2026-03-16 17:12:18', '2026-03-16 17:12:18', 0);
INSERT INTO `product_model` VALUES (49, 'Mi Pad 6 Max 14', 3, 5, NULL, NULL, NULL, NULL, NULL, 1, 0, 0, 0, 0, 0, '2026-03-16 17:12:18', '2026-03-16 17:12:18', 0);
INSERT INTO `product_model` VALUES (50, 'Apple Watch Ultra 2', 1, 6, NULL, NULL, NULL, NULL, NULL, 1, 0, 0, 0, 0, 0, '2026-03-16 17:12:18', '2026-03-16 17:12:18', 0);
INSERT INTO `product_model` VALUES (51, 'Watch Ultimate', 2, 6, NULL, NULL, NULL, NULL, NULL, 1, 0, 0, 0, 0, 0, '2026-03-16 17:12:18', '2026-03-16 17:12:18', 0);
INSERT INTO `product_model` VALUES (52, 'Fenix 7X Solar', 18, 6, NULL, NULL, NULL, NULL, NULL, 1, 0, 0, 0, 0, 0, '2026-03-16 17:12:18', '2026-03-16 17:12:18', 0);
INSERT INTO `product_model` VALUES (53, 'iPhone 14 Pro Max', 1, 1, NULL, NULL, NULL, NULL, NULL, 1, 0, 0, 0, 0, 0, '2026-03-16 17:13:37', '2026-03-16 17:13:37', 0);
INSERT INTO `product_model` VALUES (54, 'Mate 60 RS', 2, 1, NULL, NULL, NULL, NULL, NULL, 1, 0, 0, 0, 0, 0, '2026-03-16 17:13:37', '2026-03-16 17:13:37', 0);
INSERT INTO `product_model` VALUES (55, 'Xiaomi 14 Pro', 3, 1, NULL, NULL, NULL, NULL, NULL, 1, 0, 0, 0, 0, 0, '2026-03-16 17:13:37', '2026-03-16 17:13:37', 0);
INSERT INTO `product_model` VALUES (56, 'Find X6 Pro', 5, 1, NULL, NULL, NULL, NULL, NULL, 1, 0, 0, 0, 0, 0, '2026-03-16 17:13:37', '2026-03-16 17:13:37', 0);
INSERT INTO `product_model` VALUES (57, 'X100 Pro', 6, 1, NULL, NULL, NULL, NULL, NULL, 1, 0, 0, 0, 0, 0, '2026-03-16 17:13:37', '2026-03-16 17:13:37', 0);
INSERT INTO `product_model` VALUES (58, 'OnePlus 12', 7, 1, NULL, NULL, NULL, NULL, NULL, 1, 0, 0, 0, 0, 0, '2026-03-16 17:13:37', '2026-03-16 17:13:37', 0);
INSERT INTO `product_model` VALUES (59, 'Magic6 Pro', 8, 1, NULL, NULL, NULL, NULL, NULL, 1, 0, 0, 0, 0, 0, '2026-03-16 17:13:37', '2026-03-16 17:13:37', 0);
INSERT INTO `product_model` VALUES (60, 'MacBook Air M3 15', 1, 2, NULL, NULL, NULL, NULL, NULL, 1, 0, 0, 0, 0, 0, '2026-03-16 17:13:37', '2026-03-16 17:13:37', 0);
INSERT INTO `product_model` VALUES (61, 'MacBook Pro 16 M3 Max', 1, 2, NULL, NULL, NULL, NULL, NULL, 1, 0, 0, 0, 0, 0, '2026-03-16 17:13:37', '2026-03-16 17:13:37', 0);
INSERT INTO `product_model` VALUES (62, 'ThinkPad X1 Carbon Gen12', 2, 2, NULL, NULL, NULL, NULL, NULL, 1, 0, 0, 0, 0, 0, '2026-03-16 17:13:37', '2026-03-16 17:13:37', 0);
INSERT INTO `product_model` VALUES (63, 'Dell XPS 15', 10, 2, NULL, NULL, NULL, NULL, NULL, 1, 0, 0, 0, 0, 0, '2026-03-16 17:13:37', '2026-03-16 17:13:37', 0);
INSERT INTO `product_model` VALUES (64, 'ROG Zephyrus G16', 9, 2, NULL, NULL, NULL, NULL, NULL, 1, 0, 0, 0, 0, 0, '2026-03-16 17:13:37', '2026-03-16 17:13:37', 0);
INSERT INTO `product_model` VALUES (65, 'A7M4', 7, 3, NULL, NULL, NULL, NULL, NULL, 1, 0, 0, 0, 0, 0, '2026-03-16 17:13:37', '2026-03-16 17:13:37', 0);
INSERT INTO `product_model` VALUES (66, 'R6 Mark II', 11, 3, NULL, NULL, NULL, NULL, NULL, 1, 0, 0, 0, 0, 0, '2026-03-16 17:13:37', '2026-03-16 17:13:37', 0);
INSERT INTO `product_model` VALUES (67, 'Z8', 7, 3, NULL, NULL, NULL, NULL, NULL, 1, 0, 0, 0, 0, 0, '2026-03-16 17:13:37', '2026-03-16 17:13:37', 0);
INSERT INTO `product_model` VALUES (68, 'X-T5', 12, 3, NULL, NULL, NULL, NULL, NULL, 1, 0, 0, 0, 0, 0, '2026-03-16 17:13:37', '2026-03-16 17:13:37', 0);
INSERT INTO `product_model` VALUES (69, 'Osmo Pocket 3', 13, 3, NULL, NULL, NULL, NULL, NULL, 1, 0, 0, 0, 0, 0, '2026-03-16 17:13:37', '2026-03-16 17:13:37', 0);
INSERT INTO `product_model` VALUES (70, 'AirPods Max', 1, 4, NULL, NULL, NULL, NULL, NULL, 1, 0, 0, 0, 0, 0, '2026-03-16 17:13:37', '2026-03-16 17:13:37', 0);
INSERT INTO `product_model` VALUES (71, 'QC Ultra', 14, 4, NULL, NULL, NULL, NULL, NULL, 1, 0, 0, 0, 0, 0, '2026-03-16 17:13:37', '2026-03-16 17:13:37', 0);
INSERT INTO `product_model` VALUES (72, 'HD800S', 15, 4, NULL, NULL, NULL, NULL, NULL, 1, 0, 0, 0, 0, 0, '2026-03-16 17:13:37', '2026-03-16 17:13:37', 0);
INSERT INTO `product_model` VALUES (73, 'DT1990 PRO', 16, 4, NULL, NULL, NULL, NULL, NULL, 1, 0, 0, 0, 0, 0, '2026-03-16 17:13:37', '2026-03-16 17:13:37', 0);
INSERT INTO `product_model` VALUES (74, 'Utopia', 17, 4, NULL, NULL, NULL, NULL, NULL, 1, 0, 0, 0, 0, 0, '2026-03-16 17:13:37', '2026-03-16 17:13:37', 0);
INSERT INTO `product_model` VALUES (75, 'iPad Pro 13 M4', 1, 5, NULL, NULL, NULL, NULL, NULL, 1, 0, 0, 0, 0, 0, '2026-03-16 17:13:37', '2026-03-16 17:13:37', 0);
INSERT INTO `product_model` VALUES (76, 'Galaxy Tab S9 Ultra', 4, 5, NULL, NULL, NULL, NULL, NULL, 1, 0, 0, 0, 0, 0, '2026-03-16 17:13:37', '2026-03-16 17:13:37', 0);
INSERT INTO `product_model` VALUES (77, 'MatePad Pro 13.2', 2, 5, NULL, NULL, NULL, NULL, NULL, 1, 0, 0, 0, 0, 0, '2026-03-16 17:13:37', '2026-03-16 17:13:37', 0);
INSERT INTO `product_model` VALUES (78, 'Mi Pad 6 Max 14', 3, 5, NULL, NULL, NULL, NULL, NULL, 1, 0, 0, 0, 0, 0, '2026-03-16 17:13:37', '2026-03-16 17:13:37', 0);
INSERT INTO `product_model` VALUES (79, 'Apple Watch Ultra 2', 1, 6, NULL, NULL, NULL, NULL, NULL, 1, 0, 0, 0, 0, 0, '2026-03-16 17:13:37', '2026-03-16 17:13:37', 0);
INSERT INTO `product_model` VALUES (80, 'Watch Ultimate', 2, 6, NULL, NULL, NULL, NULL, NULL, 1, 0, 0, 0, 0, 0, '2026-03-16 17:13:37', '2026-03-16 17:13:37', 0);
INSERT INTO `product_model` VALUES (81, 'Fenix 7X Solar', 18, 6, NULL, NULL, NULL, NULL, NULL, 1, 0, 0, 0, 0, 0, '2026-03-16 17:13:37', '2026-03-16 17:13:37', 0);

-- ----------------------------
-- Table structure for product_model_attribute
-- ----------------------------
DROP TABLE IF EXISTS `product_model_attribute`;
CREATE TABLE `product_model_attribute`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `model_id` bigint NOT NULL COMMENT '产品型号ID',
  `attribute_id` bigint NOT NULL COMMENT '属性ID',
  `value` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '属性值',
  `created_at` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_model_attribute`(`model_id` ASC, `attribute_id` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 224 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '产品型号属性值表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of product_model_attribute
-- ----------------------------
INSERT INTO `product_model_attribute` VALUES (1, 1, 1, '6.7', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (2, 1, 2, 'A17 Pro', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (3, 1, 3, 'LTPO', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (4, 1, 4, '4422', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (5, 1, 5, '1', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (6, 1, 6, '5', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (7, 1, 7, '8', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (8, 1, 8, '256', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (9, 1, 9, '4800', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (10, 1, 10, '1200', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (11, 1, 11, '2796x1290', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (12, 1, 12, '120', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (13, 1, 24, '221', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (14, 1, 25, 'iOS', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (15, 2, 1, '6.1', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (16, 2, 2, 'A17 Pro', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (17, 2, 3, 'LTPO', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (18, 2, 4, '3274', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (19, 2, 5, '1', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (20, 2, 6, '5', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (21, 2, 7, '8', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (22, 2, 8, '128', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (23, 2, 9, '4800', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (24, 2, 10, '1200', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (25, 2, 11, '2556x1179', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (26, 2, 12, '120', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (27, 2, 24, '187', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (28, 2, 25, 'iOS', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (29, 3, 1, '6.1', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (30, 3, 2, 'A16', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (31, 3, 3, 'OLED', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (32, 3, 4, '3349', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (33, 3, 5, '1', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (34, 3, 6, '5', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (35, 3, 7, '6', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (36, 3, 8, '128', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (37, 3, 9, '4800', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (38, 3, 10, '1200', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (39, 3, 11, '2556x1179', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (40, 3, 12, '60', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (41, 3, 24, '171', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (42, 3, 25, 'iOS', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (43, 4, 1, '6.82', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (44, 4, 2, 'Kirin 9000S', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (45, 4, 3, 'OLED', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (46, 4, 4, '5000', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (47, 4, 5, '1', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (48, 4, 6, '5', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (49, 4, 7, '16', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (50, 4, 8, '512', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (51, 4, 9, '4800', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (52, 4, 10, '1300', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (53, 4, 11, '2720x1260', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (54, 4, 12, '120', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (55, 4, 24, '225', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (56, 4, 25, 'HarmonyOS', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (57, 5, 1, '6.82', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (58, 5, 2, 'Kirin 9000S', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (59, 5, 3, 'OLED', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (60, 5, 4, '5000', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (61, 5, 5, '1', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (62, 5, 6, '5', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (63, 5, 7, '12', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (64, 5, 8, '256', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (65, 5, 9, '5000', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (66, 5, 10, '1300', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (67, 5, 11, '2720x1260', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (68, 5, 12, '120', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (69, 5, 24, '225', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (70, 5, 25, 'HarmonyOS', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (71, 6, 1, '6.73', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (72, 6, 2, 'Snapdragon 8 Gen 3', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (73, 6, 3, 'AMOLED', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (74, 6, 4, '5000', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (75, 6, 5, '1', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (76, 6, 6, '5', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (77, 6, 7, '16', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (78, 6, 8, '512', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (79, 6, 9, '5000', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (80, 6, 10, '3200', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (81, 6, 11, '3200x1440', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (82, 6, 12, '120', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (83, 6, 24, '219', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (84, 6, 25, 'Android', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (85, 7, 1, '6.73', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (86, 7, 2, 'Snapdragon 8 Gen 3', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (87, 7, 3, 'AMOLED', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (88, 7, 4, '4880', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (89, 7, 5, '1', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (90, 7, 6, '5', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (91, 7, 7, '16', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (92, 7, 8, '256', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (93, 7, 9, '5000', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (94, 7, 10, '3200', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (95, 7, 11, '3200x1440', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (96, 7, 12, '120', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (97, 7, 24, '223', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (98, 7, 25, 'Android', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (99, 8, 1, '6.36', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (100, 8, 2, 'Snapdragon 8 Gen 3', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (101, 8, 3, 'OLED', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (102, 8, 4, '4610', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (103, 8, 5, '1', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (104, 8, 6, '5', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (105, 8, 7, '16', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (106, 8, 8, '256', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (107, 8, 9, '5000', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (108, 8, 10, '3200', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (109, 8, 11, '2670x1200', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (110, 8, 12, '120', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (111, 8, 24, '193', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (112, 8, 25, 'Android', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (113, 9, 1, '6.8', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (114, 9, 2, 'Snapdragon 8 Gen 3', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (115, 9, 3, 'AMOLED', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (116, 9, 4, '5000', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (117, 9, 5, '1', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (118, 9, 6, '5', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (119, 9, 7, '12', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (120, 9, 8, '256', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (121, 9, 9, '20000', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (122, 9, 10, '1200', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (123, 9, 11, '3120x1440', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (124, 9, 12, '120', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (125, 9, 24, '232', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (126, 9, 25, 'Android', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (127, 10, 1, '6.82', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (128, 10, 2, 'Snapdragon 8 Gen 3', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (129, 10, 3, 'AMOLED', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (130, 10, 4, '5000', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (131, 10, 5, '1', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (132, 10, 6, '5', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (133, 10, 7, '16', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (134, 10, 8, '256', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (135, 10, 9, '5000', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (136, 10, 10, '3200', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (137, 10, 11, '3168x1440', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (138, 10, 12, '120', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (139, 10, 24, '221', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (140, 10, 25, 'Android', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (141, 11, 1, '6.78', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (142, 11, 2, 'Dimensity 9300', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (143, 11, 3, 'AMOLED', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (144, 11, 4, '5400', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (145, 11, 5, '1', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (146, 11, 6, '5', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (147, 11, 7, '12', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (148, 11, 8, '256', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (149, 11, 9, '5000', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (150, 11, 10, '3200', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (151, 11, 11, '2800x1260', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (152, 11, 12, '120', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (153, 11, 24, '221', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (154, 11, 25, 'Android', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (155, 12, 1, '14.2', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (156, 12, 2, 'M3 Pro', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (157, 12, 7, '18', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (158, 12, 8, '512', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (159, 12, 11, '3024x1964', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (160, 12, 12, '120', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (161, 12, 24, '1600', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (162, 12, 25, 'macOS', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (163, 13, 1, '15.3', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (164, 13, 2, 'M3', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (165, 13, 7, '8', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (166, 13, 8, '256', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (167, 13, 11, '2880x1864', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (168, 13, 12, '60', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (169, 13, 24, '1510', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (170, 13, 25, 'macOS', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (171, 14, 1, '14', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (172, 14, 2, 'Intel Core i7-1365U', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (173, 14, 7, '32', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (174, 14, 8, '512', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (175, 14, 11, '2880x1800', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (176, 14, 12, '60', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (177, 14, 24, '1120', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (178, 14, 25, 'Windows', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (179, 15, 1, '16', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (180, 15, 2, 'Intel Core i9-14900HX', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (181, 15, 14, 'RTX 4070', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (182, 15, 7, '32', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (183, 15, 8, '1024', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (184, 15, 11, '2560x1600', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (185, 15, 12, '240', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (186, 15, 24, '2100', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (187, 15, 25, 'Windows', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (188, 16, 1, '12.9', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (189, 16, 2, 'M2', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (190, 16, 7, '8', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (191, 16, 8, '256', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (192, 16, 11, '2732x2048', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (193, 16, 12, '120', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (194, 16, 24, '682', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (195, 16, 25, 'iPadOS', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (196, 17, 1, '10.9', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (197, 17, 2, 'M1', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (198, 17, 7, '8', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (199, 17, 8, '64', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (200, 17, 11, '2360x1640', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (201, 17, 12, '60', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (202, 17, 24, '461', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (203, 17, 25, 'iPadOS', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (204, 18, 4, '6', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (205, 18, 20, '1', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (206, 18, 21, '1', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (207, 18, 22, '1', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (208, 18, 23, 'IPX4', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (209, 18, 24, '5.3', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (210, 18, 25, 'iOS', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (211, 19, 4, '30', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (212, 19, 20, '1', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (213, 19, 21, '2', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (214, 19, 22, '1,2', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (215, 19, 23, 'IPX4', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (216, 19, 24, '250', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (217, 19, 25, 'Android', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (218, 20, 1, '1.92', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (219, 20, 2, 'S9', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (220, 20, 4, '36', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (221, 20, 23, '100m', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (222, 20, 24, '61.3', '2026-03-16 14:00:35', '2026-03-16 14:00:35');
INSERT INTO `product_model_attribute` VALUES (223, 20, 25, 'watchOS', '2026-03-16 14:00:35', '2026-03-16 14:00:35');

-- ----------------------------
-- Table structure for shop
-- ----------------------------
DROP TABLE IF EXISTS `shop`;
CREATE TABLE `shop`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '店铺ID',
  `user_id` bigint NOT NULL COMMENT '用户ID（店主）',
  `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '店铺名称',
  `avatar` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '店铺头像',
  `cover` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '店铺封面',
  `description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '店铺简介',
  `phone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '联系电话',
  `wechat` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '微信号',
  `category` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '经营类目',
  `address` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '发货地址',
  `is_open` tinyint(1) NULL DEFAULT 1 COMMENT '是否营业 0-停业 1-营业',
  `auto_accept` tinyint(1) NULL DEFAULT 0 COMMENT '是否自动接单 0-否 1-是',
  `rating` decimal(2, 1) NULL DEFAULT 5.0 COMMENT '店铺评分 0-5',
  `follower_count` int NULL DEFAULT 0 COMMENT '粉丝数',
  `goods_count` int NULL DEFAULT 0 COMMENT '在售商品数',
  `sold_count` int NULL DEFAULT 0 COMMENT '已售数量',
  `status` tinyint NULL DEFAULT 1 COMMENT '状态 1-正常 0-关闭 2-审核中',
  `created_at` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted` tinyint NULL DEFAULT 0 COMMENT '逻辑删除',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_user_id`(`user_id` ASC) USING BTREE,
  INDEX `idx_status`(`status` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '店铺表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of shop
-- ----------------------------
INSERT INTO `shop` VALUES (1, 1, 'Digital Store', '/shops/shop1.jpg', NULL, 'Quality digital products', NULL, NULL, NULL, NULL, 1, 0, 4.8, 0, 0, 0, 1, '2026-03-12 20:47:36', '2026-03-12 20:47:36', 0);
INSERT INTO `shop` VALUES (2, 3, 'Camera Shop', '/shops/shop2.jpg', NULL, 'Professional camera equipment', NULL, NULL, NULL, NULL, 1, 0, 4.9, 0, 0, 0, 1, '2026-03-12 20:47:36', '2026-03-12 20:47:36', 0);

-- ----------------------------
-- Table structure for shop_auth
-- ----------------------------
DROP TABLE IF EXISTS `shop_auth`;
CREATE TABLE `shop_auth`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '认证ID',
  `user_id` bigint NOT NULL COMMENT '用户ID',
  `shop_name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '店铺名称',
  `shop_desc` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '店铺描述',
  `category` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '经营类目',
  `license_image` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '营业执照图片',
  `legal_person` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '法人姓名',
  `phone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '联系电话',
  `address` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '经营地址',
  `status` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT 'pending' COMMENT '状态：pending-待审核 approved-已通过 rejected-已拒绝',
  `reject_reason` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '拒绝原因',
  `created_at` datetime NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` datetime NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_user_id`(`user_id` ASC) USING BTREE,
  INDEX `idx_status`(`status` ASC) USING BTREE,
  INDEX `idx_created_at`(`created_at` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '店铺认证表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of shop_auth
-- ----------------------------

-- ----------------------------
-- Table structure for spu
-- ----------------------------
DROP TABLE IF EXISTS `spu`;
CREATE TABLE `spu`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `name` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT 'SPU名称',
  `brand_id` bigint NOT NULL COMMENT '品牌ID',
  `category_id` bigint NOT NULL COMMENT '分类ID',
  `sub_category_id` bigint NULL DEFAULT NULL,
  `cover` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '封面图',
  `images` json NULL COMMENT '图片列表',
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL COMMENT '描述',
  `specs` json NULL COMMENT '规格信息',
  `product_count` int NULL DEFAULT 0 COMMENT '商品数量',
  `member_count` int NULL DEFAULT 0 COMMENT '关注人数',
  `post_count` int NULL DEFAULT 0 COMMENT '帖子数',
  `avg_rating` decimal(3, 2) NULL DEFAULT 0.00 COMMENT '平均评分',
  `price_min` decimal(10, 2) NULL DEFAULT NULL COMMENT '最低价',
  `price_max` decimal(10, 2) NULL DEFAULT NULL COMMENT '最高价',
  `tags` json NULL COMMENT '标签',
  `status` tinyint NULL DEFAULT 1 COMMENT '状态: 0-禁用 1-正常',
  `view_count` int NULL DEFAULT 0 COMMENT '浏览数',
  `created_at` datetime NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` datetime NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_brand_id`(`brand_id` ASC) USING BTREE,
  INDEX `idx_category_id`(`category_id` ASC) USING BTREE,
  INDEX `idx_status`(`status` ASC) USING BTREE,
  INDEX `idx_product_count`(`product_count` ASC) USING BTREE,
  INDEX `idx_member_count`(`member_count` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 15 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = 'SPU标准产品单元表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of spu
-- ----------------------------
INSERT INTO `spu` VALUES (1, 'iPhone 15 Pro Max', 1, 1, NULL, '/uploads/goods/iphone15pro_1.jpg', '[\"https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-finish-select-202309-6-7inch_GEO_EMEA?wid=800\", \"https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-finish-select-202309-6-7inch-naturaltitanium_GEO_EMEA?wid=800\", \"https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-finish-select-202309-6-7inch-bluetitanium_GEO_EMEA?wid=800\"]', '苹果2023年旗舰手机，A17 Pro芯片，钛金属边框，5倍光学变焦', NULL, 1, 2500, 80, 4.90, 8999.00, 8999.00, '[\"旗舰手机\", \"苹果\", \"钛金属\", \"A17 Pro\", \"5倍光学变焦\"]', 1, 150000, '2026-03-14 18:13:46', '2026-03-20 01:14:41');
INSERT INTO `spu` VALUES (2, 'iPhone 15 Pro', 1, 1, NULL, '/uploads/goods/iphone15pro_1.jpg', '[\"https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-finish-select-202309-6-1inch_GEO_EMEA?wid=800\", \"https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-finish-select-202309-6-1inch-naturaltitanium_GEO_EMEA?wid=800\"]', '苹果Pro系列，A17 Pro芯片，钛金属设计', NULL, 0, 2000, 60, 4.85, 7299.00, 7999.00, '[\"苹果\", \"A17 Pro\", \"钛金属\", \"专业摄影\"]', 1, 120000, '2026-03-14 18:13:46', '2026-03-20 01:14:41');
INSERT INTO `spu` VALUES (3, 'iPhone 15', 1, 1, NULL, '/uploads/goods/iphone15_1.jpg', '[\"https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-finish-select-202309-6-1inch?wid=800\", \"https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-finish-select-202309-6-1inch-blue?wid=800\"]', '苹果标准版，A16芯片，灵动岛设计', NULL, 0, 1500, 40, 4.70, 5999.00, 5999.00, '[\"苹果\", \"A16芯片\", \"灵动岛\", \"性价比\"]', 1, 80000, '2026-03-14 18:13:46', '2026-03-20 01:14:41');
INSERT INTO `spu` VALUES (4, '小米14 Ultra', 3, 1, NULL, '/uploads/goods/mipad6max_1.jpg', '[\"https://cdn.cnbj1.fds.api.mi-img.com/product-images/mi14ultra/1.jpg\", \"https://cdn.cnbj1.fds.api.mi-img.com/product-images/mi14ultra/2.jpg\"]', '小米影像旗舰，徕卡光学镜头，骁龙8 Gen3', NULL, 1, 1200, 45, 4.75, 7999.00, 7999.00, '[\"小米\", \"徕卡影像\", \"骁龙8 Gen3\", \"旗舰\"]', 1, 60000, '2026-03-14 18:13:46', '2026-03-20 01:14:41');
INSERT INTO `spu` VALUES (5, '小米14 Pro', 3, 1, NULL, '/uploads/goods/mipad6max_1.jpg', '[\"https://cdn.cnbj1.fds.api.mi-img.com/product-images/mi14pro/1.jpg\", \"https://cdn.cnbj1.fds.api.mi-img.com/product-images/mi14pro/2.jpg\"]', '小米高端旗舰，骁龙8 Gen3，徕卡影像', NULL, 0, 800, 30, 4.70, 4999.00, 4999.00, '[\"小米\", \"徕卡\", \"骁龙8 Gen3\"]', 1, 40000, '2026-03-14 18:13:46', '2026-03-20 01:14:41');
INSERT INTO `spu` VALUES (6, '华为Mate 60 Pro', 2, 1, NULL, '/uploads/goods/huaweiwatchultimate_1.jpg', '[\"https://consumer.huawei.com/content/dam/huawei-cbg-site/common/mkt/pdp/phones/mate60-pro/images/prod-color@2x.png\", \"https://consumer.huawei.com/content/dam/huawei-cbg-site/common/mkt/pdp/phones/mate60-pro/images/detail-kv@2x.png\"]', '华为旗舰手机，麒麟芯片，卫星通话', NULL, 1, 1800, 55, 4.80, 5999.00, 5999.00, '[\"华为\", \"麒麟芯片\", \"卫星通信\", \"昆仑玻璃\"]', 1, 100000, '2026-03-14 18:13:46', '2026-03-20 01:14:41');
INSERT INTO `spu` VALUES (7, '华为Mate 60', 2, 1, NULL, '/uploads/goods/huaweiwatchultimate_1.jpg', NULL, '华为高端手机，麒麟芯片回归', NULL, 0, 1000, 35, 4.75, 5499.00, 6499.00, NULL, 1, 50000, '2026-03-14 18:13:46', '2026-03-20 01:14:41');
INSERT INTO `spu` VALUES (8, 'MacBook Pro 14 M3 Pro', 1, 2, NULL, '/uploads/goods/macbookpro16_1.jpg', NULL, '苹果专业笔记本，M3 Pro芯片，14英寸', NULL, 0, 500, 20, 4.95, 14999.00, 19999.00, NULL, 1, 30000, '2026-03-14 18:13:46', '2026-03-20 01:14:41');
INSERT INTO `spu` VALUES (9, 'MacBook Air 15 M3', 1, 2, NULL, '/uploads/goods/macbookairm3_1.jpg', NULL, '苹果轻薄笔记本，M3芯片，15英寸大屏', NULL, 1, 600, 25, 4.85, 8499.00, 8499.00, NULL, 1, 25000, '2026-03-14 18:13:46', '2026-03-20 01:14:41');
INSERT INTO `spu` VALUES (10, 'Galaxy S24 Ultra', 4, 1, NULL, '/uploads/goods/tabs9ultra_1.jpg', NULL, '三星旗舰手机，骁龙8 Gen3，S Pen', NULL, 0, 700, 25, 4.70, 8999.00, 11999.00, NULL, 1, 35000, '2026-03-14 18:13:46', '2026-03-20 01:14:41');
INSERT INTO `spu` VALUES (11, 'ROG Phone 8 Pro', 9, 1, 7, 'https://rog.asus.com/images/rog-phone8/cover.jpg', '[\"https://rog.asus.com/images/rog-phone8/cover.jpg\", \"https://rog.asus.com/images/rog-phone8/detail1.jpg\"]', 'Gaming Phone', NULL, 0, 500, 15, 0.00, 5499.00, 5499.00, '[\"游戏手机\", \"ROG\", \"骁龙8 Gen3\", \"电竞\"]', 1, 0, '2026-03-18 18:59:18', '2026-03-18 19:25:04');
INSERT INTO `spu` VALUES (12, 'Red Magic 9 Pro', 9, 1, 7, 'https://www.redmagic.com/images/cover.jpg', '[\"https://www.redmagic.com/images/cover.jpg\", \"https://www.redmagic.com/images/detail1.jpg\"]', 'Gaming Flagship', NULL, 1, 400, 10, 0.00, 14999.00, 14999.00, '[\"游戏手机\", \"红魔\", \"骁龙8 Gen3\", \"RGB灯效\"]', 1, 0, '2026-03-18 18:59:29', '2026-03-18 19:25:04');
INSERT INTO `spu` VALUES (13, 'vivo X100 Pro', 6, 1, 9, 'https://www.vivo.com/images/x100pro/cover.jpg', '[\"https://www.vivo.com/images/x100pro/cover.jpg\", \"https://www.vivo.com/images/x100pro/detail1.jpg\"]', 'Camera Flagship', NULL, 0, 800, 25, 0.00, 4999.00, 4999.00, '[\"拍照手机\", \"vivo\", \"蔡司影像\", \"天玑9300\"]', 1, 0, '2026-03-18 18:59:29', '2026-03-18 19:25:04');
INSERT INTO `spu` VALUES (14, 'OPPO Find X7 Ultra', 5, 1, 9, 'https://www.oppo.com/images/findx7/cover.jpg', '[\"https://www.oppo.com/images/findx7/cover.jpg\", \"https://www.oppo.com/images/findx7/detail1.jpg\"]', 'Ultra Camera Phone', NULL, 0, 600, 20, 0.00, 5799.00, 5799.00, '[\"拍照手机\", \"OPPO\", \"哈苏影像\", \"双潜望\"]', 1, 0, '2026-03-18 18:59:29', '2026-03-18 19:25:04');

-- ----------------------------
-- Table structure for spu_follow
-- ----------------------------
DROP TABLE IF EXISTS `spu_follow`;
CREATE TABLE `spu_follow`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `spu_id` bigint NOT NULL COMMENT 'SPU ID',
  `user_id` bigint NOT NULL COMMENT '用户ID',
  `created_at` datetime NULL DEFAULT CURRENT_TIMESTAMP COMMENT '关注时间',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_spu_user`(`spu_id` ASC, `user_id` ASC) USING BTREE,
  INDEX `idx_user_id`(`user_id` ASC) USING BTREE,
  INDEX `idx_spu_id`(`spu_id` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 24 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = 'SPU关注表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of spu_follow
-- ----------------------------
INSERT INTO `spu_follow` VALUES (1, 1, 1, '2026-03-14 18:13:46');
INSERT INTO `spu_follow` VALUES (2, 1, 2, '2026-03-14 18:13:46');
INSERT INTO `spu_follow` VALUES (3, 1, 3, '2026-03-14 18:13:46');
INSERT INTO `spu_follow` VALUES (4, 2, 3, '2026-03-14 18:13:46');
INSERT INTO `spu_follow` VALUES (5, 2, 4, '2026-03-14 18:13:46');
INSERT INTO `spu_follow` VALUES (6, 4, 2, '2026-03-14 18:13:46');
INSERT INTO `spu_follow` VALUES (7, 4, 4, '2026-03-14 18:13:46');
INSERT INTO `spu_follow` VALUES (8, 6, 4, '2026-03-14 18:13:46');
INSERT INTO `spu_follow` VALUES (9, 6, 1, '2026-03-14 18:13:46');
INSERT INTO `spu_follow` VALUES (10, 8, 1, '2026-03-14 18:13:46');
INSERT INTO `spu_follow` VALUES (11, 8, 3, '2026-03-14 18:13:46');

-- ----------------------------
-- Table structure for spu_price_trend
-- ----------------------------
DROP TABLE IF EXISTS `spu_price_trend`;
CREATE TABLE `spu_price_trend`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `spu_id` bigint NOT NULL COMMENT 'SPU ID',
  `date` date NOT NULL COMMENT '日期',
  `avg_price` decimal(10, 2) NULL DEFAULT NULL COMMENT '平均价',
  `min_price` decimal(10, 2) NULL DEFAULT NULL COMMENT '最低价',
  `max_price` decimal(10, 2) NULL DEFAULT NULL COMMENT '最高价',
  `product_count` int NULL DEFAULT NULL COMMENT '商品数量',
  `created_at` datetime NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_spu_date`(`spu_id` ASC, `date` ASC) USING BTREE,
  INDEX `idx_spu_id`(`spu_id` ASC) USING BTREE,
  INDEX `idx_date`(`date` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = 'SPU价格趋势表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of spu_price_trend
-- ----------------------------

-- ----------------------------
-- Table structure for system_notification
-- ----------------------------
DROP TABLE IF EXISTS `system_notification`;
CREATE TABLE `system_notification`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `user_id` bigint NOT NULL COMMENT '接收用户ID',
  `type` tinyint NOT NULL COMMENT '通知类型：1-订单发货, 2-订单签收, 3-订单取消, 4-退款, 5-实名认证成功, 6-实名认证失败, 7-商品审核通过, 8-商品审核未通过, 9-交易成功, 10-账户安全提醒, 11-系统公告',
  `title` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '通知标题',
  `content` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '通知内容',
  `related_id` bigint NULL DEFAULT NULL COMMENT '关联业务ID',
  `related_type` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '关联业务类型（order/product等）',
  `is_read` tinyint NULL DEFAULT 0 COMMENT '是否已读：0-未读, 1-已读',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_user_id`(`user_id` ASC) USING BTREE,
  INDEX `idx_is_read`(`is_read` ASC) USING BTREE,
  INDEX `idx_created_at`(`created_at` ASC) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '系统通知表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of system_notification
-- ----------------------------

-- ----------------------------
-- Table structure for upload_file
-- ----------------------------
DROP TABLE IF EXISTS `upload_file`;
CREATE TABLE `upload_file`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '文件ID',
  `user_id` bigint NULL DEFAULT NULL,
  `file_key` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '文件Key（存储路径）',
  `file_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '访问URL',
  `file_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '原始文件名',
  `file_size` bigint NULL DEFAULT NULL COMMENT '文件大小（字节）',
  `file_type` tinyint NULL DEFAULT 1 COMMENT '文件类型 1-图片 2-视频 3-文档',
  `mime_type` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT 'MIME类型',
  `width` int NULL DEFAULT NULL COMMENT '图片宽度',
  `height` int NULL DEFAULT NULL COMMENT '图片高度',
  `scene` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '上传场景',
  `created_at` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_user_id`(`user_id` ASC) USING BTREE,
  INDEX `idx_scene`(`scene` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 34 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '上传文件表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of upload_file
-- ----------------------------
INSERT INTO `upload_file` VALUES (1, 1, '2026/03/15/33637c83fd6241c6aced6076a9ea4d20.jpg', '/uploads/2026/03/15/33637c83fd6241c6aced6076a9ea4d20.jpg', '头像.jpg', 50528, 1, 'image/jpeg', NULL, NULL, 'avatar', '2026-03-15 15:49:50');
INSERT INTO `upload_file` VALUES (2, 1, '2026/03/15/f154f4e7b9de4b0c810e84f92686e42a.jpg', '/uploads/2026/03/15/f154f4e7b9de4b0c810e84f92686e42a.jpg', '头像.jpg', 50528, 1, 'image/jpeg', NULL, NULL, 'avatar', '2026-03-15 15:51:17');
INSERT INTO `upload_file` VALUES (3, 1, '2026/03/15/30fa7bde254d40419f7db936c2f567e3.jpg', '/uploads/2026/03/15/30fa7bde254d40419f7db936c2f567e3.jpg', '头像.jpg', 50528, 1, 'image/jpeg', NULL, NULL, 'other', '2026-03-15 16:34:46');
INSERT INTO `upload_file` VALUES (4, 1, '2026/03/15/8ce9fc54fd3f4853a45eb5423a91bad0.jpg', '/uploads/2026/03/15/8ce9fc54fd3f4853a45eb5423a91bad0.jpg', '头像.jpg', 50528, 1, 'image/jpeg', NULL, NULL, 'other', '2026-03-15 16:35:02');
INSERT INTO `upload_file` VALUES (5, 1, '2026/03/15/6330efc67ac04b5889fabf84668a9506.jpg', '/uploads/2026/03/15/6330efc67ac04b5889fabf84668a9506.jpg', '头像.jpg', 50528, 1, 'image/jpeg', NULL, NULL, 'other', '2026-03-15 16:44:00');
INSERT INTO `upload_file` VALUES (6, 1, '2026/03/15/824ac90c169f4276a4e430cd87efb9d7.jpg', '/uploads/2026/03/15/824ac90c169f4276a4e430cd87efb9d7.jpg', '头像.jpg', 50528, 1, 'image/jpeg', NULL, NULL, 'other', '2026-03-15 16:44:45');
INSERT INTO `upload_file` VALUES (7, 1, '2026/03/15/91ec7047f2544f0cb55454e7168d2400.jpg', '/uploads/2026/03/15/91ec7047f2544f0cb55454e7168d2400.jpg', '头像.jpg', 50528, 1, 'image/jpeg', NULL, NULL, 'other', '2026-03-15 16:52:16');
INSERT INTO `upload_file` VALUES (8, 1, '2026/03/15/aacac81f05fa4dcea09b4a2ed7c8190e.jpg', '/uploads/2026/03/15/aacac81f05fa4dcea09b4a2ed7c8190e.jpg', '头像.jpg', 50528, 1, 'image/jpeg', NULL, NULL, 'avatar', '2026-03-15 17:08:28');
INSERT INTO `upload_file` VALUES (9, 1, '2026/03/15/b38e8790f8574db594dfc3cd33fe79ea.jpg', '/uploads/2026/03/15/b38e8790f8574db594dfc3cd33fe79ea.jpg', '头像.jpg', 50528, 1, 'image/jpeg', NULL, NULL, 'avatar', '2026-03-15 18:57:09');
INSERT INTO `upload_file` VALUES (10, 1, '2026/03/15/e6fe0d3d798e48ce96f5f7071418789a.jpg', '/uploads/2026/03/15/e6fe0d3d798e48ce96f5f7071418789a.jpg', '头像.jpg', 50528, 1, 'image/jpeg', NULL, NULL, 'avatar', '2026-03-15 19:26:19');
INSERT INTO `upload_file` VALUES (11, 1, '2026/03/15/429dbb009fd8442584748064fd72f02e.jpg', '/uploads/2026/03/15/429dbb009fd8442584748064fd72f02e.jpg', '头像.jpg', 50528, 1, 'image/jpeg', NULL, NULL, 'avatar', '2026-03-15 19:26:41');
INSERT INTO `upload_file` VALUES (12, 1, '2026/03/15/6ec7081d8084418b9a4a831323116902.jpg', '/uploads/2026/03/15/6ec7081d8084418b9a4a831323116902.jpg', '头像.jpg', 50528, 1, 'image/jpeg', NULL, NULL, 'avatar', '2026-03-15 19:26:47');
INSERT INTO `upload_file` VALUES (13, 1, '2026/03/15/f6ca54b32c704d5bb6609fe02083bce2.jpg', '/uploads/2026/03/15/f6ca54b32c704d5bb6609fe02083bce2.jpg', '头像.jpg', 50528, 1, 'image/jpeg', NULL, NULL, 'avatar', '2026-03-15 19:28:01');
INSERT INTO `upload_file` VALUES (14, 1, '2026/03/15/63e637b91169479cac4d578ea547a7c0.jpg', '/uploads/2026/03/15/63e637b91169479cac4d578ea547a7c0.jpg', '头像.jpg', 50528, 1, 'image/jpeg', NULL, NULL, 'avatar', '2026-03-15 19:35:28');
INSERT INTO `upload_file` VALUES (15, 1, '2026/03/15/985a3b5e49f944e28277fa459665b6ab.jpg', '/uploads/2026/03/15/985a3b5e49f944e28277fa459665b6ab.jpg', '头像.jpg', 50528, 1, 'image/jpeg', NULL, NULL, 'avatar', '2026-03-15 19:35:55');
INSERT INTO `upload_file` VALUES (16, 1, '2026/03/15/2dc408de5edc45e8bc1c731a7c88d4a9.jpg', '/uploads/2026/03/15/2dc408de5edc45e8bc1c731a7c88d4a9.jpg', '头像.jpg', 50528, 1, 'image/jpeg', NULL, NULL, 'avatar', '2026-03-15 19:36:11');
INSERT INTO `upload_file` VALUES (17, 1, '2026/03/15/5bae09b1df404aabb61d13a93a7c9db6.jpg', '/uploads/2026/03/15/5bae09b1df404aabb61d13a93a7c9db6.jpg', '头像.jpg', 50528, 1, 'image/jpeg', NULL, NULL, 'avatar', '2026-03-15 19:41:04');
INSERT INTO `upload_file` VALUES (18, 2, '2026/03/15/bc4a25de7af0452986d459c6042f5ce9.jpg', '/uploads/2026/03/15/bc4a25de7af0452986d459c6042f5ce9.jpg', '头像.jpg', 50528, 1, 'image/jpeg', NULL, NULL, 'other', '2026-03-15 19:44:30');
INSERT INTO `upload_file` VALUES (19, 1, '2026/03/16/14d1e1518ff3453792786315e5df95dc.jpg', '/uploads/2026/03/16/14d1e1518ff3453792786315e5df95dc.jpg', '头像.jpg', 50528, 1, 'image/jpeg', NULL, NULL, 'avatar', '2026-03-16 15:10:27');
INSERT INTO `upload_file` VALUES (20, 1, '2026/03/17/2f6784c83fcd42d6a3ee3bdb6ff30510.jpg', 'http://localhost:8080/uploads/2026/03/17/2f6784c83fcd42d6a3ee3bdb6ff30510.jpg', '头像.jpg', 50528, 1, 'image/jpeg', NULL, NULL, 'other', '2026-03-17 18:17:10');
INSERT INTO `upload_file` VALUES (21, 1, '2026/03/17/9696abfa513f433187109ab14bb9c52a.jpg', 'http://localhost:8080/uploads/2026/03/17/9696abfa513f433187109ab14bb9c52a.jpg', '头像.jpg', 50528, 1, 'image/jpeg', NULL, NULL, 'avatar', '2026-03-17 18:21:12');
INSERT INTO `upload_file` VALUES (22, 20, '2026/03/22/bf8b0a96e356460db731ef864802d3d1.jpg', '/uploads/2026/03/22/bf8b0a96e356460db731ef864802d3d1.jpg', '玉米火腿肠一包-6-零食 - 副本.jpg', 95778, 1, 'image/jpeg', NULL, NULL, 'avatar', '2026-03-22 13:37:52');
INSERT INTO `upload_file` VALUES (23, 20, '2026/03/22/e525005be074415fad5fe74d1f1fe6b0.jpg', '/uploads/2026/03/22/e525005be074415fad5fe74d1f1fe6b0.jpg', '玉米火腿肠一包-6-零食 - 副本.jpg', 95778, 1, 'image/jpeg', NULL, NULL, 'avatar', '2026-03-22 13:38:00');
INSERT INTO `upload_file` VALUES (24, 20, '2026/03/22/ea63326c9dbb4084931f4ba2acd1bcb1.jpg', '/uploads/2026/03/22/ea63326c9dbb4084931f4ba2acd1bcb1.jpg', '玉米火腿肠一包-6-零食 - 副本.jpg', 95778, 1, 'image/jpeg', NULL, NULL, 'avatar', '2026-03-22 13:42:20');
INSERT INTO `upload_file` VALUES (25, 20, '2026/03/22/7789053e0d934df2a026ada1d5a4db7a.jpg', '/uploads/2026/03/22/7789053e0d934df2a026ada1d5a4db7a.jpg', '玉米火腿肠一包-6-零食.jpg', 95778, 1, 'image/jpeg', NULL, NULL, 'avatar', '2026-03-22 13:43:07');
INSERT INTO `upload_file` VALUES (26, 19, '2026/03/22/67ca2dacf8a144c38d9e61a53a3704ff.jpg', '/uploads/2026/03/22/67ca2dacf8a144c38d9e61a53a3704ff.jpg', '玉米火腿肠一包-6-零食.jpg', 95778, 1, 'image/jpeg', NULL, NULL, 'avatar', '2026-03-22 14:09:39');
INSERT INTO `upload_file` VALUES (27, 19, '2026/03/22/46046a834f614673a7eeea5d1dc49406.jpg', '/uploads/2026/03/22/46046a834f614673a7eeea5d1dc49406.jpg', '厨邦酱油1.63L-20-副食.jpg', 245171, 1, 'image/jpeg', NULL, NULL, 'avatar', '2026-03-22 14:10:40');
INSERT INTO `upload_file` VALUES (28, NULL, '2026/03/22/8cb6fbbe4e3149f09f7852886b1ec50e.jpg', '/uploads/2026/03/22/8cb6fbbe4e3149f09f7852886b1ec50e.jpg', 'avatar1.jpg', 8995, 1, 'image/jpeg', NULL, NULL, 'product', '2026-03-22 15:00:05');
INSERT INTO `upload_file` VALUES (29, NULL, '2026/03/22/d7ebefe04cf34ad787b0e4da0cdcedd5.jpg', '/uploads/2026/03/22/d7ebefe04cf34ad787b0e4da0cdcedd5.jpg', '1.jpg', 12032, 1, 'image/jpeg', NULL, NULL, 'product', '2026-03-22 15:18:10');
INSERT INTO `upload_file` VALUES (30, 19, '2026/03/22/6f40e7bcb32d4a49bf2f74eacf1b2e3e.jpg', '/uploads/2026/03/22/6f40e7bcb32d4a49bf2f74eacf1b2e3e.jpg', 'O1CN01RS8POs21ArdoPwhxS_!!2209100256945.jpg', 49928, 1, 'image/jpeg', NULL, NULL, 'product', '2026-03-22 16:00:55');
INSERT INTO `upload_file` VALUES (31, 19, '2026/03/22/213adceac29e47bc8acfdb92dd50b77c.jpg', '/uploads/2026/03/22/213adceac29e47bc8acfdb92dd50b77c.jpg', '加多宝瓶装-4-饮料.jpg', 141265, 1, 'image/jpeg', NULL, NULL, 'product', '2026-03-22 16:46:23');
INSERT INTO `upload_file` VALUES (32, 19, '2026/03/22/1399e448d1e94c43aa88537fef2cdbdf.jpg', '/uploads/2026/03/22/1399e448d1e94c43aa88537fef2cdbdf.jpg', '鲁花低芥酸菜籽油4L-77-油.jpg', 128650, 1, 'image/jpeg', NULL, NULL, 'product', '2026-03-22 16:47:41');
INSERT INTO `upload_file` VALUES (33, 19, '2026/03/22/48da4ace14394f97b72aa863d318b7d8.jpg', '/uploads/2026/03/22/48da4ace14394f97b72aa863d318b7d8.jpg', '主图-05 (1).jpg', 128650, 1, 'image/jpeg', NULL, NULL, 'product', '2026-03-22 16:47:41');

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '用户ID',
  `phone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '手机号',
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '密码',
  `nickname` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '昵称',
  `avatar` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '头像URL',
  `gender` tinyint NULL DEFAULT 0 COMMENT '性别',
  `birthday` date NULL DEFAULT NULL COMMENT '生日',
  `signature` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '个性签名',
  `status` tinyint NULL DEFAULT 1 COMMENT '状态',
  `last_login_time` datetime NULL DEFAULT NULL COMMENT '最后登录时间',
  `last_login_ip` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '最后登录IP',
  `created_at` datetime NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` datetime NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted` tinyint NULL DEFAULT 0 COMMENT '逻辑删除',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_phone`(`phone` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 21 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '用户表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES (1, '13800138001', '$2a$10$2N2IqJDgIMPR9g6b1WEENOrK0jtWH.WWNpIP8.KwpEj2u8Er3/Iq2', 'WillDC', 'http://localhost:8080/uploads/2026/03/17/9696abfa513f433187109ab14bb9c52a.jpg', 1, '1991-01-01', '热爱数码，分享生活', 1, '2026-03-20 18:05:35', NULL, '2026-03-16 14:00:35', '2026-03-20 18:05:35', 0);
INSERT INTO `user` VALUES (2, '13800138002', '$2a$10$Q7ii2UFH4Lf.R3PImbQt6Oq9q1TllcTKarHkaUj5b.Nxn2Iqwkd8a', '摄影爱好者', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200', 1, NULL, '用镜头记录世界', 1, '2026-03-16 18:48:21', NULL, '2026-03-16 14:00:35', '2026-03-18 21:39:33', 0);
INSERT INTO `user` VALUES (3, '13800138003', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5EH', '科技控', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200', 2, NULL, '追求极致体验', 1, NULL, NULL, '2026-03-16 14:00:35', '2026-03-18 21:39:33', 0);
INSERT INTO `user` VALUES (4, '13800138000', '$2a$10$SfM9Bz4ZspGALol4/QWRCOSJpMjx3.lVYRKm4Xz/5kM9ekEgNb.u2', 'testuser', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200', 0, NULL, NULL, 1, '2026-03-20 00:44:53', NULL, '2026-03-16 14:00:35', '2026-03-20 00:44:53', 0);
INSERT INTO `user` VALUES (5, '13900139001', '$2a$10$nvF9ATDwCAqnh54dy6E66.lDHpnmmlDmVNP0zvdjXksRVD05YhLFq', 'testuser1', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200', 0, NULL, NULL, 1, '2026-03-16 14:00:35', NULL, '2026-03-16 14:00:35', '2026-03-18 21:39:33', 0);
INSERT INTO `user` VALUES (7, '13900000002', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5EH', 'photo_ming', 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=200', 1, '1988-08-20', 'photography lover', 1, NULL, NULL, '2026-03-16 17:12:18', '2026-03-18 21:39:33', 0);
INSERT INTO `user` VALUES (8, '13900000003', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5EH', 'gamer_wang', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200', 1, '2000-03-10', 'game player', 1, NULL, NULL, '2026-03-16 17:12:18', '2026-03-18 21:39:33', 0);
INSERT INTO `user` VALUES (9, '13900000004', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5EH', 'music_fan', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200', 2, '1992-11-25', 'music lover', 1, NULL, NULL, '2026-03-16 17:12:18', '2026-03-18 21:39:33', 0);
INSERT INTO `user` VALUES (10, '13900000005', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5EH', 'designer_li', 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=200', 2, '1990-07-08', 'UI designer', 1, NULL, NULL, '2026-03-16 17:12:18', '2026-03-18 21:39:33', 0);
INSERT INTO `user` VALUES (11, '13900000006', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5EH', 'coder_jie', 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=200', 1, '1993-09-18', 'developer', 1, NULL, NULL, '2026-03-16 17:12:18', '2026-03-18 21:39:33', 0);
INSERT INTO `user` VALUES (12, '13900000007', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5EH', 'student_liu', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200', 1, '2002-01-30', 'student', 1, NULL, NULL, '2026-03-16 17:12:18', '2026-03-18 21:56:43', 0);
INSERT INTO `user` VALUES (19, '17333087336', '$2a$10$qLNgvTb6De8L8EbTE4pepOkIibfimKfTVJOdntgmzOHe28mOpcEq6', '用户7336', '/uploads/2026/03/22/46046a834f614673a7eeea5d1dc49406.jpg', 0, NULL, NULL, 1, '2026-03-22 13:49:33', NULL, '2026-03-22 12:39:32', '2026-03-22 14:10:40', 0);
INSERT INTO `user` VALUES (20, '15507974564', '$2a$10$.X13Ila5eFFT9Rm4M2i6DOHxKGdZQ2hyNWWaMzm6iuVmZeIwZStnK', '用户4564', '2026/03/22/e525005be074415fad5fe74d1f1fe6b0.jpg', 0, NULL, NULL, 1, NULL, NULL, '2026-03-22 12:54:09', '2026-03-22 13:38:00', 0);

-- ----------------------------
-- Table structure for user_address
-- ----------------------------
DROP TABLE IF EXISTS `user_address`;
CREATE TABLE `user_address`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '地址ID',
  `user_id` bigint NOT NULL COMMENT '用户ID',
  `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '收货人姓名',
  `phone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '收货人电话',
  `province` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '省',
  `city` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '市',
  `district` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '区/县',
  `detail` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '详细地址',
  `is_default` tinyint NULL DEFAULT 0 COMMENT '是否默认地址 0-否 1-是',
  `created_at` datetime NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` datetime NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted` tinyint NULL DEFAULT 0 COMMENT '逻辑删除 0-未删除 1-已删除',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_user_id`(`user_id` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 21 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '用户收货地址表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of user_address
-- ----------------------------
INSERT INTO `user_address` VALUES (1, 1, 'Wang Ming', '13800138001', 'Beijing', 'Beijing', 'Haidian', 'Zhongguancun Street 1', 0, '2026-03-12 20:47:36', '2026-03-19 19:34:10', 0);
INSERT INTO `user_address` VALUES (2, 2, 'Li Hua', '13800138002', 'Shanghai', 'Shanghai', 'Pudong', 'Zhangjiang Hi-Tech Park', 1, '2026-03-12 20:47:36', '2026-03-12 20:47:36', 0);
INSERT INTO `user_address` VALUES (3, 3, 'Zhang Fang', '13800138003', 'Guangdong', 'Shenzhen', 'Nanshan', 'Science Park South', 1, '2026-03-12 20:47:36', '2026-03-12 20:47:36', 0);
INSERT INTO `user_address` VALUES (4, 5, 'Test User', '13900139001', 'Beijing', 'Beijing', 'Haidian', 'Test Address 123', 1, '2026-03-14 15:22:27', '2026-03-14 15:22:27', 0);
INSERT INTO `user_address` VALUES (5, 1, 'WillDC', '13800138001', 'Guangdong', 'Shenzhen', 'Nanshan', 'Tech Park Building A 1001', 0, '2026-03-16 17:12:18', '2026-03-19 20:20:20', 0);
INSERT INTO `user_address` VALUES (6, 1, 'WillDC', '13800138001', 'Guangdong', 'Guangzhou', 'Tianhe', 'Tianhe Road Plaza', 0, '2026-03-16 17:12:18', '2026-03-16 17:12:18', 0);
INSERT INTO `user_address` VALUES (7, 2, 'user2', '13800138002', 'Shanghai', 'Shanghai', 'Pudong', 'Zhangjiang Park', 1, '2026-03-16 17:12:18', '2026-03-16 17:12:18', 0);
INSERT INTO `user_address` VALUES (8, 3, 'user3', '13800138003', 'Beijing', 'Beijing', 'Haidian', 'Zhongguancun Street', 1, '2026-03-16 17:12:18', '2026-03-16 17:12:18', 0);
INSERT INTO `user_address` VALUES (9, 4, 'user4', '13900000001', 'Zhejiang', 'Hangzhou', 'Xihu', 'Wensan Road', 1, '2026-03-16 17:12:18', '2026-03-16 17:12:18', 0);
INSERT INTO `user_address` VALUES (10, 5, 'user5', '13900000002', 'Jiangsu', 'Nanjing', 'Gulou', 'Hanzhong Road', 1, '2026-03-16 17:12:18', '2026-03-16 17:12:18', 0);
INSERT INTO `user_address` VALUES (11, 6, 'user6', '13900000003', 'Sichuan', 'Chengdu', 'Wuhou', 'Tianfu Avenue', 1, '2026-03-16 17:12:18', '2026-03-16 17:12:18', 0);
INSERT INTO `user_address` VALUES (12, 7, 'user7', '13900000004', 'Guangdong', 'Shenzhen', 'Futian', 'Huaqiang Road', 1, '2026-03-16 17:12:18', '2026-03-16 17:12:18', 0);
INSERT INTO `user_address` VALUES (13, 8, 'user8', '13900000005', 'Shanghai', 'Shanghai', 'Jingan', 'Nanjing West Road', 1, '2026-03-16 17:12:18', '2026-03-16 17:12:18', 0);
INSERT INTO `user_address` VALUES (14, 1, 'WillDC', '13800138001', 'Guangdong', 'Shenzhen', 'Nanshan', 'Tech Park Building A 1001', 1, '2026-03-16 17:12:56', '2026-03-20 18:07:18', 0);
INSERT INTO `user_address` VALUES (15, 1, 'WillDC', '13800138001', 'Guangdong', 'Guangzhou', 'Tianhe', 'Tianhe Road Plaza', 0, '2026-03-16 17:12:56', '2026-03-20 18:07:17', 0);
INSERT INTO `user_address` VALUES (16, 2, 'user2', '13800138002', 'Shanghai', 'Shanghai', 'Pudong', 'Zhangjiang Park', 1, '2026-03-16 17:12:56', '2026-03-16 17:12:56', 0);
INSERT INTO `user_address` VALUES (17, 3, 'user3', '13800138003', 'Beijing', 'Beijing', 'Haidian', 'Zhongguancun Street', 1, '2026-03-16 17:12:56', '2026-03-16 17:12:56', 0);
INSERT INTO `user_address` VALUES (18, 4, 'user4', '13900000001', 'Zhejiang', 'Hangzhou', 'Xihu', 'Wensan Road', 1, '2026-03-16 17:12:56', '2026-03-16 17:12:56', 0);
INSERT INTO `user_address` VALUES (19, 5, 'user5', '13900000002', 'Jiangsu', 'Nanjing', 'Gulou', 'Hanzhong Road', 1, '2026-03-16 17:12:56', '2026-03-16 17:12:56', 0);
INSERT INTO `user_address` VALUES (20, 6, 'user6', '13900000003', 'Sichuan', 'Chengdu', 'Wuhou', 'Tianfu Avenue', 1, '2026-03-16 17:12:56', '2026-03-16 17:12:56', 0);

-- ----------------------------
-- Table structure for user_follow
-- ----------------------------
DROP TABLE IF EXISTS `user_follow`;
CREATE TABLE `user_follow`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL COMMENT '关注者ID',
  `followed_id` bigint NOT NULL COMMENT '被关注者ID',
  `created_at` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_user_followed`(`user_id` ASC, `followed_id` ASC) USING BTREE,
  INDEX `idx_user_id`(`user_id` ASC) USING BTREE,
  INDEX `idx_followed_id`(`followed_id` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 14 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '用户关注表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of user_follow
-- ----------------------------
INSERT INTO `user_follow` VALUES (2, 1, 3, '2026-03-15 14:38:15');
INSERT INTO `user_follow` VALUES (3, 2, 1, '2026-03-15 14:38:15');
INSERT INTO `user_follow` VALUES (4, 2, 3, '2026-03-15 14:38:15');
INSERT INTO `user_follow` VALUES (5, 3, 1, '2026-03-15 14:38:15');
INSERT INTO `user_follow` VALUES (6, 1, 2, '2026-03-19 16:09:49');
INSERT INTO `user_follow` VALUES (7, 1, 5, '2026-03-21 14:51:26');
INSERT INTO `user_follow` VALUES (12, 19, 1, '2026-03-22 14:07:11');
INSERT INTO `user_follow` VALUES (13, 19, 3, '2026-03-22 14:19:13');

-- ----------------------------
-- Table structure for user_profile
-- ----------------------------
DROP TABLE IF EXISTS `user_profile`;
CREATE TABLE `user_profile`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `user_id` bigint NOT NULL COMMENT '用户ID',
  `real_name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '真实姓名',
  `id_card` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '身份证号',
  `id_card_front` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '身份证正面照',
  `id_card_back` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '身份证背面照',
  `real_name_status` tinyint NULL DEFAULT 0 COMMENT '实名状态 0-未认证 1-认证中 2-已认证 3-认证失败',
  `real_name_time` datetime NULL DEFAULT NULL COMMENT '认证时间',
  `real_name_reason` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '认证失败原因',
  `shop_auth_status` tinyint NULL DEFAULT 0 COMMENT '店铺认证状态 0-未认证 1-认证中 2-已认证 3-认证失败',
  `shop_auth_time` datetime NULL DEFAULT NULL COMMENT '店铺认证时间',
  `shop_auth_reason` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '店铺认证失败原因',
  `province` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '省份',
  `city` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '城市',
  `district` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '区县',
  `created_at` datetime NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` datetime NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_user_id`(`user_id` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 10 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '用户扩展资料表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of user_profile
-- ----------------------------
INSERT INTO `user_profile` VALUES (1, 1, NULL, NULL, NULL, NULL, 2, NULL, NULL, 2, NULL, NULL, NULL, NULL, NULL, '2026-03-12 20:47:36', '2026-03-12 20:47:36');
INSERT INTO `user_profile` VALUES (2, 2, NULL, NULL, NULL, NULL, 2, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, '2026-03-12 20:47:36', '2026-03-12 20:47:36');
INSERT INTO `user_profile` VALUES (3, 3, NULL, NULL, NULL, NULL, 2, NULL, NULL, 2, NULL, NULL, NULL, NULL, NULL, '2026-03-12 20:47:36', '2026-03-12 20:47:36');
INSERT INTO `user_profile` VALUES (4, 4, NULL, NULL, NULL, NULL, 0, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, '2026-03-14 15:16:42', '2026-03-14 15:16:42');
INSERT INTO `user_profile` VALUES (5, 5, NULL, NULL, NULL, NULL, 0, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, '2026-03-14 15:19:13', '2026-03-14 15:19:13');
INSERT INTO `user_profile` VALUES (6, 17, NULL, NULL, NULL, NULL, 0, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, '2026-03-18 16:18:21', '2026-03-18 16:18:21');
INSERT INTO `user_profile` VALUES (7, 18, NULL, NULL, NULL, NULL, 0, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, '2026-03-18 17:45:06', '2026-03-18 17:45:06');
INSERT INTO `user_profile` VALUES (8, 19, NULL, NULL, NULL, NULL, 0, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, '2026-03-22 12:39:32', '2026-03-22 12:39:32');
INSERT INTO `user_profile` VALUES (9, 20, NULL, NULL, NULL, NULL, 0, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, '2026-03-22 12:54:09', '2026-03-22 12:54:09');

SET FOREIGN_KEY_CHECKS = 1;
