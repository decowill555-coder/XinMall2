package com.example.xinmall.controller.community;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.example.xinmall.common.result.Result;
import com.example.xinmall.dto.community.request.*;
import com.example.xinmall.dto.community.response.*;
import com.example.xinmall.service.community.CommunityService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@Tag(name = "社区接口", description = "社区管理相关接口")
@RestController
@RequestMapping("/api/community")
@RequiredArgsConstructor
public class CommunityController {

    private final CommunityService communityService;

    @Operation(summary = "社区列表")
    @GetMapping("/list")
    public Result<IPage<CommunityVO>> getList(CommunityQueryRequest request) {
        IPage<CommunityVO> result = communityService.getList(request);
        return Result.success(result);
    }

    @Operation(summary = "社区详情")
    @GetMapping("/{id}")
    public Result<CommunityDetailVO> getDetail(@PathVariable Long id) {
        CommunityDetailVO detail = communityService.getDetailById(id);
        return Result.success(detail);
    }

    @Operation(summary = "按名称查询")
    @GetMapping("/by-name")
    public Result<CommunityDetailVO> getByName(@RequestParam String name) {
        CommunityDetailVO detail = communityService.getByName(name);
        return Result.success(detail);
    }

    @Operation(summary = "创建社区")
    @PostMapping("/create")
    public Result<Map<String, Object>> create(@RequestBody CreateCommunityRequest request) {
        Long id = communityService.create(request);
        Map<String, Object> result = new HashMap<>();
        result.put("id", id);
        result.put("status", "pending");
        return Result.created(result);
    }

    @Operation(summary = "加入社区")
    @PostMapping("/{id}/join")
    public Result<Map<String, Object>> join(@PathVariable Long id) {
        communityService.join(id);
        Map<String, Object> result = new HashMap<>();
        result.put("success", true);
        return Result.success(result);
    }

    @Operation(summary = "退出社区")
    @PostMapping("/{id}/leave")
    public Result<Map<String, Object>> leave(@PathVariable Long id) {
        communityService.leave(id);
        Map<String, and Object> result = new HashMap<>();
        result.put("success", true);
        return Result.success(result);
    }

    @Operation(summary = "已加入的社区")
    @GetMapping("/joined")
    public Result<IPage<CommunityVO>> getJoinedCommunities(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer pageSize) {
        IPage<CommunityVO> result = communityService.getJoinedCommunities(page, pageSize);
        return Result.success(result);
    }

    @Operation(summary = "用户在社区的等级")
    @GetMapping("/{id}/level")
    public Result<UserForumLevelVO> getUserLevel(@PathVariable Long id) {
        UserForumLevelVO level = communityService.getUserLevel(id);
        return Result.success(level);
    }
}
