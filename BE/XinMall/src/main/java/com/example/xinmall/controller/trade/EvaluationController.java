package com.example.xinmall.controller.trade;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.example.xinmall.common.result.Result;
import com.example.xinmall.dto.trade.request.EvaluationRequest;
import com.example.xinmall.dto.trade.response.EvaluationVO;
import com.example.xinmall.service.trade.EvaluationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@Tag(name = "评价接口", description = "订单评价相关接口")
@RestController
@RequestMapping("/api/evaluation")
@RequiredArgsConstructor
public class EvaluationController {

    private final EvaluationService evaluationService;

    @Operation(summary = "提交评价")
    @PostMapping
    public Result<Long> create(@Valid @RequestBody EvaluationRequest request) {
        Long id = evaluationService.create(request);
        return Result.created(id);
    }

    @Operation(summary = "商品评价列表")
    @GetMapping("/goods/{goodsId}")
    public Result<Page<EvaluationVO>> getByGoodsId(
            @PathVariable Long goodsId,
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size) {
        Page<EvaluationVO> result = evaluationService.getByGoodsId(goodsId, page, size);
        return Result.success(result);
    }

    @Operation(summary = "卖家收到的评价")
    @GetMapping("/seller/{sellerId}")
    public Result<Page<EvaluationVO>> getBySellerId(
            @PathVariable Long sellerId,
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size) {
        Page<EvaluationVO> result = evaluationService.getBySellerId(sellerId, page, size);
        return Result.success(result);
    }

    @Operation(summary = "回复评价")
    @PostMapping("/{id}/reply")
    public Result<Void> reply(@PathVariable Long id, @RequestParam String content) {
        evaluationService.reply(id, content);
        return Result.success();
    }
}
