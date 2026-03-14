-- SPU表 (标准产品单元)
CREATE TABLE IF NOT EXISTS spu (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '主键ID',
    name VARCHAR(200) NOT NULL COMMENT 'SPU名称',
    brand_id BIGINT NOT NULL COMMENT '品牌ID',
    category_id BIGINT NOT NULL COMMENT '分类ID',
    cover VARCHAR(255) COMMENT '封面图',
    images JSON COMMENT '图片列表',
    description TEXT COMMENT '描述',
    specs JSON COMMENT '规格信息',
    product_count INT DEFAULT 0 COMMENT '商品数量',
    member_count INT DEFAULT 0 COMMENT '关注人数',
    post_count INT DEFAULT 0 COMMENT '帖子数',
    avg_rating DECIMAL(3,2) DEFAULT 0.00 COMMENT '平均评分',
    price_min DECIMAL(10,2) COMMENT '最低价',
    price_max DECIMAL(10,2) COMMENT '最高价',
    tags JSON COMMENT '标签',
    status TINYINT DEFAULT 1 COMMENT '状态: 0-禁用 1-正常',
    view_count INT DEFAULT 0 COMMENT '浏览数',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_brand_id (brand_id),
    INDEX idx_category_id (category_id),
    INDEX idx_status (status),
    INDEX idx_product_count (product_count),
    INDEX idx_member_count (member_count)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='SPU标准产品单元表';

-- SPU关注表
CREATE TABLE IF NOT EXISTS spu_follow (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '主键ID',
    spu_id BIGINT NOT NULL COMMENT 'SPU ID',
    user_id BIGINT NOT NULL COMMENT '用户ID',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '关注时间',
    UNIQUE KEY uk_spu_user (spu_id, user_id),
    INDEX idx_user_id (user_id),
    INDEX idx_spu_id (spu_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='SPU关注表';

-- SPU价格趋势表
CREATE TABLE IF NOT EXISTS spu_price_trend (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '主键ID',
    spu_id BIGINT NOT NULL COMMENT 'SPU ID',
    date DATE NOT NULL COMMENT '日期',
    avg_price DECIMAL(10,2) COMMENT '平均价',
    min_price DECIMAL(10,2) COMMENT '最低价',
    max_price DECIMAL(10,2) COMMENT '最高价',
    product_count INT COMMENT '商品数量',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    UNIQUE KEY uk_spu_date (spu_id, date),
    INDEX idx_spu_id (spu_id),
    INDEX idx_date (date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='SPU价格趋势表';

-- 社区表
CREATE TABLE IF NOT EXISTS community (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '主键ID',
    name VARCHAR(100) NOT NULL COMMENT '社区名称',
    type VARCHAR(20) NOT NULL COMMENT '类型: model/user',
    description VARCHAR(500) COMMENT '描述',
    cover VARCHAR(255) COMMENT '封面图',
    model_id BIGINT COMMENT '关联型号ID',
    is_official TINYINT DEFAULT 0 COMMENT '是否官方: 0-否 1-是',
    creator_id BIGINT COMMENT '创建者ID',
    member_count INT DEFAULT 0 COMMENT '成员数',
    post_count INT DEFAULT 0 COMMENT '帖子数',
    status TINYINT DEFAULT 1 COMMENT '状态: 0-禁用 1-正常',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    UNIQUE KEY uk_name (name),
    INDEX idx_type (type),
    INDEX idx_model_id (model_id),
    INDEX idx_creator_id (creator_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='社区表';

-- 社区成员表
CREATE TABLE IF NOT EXISTS community_member (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '主键ID',
    community_id BIGINT NOT NULL COMMENT '社区ID',
    user_id BIGINT NOT NULL COMMENT '用户ID',
    level INT DEFAULT 1 COMMENT '等级',
    exp INT DEFAULT 0 COMMENT '经验值',
    is_admin TINYINT DEFAULT 0 COMMENT '是否管理员: 0-否 1-是',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '加入时间',
    UNIQUE KEY uk_community_user (community_id, user_id),
    INDEX idx_user_id (user_id),
    INDEX idx_community_id (community_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='社区成员表';

-- 帖子表
CREATE TABLE IF NOT EXISTS post (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '主键ID',
    title VARCHAR(200) NOT NULL COMMENT '标题',
    content TEXT NOT NULL COMMENT '内容',
    author_id BIGINT NOT NULL COMMENT '作者ID',
    forum_id BIGINT COMMENT '所属社区ID',
    spu_id BIGINT COMMENT '关联SPU ID',
    images JSON COMMENT '图片列表',
    tags JSON COMMENT '标签列表',
    view_count INT DEFAULT 0 COMMENT '浏览数',
    like_count INT DEFAULT 0 COMMENT '点赞数',
    comment_count INT DEFAULT 0 COMMENT '评论数',
    collect_count INT DEFAULT 0 COMMENT '收藏数',
    is_pinned TINYINT DEFAULT 0 COMMENT '是否置顶: 0-否 1-是',
    is_essence TINYINT DEFAULT 0 COMMENT '是否精华: 0-否 1-是',
    status TINYINT DEFAULT 1 COMMENT '状态: 0-删除 1-正常',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_author_id (author_id),
    INDEX idx_forum_id (forum_id),
    INDEX idx_spu_id (spu_id),
    INDEX idx_status (status),
    INDEX idx_is_pinned (is_pinned),
    INDEX idx_is_essence (is_essence),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='帖子表';

-- 评论表
CREATE TABLE IF NOT EXISTS comment (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '主键ID',
    post_id BIGINT NOT NULL COMMENT '帖子ID',
    content TEXT NOT NULL COMMENT '内容',
    author_id BIGINT NOT NULL COMMENT '作者ID',
    parent_id BIGINT COMMENT '父评论ID',
    reply_to_id BIGINT COMMENT '回复的评论ID',
    reply_to_user_id BIGINT COMMENT '回复的用户ID',
    images JSON COMMENT '图片列表',
    like_count INT DEFAULT 0 COMMENT '点赞数',
    reply_count INT DEFAULT 0 COMMENT '回复数',
    status TINYINT DEFAULT 1 COMMENT '状态: 0-删除 1-正常',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_post_id (post_id),
    INDEX idx_author_id (author_id),
    INDEX idx_parent_id (parent_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='评论表';

-- 帖子点赞表
CREATE TABLE IF NOT EXISTS post_like (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '主键ID',
    post_id BIGINT NOT NULL COMMENT '帖子ID',
    user_id BIGINT NOT NULL COMMENT '用户ID',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '点赞时间',
    UNIQUE KEY uk_post_user (post_id, user_id),
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='帖子点赞表';

-- 评论点赞表
CREATE TABLE IF NOT EXISTS comment_like (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '主键ID',
    comment_id BIGINT NOT NULL COMMENT '评论ID',
    user_id BIGINT NOT NULL COMMENT '用户ID',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '点赞时间',
    UNIQUE KEY uk_comment_user (comment_id, user_id),
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='评论点赞表';

-- 帖子收藏表
CREATE TABLE IF NOT EXISTS post_collect (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '主键ID',
    post_id BIGINT NOT NULL COMMENT '帖子ID',
    user_id BIGINT NOT NULL COMMENT '用户ID',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '收藏时间',
    UNIQUE KEY uk_post_user (post_id, user_id),
    INDEX idx_user_id (user_id),
    INDEX idx_post_id (post_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='帖子收藏表';
