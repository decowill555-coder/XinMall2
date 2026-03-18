package com.example.xinmall.service.community;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.example.xinmall.dto.community.request.CreateCommentRequest;
import com.example.xinmall.dto.community.response.CommentVO;

public interface CommentService {

    IPage<CommentVO> getList(Long postId, Integer page, Integer pageSize);

    Long create(CreateCommentRequest request);

    void delete(Long id);

    void like(Long commentId);

    void unlike(Long commentId);

    IPage<CommentVO> getReplies(Long parentId, Integer page, Integer pageSize);
}
