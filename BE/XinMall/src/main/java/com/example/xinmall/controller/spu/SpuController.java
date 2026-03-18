package com.example.xinmall.controller.spu;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.example.xinmall.common.result.PageResult;
import com.example.xinmall.common.result.Result;
import com.example.xinmall.dto.spu.request.SpuProductRequest;
import com.example.xinmall.dto.spu.request.SpuQueryRequest;
import com.example.xinmall.dto.spu.response.*;
import com.example.xinmall.service.spu.SpuService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Tag(name = "SPU接口", description = "SPU标准产品单元相关接口")
@RestController
@RequestMapping("/api/spu")
@RequiredArgsConstructor
public class SpuController {

    private final SpuService spuService;

    @Operation(summary = "SPU详情")
    @GetMapping("/{id}")
    public Result<SpuDetailVO> getDetail(@PathVariable Long id) {
        SpuDetailVO detail = spuService.getDetailById(id);
        return Result.success(detail);
    }

    @Operation(summary = "SPU列表")
    @GetMapping("/list")
    public Result<PageResult<SpuListVO>> getList(SpuQueryRequest request) {
        IPage<SpuListVO> result = spuService.search(request);
        return Result.success(PageResult.of(result));
    }

    @Operation(summary = "SPU搜索")
    @GetMapping("/search")
    public Result<Map<String, Object>> search(SpuQueryRequest request) {
        IPage<SpuListVO> result = spuService.search(request);
        Map<String, Object> response = new HashMap<>();
        response.put("list", result.getRecords());
        response.put("total", result.getTotal());
        response.put("hasMore", result.getCurrent() < result.getPages());
        return Result.success(response);
    }

    @Operation(summary = "SPU商品列表")
    @GetMapping("/{id}/products")
    public Result<PageResult<SpuProductVO>> getProducts(
            @PathVariable Long id,
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer pageSize) {
        IPage<SpuProductVO> result = spuService.getProducts(id, page, pageSize);
        return Result.success(PageResult.of(result));
    }

    @Operation(summary = "SPU帖子列表")
    @GetMapping("/{id}/posts")
    public Result<PageResult<SpuPostVO>> getPosts(
            @PathVariable Long id,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String sort,
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer pageSize) {
        IPage<SpuPostVO> result = spuService.getPosts(id, type, sort, page, pageSize);
        return Result.success(PageResult.of(result));
    }

    @Operation(summary = "SPU评价列表")
    @GetMapping("/{id}/evaluations")
    public Result<PageResult<SpuEvaluationVO>> getEvaluations(
            @PathVariable Long id,
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer pageSize) {
        IPage<SpuEvaluationVO> result = spuService.getEvaluations(id, page, pageSize);
        return Result.success(PageResult.of(result));
    }

    @Operation(summary = "关注SPU")
    @PostMapping("/{id}/follow")
    public Result<Map<String, Object>> follow(@PathVariable Long id) {
        spuService.follow(id);
        Long memberCount = spuService.getMemberCount(id);
        Map<String, Object> result = new HashMap<>();
        result.put("success", true);
        result.put("memberCount", memberCount);
        return Result.success(result);
    }

    @Operation(summary = "取消关注")
    @PostMapping("/{id}/unfollow")
    public Result<Map<String, Object>> unfollow(@PathVariable Long id) {
        spuService.unfollow(id);
        Long memberCount = spuService.getMemberCount(id);
        Map<String, Object> result = new HashMap<>();
        result.put("success", true);
        result.put("memberCount", memberCount);
        return Result.success(result);
    }

    @Operation(summary = "热门SPU")
    @GetMapping("/hot")
    public Result<List<SpuListVO>> getHotSpus(
            @RequestParam(required = false) Long deviceTypeId,
            @RequestParam(defaultValue = "10") Integer limit) {
        List<SpuListVO> result = spuService.getHotSpus(deviceTypeId, limit);
        return Result.success(result);
    }

    @Operation(summary = "价格趋势")
    @GetMapping("/{id}/price-trend")
    public Result<List<SpuPriceTrendVO>> getPriceTrend(
            @PathVariable Long id,
            @RequestParam(defaultValue = "30") Integer days) {
        List<SpuPriceTrendVO> result = spuService.getPriceTrend(id, days);
        return Result.success(result);
    }

    @Operation(summary = "规格选项")
    @GetMapping("/{id}/spec-options")
    public Result<List<SpuSpecOptionVO>> getSpecOptions(@PathVariable Long id) {
        List<SpuSpecOptionVO> result = spuService.getSpecOptions(id);
        return Result.success(result);
    }

    @Operation(summary = "相关SPU")
    @GetMapping("/{id}/related")
    public Result<List<SpuListVO>> getRelatedSpus(
            @PathVariable Long id,
            @RequestParam(defaultValue = "6") Integer limit) {
        List<SpuListVO> result = spuService.getRelatedSpus(id, limit);
        return Result.success(result);
    }

    @Operation(summary = "已关注的SPU")
    @GetMapping("/followed")
    public Result<PageResult<SpuListVO>> getFollowedSpus(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer pageSize) {
        IPage<SpuListVO> result = spuService.getFollowedSpus(page, pageSize);
        return Result.success(PageResult.of(result));
    }
}
