-- 用户关注表 - 用于关注页面功能
-- 此表在 xinmall.sql 中缺失，需要手动创建

-- 创建 user_follow 表
CREATE TABLE IF NOT EXISTS `user_follow` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `user_id` bigint NOT NULL COMMENT '关注者ID',
  `followed_id` bigint NOT NULL COMMENT '被关注者ID',
  `created_at` datetime NULL DEFAULT CURRENT_TIMESTAMP COMMENT '关注时间',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_user_followed`(`user_id` ASC, `followed_id` ASC) USING BTREE,
  INDEX `idx_user_id`(`user_id` ASC) USING BTREE,
  INDEX `idx_followed_id`(`followed_id` ASC) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '用户关注表' ROW_FORMAT = DYNAMIC;

-- 添加测试数据
-- 用户ID说明: 1=user01, 2=user02, 3=user03, 5=testuser1
INSERT INTO `user_follow` (`user_id`, `followed_id`, `created_at`) VALUES
(1, 2, '2026-03-14 10:00:00'),
(1, 3, '2026-03-14 11:00:00'),
(2, 1, '2026-03-14 12:00:00'),
(2, 3, '2026-03-14 13:00:00'),
(3, 1, '2026-03-14 14:00:00'),
(5, 1, '2026-03-14 15:00:00'),
(5, 2, '2026-03-14 16:00:00');
