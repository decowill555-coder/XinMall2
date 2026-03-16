package com.example.xinmall.controller.community;

import com.example.xinmall.common.result.PageResult;
import com.example.xinmall.common.result.Result;
import com.example.xinmall.dto.community.request.CommunityQueryRequest;
import com.example.xinmall.dto.community.request.CreateCommunityRequest;
import com.example.xinmall.dto.community.response.CommunityDetailVO;
import com.example.xinmall.dto.community.response.CommunityVO;
import com.example.xinmall.dto.community.response.UserForumLevelVO;
import com.example.xinmall.service.community.CommunityService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Tag(name = "社区接口", description = "社区管理相关接口")
@RestController
@RequestMapping("/api/community")
@RequiredArgsConstructor
public class CommunityController {

    private final CommunityService communityService;

    @Operation(summary = "社区列表")
    @GetMapping("/list")
    public Result<PageResult<CommunityVO>> list(CommunityQueryRequest request) {
        return Result.success(PageResult.of(communityService.getList(request)));
    }

    @Operation(summary = "社区详情")
    @GetMapping("/{id}")
    public Result<CommunityDetailVO> detail(@PathVariable Long id) {
        return Result.success(communityService.getDetailById(id));
    }

    @Operation(summary = "按名称查询")
    @GetMapping("/by-name")
    public Result<CommunityDetailVO> byName(@RequestParam String name) {
        return Result.success(communityService.getByName(name));
    }

    @Operation(summary = "创建社区")
    @PostMapping("/create")
    public Result<Long> create(@Valid @RequestBody CreateCommunityRequest request) {
        return Result.success(communityService.create(request));
    }

    @Operation(summary = "加入社区")
    @PostMapping("/{id}/join")
    public Result<Void> join(@PathVariable Long id) {
        communityService.join(id);
        return Result.success();
    }

    @Operation(summary = "退出社区")
    @PostMapping("/{id}/leave")
    public Result<Void> leave(@PathVariable Long id) {
        communityService.leave(id);
        return Result.success();
    }

    @Operation(summary = "已加入的社区")
    @GetMapping("/joined")
    public Result<PageResult<CommunityVO>> joined(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer pageSize) {
        return Result.success(PageResult.of(communityService.getJoinedCommunities(page, pageSize)));
    }

    @Operation(summary = "社区等级")
    @GetMapping("/{id}/level")
    public Result<UserForumLevelVO> level(@PathVariable Long id) {
        return Result.success(communityService.getUserLevel(id));
    }

    @Operation(summary = "热门标签")
    @GetMapping("/tags/hot")
    public Result<List<Map<String, Object>>> hotTags(
            @RequestParam(required = false) Long communityId,
            @RequestParam(defaultValue = "10") Integer limit) {
        // 返回模拟数据，实际项目中应从数据库查询
        List<Map<String, Object>> tags = List.of(
                Map.of("name", "iPhone 16", "count", 156),
                Map.of("name", "MacBook Pro", "count", 128),
                Map.of("name", "新手入门", "count", 98),
                Map.of("name", "开箱评测", "count", 87),
                Map.of("name", "技巧分享", "count", 76),
                Map.of("name", "问题求助", "count", 65),
                Map.of("name", "二手交易", "count", 54),
                Map.of("name", "配件推荐", "count", 43),
                Map.of("name", "系统更新", "count", 32),
                Map.of("name", "电池续航", "count", 28)
        );
        return Result.success(tags.size() > limit ? tags.subList(0, limit) : tags);
    }
}
