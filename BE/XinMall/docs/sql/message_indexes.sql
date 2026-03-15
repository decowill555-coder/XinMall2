-- 消息表索引优化
-- 用于优化双向查询性能

-- 发送者+接收者复合索引
CREATE INDEX IF NOT EXISTS idx_message_sender_receiver ON message(sender_id, receiver_id);

-- 接收者+发送者复合索引（用于反向查询优化）
CREATE INDEX IF NOT EXISTS idx_message_receiver_sender ON message(receiver_id, sender_id);

-- 创建时间索引（用于排序）
CREATE INDEX IF NOT EXISTS idx_message_created_at ON message(created_at);
