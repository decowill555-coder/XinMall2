/*
 Banner表创建脚本
 
 用途: 立即修复 /api/banner/list 500错误
 执行方式: 在MySQL中执行此脚本
*/

USE xinmall;

-- 创建 banner 表
CREATE TABLE IF NOT EXISTS `banner` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT 'Banner ID',
  `image` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '图片URL',
  `title` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '标题',
  `link` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '跳转链接',
  `sort` int NULL DEFAULT 0 COMMENT '排序',
  `status` tinyint NULL DEFAULT 1 COMMENT '状态 1-启用 0-禁用',
  `created_at` datetime NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` datetime NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '轮播图表' ROW_FORMAT = Dynamic;

-- 插入测试数据
INSERT INTO `banner` (`image`, `title`, `link`, `sort`, `status`) VALUES
('https://picsum.photos/750/300?random=1', '新品首发', '/pages-sub/trade/product/list?tag=new', 1, 1),
('https://picsum.photos/750/300?random=2', '限时特惠', '/pages-sub/trade/product/list?tag=sale', 2, 1),
('https://picsum.photos/750/300?random=3', '品牌专区', '/pages-sub/search/category', 3, 1),
('https://picsum.photos/750/300?random=4', '二手好物', '/pages-sub/trade/product/list', 4, 1);

SELECT 'Banner表创建成功!' AS message;
