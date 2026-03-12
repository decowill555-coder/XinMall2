package com.example.xinmall.controller.product;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.example.xinmall.common.result.Result;
import com.example.xinmall.dto.product.request.ProductModelQueryRequest;
import com.example.xinmall.dto.product.response.ProductModelDetailVO;
import com.example.xinmall.dto.product.response.ProductModelVO;
import com.example.xinmall.service.product.ProductModelService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@Tag(name = "产品型号接口", description = "产品型号相关接口")
@RestController
@RequestMapping("/api/product")
@RequiredArgsConstructor
public class ProductModelController {

    private final ProductModelService productModelService;

    @Operation(summary = "搜索产品型号")
    @GetMapping("/search")
    public Result<IPage<ProductModelVO>> search(ProductModelQueryRequest request) {
        IPage<ProductModelVO> result = productModelService.search(request);
        return Result.success(result);
    }

    @Operation(summary = "获取产品详情")
    @GetMapping("/{id}")
    public Result<ProductModelDetailVO> getDetail(@PathVariable Long id) {
        ProductModelDetailVO detail = productModelService.getDetailById(id);
        productModelService.incrementViewCount(id);
        return Result.success(detail);
    }
}
