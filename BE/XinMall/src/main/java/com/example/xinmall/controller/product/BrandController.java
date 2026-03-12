package com.example.xinmall.controller.product;

import com.example.xinmall.common.result.Result;
import com.example.xinmall.dto.product.response.BrandVO;
import com.example.xinmall.service.product.BrandService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "品牌接口", description = "品牌相关接口")
@RestController
@RequestMapping("/api/brand")
@RequiredArgsConstructor
public class BrandController {

    private final BrandService brandService;

    @Operation(summary = "按分类获取品牌列表")
    @GetMapping("/list")
    public Result<List<BrandVO>> getBrandsByCategory(@RequestParam Long categoryId) {
        List<BrandVO> brands = brandService.getBrandsByCategoryId(categoryId);
        return Result.success(brands);
    }

    @Operation(summary = "获取品牌详情")
    @GetMapping("/{id}")
    public Result<BrandVO> getBrandById(@PathVariable Long id) {
        BrandVO brand = brandService.getById(id);
        return Result.success(brand);
    }

    @Operation(summary = "搜索品牌")
    @GetMapping("/search")
    public Result<List<BrandVO>> searchBrands(@RequestParam String keyword) {
        List<BrandVO> brands = brandService.searchByName(keyword);
        return Result.success(brands);
    }
}
