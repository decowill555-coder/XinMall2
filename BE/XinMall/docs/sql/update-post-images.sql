-- 更新帖子图片数据，添加真实的测试图片
-- 执行此SQL来更新已存在的帖子图片

-- 帖子1: iPhone 15 Pro Max 开箱体验
UPDATE post SET images = '["https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800", "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800", "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800"]' WHERE id = 1;

-- 帖子2: 小米14 Ultra 拍照测评
UPDATE post SET images = '["https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800", "https://images.unsplash.com/photo-1606986628253-e0e8e2e5c6e3?w=800", "https://images.unsplash.com/photo-1502920917128-1aa5f9d5d24f?w=800"]' WHERE id = 2;

-- 帖子3: 二手交易注意事项
UPDATE post SET images = '["https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800", "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800"]' WHERE id = 3;

-- 帖子4: 华为Mate 60 Pro 卫星通话体验
UPDATE post SET images = '["https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800", "https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=800"]' WHERE id = 4;

-- 帖子5: MacBook Pro M3 Pro 开发体验
UPDATE post SET images = '["https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800", "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800"]' WHERE id = 5;

-- 帖子6: iPhone 15 Pro vs 小米14 Ultra 拍照对比
UPDATE post SET images = '["https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800", "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800", "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800"]' WHERE id = 6;

SELECT '帖子图片更新完成！' AS message;
