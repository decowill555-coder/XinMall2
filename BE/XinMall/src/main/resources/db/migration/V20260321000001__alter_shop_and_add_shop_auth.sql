/*
 XinMall 店铺功能扩展数据库迁移脚本

 版本: v1.1
 创建时间: 2026-03-21
 说明: 扩展shop表字段，创建店铺认证表
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ============================================================
-- 1. 扩展shop表字段
-- ============================================================

-- 添加联系电话字段
ALTER TABLE `shop` ADD COLUMN `phone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '联系电话' AFTER `description`;

-- 添加微信号字段
ALTER TABLE `shop` ADD COLUMN `wechat` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '微信号' AFTER `phone`;

-- 添加经营类目字段
ALTER TABLE `shop` ADD COLUMN `category` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '经营类目' AFTER `wechat`;

-- 添加发货地址字段
ALTER TABLE `shop` ADD COLUMN `address` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '发货地址' AFTER `category`;

-- 添加是否营业字段
ALTER TABLE `shop` ADD COLUMN `is_open` tinyint(1) NULL DEFAULT 1 COMMENT '是否营业 0-停业 1-营业' AFTER `address`;

-- 添加是否自动接单字段
ALTER TABLE `shop` ADD COLUMN `auto_accept` tinyint(1) NULL DEFAULT 0 COMMENT '是否自动接单 0-否 1-是' AFTER `is_open`;

-- ============================================================
-- 2. 创建店铺认证表
-- ============================================================

DROP TABLE IF EXISTS `shop_auth`;
CREATE TABLE `shop_auth` (
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
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '店铺认证表' ROW_FORMAT = Dynamic;

SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================
-- 完成提示
-- ============================================================
-- 店铺功能扩展完成：
-- - shop表新增字段：phone, wechat, category, address, is_open, auto_accept
-- - shop_auth表：店铺认证申请记录
-- ============================================================
