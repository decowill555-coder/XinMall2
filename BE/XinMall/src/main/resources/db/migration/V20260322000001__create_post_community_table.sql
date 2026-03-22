-- 创建帖子-社区关联表
-- 用于实现一个帖子可以同时出现在多个社区

CREATE TABLE IF NOT EXISTS post_community (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
    post_id BIGINT NOT NULL COMMENT '帖子ID',
    community_id BIGINT NOT NULL COMMENT '社区ID',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    
    UNIQUE KEY uk_post_community (post_id, community_id),
    INDEX idx_community_id (community_id),
    INDEX idx_post_id (post_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='帖子-社区关联表';

-- 迁移现有数据：将 post 表中的 forum_id 迁移到关联表
INSERT INTO post_community (post_id, community_id, created_at)
SELECT id, forum_id, created_at 
FROM post 
WHERE forum_id IS NOT NULL
ON DUPLICATE KEY UPDATE post_id = post_id;
