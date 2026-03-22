-- 系统通知表
CREATE TABLE IF NOT EXISTS `system_notification` (
    `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `user_id` BIGINT NOT NULL COMMENT '接收用户ID',
    `type` TINYINT NOT NULL COMMENT '通知类型：1-订单发货, 2-订单签收, 3-订单取消, 4-退款, 5-实名认证成功, 6-实名认证失败, 7-商品审核通过, 8-商品审核未通过, 9-交易成功, 10-账户安全提醒, 11-系统公告',
    `title` VARCHAR(100) NOT NULL COMMENT '通知标题',
    `content` VARCHAR(500) NOT NULL COMMENT '通知内容',
    `related_id` BIGINT DEFAULT NULL COMMENT '关联业务ID',
    `related_type` VARCHAR(50) DEFAULT NULL COMMENT '关联业务类型（order/product等）',
    `is_read` TINYINT DEFAULT 0 COMMENT '是否已读：0-未读, 1-已读',
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    PRIMARY KEY (`id`),
    KEY `idx_user_id` (`user_id`),
    KEY `idx_is_read` (`is_read`),
    KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='系统通知表';

-- 互动消息表
CREATE TABLE IF NOT EXISTS `interaction_message` (
    `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `user_id` BIGINT NOT NULL COMMENT '接收用户ID（被互动的用户）',
    `actor_id` BIGINT NOT NULL COMMENT '发起互动的用户ID',
    `type` TINYINT NOT NULL COMMENT '互动类型：1-点赞帖子, 2-评论帖子, 3-回复评论, 4-关注用户, 5-收藏帖子',
    `post_id` BIGINT DEFAULT NULL COMMENT '关联帖子ID',
    `comment_id` BIGINT DEFAULT NULL COMMENT '关联评论ID',
    `content` VARCHAR(500) DEFAULT NULL COMMENT '互动内容（如评论内容）',
    `is_read` TINYINT DEFAULT 0 COMMENT '是否已读：0-未读, 1-已读',
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    PRIMARY KEY (`id`),
    KEY `idx_user_id` (`user_id`),
    KEY `idx_actor_id` (`actor_id`),
    KEY `idx_is_read` (`is_read`),
    KEY `idx_created_at` (`created_at`),
    KEY `idx_post_id` (`post_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='互动消息表';
