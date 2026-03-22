package com.example.xinmall.service.community.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.LambdaUpdateWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.example.xinmall.common.exception.BusinessException;
import com.example.xinmall.dto.community.request.CreatePostRequest;
import com.example.xinmall.dto.community.request.PostQueryRequest;
import com.example.xinmall.dto.community.response.PostDetailVO;
import com.example.xinmall.dto.community.response.PostVO;
import com.example.xinmall.entity.community.Community;
import com.example.xinmall.entity.community.Post;
import com.example.xinmall.entity.community.PostLike;
import com.example.xinmall.entity.community.PostCollect;
import com.example.xinmall.entity.community.PostCommunity;
import com.example.xinmall.entity.spu.Spu;
import com.example.xinmall.entity.user.User;
import com.example.xinmall.mapper.community.CommunityMapper;
import com.example.xinmall.mapper.community.PostLikeMapper;
import com.example.xinmall.mapper.community.PostCollectMapper;
import com.example.xinmall.mapper.community.PostCommunityMapper;
import com.example.xinmall.mapper.community.PostMapper;
import com.example.xinmall.mapper.spu.SpuMapper;
import com.example.xinmall.mapper.user.UserMapper;
import com.example.xinmall.service.community.PostService;
import com.example.xinmall.service.message.InteractionMessageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class PostServiceImpl implements PostService {

    private final PostMapper postMapper;
    private final PostLikeMapper postLikeMapper;
    private final PostCollectMapper postCollectMapper;
    private final PostCommunityMapper postCommunityMapper;
    private final UserMapper userMapper;
    private final CommunityMapper communityMapper;
    private final SpuMapper spuMapper;
    private final InteractionMessageService interactionMessageService;

    @Override
    public IPage<PostVO> getList(PostQueryRequest request) {
        log.debug("Getting post list, page: {}, pageSize: {}", request.getPage(), request.getPageSize());
        try {
            Page<Post> page = new Page<>(request.getPage(), request.getPageSize());
            IPage<Post> postPage;
            Long currentUserId = getCurrentUserId();

            if (request.getForumId() != null) {
                postPage = postMapper.selectPostsByCommunityId(page, request.getForumId());
            } else {
                LambdaQueryWrapper<Post> wrapper = new LambdaQueryWrapper<>();
                wrapper.eq(Post::getStatus, 1);

                if (request.getSpuId() != null) {
                    wrapper.eq(Post::getSpuId, request.getSpuId());
                }
                if (request.getAuthorId() != null) {
                    wrapper.eq(Post::getAuthorId, request.getAuthorId());
                }
                if (request.getKeyword() != null && !request.getKeyword().isEmpty()) {
                    wrapper.and(w -> w.like(Post::getTitle, request.getKeyword())
                            .or()
                            .like(Post::getContent, request.getKeyword()));
                }

                if ("hot".equals(request.getSort())) {
                    wrapper.orderByDesc(Post::getLikeCount);
                } else if ("essence".equals(request.getSort())) {
                    wrapper.orderByDesc(Post::getIsEssence);
                } else {
                    wrapper.last("ORDER BY RAND()");
                }

                postPage = postMapper.selectPage(page, wrapper);
            }

            log.debug("Found {} posts", postPage.getRecords().size());
            return postPage.convert(post -> convertToVO(post, currentUserId));
        } catch (Exception e) {
            log.error("Error getting post list: {}", e.getMessage(), e);
            throw e;
        }
    }

    @Override
    public PostDetailVO getDetailById(Long id) {
        Post post = postMapper.selectById(id);
        if (post == null || post.getStatus() != 1) {
            throw new BusinessException("帖子不存在");
        }

        postMapper.update(null, new LambdaUpdateWrapper<Post>()
                .eq(Post::getId, id)
                .setSql("view_count = view_count + 1"));

        Long currentUserId = getCurrentUserId();
        return convertToDetailVO(post, currentUserId);
    }

    @Override
    @Transactional
    public Long create(CreatePostRequest request) {
        Long userId = getCurrentUserId();
        if (userId == null) {
            throw new BusinessException("请先登录");
        }

        Post post = new Post();
        post.setTitle(request.getTitle());
        post.setContent(request.getContent());
        post.setAuthorId(userId);
        post.setSpuId(request.getSpuId());
        post.setImages(request.getImages());
        post.setTags(request.getTags());
        post.setViewCount(0);
        post.setLikeCount(0);
        post.setCommentCount(0);
        post.setCollectCount(0);
        post.setIsPinned(0);
        post.setIsEssence(0);
        post.setStatus(1);
        post.setCreatedAt(LocalDateTime.now());
        post.setUpdatedAt(LocalDateTime.now());
        postMapper.insert(post);

        List<Long> matchedCommunityIds = findCommunitiesByTags(request.getTags());
        for (Long communityId : matchedCommunityIds) {
            PostCommunity pc = new PostCommunity();
            pc.setPostId(post.getId());
            pc.setCommunityId(communityId);
            pc.setCreatedAt(LocalDateTime.now());
            postCommunityMapper.insert(pc);

            communityMapper.update(null, new LambdaUpdateWrapper<Community>()
                    .eq(Community::getId, communityId)
                    .setSql("post_count = post_count + 1"));
        }

        return post.getId();
    }

    private List<Long> findCommunitiesByTags(List<String> tags) {
        if (tags == null || tags.isEmpty()) {
            return Collections.emptyList();
        }

        LambdaQueryWrapper<Community> wrapper = new LambdaQueryWrapper<>();
        wrapper.isNotNull(Community::getTags);
        
        for (int i = 0; i < tags.size(); i++) {
            String tag = tags.get(i);
            if (i == 0) {
                wrapper.apply("JSON_CONTAINS(tags, {0})", "\"" + tag + "\"");
            } else {
                wrapper.or(w -> w.apply("JSON_CONTAINS(tags, {0})", "\"" + tag + "\""));
            }
        }

        List<Community> communities = communityMapper.selectList(wrapper);
        return communities.stream().map(Community::getId).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void delete(Long id) {
        Long userId = getCurrentUserId();
        if (userId == null) {
            throw new BusinessException("请先登录");
        }

        Post post = postMapper.selectById(id);
        if (post == null) {
            throw new BusinessException("帖子不存在");
        }

        if (!post.getAuthorId().equals(userId)) {
            throw new BusinessException("无权删除此帖子");
        }

        post.setStatus(0);
        post.setUpdatedAt(LocalDateTime.now());
        postMapper.updateById(post);

        List<Long> communityIds = postCommunityMapper.selectCommunityIdsByPostId(id);
        for (Long communityId : communityIds) {
            communityMapper.update(null, new LambdaUpdateWrapper<Community>()
                    .eq(Community::getId, communityId)
                    .setSql("post_count = GREATEST(post_count - 1, 0)"));
        }
    }

    @Override
    @Transactional
    public void like(Long postId) {
        Long userId = getCurrentUserId();
        if (userId == null) {
            throw new BusinessException("请先登录");
        }

        Post post = postMapper.selectById(postId);
        if (post == null || post.getStatus() != 1) {
            throw new BusinessException("帖子不存在");
        }

        LambdaQueryWrapper<PostLike> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(PostLike::getPostId, postId).eq(PostLike::getUserId, userId);
        if (postLikeMapper.selectCount(wrapper) > 0) {
            return;
        }

        PostLike like = new PostLike();
        like.setPostId(postId);
        like.setUserId(userId);
        like.setCreatedAt(LocalDateTime.now());
        postLikeMapper.insert(like);

        postMapper.update(null, new LambdaUpdateWrapper<Post>()
                .eq(Post::getId, postId)
                .setSql("like_count = like_count + 1"));

        // 发送点赞通知
        interactionMessageService.createPostLikeNotification(
                post.getAuthorId(), userId, postId, post.getTitle());
    }

    @Override
    @Transactional
    public void unlike(Long postId) {
        Long userId = getCurrentUserId();
        if (userId == null) {
            throw new BusinessException("请先登录");
        }

        LambdaQueryWrapper<PostLike> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(PostLike::getPostId, postId).eq(PostLike::getUserId, userId);
        if (postLikeMapper.delete(wrapper) > 0) {
            postMapper.update(null, new LambdaUpdateWrapper<Post>()
                    .eq(Post::getId, postId)
                    .setSql("like_count = GREATEST(like_count - 1, 0)"));
        }
    }

    @Override
    @Transactional
    public void collect(Long postId) {
        Long userId = getCurrentUserId();
        if (userId == null) {
            throw new BusinessException("请先登录");
        }

        Post post = postMapper.selectById(postId);
        if (post == null || post.getStatus() != 1) {
            throw new BusinessException("帖子不存在");
        }

        LambdaQueryWrapper<PostCollect> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(PostCollect::getPostId, postId).eq(PostCollect::getUserId, userId);
        if (postCollectMapper.selectCount(wrapper) > 0) {
            return;
        }

        PostCollect collect = new PostCollect();
        collect.setPostId(postId);
        collect.setUserId(userId);
        collect.setCreatedAt(LocalDateTime.now());
        postCollectMapper.insert(collect);

        postMapper.update(null, new LambdaUpdateWrapper<Post>()
                .eq(Post::getId, postId)
                .setSql("collect_count = collect_count + 1"));

        // 发送收藏通知
        interactionMessageService.createPostCollectNotification(
                post.getAuthorId(), userId, postId, post.getTitle());
    }

    @Override
    @Transactional
    public void uncollect(Long postId) {
        Long userId = getCurrentUserId();
        if (userId == null) {
            throw new BusinessException("请先登录");
        }

        LambdaQueryWrapper<PostCollect> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(PostCollect::getPostId, postId).eq(PostCollect::getUserId, userId);
        if (postCollectMapper.delete(wrapper) > 0) {
            postMapper.update(null, new LambdaUpdateWrapper<Post>()
                    .eq(Post::getId, postId)
                    .setSql("collect_count = GREATEST(collect_count - 1, 0)"));
        }
    }

    @Override
    @Transactional
    public void pin(Long postId) {
        Post post = postMapper.selectById(postId);
        if (post == null || post.getStatus() != 1) {
            throw new BusinessException("帖子不存在");
        }

        post.setIsPinned(1);
        post.setUpdatedAt(LocalDateTime.now());
        postMapper.updateById(post);
    }

    @Override
    @Transactional
    public void unpin(Long postId) {
        Post post = postMapper.selectById(postId);
        if (post == null) {
            throw new BusinessException("帖子不存在");
        }

        post.setIsPinned(0);
        post.setUpdatedAt(LocalDateTime.now());
        postMapper.updateById(post);
    }

    @Override
    @Transactional
    public void setEssence(Long postId) {
        Post post = postMapper.selectById(postId);
        if (post == null || post.getStatus() != 1) {
            throw new BusinessException("帖子不存在");
        }

        post.setIsEssence(1);
        post.setUpdatedAt(LocalDateTime.now());
        postMapper.updateById(post);
    }

    @Override
    public IPage<PostVO> getUserPosts(Long userId, Integer page, Integer pageSize) {
        Page<Post> postPage = new Page<>(page, pageSize);
        LambdaQueryWrapper<Post> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Post::getAuthorId, userId)
                .eq(Post::getStatus, 1)
                .orderByDesc(Post::getCreatedAt);

        IPage<Post> result = postMapper.selectPage(postPage, wrapper);
        Long currentUserId = getCurrentUserId();

        return result.convert(post -> convertToVO(post, currentUserId));
    }

    @Override
    public IPage<PostVO> getMyPosts(Integer page, Integer pageSize) {
        Long userId = getCurrentUserId();
        if (userId == null) {
            throw new BusinessException("请先登录");
        }
        return getUserPosts(userId, page, pageSize);
    }

    @Override
    public IPage<PostVO> getFollowedPosts(Integer page, Integer pageSize) {
        Long userId = getCurrentUserId();
        if (userId == null) {
            throw new BusinessException("请先登录");
        }

        Page<Post> postPage = new Page<>(page, pageSize);
        IPage<Post> result = postMapper.selectFollowedPosts(postPage, userId);
        
        return result.convert(post -> convertToVO(post, userId));
    }

    private PostVO convertToVO(Post post, Long currentUserId) {
        try {
            log.debug("Converting post to VO, postId: {}", post != null ? post.getId() : "null");

            PostVO vo = new PostVO();
            BeanUtils.copyProperties(post, vo);
            vo.setIsPinned(post.getIsPinned() != null && post.getIsPinned() == 1);
            vo.setIsEssence(post.getIsEssence() != null && post.getIsEssence() == 1);

            PostVO.AuthorVO authorVO = new PostVO.AuthorVO();
            User author = userMapper.selectById(post.getAuthorId());
            if (author != null) {
                authorVO.setId(author.getId());
                authorVO.setName(author.getNickname());
                authorVO.setAvatar(author.getAvatar());
            }
            vo.setAuthor(authorVO);

            List<Long> communityIds = postCommunityMapper.selectCommunityIdsByPostId(post.getId());
            if (!communityIds.isEmpty()) {
                Community community = communityMapper.selectById(communityIds.get(0));
                if (community != null) {
                    vo.setForumName(community.getName());
                }
            }

            if (post.getSpuId() != null) {
                Spu spu = spuMapper.selectById(post.getSpuId());
                if (spu != null) {
                    vo.setSpuName(spu.getName());
                }
            }

            if (currentUserId != null) {
                LambdaQueryWrapper<PostLike> likeWrapper = new LambdaQueryWrapper<>();
                likeWrapper.eq(PostLike::getPostId, post.getId())
                        .eq(PostLike::getUserId, currentUserId);
                vo.setIsLiked(postLikeMapper.selectCount(likeWrapper) > 0);

                LambdaQueryWrapper<PostCollect> collectWrapper = new LambdaQueryWrapper<>();
                collectWrapper.eq(PostCollect::getPostId, post.getId())
                        .eq(PostCollect::getUserId, currentUserId);
                vo.setIsCollected(postCollectMapper.selectCount(collectWrapper) > 0);
            } else {
                vo.setIsLiked(false);
                vo.setIsCollected(false);
            }

            return vo;
        } catch (Exception e) {
            log.error("Error converting post to VO: postId={}, error={}", post != null ? post.getId() : "null", e.getMessage(), e);
            throw e;
        }
    }

    private PostDetailVO convertToDetailVO(Post post, Long currentUserId) {
        PostDetailVO vo = new PostDetailVO();
        BeanUtils.copyProperties(post, vo);
        vo.setIsPinned(post.getIsPinned() != null && post.getIsPinned() == 1);
        vo.setIsEssence(post.getIsEssence() != null && post.getIsEssence() == 1);
        vo.setIsAdmin(false);

        PostDetailVO.AuthorVO authorVO = new PostDetailVO.AuthorVO();
        User author = userMapper.selectById(post.getAuthorId());
        if (author != null) {
            authorVO.setId(author.getId());
            authorVO.setName(author.getNickname());
            authorVO.setAvatar(author.getAvatar());
            authorVO.setSignature(author.getSignature());
        }
        vo.setAuthor(authorVO);

        List<Long> communityIds = postCommunityMapper.selectCommunityIdsByPostId(post.getId());
        if (!communityIds.isEmpty()) {
            Community community = communityMapper.selectById(communityIds.get(0));
            if (community != null) {
                vo.setForumName(community.getName());
            }
        }

        if (post.getSpuId() != null) {
            Spu spu = spuMapper.selectById(post.getSpuId());
            if (spu != null) {
                vo.setSpuName(spu.getName());
            }
        }

        if (currentUserId != null) {
            LambdaQueryWrapper<PostLike> likeWrapper = new LambdaQueryWrapper<>();
            likeWrapper.eq(PostLike::getPostId, post.getId())
                    .eq(PostLike::getUserId, currentUserId);
            vo.setIsLiked(postLikeMapper.selectCount(likeWrapper) > 0);

            LambdaQueryWrapper<PostCollect> collectWrapper = new LambdaQueryWrapper<>();
            collectWrapper.eq(PostCollect::getPostId, post.getId())
                    .eq(PostCollect::getUserId, currentUserId);
            vo.setIsCollected(postCollectMapper.selectCount(collectWrapper) > 0);
        } else {
            vo.setIsLiked(false);
            vo.setIsCollected(false);
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
