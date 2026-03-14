package com.example.xinmall.service.community;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.example.xinmall.dto.community.request.*;
import com.example.xinmall.dto.community.response.*;

import java.util.List;

public interface CommunityService {

    IPage<CommunityVO> getList(CommunityQueryRequest request);

    CommunityDetailVO getDetailById(Long id);

    CommunityDetailVO getByName(String name);

    Long create(CreateCommunityRequest request);

    void join(Long communityId);

    void leave(Long communityId);

    IPage<CommunityVO> getJoinedCommunities(Integer page, Integer pageSize);

    UserForumLevelVO getUserLevel(Long communityId);
}
