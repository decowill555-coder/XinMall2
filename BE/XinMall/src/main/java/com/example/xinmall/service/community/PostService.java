package com.example.xinmall.service.community;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.example.xinmall.dto.community.request.CreatePostRequest;
import com.example.xinmall.dto.community.request.PostQueryRequest;
import com.example.xinmall.dto.community.response.PostDetailVO;
import com.example.xinmall.dto.community.response.PostVO;

public interface PostService {

    IPage<PostVO> getList(PostQueryRequest request);

    PostDetailVO getDetailById(Long id);

    Long create(CreatePostRequest request);

    void delete(Long id);

    void like(Long postId);

    void unlike(Long postId);

    void collect(Long postId);

    void uncollect(Long postId);

    void pin(Long postId);

    void unpin(Long postId);

    void setEssence(Long postId);

    IPage<PostVO> getUserPosts(Long userId, Integer page, Integer pageSize);

    IPage<PostVO> getMyPosts(Integer page, Integer pageSize);
}
