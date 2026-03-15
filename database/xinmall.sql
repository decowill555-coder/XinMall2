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

 Date: 15/03/2026 18:15:46
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for attribute
-- ----------------------------
DROP TABLE IF EXISTS `attribute`;
CREATE TABLE `attribute`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '属性ID',
  `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '属性名称（如：屏幕尺寸、处理器、电池容量）',
  `unit` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '单位（如：英寸、mAh、GB）',
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
INSERT INTO `attribute` VALUES (1, '屏幕尺寸', '英寸', 2, 1, 1, '2026-03-12 20:47:36', '2026-03-12 20:47:36');
INSERT INTO `attribute` VALUES (2, '处理器型号', NULL, 1, 2, 1, '2026-03-12 20:47:36', '2026-03-12 20:47:36');
INSERT INTO `attribute` VALUES (3, '屏幕类型', NULL, 3, 3, 1, '2026-03-12 20:47:36', '2026-03-12 20:47:36');
INSERT INTO `attribute` VALUES (4, '电池容量', 'mAh', 2, 4, 1, '2026-03-12 20:47:36', '2026-03-12 20:47:36');
INSERT INTO `attribute` VALUES (5, '是否支持快充', NULL, 5, 5, 1, '2026-03-12 20:47:36', '2026-03-12 20:47:36');
INSERT INTO `attribute` VALUES (6, '网络制式', NULL, 4, 6, 1, '2026-03-12 20:47:36', '2026-03-12 20:47:36');
INSERT INTO `attribute` VALUES (7, '运行内存', 'GB', 2, 7, 1, '2026-03-12 20:47:36', '2026-03-12 20:47:36');
INSERT INTO `attribute` VALUES (8, '存储容量', 'GB', 2, 8, 1, '2026-03-12 20:47:36', '2026-03-12 20:47:36');
INSERT INTO `attribute` VALUES (9, '后置摄像头', '万像素', 2, 9, 1, '2026-03-12 20:47:36', '2026-03-12 20:47:36');
INSERT INTO `attribute` VALUES (10, '前置摄像头', '万像素', 2, 10, 1, '2026-03-12 20:47:36', '2026-03-12 20:47:36');
INSERT INTO `attribute` VALUES (11, '屏幕分辨率', NULL, 1, 11, 1, '2026-03-12 20:47:36', '2026-03-12 20:47:36');
INSERT INTO `attribute` VALUES (12, '刷新率', 'Hz', 2, 12, 1, '2026-03-12 20:47:36', '2026-03-12 20:47:36');
INSERT INTO `attribute` VALUES (13, 'CPU型号', NULL, 1, 13, 1, '2026-03-12 20:47:36', '2026-03-12 20:47:36');
INSERT INTO `attribute` VALUES (14, '显卡型号', NULL, 1, 14, 1, '2026-03-12 20:47:36', '2026-03-12 20:47:36');
INSERT INTO `attribute` VALUES (15, '硬盘容量', 'GB', 2, 15, 1, '2026-03-12 20:47:36', '2026-03-12 20:47:36');
INSERT INTO `attribute` VALUES (16, '有效像素', '万像素', 2, 16, 1, '2026-03-12 20:47:36', '2026-03-12 20:47:36');
INSERT INTO `attribute` VALUES (17, '传感器尺寸', NULL, 1, 17, 1, '2026-03-12 20:47:36', '2026-03-12 20:47:36');
INSERT INTO `attribute` VALUES (18, '镜头卡口', NULL, 1, 18, 1, '2026-03-12 20:47:36', '2026-03-12 20:47:36');
INSERT INTO `attribute` VALUES (19, '续航时间', '小时', 2, 19, 1, '2026-03-12 20:47:36', '2026-03-12 20:47:36');
INSERT INTO `attribute` VALUES (20, '降噪功能', NULL, 5, 20, 1, '2026-03-12 20:47:36', '2026-03-12 20:47:36');
INSERT INTO `attribute` VALUES (21, '佩戴方式', NULL, 3, 21, 1, '2026-03-12 20:47:36', '2026-03-12 20:47:36');
INSERT INTO `attribute` VALUES (22, '连接方式', NULL, 4, 22, 1, '2026-03-12 20:47:36', '2026-03-12 20:47:36');
INSERT INTO `attribute` VALUES (23, '防水等级', NULL, 1, 23, 1, '2026-03-12 20:47:36', '2026-03-12 20:47:36');
INSERT INTO `attribute` VALUES (24, '重量', 'g', 2, 24, 1, '2026-03-12 20:47:36', '2026-03-12 20:47:36');
INSERT INTO `attribute` VALUES (25, '操作系统', NULL, 1, 25, 1, '2026-03-12 20:47:36', '2026-03-12 20:47:36');

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
) ENGINE = InnoDB AUTO_INCREMENT = 9 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = 'Banner table' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of banner
-- ----------------------------
INSERT INTO `banner` VALUES (1, 'https://picsum.photos/750/300?random=1', '新品首发', '/pages-sub/trade/product/list?tag=new', 1, 1, '2026-03-15 14:02:03', '2026-03-15 14:02:03');
INSERT INTO `banner` VALUES (2, 'https://picsum.photos/750/300?random=2', '限时特惠', '/pages-sub/trade/product/list?tag=sale', 2, 1, '2026-03-15 14:02:03', '2026-03-15 14:02:03');
INSERT INTO `banner` VALUES (3, 'https://picsum.photos/750/300?random=3', '品牌专区', '/pages-sub/search/category', 3, 1, '2026-03-15 14:02:03', '2026-03-15 14:02:03');
INSERT INTO `banner` VALUES (4, 'https://picsum.photos/750/300?random=4', '二手好物', '/pages-sub/trade/product/list', 4, 1, '2026-03-15 14:02:03', '2026-03-15 14:02:03');

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
INSERT INTO `brand` VALUES (1, '苹果', '/brands/apple.png', 'Apple Inc.', 1, 1, '2026-03-12 20:47:36', '2026-03-12 20:47:36');
INSERT INTO `brand` VALUES (2, '华为', '/brands/huawei.png', 'Huawei', 2, 1, '2026-03-12 20:47:36', '2026-03-12 20:47:36');
INSERT INTO `brand` VALUES (3, '小米', '/brands/xiaomi.png', 'Xiaomi', 3, 1, '2026-03-12 20:47:36', '2026-03-12 20:47:36');
INSERT INTO `brand` VALUES (4, '三星', '/brands/samsung.png', 'Samsung', 4, 1, '2026-03-12 20:47:36', '2026-03-12 20:47:36');
INSERT INTO `brand` VALUES (5, 'OPPO', '/brands/oppo.png', 'OPPO', 5, 1, '2026-03-12 20:47:36', '2026-03-12 20:47:36');
INSERT INTO `brand` VALUES (6, 'vivo', '/brands/vivo.png', 'vivo', 6, 1, '2026-03-12 20:47:36', '2026-03-12 20:47:36');
INSERT INTO `brand` VALUES (7, '索尼', '/brands/sony.png', 'Sony', 7, 1, '2026-03-12 20:47:36', '2026-03-12 20:47:36');
INSERT INTO `brand` VALUES (8, '联想', '/brands/lenovo.png', 'Lenovo', 8, 1, '2026-03-12 20:47:36', '2026-03-12 20:47:36');
INSERT INTO `brand` VALUES (9, '华硕', '/brands/asus.png', 'ASUS', 9, 1, '2026-03-12 20:47:36', '2026-03-12 20:47:36');
INSERT INTO `brand` VALUES (10, '戴尔', '/brands/dell.png', 'Dell', 10, 1, '2026-03-12 20:47:36', '2026-03-12 20:47:36');

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
) ENGINE = InnoDB AUTO_INCREMENT = 60 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '品牌分类关联表' ROW_FORMAT = DYNAMIC;

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
  `parent_id` bigint NULL DEFAULT 0 COMMENT '父分类ID，0表示顶级',
  `level` tinyint NULL DEFAULT 1 COMMENT '层级 1-一级 2-二级 3-三级',
  `icon` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '分类图标',
  `image` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '分类图片',
  `sort` int NULL DEFAULT 0 COMMENT '排序',
  `status` tinyint NULL DEFAULT 1 COMMENT '状态 1-启用 0-禁用',
  `created_at` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_parent_id`(`parent_id` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 14 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '设备分类表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of category
-- ----------------------------
INSERT INTO `category` VALUES (1, '手机', 0, 1, '/icons/phone.png', NULL, 1, 1, '2026-03-12 20:47:36', '2026-03-12 20:47:36');
INSERT INTO `category` VALUES (2, '电脑', 0, 1, '/icons/computer.png', NULL, 2, 1, '2026-03-12 20:47:36', '2026-03-12 20:47:36');
INSERT INTO `category` VALUES (3, '相机', 0, 1, '/icons/camera.png', NULL, 3, 1, '2026-03-12 20:47:36', '2026-03-12 20:47:36');
INSERT INTO `category` VALUES (4, '耳机', 0, 1, '/icons/headphone.png', NULL, 4, 1, '2026-03-12 20:47:36', '2026-03-12 20:47:36');
INSERT INTO `category` VALUES (5, '平板', 0, 1, '/icons/tablet.png', NULL, 5, 1, '2026-03-12 20:47:36', '2026-03-12 20:47:36');
INSERT INTO `category` VALUES (6, '智能手表', 0, 1, '/icons/watch.png', NULL, 6, 1, '2026-03-12 20:47:36', '2026-03-12 20:47:36');
INSERT INTO `category` VALUES (7, '游戏手机', 1, 2, NULL, NULL, 1, 1, '2026-03-12 20:47:36', '2026-03-12 20:47:36');
INSERT INTO `category` VALUES (8, '轻薄手机', 1, 2, NULL, NULL, 2, 1, '2026-03-12 20:47:36', '2026-03-12 20:47:36');
INSERT INTO `category` VALUES (9, '拍照手机', 1, 2, NULL, NULL, 3, 1, '2026-03-12 20:47:36', '2026-03-12 20:47:36');
INSERT INTO `category` VALUES (11, '游戏手机', 1, 2, NULL, NULL, 1, 1, '2026-03-14 18:13:46', '2026-03-14 18:13:46');
INSERT INTO `category` VALUES (12, '拍照手机', 1, 2, NULL, NULL, 2, 1, '2026-03-14 18:13:46', '2026-03-14 18:13:46');
INSERT INTO `category` VALUES (13, '商务手机', 1, 2, NULL, NULL, 3, 1, '2026-03-14 18:13:46', '2026-03-14 18:13:46');

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
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '收藏表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of collection
-- ----------------------------

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
) ENGINE = InnoDB AUTO_INCREMENT = 9 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '评论表' ROW_FORMAT = Dynamic;

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
) ENGINE = InnoDB AUTO_INCREMENT = 10 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '评论点赞表' ROW_FORMAT = Dynamic;

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
) ENGINE = InnoDB AUTO_INCREMENT = 8 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '社区表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of community
-- ----------------------------
INSERT INTO `community` VALUES (1, 'iPhone 15 Pro Max 圈子', 'model', 'iPhone 15 Pro Max 用户交流社区，分享使用心得、技巧和问题', 'https://example.com/community/iphone15pm.jpg', 1, 1, 1, 2500, 80, 1, '2026-03-14 18:13:46', '2026-03-14 18:13:46');
INSERT INTO `community` VALUES (2, 'iPhone 15 Pro 圈子', 'model', 'iPhone 15 Pro 用户交流社区', 'https://example.com/community/iphone15p.jpg', 2, 1, 1, 2000, 60, 1, '2026-03-14 18:13:46', '2026-03-14 18:13:46');
INSERT INTO `community` VALUES (3, '小米发烧友', 'model', '小米手机爱好者社区，分享MIUI技巧和玩机心得', 'https://example.com/community/xiaomi.jpg', 4, 0, 2, 1200, 45, 1, '2026-03-14 18:13:46', '2026-03-14 18:13:46');
INSERT INTO `community` VALUES (4, '华为Mate60 圈子', 'model', '华为Mate60系列用户交流', 'https://example.com/community/mate60.jpg', 6, 0, 4, 1800, 55, 1, '2026-03-14 18:13:46', '2026-03-14 18:13:46');
INSERT INTO `community` VALUES (5, '数码交易交流', 'user', '二手数码交易交流社区，诚信交易', 'https://example.com/community/trade.jpg', NULL, 0, 5, 500, 100, 1, '2026-03-14 18:13:46', '2026-03-14 18:13:46');
INSERT INTO `community` VALUES (6, 'MacBook 用户群', 'model', 'MacBook 用户交流社区', 'https://example.com/community/macbook.jpg', 8, 1, 1, 500, 20, 1, '2026-03-14 18:13:46', '2026-03-14 18:13:46');
INSERT INTO `community` VALUES (7, '摄影爱好者', 'user', '手机摄影爱好者交流社区', 'https://example.com/community/photo.jpg', NULL, 0, 3, 800, 50, 1, '2026-03-14 18:13:46', '2026-03-14 18:13:46');

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
) ENGINE = InnoDB AUTO_INCREMENT = 14 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '社区成员表' ROW_FORMAT = Dynamic;

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
) ENGINE = InnoDB AUTO_INCREMENT = 11 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '会话表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of conversation
-- ----------------------------
INSERT INTO `conversation` VALUES (1, 1, 2, '好的，明天发货', 1, '2026-03-15 10:30:00', 0, 0, 0, 0, '2026-03-14 09:00:00', '2026-03-15 17:11:59');
INSERT INTO `conversation` VALUES (2, 1, 3, 'http://localhost:8080/uploads/2026/03/15/91ec7047f2544f0cb55454e7168d2400.jpg', 2, '2026-03-15 16:52:16', 0, 0, 0, 0, '2026-03-13 14:00:00', '2026-03-15 17:11:54');
INSERT INTO `conversation` VALUES (3, 1, 5, 'http://localhost:8080/uploads/2026/03/15/824ac90c169f4276a4e430cd87efb9d7.jpg', 2, '2026-03-15 16:44:45', 0, 1, 0, 0, '2026-03-10 11:00:00', '2026-03-15 17:12:21');
INSERT INTO `conversation` VALUES (4, 2, 1, '好的，明天发货', 1, '2026-03-15 10:30:00', 0, 0, 0, 0, '2026-03-14 09:00:00', '2026-03-15 10:30:00');
INSERT INTO `conversation` VALUES (5, 2, 3, '请问这个相机还在吗？', 1, '2026-03-14 15:00:00', 3, 0, 1, 0, '2026-03-12 10:00:00', '2026-03-14 15:00:00');
INSERT INTO `conversation` VALUES (6, 3, 1, 'http://localhost:8080/uploads/2026/03/15/91ec7047f2544f0cb55454e7168d2400.jpg', 2, '2026-03-15 16:52:16', 3, 0, 0, 0, '2026-03-13 14:00:00', '2026-03-15 16:52:15');
INSERT INTO `conversation` VALUES (7, 3, 2, '请问这个相机还在吗？', 1, '2026-03-14 15:00:00', 0, 0, 0, 0, '2026-03-12 10:00:00', '2026-03-14 15:00:00');
INSERT INTO `conversation` VALUES (8, 3, 5, '好的，已收到款项', 1, '2026-03-13 11:30:00', 0, 0, 0, 0, '2026-03-11 09:00:00', '2026-03-13 11:30:00');
INSERT INTO `conversation` VALUES (9, 5, 1, 'http://localhost:8080/uploads/2026/03/15/824ac90c169f4276a4e430cd87efb9d7.jpg', 2, '2026-03-15 16:44:45', 6, 0, 0, 0, '2026-03-10 11:00:00', '2026-03-15 16:44:45');
INSERT INTO `conversation` VALUES (10, 5, 3, '好的，已收到款项', 1, '2026-03-13 11:30:00', 2, 0, 0, 0, '2026-03-11 09:00:00', '2026-03-13 11:30:00');

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
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '评价表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of evaluation
-- ----------------------------

-- ----------------------------
-- Table structure for goods
-- ----------------------------
DROP TABLE IF EXISTS `goods`;
CREATE TABLE `goods`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '商品ID',
  `title` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '商品标题',
  `seller_id` bigint NOT NULL COMMENT '卖家ID',
  `model_id` bigint NULL DEFAULT NULL COMMENT '关联产品型号ID（可选）',
  `category_id` bigint NULL DEFAULT NULL COMMENT '分类ID（可选）',
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL COMMENT '商品描述',
  `images` json NULL COMMENT '图片列表',
  `price` decimal(10, 2) NOT NULL COMMENT '售价',
  `original_price` decimal(10, 2) NULL DEFAULT NULL COMMENT '原价（展示用）',
  `condition_level` tinyint NULL DEFAULT 10 COMMENT '成色 1-10，10为全新',
  `condition_desc` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '成色描述',
  `warranty` tinyint NULL DEFAULT 0 COMMENT '是否保修 0-否 1-是',
  `invoice` tinyint NULL DEFAULT 0 COMMENT '是否有发票 0-否 1-是',
  `can_bargain` tinyint NULL DEFAULT 1 COMMENT '是否可议价 0-否 1-是',
  `location` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '发货地',
  `stock` int NULL DEFAULT 1 COMMENT '库存，默认1件',
  `view_count` int NULL DEFAULT 0 COMMENT '浏览量',
  `like_count` int NULL DEFAULT 0 COMMENT '收藏数',
  `status` tinyint NULL DEFAULT 1 COMMENT '状态 1-在售 2-已售 0-下架 3-审核中',
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
-- Records of goods
-- ----------------------------
INSERT INTO `goods` VALUES (1, 'iPhone 15 Pro Max 256GB 原色钛金属', 1, 1, 1, '99新，无划痕，配件齐全', '[\"https://picsum.photos/400/400?random=1\"]', 8999.00, 9999.00, 10, '全新未拆封', 1, 1, 1, '北京', 1, 160, 23, 1, NULL, '2026-03-15 14:19:30', '2026-03-15 17:12:13', 0);
INSERT INTO `goods` VALUES (2, '华为 Mate 60 Pro+ 512GB', 2, 4, 1, '95新，轻微使用痕迹', '[\"https://picsum.photos/400/400?random=2\"]', 7999.00, 8999.00, 9, '轻微划痕', 1, 0, 1, '上海', 1, 90, 12, 1, NULL, '2026-03-15 14:19:30', '2026-03-15 16:26:11', 0);
INSERT INTO `goods` VALUES (3, '小米14 Ultra 16+512 黑色', 3, 6, 1, '99新，全套配件', '[\"https://picsum.photos/400/400?random=3\"]', 5999.00, 6499.00, 10, '几乎全新', 1, 1, 0, '深圳', 1, 234, 45, 1, NULL, '2026-03-15 14:19:30', '2026-03-15 14:19:30', 0);
INSERT INTO `goods` VALUES (4, 'MacBook Pro 14 M3 Pro', 1, 12, 2, '95新，电池健康度98%', '[\"https://picsum.photos/400/400?random=4\"]', 14999.00, 16999.00, 9, '正常使用痕迹', 1, 1, 1, '北京', 1, 67, 8, 1, NULL, '2026-03-15 14:19:30', '2026-03-15 14:19:30', 0);
INSERT INTO `goods` VALUES (5, 'iPad Pro 12.9 M2 256GB', 2, 16, 5, '99新，带Apple Pencil', '[\"https://picsum.photos/400/400?random=5\"]', 7999.00, 9299.00, 10, '屏幕完美', 1, 1, 1, '广州', 1, 123, 19, 1, NULL, '2026-03-15 14:19:30', '2026-03-15 14:19:30', 0);
INSERT INTO `goods` VALUES (6, 'AirPods Pro 2 主动降噪', 3, 18, 4, '全新未拆封', '[\"https://picsum.photos/400/400?random=6\"]', 1699.00, 1899.00, 10, '全新', 1, 1, 0, '深圳', 1, 456, 78, 1, NULL, '2026-03-15 14:19:30', '2026-03-15 14:19:30', 0);
INSERT INTO `goods` VALUES (7, '索尼 WH-1000XM5 头戴式耳机', 1, 19, 4, '95新，降噪效果极佳', '[\"https://picsum.photos/400/400?random=7\"]', 1999.00, 2499.00, 9, '耳罩轻微磨损', 1, 0, 1, '上海', 1, 89, 15, 1, NULL, '2026-03-15 14:19:30', '2026-03-15 14:19:30', 0);
INSERT INTO `goods` VALUES (8, '三星 Galaxy S24 Ultra', 2, 9, 1, '99新，国行在保', '[\"https://picsum.photos/400/400?random=8\"]', 8499.00, 9699.00, 10, '完美成色', 1, 1, 1, '北京', 1, 178, 32, 1, NULL, '2026-03-15 14:19:30', '2026-03-15 14:19:30', 0);

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
) ENGINE = InnoDB AUTO_INCREMENT = 146 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '消息表' ROW_FORMAT = DYNAMIC;

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
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '订单表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of order
-- ----------------------------

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
) ENGINE = InnoDB AUTO_INCREMENT = 7 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '帖子表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of post
-- ----------------------------
INSERT INTO `post` VALUES (1, 'iPhone 15 Pro Max 开箱体验，钛金属质感太棒了！', '今天收到了新手机，分享一下开箱体验。包装很简洁，手机拿在手里的质感真的很好，钛金属边框摸起来很舒服。屏幕显示效果非常棒，A17 Pro芯片运行流畅，拍照效果也很出色。', 1, 1, 1, '[\"https://example.com/post/1-1.jpg\", \"https://example.com/post/1-2.jpg\"]', '[\"开箱\", \"iPhone15\", \"体验\"]', 5000, 250, 50, 100, 0, 1, 1, '2026-03-14 18:13:46', '2026-03-14 18:13:46');
INSERT INTO `post` VALUES (2, '小米14 Ultra 拍照测评，徕卡色彩真的很德味', '分享一下这款手机的拍照效果，徕卡色彩调教真的很棒，人像模式效果很好，夜景拍摄也很出色。', 2, 3, 4, '[\"https://example.com/post/2-1.jpg\", \"https://example.com/post/2-2.jpg\"]', '[\"拍照\", \"徕卡\", \"测评\"]', 3000, 150, 30, 60, 0, 0, 1, '2026-03-14 18:13:46', '2026-03-14 18:13:46');
INSERT INTO `post` VALUES (3, '二手交易注意事项，总结一些经验', '总结一些二手交易的经验，希望大家都能顺利交易，避免被骗。1. 尽量当面交易 2. 检查机器是否有锁 3. 核对序列号...', 5, 5, NULL, '[]', '[\"交易\", \"经验\", \"注意事项\"]', 2000, 100, 40, 80, 1, 1, 1, '2026-03-14 18:13:46', '2026-03-14 18:13:46');
INSERT INTO `post` VALUES (4, '华为Mate 60 Pro 卫星通话体验', '测试了一下卫星通话功能，虽然平时用不上，但是关键时刻真的能救命。分享一下使用体验...', 4, 4, 6, '[\"https://example.com/post/4-1.jpg\"]', '[\"卫星通话\", \"华为\", \"体验\"]', 4000, 200, 35, 70, 0, 0, 1, '2026-03-14 18:13:46', '2026-03-14 18:13:46');
INSERT INTO `post` VALUES (5, 'MacBook Pro M3 Pro 开发体验', '作为开发者，分享一下M3 Pro MacBook的开发体验，编译速度很快，续航也很给力...', 1, 6, 8, '[\"https://example.com/post/5-1.jpg\"]', '[\"MacBook\", \"开发\", \"M3\"]', 2500, 120, 25, 50, 0, 0, 1, '2026-03-14 18:13:46', '2026-03-14 18:13:46');
INSERT INTO `post` VALUES (6, 'iPhone 15 Pro vs 小米14 Ultra 拍照对比', '两款手机拍照对比，各有特色，分享一下我的使用感受...', 3, 7, NULL, '[\"https://example.com/post/6-1.jpg\", \"https://example.com/post/6-2.jpg\"]', '[\"对比\", \"拍照\", \"iPhone\", \"小米\"]', 6000, 300, 60, 120, 0, 1, 1, '2026-03-14 18:13:46', '2026-03-14 18:13:46');

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
) ENGINE = InnoDB AUTO_INCREMENT = 16 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '帖子点赞表' ROW_FORMAT = Dynamic;

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
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '型号名称（如：iPhone 15 Pro Max）',
  `brand_id` bigint NOT NULL COMMENT '品牌ID',
  `category_id` bigint NOT NULL COMMENT '分类ID（取最细粒度的分类）',
  `cover` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '封面图',
  `images` json NULL COMMENT '图片列表',
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL COMMENT '简介',
  `release_date` date NULL DEFAULT NULL COMMENT '发布日期',
  `reference_price` decimal(10, 2) NULL DEFAULT NULL COMMENT '参考价格',
  `status` tinyint NULL DEFAULT 1 COMMENT '状态 1-在售 2-停售 0-删除',
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
-- Records of product_model
-- ----------------------------
INSERT INTO `product_model` VALUES (1, 'iPhone 15 Pro Max', 1, 1, '/products/iphone15pm.jpg', NULL, 'iPhone 15 Pro Max', '2023-09-22', 9999.00, 1, 1, 0, 0, 0, 0, '2026-03-12 20:47:36', '2026-03-12 20:47:36', 0);
INSERT INTO `product_model` VALUES (2, 'iPhone 15 Pro', 1, 1, '/products/iphone15p.jpg', NULL, 'iPhone 15 Pro', '2023-09-22', 7999.00, 1, 2, 0, 0, 0, 0, '2026-03-12 20:47:36', '2026-03-12 20:47:36', 0);
INSERT INTO `product_model` VALUES (3, 'iPhone 15', 1, 1, '/products/iphone15.jpg', NULL, 'iPhone 15', '2023-09-22', 5999.00, 1, 3, 0, 0, 0, 0, '2026-03-12 20:47:36', '2026-03-12 20:47:36', 0);
INSERT INTO `product_model` VALUES (4, 'Mate 60 Pro+', 2, 1, '/products/mate60pro.jpg', NULL, 'Huawei Mate 60 Pro+', '2023-08-29', 8999.00, 1, 4, 0, 0, 0, 0, '2026-03-12 20:47:36', '2026-03-12 20:47:36', 0);
INSERT INTO `product_model` VALUES (5, 'Mate 60 Pro', 2, 1, '/products/mate60pro.jpg', NULL, 'Huawei Mate 60 Pro', '2023-08-29', 6999.00, 1, 5, 0, 0, 0, 0, '2026-03-12 20:47:36', '2026-03-12 20:47:36', 0);
INSERT INTO `product_model` VALUES (6, 'Xiaomi 14 Ultra', 3, 1, '/products/mi14ultra.jpg', NULL, 'Xiaomi 14 Ultra', '2024-02-22', 6499.00, 1, 6, 0, 0, 0, 0, '2026-03-12 20:47:36', '2026-03-12 20:47:36', 0);
INSERT INTO `product_model` VALUES (7, 'Xiaomi 14 Pro', 3, 1, '/products/mi14pro.jpg', NULL, 'Xiaomi 14 Pro', '2023-10-26', 4999.00, 1, 7, 0, 0, 0, 0, '2026-03-12 20:47:36', '2026-03-12 20:47:36', 0);
INSERT INTO `product_model` VALUES (8, 'Xiaomi 14', 3, 1, '/products/mi14.jpg', NULL, 'Xiaomi 14', '2023-10-26', 3999.00, 1, 8, 0, 0, 0, 0, '2026-03-12 20:47:36', '2026-03-12 20:47:36', 0);
INSERT INTO `product_model` VALUES (9, 'Galaxy S24 Ultra', 4, 1, '/products/s24ultra.jpg', NULL, 'Samsung Galaxy S24 Ultra', '2024-01-17', 9699.00, 1, 9, 0, 0, 0, 0, '2026-03-12 20:47:36', '2026-03-12 20:47:36', 0);
INSERT INTO `product_model` VALUES (10, 'Find X7 Ultra', 5, 1, '/products/findx7ultra.jpg', NULL, 'OPPO Find X7 Ultra', '2024-01-08', 5999.00, 1, 10, 0, 0, 0, 0, '2026-03-12 20:47:36', '2026-03-12 20:47:36', 0);
INSERT INTO `product_model` VALUES (11, 'X100 Pro', 6, 1, '/products/x100pro.jpg', NULL, 'vivo X100 Pro', '2023-11-13', 4999.00, 1, 11, 0, 0, 0, 0, '2026-03-12 20:47:36', '2026-03-12 20:47:36', 0);
INSERT INTO `product_model` VALUES (12, 'MacBook Pro 14', 1, 2, '/products/mbp14.jpg', NULL, 'MacBook Pro 14 M3 Pro', '2023-11-07', 16999.00, 1, 1, 0, 0, 0, 0, '2026-03-12 20:47:36', '2026-03-12 20:47:36', 0);
INSERT INTO `product_model` VALUES (13, 'MacBook Air 15', 1, 2, '/products/mba15.jpg', NULL, 'MacBook Air 15 M3', '2023-06-05', 10999.00, 1, 2, 0, 0, 0, 0, '2026-03-12 20:47:36', '2026-03-12 20:47:36', 0);
INSERT INTO `product_model` VALUES (14, 'ThinkPad X1 Carbon', 8, 2, '/products/x1carbon.jpg', NULL, 'ThinkPad X1 Carbon', '2023-06-01', 12999.00, 1, 3, 0, 0, 0, 0, '2026-03-12 20:47:36', '2026-03-12 20:47:36', 0);
INSERT INTO `product_model` VALUES (15, 'ROG Zephyrus G16', 9, 2, '/products/rog16.jpg', NULL, 'ROG Zephyrus G16', '2024-01-01', 15999.00, 1, 4, 0, 0, 0, 0, '2026-03-12 20:47:36', '2026-03-12 20:47:36', 0);
INSERT INTO `product_model` VALUES (16, 'iPad Pro 12.9', 1, 5, '/products/ipadpro.jpg', NULL, 'iPad Pro 12.9 M2', '2022-10-26', 9299.00, 1, 1, 0, 0, 0, 0, '2026-03-12 20:47:36', '2026-03-12 20:47:36', 0);
INSERT INTO `product_model` VALUES (17, 'iPad Air 5', 1, 5, '/products/ipadair.jpg', NULL, 'iPad Air 5 M1', '2022-03-18', 4799.00, 1, 2, 0, 0, 0, 0, '2026-03-12 20:47:36', '2026-03-12 20:47:36', 0);
INSERT INTO `product_model` VALUES (18, 'AirPods Pro 2', 1, 4, '/products/app2.jpg', NULL, 'AirPods Pro 2nd Gen', '2022-09-23', 1899.00, 1, 1, 0, 0, 0, 0, '2026-03-12 20:47:36', '2026-03-12 20:47:36', 0);
INSERT INTO `product_model` VALUES (19, 'WH-1000XM5', 7, 4, '/products/xm5.jpg', NULL, 'Sony WH-1000XM5', '2022-05-20', 2499.00, 1, 2, 0, 0, 0, 0, '2026-03-12 20:47:36', '2026-03-12 20:47:36', 0);
INSERT INTO `product_model` VALUES (20, 'Apple Watch Ultra 2', 1, 6, '/products/awultra.jpg', NULL, 'Apple Watch Ultra 2', '2023-09-22', 6499.00, 1, 1, 0, 0, 0, 0, '2026-03-12 20:47:36', '2026-03-12 20:47:36', 0);

-- ----------------------------
-- Table structure for product_model_attribute
-- ----------------------------
DROP TABLE IF EXISTS `product_model_attribute`;
CREATE TABLE `product_model_attribute`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `model_id` bigint NOT NULL COMMENT '产品型号ID',
  `attribute_id` bigint NOT NULL COMMENT '属性ID',
  `value` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '属性值（文本/数字/选项ID，多选用逗号分隔）',
  `created_at` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_model_attribute`(`model_id` ASC, `attribute_id` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 85 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '产品型号属性值表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of product_model_attribute
-- ----------------------------
INSERT INTO `product_model_attribute` VALUES (1, 1, 1, '6.7', '2026-03-12 20:47:36', '2026-03-12 20:47:36');
INSERT INTO `product_model_attribute` VALUES (2, 1, 2, 'A17 Pro', '2026-03-12 20:47:36', '2026-03-12 20:47:36');
INSERT INTO `product_model_attribute` VALUES (3, 1, 3, '1', '2026-03-12 20:47:36', '2026-03-12 20:47:36');
INSERT INTO `product_model_attribute` VALUES (4, 1, 4, '4422', '2026-03-12 20:47:36', '2026-03-12 20:47:36');
INSERT INTO `product_model_attribute` VALUES (5, 1, 5, '1', '2026-03-12 20:47:36', '2026-03-12 20:47:36');
INSERT INTO `product_model_attribute` VALUES (6, 1, 6, '4,5', '2026-03-12 20:47:36', '2026-03-12 20:47:36');
INSERT INTO `product_model_attribute` VALUES (7, 1, 7, '8', '2026-03-12 20:47:36', '2026-03-12 20:47:36');
INSERT INTO `product_model_attribute` VALUES (8, 1, 8, '256', '2026-03-12 20:47:36', '2026-03-12 20:47:36');
INSERT INTO `product_model_attribute` VALUES (9, 1, 9, '4800', '2026-03-12 20:47:36', '2026-03-12 20:47:36');
INSERT INTO `product_model_attribute` VALUES (10, 1, 10, '1200', '2026-03-12 20:47:36', '2026-03-12 20:47:36');
INSERT INTO `product_model_attribute` VALUES (11, 1, 11, '2796x1290', '2026-03-12 20:47:36', '2026-03-12 20:47:36');
INSERT INTO `product_model_attribute` VALUES (12, 1, 12, '120', '2026-03-12 20:47:36', '2026-03-12 20:47:36');
INSERT INTO `product_model_attribute` VALUES (13, 1, 24, '221', '2026-03-12 20:47:36', '2026-03-12 20:47:36');
INSERT INTO `product_model_attribute` VALUES (14, 1, 25, 'iOS', '2026-03-12 20:47:36', '2026-03-12 20:47:36');
INSERT INTO `product_model_attribute` VALUES (15, 2, 1, '6.1', '2026-03-12 20:47:36', '2026-03-12 20:47:36');
INSERT INTO `product_model_attribute` VALUES (16, 2, 2, 'A17 Pro', '2026-03-12 20:47:36', '2026-03-12 20:47:36');
INSERT INTO `product_model_attribute` VALUES (17, 2, 3, '1', '2026-03-12 20:47:36', '2026-03-12 20:47:36');
INSERT INTO `product_model_attribute` VALUES (18, 2, 4, '3274', '2026-03-12 20:47:36', '2026-03-12 20:47:36');
INSERT INTO `product_model_attribute` VALUES (19, 2, 5, '1', '2026-03-12 20:47:36', '2026-03-12 20:47:36');
INSERT INTO `product_model_attribute` VALUES (20, 2, 6, '4,5', '2026-03-12 20:47:36', '2026-03-12 20:47:36');
INSERT INTO `product_model_attribute` VALUES (21, 2, 7, '8', '2026-03-12 20:47:36', '2026-03-12 20:47:36');
INSERT INTO `product_model_attribute` VALUES (22, 2, 8, '128', '2026-03-12 20:47:36', '2026-03-12 20:47:36');
INSERT INTO `product_model_attribute` VALUES (23, 2, 24, '187', '2026-03-12 20:47:36', '2026-03-12 20:47:36');
INSERT INTO `product_model_attribute` VALUES (24, 2, 25, 'iOS', '2026-03-12 20:47:36', '2026-03-12 20:47:36');
INSERT INTO `product_model_attribute` VALUES (25, 3, 1, '6.1', '2026-03-12 20:47:36', '2026-03-12 20:47:36');
INSERT INTO `product_model_attribute` VALUES (26, 3, 2, 'A16', '2026-03-12 20:47:36', '2026-03-12 20:47:36');
INSERT INTO `product_model_attribute` VALUES (27, 3, 3, '1', '2026-03-12 20:47:36', '2026-03-12 20:47:36');
INSERT INTO `product_model_attribute` VALUES (28, 3, 4, '3349', '2026-03-12 20:47:36', '2026-03-12 20:47:36');
INSERT INTO `product_model_attribute` VALUES (29, 3, 5, '1', '2026-03-12 20:47:36', '2026-03-12 20:47:36');
INSERT INTO `product_model_attribute` VALUES (30, 3, 6, '4,5', '2026-03-12 20:47:36', '2026-03-12 20:47:36');
INSERT INTO `product_model_attribute` VALUES (31, 3, 7, '6', '2026-03-12 20:47:36', '2026-03-12 20:47:36');
INSERT INTO `product_model_attribute` VALUES (32, 3, 8, '128', '2026-03-12 20:47:36', '2026-03-12 20:47:36');
INSERT INTO `product_model_attribute` VALUES (33, 3, 24, '171', '2026-03-12 20:47:36', '2026-03-12 20:47:36');
INSERT INTO `product_model_attribute` VALUES (34, 3, 25, 'iOS', '2026-03-12 20:47:36', '2026-03-12 20:47:36');
INSERT INTO `product_model_attribute` VALUES (35, 4, 1, '6.82', '2026-03-12 20:47:36', '2026-03-12 20:47:36');
INSERT INTO `product_model_attribute` VALUES (36, 4, 2, 'Kirin 9000S', '2026-03-12 20:47:36', '2026-03-12 20:47:36');
INSERT INTO `product_model_attribute` VALUES (37, 4, 3, '3', '2026-03-12 20:47:36', '2026-03-12 20:47:36');
INSERT INTO `product_model_attribute` VALUES (38, 4, 4, '5000', '2026-03-12 20:47:36', '2026-03-12 20:47:36');
INSERT INTO `product_model_attribute` VALUES (39, 4, 5, '1', '2026-03-12 20:47:36', '2026-03-12 20:47:36');
INSERT INTO `product_model_attribute` VALUES (40, 4, 6, '4,5', '2026-03-12 20:47:36', '2026-03-12 20:47:36');
INSERT INTO `product_model_attribute` VALUES (41, 4, 7, '16', '2026-03-12 20:47:36', '2026-03-12 20:47:36');
INSERT INTO `product_model_attribute` VALUES (42, 4, 8, '512', '2026-03-12 20:47:36', '2026-03-12 20:47:36');
INSERT INTO `product_model_attribute` VALUES (43, 4, 24, '225', '2026-03-12 20:47:36', '2026-03-12 20:47:36');
INSERT INTO `product_model_attribute` VALUES (44, 4, 25, 'HarmonyOS', '2026-03-12 20:47:36', '2026-03-12 20:47:36');
INSERT INTO `product_model_attribute` VALUES (45, 5, 1, '6.82', '2026-03-12 20:47:36', '2026-03-12 20:47:36');
INSERT INTO `product_model_attribute` VALUES (46, 5, 2, 'Kirin 9000S', '2026-03-12 20:47:36', '2026-03-12 20:47:36');
INSERT INTO `product_model_attribute` VALUES (47, 5, 3, '3', '2026-03-12 20:47:36', '2026-03-12 20:47:36');
INSERT INTO `product_model_attribute` VALUES (48, 5, 4, '5000', '2026-03-12 20:47:36', '2026-03-12 20:47:36');
INSERT INTO `product_model_attribute` VALUES (49, 5, 5, '1', '2026-03-12 20:47:36', '2026-03-12 20:47:36');
INSERT INTO `product_model_attribute` VALUES (50, 5, 6, '4,5', '2026-03-12 20:47:36', '2026-03-12 20:47:36');
INSERT INTO `product_model_attribute` VALUES (51, 5, 7, '12', '2026-03-12 20:47:36', '2026-03-12 20:47:36');
INSERT INTO `product_model_attribute` VALUES (52, 5, 8, '256', '2026-03-12 20:47:36', '2026-03-12 20:47:36');
INSERT INTO `product_model_attribute` VALUES (53, 5, 24, '225', '2026-03-12 20:47:36', '2026-03-12 20:47:36');
INSERT INTO `product_model_attribute` VALUES (54, 5, 25, 'HarmonyOS', '2026-03-12 20:47:36', '2026-03-12 20:47:36');
INSERT INTO `product_model_attribute` VALUES (55, 6, 1, '6.73', '2026-03-12 20:47:36', '2026-03-12 20:47:36');
INSERT INTO `product_model_attribute` VALUES (56, 6, 2, 'Snapdragon 8 Gen 3', '2026-03-12 20:47:36', '2026-03-12 20:47:36');
INSERT INTO `product_model_attribute` VALUES (57, 6, 3, '4', '2026-03-12 20:47:36', '2026-03-12 20:47:36');
INSERT INTO `product_model_attribute` VALUES (58, 6, 4, '5000', '2026-03-12 20:47:36', '2026-03-12 20:47:36');
INSERT INTO `product_model_attribute` VALUES (59, 6, 5, '1', '2026-03-12 20:47:36', '2026-03-12 20:47:36');
INSERT INTO `product_model_attribute` VALUES (60, 6, 6, '4,5', '2026-03-12 20:47:36', '2026-03-12 20:47:36');
INSERT INTO `product_model_attribute` VALUES (61, 6, 7, '16', '2026-03-12 20:47:36', '2026-03-12 20:47:36');
INSERT INTO `product_model_attribute` VALUES (62, 6, 8, '512', '2026-03-12 20:47:36', '2026-03-12 20:47:36');
INSERT INTO `product_model_attribute` VALUES (63, 6, 24, '219', '2026-03-12 20:47:36', '2026-03-12 20:47:36');
INSERT INTO `product_model_attribute` VALUES (64, 6, 25, 'Android', '2026-03-12 20:47:36', '2026-03-12 20:47:36');
INSERT INTO `product_model_attribute` VALUES (65, 7, 1, '6.73', '2026-03-12 20:47:36', '2026-03-12 20:47:36');
INSERT INTO `product_model_attribute` VALUES (66, 7, 2, 'Snapdragon 8 Gen 3', '2026-03-12 20:47:36', '2026-03-12 20:47:36');
INSERT INTO `product_model_attribute` VALUES (67, 7, 3, '4', '2026-03-12 20:47:36', '2026-03-12 20:47:36');
INSERT INTO `product_model_attribute` VALUES (68, 7, 4, '4880', '2026-03-12 20:47:36', '2026-03-12 20:47:36');
INSERT INTO `product_model_attribute` VALUES (69, 7, 5, '1', '2026-03-12 20:47:36', '2026-03-12 20:47:36');
INSERT INTO `product_model_attribute` VALUES (70, 7, 6, '4,5', '2026-03-12 20:47:36', '2026-03-12 20:47:36');
INSERT INTO `product_model_attribute` VALUES (71, 7, 7, '16', '2026-03-12 20:47:36', '2026-03-12 20:47:36');
INSERT INTO `product_model_attribute` VALUES (72, 7, 8, '256', '2026-03-12 20:47:36', '2026-03-12 20:47:36');
INSERT INTO `product_model_attribute` VALUES (73, 7, 24, '223', '2026-03-12 20:47:36', '2026-03-12 20:47:36');
INSERT INTO `product_model_attribute` VALUES (74, 7, 25, 'Android', '2026-03-12 20:47:36', '2026-03-12 20:47:36');
INSERT INTO `product_model_attribute` VALUES (75, 8, 1, '6.36', '2026-03-12 20:47:36', '2026-03-12 20:47:36');
INSERT INTO `product_model_attribute` VALUES (76, 8, 2, 'Snapdragon 8 Gen 3', '2026-03-12 20:47:36', '2026-03-12 20:47:36');
INSERT INTO `product_model_attribute` VALUES (77, 8, 3, '3', '2026-03-12 20:47:36', '2026-03-12 20:47:36');
INSERT INTO `product_model_attribute` VALUES (78, 8, 4, '4610', '2026-03-12 20:47:36', '2026-03-12 20:47:36');
INSERT INTO `product_model_attribute` VALUES (79, 8, 5, '1', '2026-03-12 20:47:36', '2026-03-12 20:47:36');
INSERT INTO `product_model_attribute` VALUES (80, 8, 6, '4,5', '2026-03-12 20:47:36', '2026-03-12 20:47:36');
INSERT INTO `product_model_attribute` VALUES (81, 8, 7, '16', '2026-03-12 20:47:36', '2026-03-12 20:47:36');
INSERT INTO `product_model_attribute` VALUES (82, 8, 8, '256', '2026-03-12 20:47:36', '2026-03-12 20:47:36');
INSERT INTO `product_model_attribute` VALUES (83, 8, 24, '193', '2026-03-12 20:47:36', '2026-03-12 20:47:36');
INSERT INTO `product_model_attribute` VALUES (84, 8, 25, 'Android', '2026-03-12 20:47:36', '2026-03-12 20:47:36');

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
INSERT INTO `shop` VALUES (1, 1, 'Digital Store', '/shops/shop1.jpg', NULL, 'Quality digital products', 4.8, 0, 0, 0, 1, '2026-03-12 20:47:36', '2026-03-12 20:47:36', 0);
INSERT INTO `shop` VALUES (2, 3, 'Camera Shop', '/shops/shop2.jpg', NULL, 'Professional camera equipment', 4.9, 0, 0, 0, 1, '2026-03-12 20:47:36', '2026-03-12 20:47:36', 0);

-- ----------------------------
-- Table structure for spu
-- ----------------------------
DROP TABLE IF EXISTS `spu`;
CREATE TABLE `spu`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `name` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT 'SPU名称',
  `brand_id` bigint NOT NULL COMMENT '品牌ID',
  `category_id` bigint NOT NULL COMMENT '分类ID',
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
) ENGINE = InnoDB AUTO_INCREMENT = 11 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = 'SPU标准产品单元表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of spu
-- ----------------------------
INSERT INTO `spu` VALUES (1, 'iPhone 15 Pro Max', 1, 1, 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-finish-select-202309-6-7inch_GEO_EMEA?wid=400', NULL, '苹果2023年旗舰手机，A17 Pro芯片，钛金属边框，5倍光学变焦', NULL, 15, 2500, 80, 4.90, 9999.00, 13999.00, NULL, 1, 150000, '2026-03-14 18:13:46', '2026-03-14 18:13:46');
INSERT INTO `spu` VALUES (2, 'iPhone 15 Pro', 1, 1, 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-finish-select-202309-6-1inch_GEO_EMEA?wid=400', NULL, '苹果Pro系列，A17 Pro芯片，钛金属设计', NULL, 12, 2000, 60, 4.85, 7999.00, 10999.00, NULL, 1, 120000, '2026-03-14 18:13:46', '2026-03-14 18:13:46');
INSERT INTO `spu` VALUES (3, 'iPhone 15', 1, 1, 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-finish-select-202309-6-1inch?wid=400', NULL, '苹果标准版，A16芯片，灵动岛设计', NULL, 10, 1500, 40, 4.70, 5999.00, 7999.00, NULL, 1, 80000, '2026-03-14 18:13:46', '2026-03-14 18:13:46');
INSERT INTO `spu` VALUES (4, '小米14 Ultra', 2, 1, 'https://cdn.cnbj1.fds.api.mi-img.com/product-images/mi14ultra/1.jpg', NULL, '小米影像旗舰，徕卡光学镜头，骁龙8 Gen3', NULL, 8, 1200, 45, 4.75, 5999.00, 6999.00, NULL, 1, 60000, '2026-03-14 18:13:46', '2026-03-14 18:13:46');
INSERT INTO `spu` VALUES (5, '小米14 Pro', 2, 1, 'https://cdn.cnbj1.fds.api.mi-img.com/product-images/mi14pro/1.jpg', NULL, '小米高端旗舰，骁龙8 Gen3，徕卡影像', NULL, 6, 800, 30, 4.70, 4999.00, 5999.00, NULL, 1, 40000, '2026-03-14 18:13:46', '2026-03-14 18:13:46');
INSERT INTO `spu` VALUES (6, '华为Mate 60 Pro', 3, 1, 'https://consumer.huawei.com/content/dam/huawei-cbg-site/common/mkt/pdp/phones/mate60-pro/images/prod-color@2x.png', NULL, '华为旗舰手机，麒麟芯片，卫星通话', NULL, 5, 1800, 55, 4.80, 6499.00, 7999.00, NULL, 1, 100000, '2026-03-14 18:13:46', '2026-03-14 18:13:46');
INSERT INTO `spu` VALUES (7, '华为Mate 60', 3, 1, 'https://consumer.huawei.com/content/dam/huawei-cbg-site/common/mkt/pdp/phones/mate60/images/prod-color@2x.png', NULL, '华为高端手机，麒麟芯片回归', NULL, 4, 1000, 35, 4.75, 5499.00, 6499.00, NULL, 1, 50000, '2026-03-14 18:13:46', '2026-03-14 18:13:46');
INSERT INTO `spu` VALUES (8, 'MacBook Pro 14 M3 Pro', 1, 2, 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mbp14-spacegray-select-202310?wid=400', NULL, '苹果专业笔记本，M3 Pro芯片，14英寸', NULL, 3, 500, 20, 4.95, 14999.00, 19999.00, NULL, 1, 30000, '2026-03-14 18:13:46', '2026-03-14 18:13:46');
INSERT INTO `spu` VALUES (9, 'MacBook Air 15 M3', 1, 2, 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/macbook-air-midnight-select-20220606?wid=400', NULL, '苹果轻薄笔记本，M3芯片，15英寸大屏', NULL, 4, 600, 25, 4.85, 10499.00, 12999.00, NULL, 1, 25000, '2026-03-14 18:13:46', '2026-03-14 18:13:46');
INSERT INTO `spu` VALUES (10, 'Galaxy S24 Ultra', 4, 1, 'https://images.samsung.com/is/image/samsung/p6pim/uk/2401/gallery/uk-galaxy-s24-ultra-sm-s928-sm-s928bztpeub-thumb-539573169?$300_300_PNG$', NULL, '三星旗舰手机，骁龙8 Gen3，S Pen', NULL, 5, 700, 25, 4.70, 8999.00, 11999.00, NULL, 1, 35000, '2026-03-14 18:13:46', '2026-03-14 18:13:46');

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
) ENGINE = InnoDB AUTO_INCREMENT = 12 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = 'SPU关注表' ROW_FORMAT = Dynamic;

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
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = 'SPU价格趋势表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of spu_price_trend
-- ----------------------------

-- ----------------------------
-- Table structure for upload_file
-- ----------------------------
DROP TABLE IF EXISTS `upload_file`;
CREATE TABLE `upload_file`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '文件ID',
  `user_id` bigint NOT NULL COMMENT '上传者ID',
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
) ENGINE = InnoDB AUTO_INCREMENT = 9 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '上传文件表' ROW_FORMAT = DYNAMIC;

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

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '用户ID',
  `phone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '手机号',
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '密码（加密存储）',
  `nickname` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '昵称',
  `avatar` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '头像URL',
  `gender` tinyint NULL DEFAULT 0 COMMENT '性别 0-未知 1-男 2-女',
  `birthday` date NULL DEFAULT NULL COMMENT '生日',
  `signature` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '个性签名',
  `status` tinyint NULL DEFAULT 1 COMMENT '状态 1-正常 0-禁用 2-待激活',
  `last_login_time` datetime NULL DEFAULT NULL COMMENT '最后登录时间',
  `last_login_ip` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '最后登录IP',
  `created_at` datetime NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` datetime NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted` tinyint NULL DEFAULT 0 COMMENT '逻辑删除 0-未删除 1-已删除',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_phone`(`phone` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 6 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '用户表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES (1, '13800138001', '$2a$10$2N2IqJDgIMPR9g6b1WEENOrK0jtWH.WWNpIP8.KwpEj2u8Er3/Iq2', 'user01', '/avatars/user1.jpg', 1, '1991-01-01', '我厉害', 1, '2026-03-14 22:45:53', NULL, '2026-03-12 20:47:36', '2026-03-15 17:08:28', 0);
INSERT INTO `user` VALUES (2, '13800138002', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5EH', 'user02', '/avatars/user2.jpg', 1, NULL, NULL, 1, NULL, NULL, '2026-03-12 20:47:36', '2026-03-12 20:47:36', 0);
INSERT INTO `user` VALUES (3, '13800138003', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5EH', 'user03', '/avatars/user3.jpg', 2, NULL, NULL, 1, NULL, NULL, '2026-03-12 20:47:36', '2026-03-12 20:47:36', 0);
INSERT INTO `user` VALUES (4, '13800138000', '$2a$10$SfM9Bz4ZspGALol4/QWRCOSJpMjx3.lVYRKm4Xz/5kM9ekEgNb.u2', 'testuser', NULL, 0, NULL, NULL, 1, NULL, NULL, '2026-03-14 15:16:42', '2026-03-14 15:16:42', 0);
INSERT INTO `user` VALUES (5, '13900139001', '$2a$10$nvF9ATDwCAqnh54dy6E66.lDHpnmmlDmVNP0zvdjXksRVD05YhLFq', 'testuser1', NULL, 0, NULL, NULL, 1, '2026-03-14 15:30:19', NULL, '2026-03-14 15:19:13', '2026-03-14 15:30:19', 0);

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
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '用户收货地址表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of user_address
-- ----------------------------
INSERT INTO `user_address` VALUES (1, 1, 'Wang Ming', '13800138001', 'Beijing', 'Beijing', 'Haidian', 'Zhongguancun Street 1', 1, '2026-03-12 20:47:36', '2026-03-12 20:47:36', 0);
INSERT INTO `user_address` VALUES (2, 2, 'Li Hua', '13800138002', 'Shanghai', 'Shanghai', 'Pudong', 'Zhangjiang Hi-Tech Park', 1, '2026-03-12 20:47:36', '2026-03-12 20:47:36', 0);
INSERT INTO `user_address` VALUES (3, 3, 'Zhang Fang', '13800138003', 'Guangdong', 'Shenzhen', 'Nanshan', 'Science Park South', 1, '2026-03-12 20:47:36', '2026-03-12 20:47:36', 0);
INSERT INTO `user_address` VALUES (4, 5, 'Test User', '13900139001', 'Beijing', 'Beijing', 'Haidian', 'Test Address 123', 1, '2026-03-14 15:22:27', '2026-03-14 15:22:27', 0);

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
) ENGINE = InnoDB AUTO_INCREMENT = 6 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '用户关注表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of user_follow
-- ----------------------------
INSERT INTO `user_follow` VALUES (1, 1, 2, '2026-03-15 14:38:15');
INSERT INTO `user_follow` VALUES (2, 1, 3, '2026-03-15 14:38:15');
INSERT INTO `user_follow` VALUES (3, 2, 1, '2026-03-15 14:38:15');
INSERT INTO `user_follow` VALUES (4, 2, 3, '2026-03-15 14:38:15');
INSERT INTO `user_follow` VALUES (5, 3, 1, '2026-03-15 14:38:15');

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
) ENGINE = InnoDB AUTO_INCREMENT = 6 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '用户扩展资料表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of user_profile
-- ----------------------------
INSERT INTO `user_profile` VALUES (1, 1, NULL, NULL, NULL, NULL, 2, NULL, NULL, 2, NULL, NULL, NULL, NULL, NULL, '2026-03-12 20:47:36', '2026-03-12 20:47:36');
INSERT INTO `user_profile` VALUES (2, 2, NULL, NULL, NULL, NULL, 2, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, '2026-03-12 20:47:36', '2026-03-12 20:47:36');
INSERT INTO `user_profile` VALUES (3, 3, NULL, NULL, NULL, NULL, 2, NULL, NULL, 2, NULL, NULL, NULL, NULL, NULL, '2026-03-12 20:47:36', '2026-03-12 20:47:36');
INSERT INTO `user_profile` VALUES (4, 4, NULL, NULL, NULL, NULL, 0, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, '2026-03-14 15:16:42', '2026-03-14 15:16:42');
INSERT INTO `user_profile` VALUES (5, 5, NULL, NULL, NULL, NULL, 0, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, '2026-03-14 15:19:13', '2026-03-14 15:19:13');

SET FOREIGN_KEY_CHECKS = 1;
