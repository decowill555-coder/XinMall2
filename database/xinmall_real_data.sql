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

 Date: 16/03/2026 13:50:28
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

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
INSERT INTO `attribute` VALUES (1, '屏幕尺寸', '英寸', 2, 1, 1, NOW(), NOW());
INSERT INTO `attribute` VALUES (2, '处理器型号', NULL, 1, 2, 1, NOW(), NOW());
INSERT INTO `attribute` VALUES (3, '屏幕类型', NULL, 3, 3, 1, NOW(), NOW());
INSERT INTO `attribute` VALUES (4, '电池容量', 'mAh', 2, 4, 1, NOW(), NOW());
INSERT INTO `attribute` VALUES (5, '是否支持快充', NULL, 5, 5, 1, NOW(), NOW());
INSERT INTO `attribute` VALUES (6, '网络制式', NULL, 4, 6, 1, NOW(), NOW());
INSERT INTO `attribute` VALUES (7, '运行内存', 'GB', 2, 7, 1, NOW(), NOW());
INSERT INTO `attribute` VALUES (8, '存储容量', 'GB', 2, 8, 1, NOW(), NOW());
INSERT INTO `attribute` VALUES (9, '后置摄像头', '万像素', 2, 9, 1, NOW(), NOW());
INSERT INTO `attribute` VALUES (10, '前置摄像头', '万像素', 2, 10, 1, NOW(), NOW());
INSERT INTO `attribute` VALUES (11, '屏幕分辨率', NULL, 1, 11, 1, NOW(), NOW());
INSERT INTO `attribute` VALUES (12, '刷新率', 'Hz', 2, 12, 1, NOW(), NOW());
INSERT INTO `attribute` VALUES (13, 'CPU型号', NULL, 1, 13, 1, NOW(), NOW());
INSERT INTO `attribute` VALUES (14, '显卡型号', NULL, 1, 14, 1, NOW(), NOW());
INSERT INTO `attribute` VALUES (15, '硬盘容量', 'GB', 2, 15, 1, NOW(), NOW());
INSERT INTO `attribute` VALUES (16, '有效像素', '万像素', 2, 16, 1, NOW(), NOW());
INSERT INTO `attribute` VALUES (17, '传感器尺寸', NULL, 1, 17, 1, NOW(), NOW());
INSERT INTO `attribute` VALUES (18, '镜头卡口', NULL, 1, 18, 1, NOW(), NOW());
INSERT INTO `attribute` VALUES (19, '续航时间', '小时', 2, 19, 1, NOW(), NOW());
INSERT INTO `attribute` VALUES (20, '降噪功能', NULL, 5, 20, 1, NOW(), NOW());
INSERT INTO `attribute` VALUES (21, '佩戴方式', NULL, 3, 21, 1, NOW(), NOW());
INSERT INTO `attribute` VALUES (22, '连接方式', NULL, 4, 22, 1, NOW(), NOW());
INSERT INTO `attribute` VALUES (23, '防水等级', NULL, 1, 23, 1, NOW(), NOW());
INSERT INTO `attribute` VALUES (24, '重量', 'g', 2, 24, 1, NOW(), NOW());
INSERT INTO `attribute` VALUES (25, '操作系统', NULL, 1, 25, 1, NOW(), NOW());

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
) ENGINE = InnoDB AUTO_INCREMENT = 11 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '品牌表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of brand
-- ----------------------------
INSERT INTO `brand` VALUES (1, '苹果', '/uploads/brands/apple.png', 'Apple Inc. - 全球领先的消费电子产品制造商', 1, 1, NOW(), NOW());
INSERT INTO `brand` VALUES (2, '华为', '/uploads/brands/huawei.png', 'Huawei - 全球领先的ICT解决方案提供商', 2, 1, NOW(), NOW());
INSERT INTO `brand` VALUES (3, '小米', '/uploads/brands/xiaomi.png', 'Xiaomi - 让每个人都能享受科技的乐趣', 3, 1, NOW(), NOW());
INSERT INTO `brand` VALUES (4, '三星', '/uploads/brands/samsung.png', 'Samsung - 全球领先的电子产品制造商', 4, 1, NOW(), NOW());
INSERT INTO `brand` VALUES (5, 'OPPO', '/uploads/brands/oppo.png', 'OPPO - 拍照手机专家', 5, 1, NOW(), NOW());
INSERT INTO `brand` VALUES (6, 'vivo', '/uploads/brands/vivo.png', 'vivo - 专业音质与拍照体验', 6, 1, NOW(), NOW());
INSERT INTO `brand` VALUES (7, '索尼', '/uploads/brands/sony.png', 'Sony - 创新科技，感动人心', 7, 1, NOW(), NOW());
INSERT INTO `brand` VALUES (8, '联想', '/uploads/brands/lenovo.png', 'Lenovo - 全球PC领导品牌', 8, 1, NOW(), NOW());
INSERT INTO `brand` VALUES (9, '华硕', '/uploads/brands/asus.png', 'ASUS - 追求无与伦比', 9, 1, NOW(), NOW());
INSERT INTO `brand` VALUES (10, '戴尔', '/uploads/brands/dell.png', 'Dell - 让科技更简单', 10, 1, NOW(), NOW());

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
  `sort` int NULL DEFAULT 0 COMMENT '排序',
  `status` tinyint NULL DEFAULT 1 COMMENT '状态',
  `created_at` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_parent_id`(`parent_id` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 14 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '设备分类表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of category
-- ----------------------------
INSERT INTO `category` VALUES (1, '手机', 0, 1, '/uploads/icons/phone.png', NULL, 1, 1, NOW(), NOW());
INSERT INTO `category` VALUES (2, '电脑', 0, 1, '/uploads/icons/computer.png', NULL, 2, 1, NOW(), NOW());
INSERT INTO `category` VALUES (3, '相机', 0, 1, '/uploads/icons/camera.png', NULL, 3, 1, NOW(), NOW());
INSERT INTO `category` VALUES (4, '耳机', 0, 1, '/uploads/icons/headphone.png', NULL, 4, 1, NOW(), NOW());
INSERT INTO `category` VALUES (5, '平板', 0, 1, '/uploads/icons/tablet.png', NULL, 5, 1, NOW(), NOW());
INSERT INTO `category` VALUES (6, '智能手表', 0, 1, '/uploads/icons/watch.png', NULL, 6, 1, NOW(), NOW());
INSERT INTO `category` VALUES (7, '游戏手机', 1, 2, NULL, NULL, 1, 1, NOW(), NOW());
INSERT INTO `category` VALUES (8, '轻薄手机', 1, 2, NULL, NULL, 2, 1, NOW(), NOW());
INSERT INTO `category` VALUES (9, '拍照手机', 1, 2, NULL, NULL, 3, 1, NOW(), NOW());

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
) ENGINE = InnoDB AUTO_INCREMENT = 21 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '产品型号表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of product_model (真实数据)
-- ----------------------------
INSERT INTO `product_model` VALUES (1, 'iPhone 15 Pro Max', 1, 1, '/uploads/products/1.jpg', NULL, 'iPhone 15 Pro Max，A17 Pro芯片，钛金属边框，4800万像素主摄，5倍光学变焦', '2023-09-22', 9999.0, 1, 1, 0, 0, 0, 0, NOW(), NOW(), 0);
INSERT INTO `product_model` VALUES (2, 'iPhone 15 Pro', 1, 1, '/uploads/products/2.jpg', NULL, 'iPhone 15 Pro，A17 Pro芯片，钛金属设计，4800万像素主摄，3倍光学变焦', '2023-09-22', 7999.0, 1, 2, 0, 0, 0, 0, NOW(), NOW(), 0);
INSERT INTO `product_model` VALUES (3, 'iPhone 15', 1, 1, '/uploads/products/3.jpg', NULL, 'iPhone 15，A16芯片，灵动岛设计，4800万像素主摄', '2023-09-22', 5999.0, 1, 3, 0, 0, 0, 0, NOW(), NOW(), 0);
INSERT INTO `product_model` VALUES (4, 'Mate 60 Pro+', 2, 1, '/uploads/products/4.jpg', NULL, '华为Mate 60 Pro+，麒麟9000S芯片，卫星通话，玄武架构，5000万像素超感知影像', '2023-08-29', 8999.0, 1, 4, 0, 0, 0, 0, NOW(), NOW(), 0);
INSERT INTO `product_model` VALUES (5, 'Mate 60 Pro', 2, 1, '/uploads/products/5.jpg', NULL, '华为Mate 60 Pro，麒麟9000S芯片，卫星通话，昆仑玻璃', '2023-08-29', 6999.0, 1, 5, 0, 0, 0, 0, NOW(), NOW(), 0);
INSERT INTO `product_model` VALUES (6, 'Xiaomi 14 Ultra', 3, 1, '/uploads/products/6.jpg', NULL, '小米14 Ultra，骁龙8 Gen3，徕卡光学镜头，一英寸大底传感器', '2024-02-22', 6499.0, 1, 6, 0, 0, 0, 0, NOW(), NOW(), 0);
INSERT INTO `product_model` VALUES (7, 'Xiaomi 14 Pro', 3, 1, '/uploads/products/7.jpg', NULL, '小米14 Pro，骁龙8 Gen3，徕卡影像，光影猎人900传感器', '2023-10-26', 4999.0, 1, 7, 0, 0, 0, 0, NOW(), NOW(), 0);
INSERT INTO `product_model` VALUES (8, 'Xiaomi 14', 3, 1, '/uploads/products/8.jpg', NULL, '小米14，骁龙8 Gen3，徕卡光学镜头，小尺寸旗舰', '2023-10-26', 3999.0, 1, 8, 0, 0, 0, 0, NOW(), NOW(), 0);
INSERT INTO `product_model` VALUES (9, 'Galaxy S24 Ultra', 4, 1, '/uploads/products/9.jpg', NULL, '三星Galaxy S24 Ultra，骁龙8 Gen3，S Pen，2亿像素，钛金属边框', '2024-01-17', 9699.0, 1, 9, 0, 0, 0, 0, NOW(), NOW(), 0);
INSERT INTO `product_model` VALUES (10, 'Find X7 Ultra', 5, 1, '/uploads/products/10.jpg', NULL, 'OPPO Find X7 Ultra，双潜望长焦，哈苏影像，一英寸大底', '2024-01-08', 5999.0, 1, 10, 0, 0, 0, 0, NOW(), NOW(), 0);
INSERT INTO `product_model` VALUES (11, 'X100 Pro', 6, 1, '/uploads/products/11.jpg', NULL, 'vivo X100 Pro，天玑9300，蔡司影像，一英寸主摄', '2023-11-13', 4999.0, 1, 11, 0, 0, 0, 0, NOW(), NOW(), 0);
INSERT INTO `product_model` VALUES (12, 'MacBook Pro 14', 1, 2, '/uploads/products/12.jpg', NULL, 'MacBook Pro 14英寸，M3 Pro芯片，18小时续航，Liquid Retina XDR显示屏', '2023-11-07', 16999.0, 1, 12, 0, 0, 0, 0, NOW(), NOW(), 0);
INSERT INTO `product_model` VALUES (13, 'MacBook Air 15', 1, 2, '/uploads/products/13.jpg', NULL, 'MacBook Air 15英寸，M3芯片，轻薄设计，18小时续航', '2023-06-05', 10999.0, 1, 13, 0, 0, 0, 0, NOW(), NOW(), 0);
INSERT INTO `product_model` VALUES (14, 'ThinkPad X1 Carbon', 8, 2, '/uploads/products/14.jpg', NULL, 'ThinkPad X1 Carbon Gen 11，轻薄商务本，14英寸2.8K OLED屏', '2023-06-01', 12999.0, 1, 14, 0, 0, 0, 0, NOW(), NOW(), 0);
INSERT INTO `product_model` VALUES (15, 'ROG Zephyrus G16', 9, 2, '/uploads/products/15.jpg', NULL, 'ROG幻16，RTX 4070，16英寸星云屏，电竞游戏本', '2024-01-01', 15999.0, 1, 15, 0, 0, 0, 0, NOW(), NOW(), 0);
INSERT INTO `product_model` VALUES (16, 'iPad Pro 12.9', 1, 5, '/uploads/products/16.jpg', NULL, 'iPad Pro 12.9英寸，M2芯片，Liquid Retina XDR显示屏，ProMotion自适应刷新率', '2022-10-26', 9299.0, 1, 16, 0, 0, 0, 0, NOW(), NOW(), 0);
INSERT INTO `product_model` VALUES (17, 'iPad Air 5', 1, 5, '/uploads/products/17.jpg', NULL, 'iPad Air 5，M1芯片，10.9英寸全面屏，支持Apple Pencil', '2022-03-18', 4799.0, 1, 17, 0, 0, 0, 0, NOW(), NOW(), 0);
INSERT INTO `product_model` VALUES (18, 'AirPods Pro 2', 1, 4, '/uploads/products/18.jpg', NULL, 'AirPods Pro第二代，H2芯片，主动降噪，自适应通透模式', '2022-09-23', 1899.0, 1, 18, 0, 0, 0, 0, NOW(), NOW(), 0);
INSERT INTO `product_model` VALUES (19, 'WH-1000XM5', 7, 4, '/uploads/products/19.jpg', NULL, '索尼WH-1000XM5，业界领先降噪，30小时续航，Hi-Res音质', '2022-05-20', 2499.0, 1, 19, 0, 0, 0, 0, NOW(), NOW(), 0);
INSERT INTO `product_model` VALUES (20, 'Apple Watch Ultra 2', 1, 6, '/uploads/products/20.jpg', NULL, 'Apple Watch Ultra 2，钛金属表壳，双频GPS，100米防水', '2023-09-22', 6499.0, 1, 20, 0, 0, 0, 0, NOW(), NOW(), 0);

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
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '产品型号属性值表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of product_model_attribute (真实数据)
-- ----------------------------
INSERT INTO `product_model_attribute` VALUES (1, 1, 1, '6.7', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (2, 1, 2, 'A17 Pro', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (3, 1, 3, 'LTPO', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (4, 1, 4, '4422', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (5, 1, 5, '1', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (6, 1, 6, '5', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (7, 1, 7, '8', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (8, 1, 8, '256', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (9, 1, 9, '4800', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (10, 1, 10, '1200', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (11, 1, 11, '2796x1290', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (12, 1, 12, '120', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (13, 1, 24, '221', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (14, 1, 25, 'iOS', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (15, 2, 1, '6.1', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (16, 2, 2, 'A17 Pro', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (17, 2, 3, 'LTPO', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (18, 2, 4, '3274', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (19, 2, 5, '1', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (20, 2, 6, '5', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (21, 2, 7, '8', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (22, 2, 8, '128', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (23, 2, 9, '4800', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (24, 2, 10, '1200', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (25, 2, 11, '2556x1179', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (26, 2, 12, '120', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (27, 2, 24, '187', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (28, 2, 25, 'iOS', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (29, 3, 1, '6.1', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (30, 3, 2, 'A16', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (31, 3, 3, 'OLED', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (32, 3, 4, '3349', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (33, 3, 5, '1', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (34, 3, 6, '5', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (35, 3, 7, '6', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (36, 3, 8, '128', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (37, 3, 9, '4800', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (38, 3, 10, '1200', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (39, 3, 11, '2556x1179', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (40, 3, 12, '60', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (41, 3, 24, '171', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (42, 3, 25, 'iOS', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (43, 4, 1, '6.82', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (44, 4, 2, 'Kirin 9000S', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (45, 4, 3, 'OLED', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (46, 4, 4, '5000', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (47, 4, 5, '1', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (48, 4, 6, '5', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (49, 4, 7, '16', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (50, 4, 8, '512', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (51, 4, 9, '4800', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (52, 4, 10, '1300', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (53, 4, 11, '2720x1260', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (54, 4, 12, '120', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (55, 4, 24, '225', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (56, 4, 25, 'HarmonyOS', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (57, 5, 1, '6.82', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (58, 5, 2, 'Kirin 9000S', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (59, 5, 3, 'OLED', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (60, 5, 4, '5000', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (61, 5, 5, '1', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (62, 5, 6, '5', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (63, 5, 7, '12', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (64, 5, 8, '256', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (65, 5, 9, '5000', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (66, 5, 10, '1300', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (67, 5, 11, '2720x1260', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (68, 5, 12, '120', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (69, 5, 24, '225', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (70, 5, 25, 'HarmonyOS', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (71, 6, 1, '6.73', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (72, 6, 2, 'Snapdragon 8 Gen 3', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (73, 6, 3, 'AMOLED', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (74, 6, 4, '5000', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (75, 6, 5, '1', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (76, 6, 6, '5', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (77, 6, 7, '16', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (78, 6, 8, '512', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (79, 6, 9, '5000', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (80, 6, 10, '3200', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (81, 6, 11, '3200x1440', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (82, 6, 12, '120', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (83, 6, 24, '219', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (84, 6, 25, 'Android', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (85, 7, 1, '6.73', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (86, 7, 2, 'Snapdragon 8 Gen 3', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (87, 7, 3, 'AMOLED', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (88, 7, 4, '4880', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (89, 7, 5, '1', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (90, 7, 6, '5', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (91, 7, 7, '16', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (92, 7, 8, '256', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (93, 7, 9, '5000', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (94, 7, 10, '3200', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (95, 7, 11, '3200x1440', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (96, 7, 12, '120', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (97, 7, 24, '223', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (98, 7, 25, 'Android', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (99, 8, 1, '6.36', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (100, 8, 2, 'Snapdragon 8 Gen 3', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (101, 8, 3, 'OLED', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (102, 8, 4, '4610', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (103, 8, 5, '1', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (104, 8, 6, '5', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (105, 8, 7, '16', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (106, 8, 8, '256', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (107, 8, 9, '5000', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (108, 8, 10, '3200', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (109, 8, 11, '2670x1200', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (110, 8, 12, '120', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (111, 8, 24, '193', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (112, 8, 25, 'Android', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (113, 9, 1, '6.8', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (114, 9, 2, 'Snapdragon 8 Gen 3', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (115, 9, 3, 'AMOLED', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (116, 9, 4, '5000', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (117, 9, 5, '1', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (118, 9, 6, '5', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (119, 9, 7, '12', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (120, 9, 8, '256', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (121, 9, 9, '20000', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (122, 9, 10, '1200', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (123, 9, 11, '3120x1440', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (124, 9, 12, '120', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (125, 9, 24, '232', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (126, 9, 25, 'Android', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (127, 10, 1, '6.82', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (128, 10, 2, 'Snapdragon 8 Gen 3', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (129, 10, 3, 'AMOLED', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (130, 10, 4, '5000', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (131, 10, 5, '1', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (132, 10, 6, '5', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (133, 10, 7, '16', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (134, 10, 8, '256', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (135, 10, 9, '5000', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (136, 10, 10, '3200', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (137, 10, 11, '3168x1440', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (138, 10, 12, '120', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (139, 10, 24, '221', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (140, 10, 25, 'Android', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (141, 11, 1, '6.78', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (142, 11, 2, 'Dimensity 9300', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (143, 11, 3, 'AMOLED', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (144, 11, 4, '5400', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (145, 11, 5, '1', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (146, 11, 6, '5', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (147, 11, 7, '12', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (148, 11, 8, '256', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (149, 11, 9, '5000', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (150, 11, 10, '3200', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (151, 11, 11, '2800x1260', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (152, 11, 12, '120', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (153, 11, 24, '221', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (154, 11, 25, 'Android', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (155, 12, 1, '14.2', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (156, 12, 2, 'M3 Pro', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (157, 12, 7, '18', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (158, 12, 8, '512', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (159, 12, 11, '3024x1964', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (160, 12, 12, '120', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (161, 12, 24, '1600', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (162, 12, 25, 'macOS', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (163, 13, 1, '15.3', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (164, 13, 2, 'M3', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (165, 13, 7, '8', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (166, 13, 8, '256', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (167, 13, 11, '2880x1864', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (168, 13, 12, '60', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (169, 13, 24, '1510', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (170, 13, 25, 'macOS', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (171, 14, 1, '14', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (172, 14, 2, 'Intel Core i7-1365U', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (173, 14, 7, '32', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (174, 14, 8, '512', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (175, 14, 11, '2880x1800', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (176, 14, 12, '60', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (177, 14, 24, '1120', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (178, 14, 25, 'Windows', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (179, 15, 1, '16', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (180, 15, 2, 'Intel Core i9-14900HX', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (181, 15, 14, 'RTX 4070', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (182, 15, 7, '32', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (183, 15, 8, '1024', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (184, 15, 11, '2560x1600', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (185, 15, 12, '240', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (186, 15, 24, '2100', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (187, 15, 25, 'Windows', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (188, 16, 1, '12.9', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (189, 16, 2, 'M2', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (190, 16, 7, '8', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (191, 16, 8, '256', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (192, 16, 11, '2732x2048', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (193, 16, 12, '120', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (194, 16, 24, '682', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (195, 16, 25, 'iPadOS', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (196, 17, 1, '10.9', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (197, 17, 2, 'M1', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (198, 17, 7, '8', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (199, 17, 8, '64', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (200, 17, 11, '2360x1640', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (201, 17, 12, '60', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (202, 17, 24, '461', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (203, 17, 25, 'iPadOS', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (204, 18, 4, '6', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (205, 18, 20, '1', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (206, 18, 21, '1', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (207, 18, 22, '1', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (208, 18, 23, 'IPX4', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (209, 18, 24, '5.3', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (210, 18, 25, 'iOS', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (211, 19, 4, '30', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (212, 19, 20, '1', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (213, 19, 21, '2', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (214, 19, 22, '1,2', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (215, 19, 23, 'IPX4', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (216, 19, 24, '250', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (217, 19, 25, 'Android', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (218, 20, 1, '1.92', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (219, 20, 2, 'S9', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (220, 20, 4, '36', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (221, 20, 23, '100m', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (222, 20, 24, '61.3', NOW(), NOW());
INSERT INTO `product_model_attribute` VALUES (223, 20, 25, 'watchOS', NOW(), NOW());

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
) ENGINE = InnoDB AUTO_INCREMENT = 9 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '商品表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of goods (真实数据)
-- ----------------------------
INSERT INTO `goods` VALUES (1, 'iPhone 15 Pro Max 256GB 原色钛金属', 1, 1, 1, '99新，无划痕，配件齐全，电池健康度100%，支持验机', '["/uploads/goods/1.jpg"]', 8999.0, 9999.0, 10, '全新未拆封', 1, 1, 1, '北京', 1, 279, 34, 1, NULL, NOW(), NOW(), 0);
INSERT INTO `goods` VALUES (2, '华为 Mate 60 Pro+ 512GB 雅丹黑', 2, 4, 1, '95新，轻微使用痕迹，卫星通话功能正常，配件齐全', '["/uploads/goods/2.jpg"]', 7999.0, 8999.0, 9, '轻微划痕', 1, 0, 1, '上海', 1, 519, 74, 1, NULL, NOW(), NOW(), 0);
INSERT INTO `goods` VALUES (3, '小米14 Ultra 16+512 黑色', 3, 6, 1, '99新，全套配件，徕卡影像系统，摄影爱好者必入', '["/uploads/goods/3.jpg"]', 5999.0, 6499.0, 10, '几乎全新', 1, 1, 0, '深圳', 1, 465, 20, 1, NULL, NOW(), NOW(), 0);
INSERT INTO `goods` VALUES (4, 'MacBook Pro 14 M3 Pro 18+512 深空黑', 1, 12, 2, '95新，电池健康度98%，屏幕完美无划痕，开发利器', '["/uploads/goods/4.jpg"]', 14999.0, 16999.0, 9, '正常使用痕迹', 1, 1, 1, '北京', 1, 279, 34, 1, NULL, NOW(), NOW(), 0);
INSERT INTO `goods` VALUES (5, 'iPad Pro 12.9 M2 256GB 深空灰', 2, 16, 5, '99新，带Apple Pencil二代，屏幕完美，生产力工具', '["/uploads/goods/5.jpg"]', 7999.0, 9299.0, 10, '屏幕完美', 1, 1, 1, '广州', 1, 230, 85, 1, NULL, NOW(), NOW(), 0);
INSERT INTO `goods` VALUES (6, 'AirPods Pro 2 主动降噪版', 3, 18, 4, '全新未拆封，H2芯片，降噪效果一流', '["/uploads/goods/6.jpg"]', 1699.0, 1899.0, 10, '全新', 1, 1, 0, '深圳', 1, 293, 48, 1, NULL, NOW(), NOW(), 0);
INSERT INTO `goods` VALUES (7, '索尼 WH-1000XM5 头戴式降噪耳机 黑色', 1, 19, 4, '95新，降噪效果极佳，30小时续航，音质出众', '["/uploads/goods/7.jpg"]', 1999.0, 2499.0, 9, '耳罩轻微磨损', 1, 0, 1, '上海', 1, 65, 20, 1, NULL, NOW(), NOW(), 0);
INSERT INTO `goods` VALUES (8, '三星 Galaxy S24 Ultra 12+256 钛灰色', 2, 9, 1, '99新，国行在保，S Pen书写流畅，2亿像素相机', '["/uploads/goods/8.jpg"]', 8499.0, 9699.0, 10, '完美成色', 1, 1, 1, '北京', 1, 285, 40, 1, NULL, NOW(), NOW(), 0);

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
) ENGINE = InnoDB AUTO_INCREMENT = 9 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = 'Banner table' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of banner
-- ----------------------------
INSERT INTO `banner` VALUES (1, '/uploads/banners/1.jpg', '新品首发', '/pages-sub/trade/product/list?tag=new', 1, 1, NOW(), NOW());
INSERT INTO `banner` VALUES (2, '/uploads/banners/2.jpg', '限时特惠', '/pages-sub/trade/product/list?tag=sale', 2, 1, NOW(), NOW());
INSERT INTO `banner` VALUES (3, '/uploads/banners/3.jpg', '品牌专区', '/pages-sub/search/category', 3, 1, NOW(), NOW());
INSERT INTO `banner` VALUES (4, '/uploads/banners/4.jpg', '二手好物', '/pages-sub/trade/product/list', 4, 1, NOW(), NOW());

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
) ENGINE = InnoDB AUTO_INCREMENT = 6 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '用户表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES (1, '13800138001', '$2a$10$2N2IqJDgIMPR9g6b1WEENOrK0jtWH.WWNpIP8.KwpEj2u8Er3/Iq2', '数码达人', '/avatars/user1.jpg', 1, '1991-01-01', '热爱数码，分享生活', 1, NOW(), NULL, NOW(), NOW(), 0);
INSERT INTO `user` VALUES (2, '13800138002', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5EH', '摄影爱好者', '/avatars/user2.jpg', 1, NULL, '用镜头记录世界', 1, NULL, NULL, NOW(), NOW(), 0);
INSERT INTO `user` VALUES (3, '13800138003', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5EH', '科技控', '/avatars/user3.jpg', 2, NULL, '追求极致体验', 1, NULL, NULL, NOW(), NOW(), 0);
INSERT INTO `user` VALUES (4, '13800138000', '$2a$10$SfM9Bz4ZspGALol4/QWRCOSJpMjx3.lVYRKm4Xz/5kM9ekEgNb.u2', 'testuser', NULL, 0, NULL, NULL, 1, NULL, NULL, NOW(), NOW(), 0);
INSERT INTO `user` VALUES (5, '13900139001', '$2a$10$nvF9ATDwCAqnh54dy6E66.lDHpnmmlDmVNP0zvdjXksRVD05YhLFq', 'testuser1', NULL, 0, NULL, NULL, 1, NOW(), NULL, NOW(), NOW(), 0);

SET FOREIGN_KEY_CHECKS = 1;
