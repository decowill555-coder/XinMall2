package com.example.xinmall.controller.product;

import com.example.xinmall.common.result.Result;
import com.example.xinmall.dto.product.response.CategoryVO;
import com.example.xinmall.service.product.CategoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Tag(name = "分类接口", description = "设备分类相关接口")
@RestController
@RequestMapping("/api/category")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

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
        Map<String, Object> result = new HashMap<>();
        result.put("id", id);
        result.put("name", "分类名称");
        result.put("icon", "");
        result.put("description", "");
        result.put("subCategories", new ArrayList<>());
        result.put("brands", new ArrayList<>());
        result.put("productCount", 0);
        return Result.success(result);
    }
}
