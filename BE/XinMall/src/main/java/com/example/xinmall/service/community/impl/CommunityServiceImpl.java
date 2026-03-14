package com.example.xinmall.service.community.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.LambdaUpdateWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.example.xinmall.common.exception.BusinessException;
import com.example.xinmall.dto.community.request.*;
import com.example.xinmall.dto.community.response.*;
import com.example.xinmall.entity.community.Community;
import com.example.xinmall.entity.community.CommunityMember;
import com.example.xinmall.mapper.community.CommunityMapper;
import com.example.xinmall.mapper.community.CommunityMemberMapper;
import com.example.xinmall.service.community.CommunityService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class CommunityServiceImpl implements CommunityService {

    private final CommunityMapper communityMapper;
    private final CommunityMemberMapper memberMapper;

    @Override
    public IPage<CommunityVO> getList(CommunityQueryRequest request) {
        Page<Community> page = new Page<>(request.getPage(), request.getPageSize());
        LambdaQueryWrapper<Community> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Community::getStatus, 1);

        if (request.getType() != null && !request.getType().isEmpty()) {
            wrapper.eq(Community::getType, request.getType());
        }
        if (request.getKeyword() != null && !request.getKeyword().isEmpty()) {
            wrapper.like(Community::getName, request.getKeyword());
        }

        if ("hot".equals(request.getSort())) {
            wrapper.orderByDesc(Community::getMemberCount);
        } else if ("new".equals(request.getSort())) {
            wrapper.orderByDesc(Community::getCreatedAt);
        } else if ("member".equals(request.getSort())) {
            wrapper.orderByDesc(Community::getMemberCount);
        } else {
            wrapper.orderByDesc(Community::getMemberCount);
        }

        IPage<Community> communityPage = communityMapper.selectPage(page, wrapper);
        return communityPage.convert(this::convertToVO);
    }

    @Override
    public CommunityDetailVO getDetailById(Long id) {
        Community community = communityMapper.selectById(id);
        if (community == null) {
            throw new BusinessException("社区不存在");
        }
        return convertToDetailVO(community);
    }

    @Override
    public CommunityDetailVO getByName(String name) {
        LambdaQueryWrapper<Community> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Community::getStatus, 1)
                .eq(Community::getName, name);
        Community community = communityMapper.selectOne(wrapper);
        if (community == null) {
            throw new BusinessException("社区不存在");
        }
        return convertToDetailVO(community);
    }

    @Override
    @Transactional
    public Long create(CreateCommunityRequest request) {
        Long userId = getCurrentUserId();
        if (userId == null) {
            throw new BusinessException("请先登录");
        }

        LambdaQueryWrapper<Community> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Community::getName, request.getName());
        if (communityMapper.selectCount(wrapper) > 0) {
            throw new BusinessException("社区名称已存在");
        }

        Community community = new Community();
        community.setName(request.getName());
        community.setType("user");
        community.setDescription(request.getDescription());
        community.setCover(request.getCover());
        community.setCreatorId(userId);
        community.setMemberCount(1);
        community.setPostCount(0);
        community.setStatus(1);
        community.setIsOfficial(0);
        community.setCreatedAt(LocalDateTime.now());
        community.setUpdatedAt(LocalDateTime.now());
        communityMapper.insert(community);

        CommunityMember member = new CommunityMember();
        member.setCommunityId(community.getId());
        member.setUserId(userId);
        member.setLevel(1);
        member.setExp(0);
        member.setIsAdmin(1);
        member.setCreatedAt(LocalDateTime.now());
        memberMapper.insert(member);

        return community.getId();
    }

    @Override
    @Transactional
    public void join(Long communityId) {
        Long userId = getCurrentUserId();
        if (userId == null) {
            throw new BusinessException("请先登录");
        }

        Community community = communityMapper.selectById(communityId);
        if (community == null) {
            throw new BusinessException("社区不存在");
        }

        LambdaQueryWrapper<CommunityMember> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(CommunityMember::getCommunityId, communityId)
                .eq(CommunityMember::getUserId, userId);
        if (memberMapper.selectCount(wrapper) > 0) {
            return;
        }

        CommunityMember member = new CommunityMember();
        member.setCommunityId(communityId);
        member.setUserId(userId);
        member.setLevel(1);
        member.setExp(0);
        member.setIsAdmin(0);
        member.setCreatedAt(LocalDateTime.now());
        memberMapper.insert(member);

        communityMapper.update(null, new LambdaUpdateWrapper<Community>()
                .eq(Community::getId, communityId)
                .setSql("member_count = member_count + 1"));
    }

    @Override
    @Transactional
    public void leave(Long communityId) {
        Long userId = getCurrentUserId();
        if (userId == null) {
            throw new BusinessException("请先登录");
        }

        LambdaQueryWrapper<CommunityMember> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(CommunityMember::getCommunityId, communityId)
                .eq(CommunityMember::getUserId, userId);
        if (memberMapper.delete(wrapper) > 0) {
            communityMapper.update(null, new LambdaUpdateWrapper<Community>()
                    .eq(Community::getId, communityId)
                    .setSql("member_count = GREATEST(member_count - 1, 0)"));
        }
    }

    @Override
    public IPage<CommunityVO> getJoinedCommunities(Integer page, Integer pageSize) {
        Long userId = getCurrentUserId();
        if (userId == null) {
            throw new BusinessException("请先登录");
        }

        LambdaQueryWrapper<CommunityMember> memberWrapper = new LambdaQueryWrapper<>();
        memberWrapper.eq(CommunityMember::getUserId, userId);
        List<CommunityMember> members = memberMapper.selectList(memberWrapper);

        if (members.isEmpty()) {
            Page<CommunityVO> emptyPage = new Page<>(page, pageSize);
            emptyPage.setRecords(new ArrayList<>());
            emptyPage.setTotal(0);
            return emptyPage;
        }

        List<Long> communityIds = members.stream()
                .map(CommunityMember::getCommunityId)
                .collect(Collectors.toList());

        Page<Community> communityPage = new Page<>(page, pageSize);
        LambdaQueryWrapper<Community> wrapper = new LambdaQueryWrapper<>();
        wrapper.in(Community::getId, communityIds)
                .eq(Community::getStatus, 1)
                .orderByDesc(Community::getMemberCount);

        IPage<Community> result = communityMapper.selectPage(communityPage, wrapper);
        return result.convert(this::convertToVO);
    }

    @Override
    public UserForumLevelVO getUserLevel(Long communityId) {
        Long userId = getCurrentUserId();
        if (userId == null) {
            throw new BusinessException("请先登录");
        }

        LambdaQueryWrapper<CommunityMember> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(CommunityMember::getCommunityId, communityId)
                .eq(CommunityMember::getUserId, userId);
        CommunityMember member = memberMapper.selectOne(wrapper);
        if (member == null) {
            throw new BusinessException("您未加入该社区");
        }

        UserForumLevelVO vo = new UserForumLevelVO();
        BeanUtils.copyProperties(member, vo);
        vo.setForumId(communityId);
        return vo;
    }

    private CommunityVO convertToVO(Community community) {
        CommunityVO vo = new CommunityVO();
        BeanUtils.copyProperties(community, vo);
        vo.setIsJoined(checkIsJoined(community.getId()));
        return vo;
    }

    private CommunityDetailVO convertToDetailVO(Community community) {
        CommunityDetailVO vo = new CommunityDetailVO();
        BeanUtils.copyProperties(community, vo);
        vo.setIsJoined(checkIsJoined(community.getId()));
        vo.setIsAdmin(checkIsAdmin(community.getId()));
        return vo;
    }

    private Boolean checkIsJoined(Long communityId) {
        Long userId = getCurrentUserId();
        if (userId == null) {
            return false;
        }
        LambdaQueryWrapper<CommunityMember> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(CommunityMember::getCommunityId, communityId)
                .eq(CommunityMember::getUserId, userId);
        return memberMapper.selectCount(wrapper) > 0;
    }

    private Boolean checkIsAdmin(Long communityId) {
        Long userId = getCurrentUserId();
        if (userId == null) {
            return false;
        }
        LambdaQueryWrapper<CommunityMember> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(CommunityMember::getCommunityId, communityId)
                .eq(CommunityMember::getUserId, userId)
                .eq(CommunityMember::getIsAdmin, 1);
        return memberMapper.selectCount(wrapper) > 0;
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
