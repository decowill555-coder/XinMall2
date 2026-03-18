package com.example.xinmall.controller.product;

import com.example.xinmall.common.result.Result;
import com.example.xinmall.dto.product.response.AlphabetCategoryVO;
import com.example.xinmall.dto.product.response.CategoryVO;
import com.example.xinmall.dto.product.response.BrandVO;
import com.example.xinmall.entity.product.Category;
import com.example.xinmall.service.product.CategoryService;
import com.example.xinmall.service.product.BrandService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Tag(name = "分类接口", description = "设备分类相关接口")
@RestController
@RequestMapping("/api/category")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;
    private final BrandService brandService;

    @Operation(summary = "获取分类树")
    @GetMapping("/tree")
    public Result<List<CategoryVO>> getCategoryTree() {
        List<CategoryVO> tree = categoryService.getCategoryTree();
        return Result.success(tree);
    }

    @Operation(summary = "获取子分类")
    @GetMapping("/children")
    public Result<List<CategoryVO>> getChildren(@RequestParam(required = false, defaultValue = "0") Long parentId) {
        List<CategoryVO> children = categoryService.getChildrenByParentId(parentId);
        return Result.success(children);
    }

    @Operation(summary = "获取分类详情")
    @GetMapping("/{id}")
    public Result<Map<String, Object>> getDetail(@PathVariable Long id) {
        Category category = categoryService.getById(id);
        if (category == null) {
            return Result.success(null);
        }

        Map<String, Object> result = new HashMap<>();
        result.put("id", category.getId());
        result.put("name", category.getName() != null ? category.getName() : "");
        result.put("icon", category.getIcon() != null ? category.getIcon() : "");
        result.put("description", "");

        // 获取子分类列表
        List<CategoryVO> children = categoryService.getChildrenByParentId(id);
        List<Map<String, Object>> subCategories = children.stream().map(child -> {
            Map<String, Object> subCat = new HashMap<>();
            subCat.put("id", child.getId());
            subCat.put("name", child.getName() != null ? child.getName() : "");
            subCat.put("productCount", 0);
            return subCat;
        }).collect(Collectors.toList());
        result.put("subCategories", subCategories);

        // 获取该分类关联的品牌列表
        List<BrandVO> brands = brandService.getBrandsByCategoryId(id);
        // 确保品牌数据格式正确
        List<Map<String, Object>> brandList = brands.stream().map(brand -> {
            Map<String, Object> brandMap = new HashMap<>();
            brandMap.put("id", brand.getId());
            brandMap.put("name", brand.getName() != null ? brand.getName() : "");
            brandMap.put("logo", brand.getLogo() != null ? brand.getLogo() : "");
            brandMap.put("productCount", 0);
            return brandMap;
        }).collect(Collectors.toList());
        result.put("brands", brandList);

        result.put("productCount", 0);
        return Result.success(result);
    }

    @Operation(summary = "获取所有分类按字母分组")
    @GetMapping("/all")
    public Result<List<AlphabetCategoryVO>> getAllCategories() {
        List<AlphabetCategoryVO> categories = categoryService.getAllCategoriesGroupByLetter();
        return Result.success(categories);
    }
}
