package com.example.xinmall.service.message.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.LambdaUpdateWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.example.xinmall.dto.message.response.SystemNotificationVO;
import com.example.xinmall.entity.message.SystemNotification;
import com.example.xinmall.entity.message.enums.NotificationType;
import com.example.xinmall.mapper.message.SystemNotificationMapper;
import com.example.xinmall.service.message.SystemNotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class SystemNotificationServiceImpl implements SystemNotificationService {

    private final SystemNotificationMapper notificationMapper;

    @Override
    public IPage<SystemNotificationVO> getNotifications(Integer page, Integer size) {
        Long userId = getCurrentUserId();
        if (userId == null) {
            throw new RuntimeException("请先登录");
        }

        Page<SystemNotification> pageParam = new Page<>(page, size);
        LambdaQueryWrapper<SystemNotification> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(SystemNotification::getUserId, userId)
                .orderByDesc(SystemNotification::getCreatedAt);

        IPage<SystemNotification> notificationPage = notificationMapper.selectPage(pageParam, wrapper);

        return notificationPage.convert(this::convertToVO);
    }

    @Override
    public Long getUnreadCount() {
        Long userId = getCurrentUserId();
        if (userId == null) {
            return 0L;
        }

        LambdaQueryWrapper<SystemNotification> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(SystemNotification::getUserId, userId)
                .eq(SystemNotification::getIsRead, false);

        return notificationMapper.selectCount(wrapper);
    }

    @Override
    @Transactional
    public void markAsRead(Long id) {
        Long userId = getCurrentUserId();
        if (userId == null) {
            throw new RuntimeException("请先登录");
        }

        notificationMapper.update(null, new LambdaUpdateWrapper<SystemNotification>()
                .eq(SystemNotification::getId, id)
                .eq(SystemNotification::getUserId, userId)
                .set(SystemNotification::getIsRead, true));
    }

    @Override
    @Transactional
    public void markAllAsRead() {
        Long userId = getCurrentUserId();
        if (userId == null) {
            return;
        }

        notificationMapper.update(null, new LambdaUpdateWrapper<SystemNotification>()
                .eq(SystemNotification::getUserId, userId)
                .eq(SystemNotification::getIsRead, false)
                .set(SystemNotification::getIsRead, true));
    }

    @Override
    @Transactional
    public void createNotification(Long userId, NotificationType type, String title, String content,
                                   Long relatedId, String relatedType) {
        SystemNotification notification = new SystemNotification();
        notification.setUserId(userId);
        notification.setType(type);
        notification.setTitle(title);
        notification.setContent(content);
        notification.setRelatedId(relatedId);
        notification.setRelatedType(relatedType);
        notification.setIsRead(false);
        notification.setCreatedAt(LocalDateTime.now());

        notificationMapper.insert(notification);
        log.info("创建系统通知: userId={}, type={}, title={}", userId, type, title);
    }

    @Override
    @Transactional
    public void deleteNotification(Long id) {
        Long userId = getCurrentUserId();
        if (userId == null) {
            throw new RuntimeException("请先登录");
        }

        notificationMapper.delete(new LambdaQueryWrapper<SystemNotification>()
                .eq(SystemNotification::getId, id)
                .eq(SystemNotification::getUserId, userId));
    }

    private SystemNotificationVO convertToVO(SystemNotification notification) {
        SystemNotificationVO vo = new SystemNotificationVO();
        BeanUtils.copyProperties(notification, vo);

        NotificationType type = notification.getType();
        if (type != null) {
            vo.setTypeName(type.getName());
            vo.setIcon(type.getIcon());
            vo.setIconColor(type.getIconColor());
        }

        vo.setTimeAgo(formatTimeAgo(notification.getCreatedAt()));

        return vo;
    }

    private String formatTimeAgo(LocalDateTime dateTime) {
        if (dateTime == null) {
            return "";
        }

        Duration duration = Duration.between(dateTime, LocalDateTime.now());
        long minutes = duration.toMinutes();
        long hours = duration.toHours();
        long days = duration.toDays();

        if (minutes < 1) {
            return "刚刚";
        } else if (minutes < 60) {
            return minutes + "分钟前";
        } else if (hours < 24) {
            return hours + "小时前";
        } else if (days < 7) {
            return days + "天前";
        } else {
            return dateTime.toLocalDate().toString();
        }
    }

    private Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return null;
        }
        try {
            return Long.parseLong(authentication.getName());
        } catch (Exception e) {
            return null;
        }
    }
}
