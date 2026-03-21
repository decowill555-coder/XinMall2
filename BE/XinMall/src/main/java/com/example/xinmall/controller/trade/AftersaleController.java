package com.example.xinmall.controller.trade;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.example.xinmall.common.result.PageResult;
import com.example.xinmall.common.result.Result;
import com.example.xinmall.dto.trade.request.AftersaleCreateRequest;
import com.example.xinmall.dto.trade.request.AftersaleLogisticsRequest;
import com.example.xinmall.dto.trade.response.AftersaleDetailVO;
import com.example.xinmall.dto.trade.response.AftersaleVO;
import com.example.xinmall.entity.trade.enums.AftersaleStatus;
import com.example.xinmall.entity.trade.enums.AftersaleType;
import com.example.xinmall.service.trade.AftersaleService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "售后接口", description = "售后管理相关接口")
@RestController
@RequestMapping("/api/aftersale")
@RequiredArgsConstructor
@Validated
public class AftersaleController {

    private final AftersaleService aftersaleService;

    @Operation(summary = "创建售后申请")
    @PostMapping
    public Result<Long> create(@Valid @RequestBody AftersaleCreateRequest request) {
        Long id = aftersaleService.create(request);
        return Result.created(id);
    }

    @Operation(summary = "售后列表")
    @GetMapping
    public Result<PageResult<AftersaleVO>> getList(
            @RequestParam(required = false) AftersaleStatus status,
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size) {
        IPage<AftersaleVO> result = aftersaleService.getList(status, page, size);
        return Result.success(PageResult.of(result));
    }

    @Operation(summary = "售后详情")
    @GetMapping("/{id}")
    public Result<AftersaleDetailVO> getDetail(@PathVariable Long id) {
        AftersaleDetailVO detail = aftersaleService.getDetail(id);
        return Result.success(detail);
    }

    @Operation(summary = "取消售后申请")
    @PutMapping("/{id}/cancel")
    public Result<Void> cancel(@PathVariable Long id) {
        aftersaleService.cancel(id);
        return Result.success();
    }

    @Operation(summary = "提交物流信息")
    @PostMapping("/{id}/logistics")
    public Result<Void> submitLogistics(
            @PathVariable Long id,
            @Valid @RequestBody AftersaleLogisticsRequest request) {
        aftersaleService.submitLogistics(id, request);
        return Result.success();
    }

    @Operation(summary = "获取售后原因列表")
    @GetMapping("/reasons")
    public Result<List<String>> getReasons(@RequestParam(required = false) AftersaleType type) {
        List<String> reasons = aftersaleService.getReasons(type);
        return Result.success(reasons);
    }

    @Operation(summary = "卖家售后列表")
    @GetMapping("/seller")
    public Result<PageResult<AftersaleVO>> getSellerList(
            @RequestParam(required = false) AftersaleStatus status,
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size) {
        IPage<AftersaleVO> result = aftersaleService.getSellerList(status, page, size);
        return Result.success(PageResult.of(result));
    }

    @Operation(summary = "卖家售后数量统计")
    @GetMapping("/seller/count")
    public Result<Long> getSellerAftersaleCount() {
        Long count = aftersaleService.getSellerAftersaleCount();
        return Result.success(count);
    }

    @Operation(summary = "同意售后")
    @PutMapping("/{id}/agree")
    public Result<Void> agree(@PathVariable Long id) {
        aftersaleService.agree(id);
        return Result.success();
    }

    @Operation(summary = "拒绝售后")
    @PutMapping("/{id}/reject")
    public Result<Void> reject(@PathVariable Long id, @RequestBody java.util.Map<String, String> body) {
        String reason = body.get("reason");
        aftersaleService.reject(id, reason);
        return Result.success();
    }
}
