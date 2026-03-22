package com.example.xinmall.service.community.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.LambdaUpdateWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.example.xinmall.common.exception.BusinessException;
import com.example.xinmall.dto.community.request.CreateCommentRequest;
import com.example.xinmall.dto.community.response.CommentVO;
import com.example.xinmall.entity.community.Comment;
import com.example.xinmall.entity.community.CommentLike;
import com.example.xinmall.entity.community.Post;
import com.example.xinmall.entity.user.User;
import com.example.xinmall.mapper.community.CommentLikeMapper;
import com.example.xinmall.mapper.community.CommentMapper;
import com.example.xinmall.mapper.community.PostMapper;
import com.example.xinmall.mapper.user.UserMapper;
import com.example.xinmall.service.community.CommentService;
import com.example.xinmall.service.message.InteractionMessageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
public class CommentServiceImpl implements CommentService {

    private final CommentMapper commentMapper;
    private final CommentLikeMapper commentLikeMapper;
    private final PostMapper postMapper;
    private final UserMapper userMapper;
    private final InteractionMessageService interactionMessageService;

    @Override
    public IPage<CommentVO> getList(Long postId, Integer page, Integer pageSize) {
        Page<Comment> commentPage = new Page<>(page, pageSize);
        LambdaQueryWrapper<Comment> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Comment::getPostId, postId)
                .isNull(Comment::getParentId)
                .eq(Comment::getStatus, 1)
                .orderByDesc(Comment::getLikeCount)
                .orderByDesc(Comment::getCreatedAt);

        IPage<Comment> result = commentMapper.selectPage(commentPage, wrapper);
        Long currentUserId = getCurrentUserId();

        return result.convert(comment -> convertToVO(comment, currentUserId));
    }

    @Override
    @Transactional
    public Long create(CreateCommentRequest request) {
        Long userId = getCurrentUserId();
        if (userId == null) {
            throw new BusinessException("请先登录");
        }

        Post post = postMapper.selectById(request.getPostId());
        if (post == null || post.getStatus() != 1) {
            throw new BusinessException("帖子不存在");
        }

        Comment comment = new Comment();
        comment.setPostId(request.getPostId());
        comment.setContent(request.getContent());
        comment.setAuthorId(userId);
        comment.setParentId(request.getParentId());
        comment.setReplyToId(request.getReplyToId());
        comment.setReplyToUserId(request.getReplyToUserId());
        comment.setLikeCount(0);
        comment.setReplyCount(0);
        comment.setStatus(1);
        comment.setCreatedAt(LocalDateTime.now());
        comment.setUpdatedAt(LocalDateTime.now());
        commentMapper.insert(comment);

        postMapper.update(null, new LambdaUpdateWrapper<Post>()
                .eq(Post::getId, request.getPostId())
                .setSql("comment_count = comment_count + 1"));

        if (request.getParentId() != null) {
            commentMapper.update(null, new LambdaUpdateWrapper<Comment>()
                    .eq(Comment::getId, request.getParentId())
                    .setSql("reply_count = reply_count + 1"));

            // 发送回复通知
            if (request.getReplyToUserId() != null) {
                interactionMessageService.createCommentReplyNotification(
                        request.getReplyToUserId(), userId, request.getPostId(), post.getTitle(),
                        comment.getId(), request.getContent());
            }
        } else {
            // 发送评论通知
            interactionMessageService.createPostCommentNotification(
                    post.getAuthorId(), userId, request.getPostId(), post.getTitle(),
                    comment.getId(), request.getContent());
        }

        return comment.getId();
    }

    @Override
    @Transactional
    public void delete(Long id) {
        Long userId = getCurrentUserId();
        if (userId == null) {
            throw new BusinessException("请先登录");
        }

        Comment comment = commentMapper.selectById(id);
        if (comment == null) {
            throw new BusinessException("评论不存在");
        }

        if (!comment.getAuthorId().equals(userId)) {
            throw new BusinessException("无权删除此评论");
        }

        comment.setStatus(0);
        comment.setUpdatedAt(LocalDateTime.now());
        commentMapper.updateById(comment);

        postMapper.update(null, new LambdaUpdateWrapper<Post>()
                .eq(Post::getId, comment.getPostId())
                .setSql("comment_count = GREATEST(comment_count - 1, 0)"));

        if (comment.getParentId() != null) {
            commentMapper.update(null, new LambdaUpdateWrapper<Comment>()
                    .eq(Comment::getId, comment.getParentId())
                    .setSql("reply_count = GREATEST(reply_count - 1, 0)"));
        }
    }

    @Override
    @Transactional
    public void like(Long commentId) {
        Long userId = getCurrentUserId();
        if (userId == null) {
            throw new BusinessException("请先登录");
        }

        Comment comment = commentMapper.selectById(commentId);
        if (comment == null || comment.getStatus() != 1) {
            throw new BusinessException("评论不存在");
        }

        LambdaQueryWrapper<CommentLike> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(CommentLike::getCommentId, commentId).eq(CommentLike::getUserId, userId);
        if (commentLikeMapper.selectCount(wrapper) > 0) {
            return;
        }

        CommentLike like = new CommentLike();
        like.setCommentId(commentId);
        like.setUserId(userId);
        like.setCreatedAt(LocalDateTime.now());
        commentLikeMapper.insert(like);

        commentMapper.update(null, new LambdaUpdateWrapper<Comment>()
                .eq(Comment::getId, commentId)
                .setSql("like_count = like_count + 1"));
    }

    @Override
    @Transactional
    public void unlike(Long commentId) {
        Long userId = getCurrentUserId();
        if (userId == null) {
            throw new BusinessException("请先登录");
        }

        LambdaQueryWrapper<CommentLike> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(CommentLike::getCommentId, commentId).eq(CommentLike::getUserId, userId);
        if (commentLikeMapper.delete(wrapper) > 0) {
            commentMapper.update(null, new LambdaUpdateWrapper<Comment>()
                    .eq(Comment::getId, commentId)
                    .setSql("like_count = GREATEST(like_count - 1, 0)"));
        }
    }

    @Override
    public IPage<CommentVO> getReplies(Long parentId, Integer page, Integer pageSize) {
        Page<Comment> commentPage = new Page<>(page, pageSize);
        LambdaQueryWrapper<Comment> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Comment::getParentId, parentId)
                .eq(Comment::getStatus, 1)
                .orderByAsc(Comment::getCreatedAt);

        IPage<Comment> result = commentMapper.selectPage(commentPage, wrapper);
        Long currentUserId = getCurrentUserId();

        return result.convert(comment -> convertToVO(comment, currentUserId));
    }

    private CommentVO convertToVO(Comment comment, Long currentUserId) {
        CommentVO vo = new CommentVO();
        BeanUtils.copyProperties(comment, vo);

        CommentVO.AuthorVO authorVO = new CommentVO.AuthorVO();
        User author = userMapper.selectById(comment.getAuthorId());
        if (author != null) {
            authorVO.setId(author.getId());
            authorVO.setName(author.getNickname());
            authorVO.setAvatar(author.getAvatar());
        }
        vo.setAuthor(authorVO);

        if (comment.getReplyToUserId() != null) {
            CommentVO.AuthorVO replyToUser = new CommentVO.AuthorVO();
            User replyUser = userMapper.selectById(comment.getReplyToUserId());
            if (replyUser != null) {
                replyToUser.setId(replyUser.getId());
                replyToUser.setName(replyUser.getNickname());
                replyToUser.setAvatar(replyUser.getAvatar());
            }
            vo.setReplyToUser(replyToUser);
        }

        if (currentUserId != null) {
            LambdaQueryWrapper<CommentLike> wrapper = new LambdaQueryWrapper<>();
            wrapper.eq(CommentLike::getCommentId, comment.getId())
                    .eq(CommentLike::getUserId, currentUserId);
            vo.setIsLiked(commentLikeMapper.selectCount(wrapper) > 0);
        } else {
            vo.setIsLiked(false);
        }

        return vo;
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
