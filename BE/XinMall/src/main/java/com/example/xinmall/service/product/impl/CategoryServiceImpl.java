package com.example.xinmall.service.product.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.example.xinmall.dto.product.response.CategoryVO;
import com.example.xinmall.entity.product.Category;
import com.example.xinmall.entity.product.enums.CommonStatus;
import com.example.xinmall.mapper.product.CategoryMapper;
import com.example.xinmall.service.product.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryMapper categoryMapper;

    @Override
    public List<CategoryVO> getCategoryTree() {
        List<Category> allCategories = categoryMapper.selectList(
                new LambdaQueryWrapper<Category>()
                        .eq(Category::getStatus, CommonStatus.ENABLED)
                        .orderByAsc(Category::getSort)
        );

        List<CategoryVO> rootCategories = allCategories.stream()
                .filter(c -> c.getParentId() == null || c.getParentId() == 0)
                .map(this::convertToVO)
                .collect(Collectors.toList());

        rootCategories.forEach(root -> buildChildren(root, allCategories));

        return rootCategories;
    }

    @Override
    public List<CategoryVO> getChildrenByParentId(Long parentId) {
        List<Category> children = categoryMapper.selectList(
                new LambdaQueryWrapper<Category>()
                        .eq(Category::getParentId, parentId)
                        .eq(Category::getStatus, CommonStatus.ENABLED)
                        .orderByAsc(Category::getSort)
        );
        return children.stream().map(this::convertToVO).collect(Collectors.toList());
    }

    @Override
    public Category getById(Long id) {
        return categoryMapper.selectById(id);
    }

    private void buildChildren(CategoryVO parent, List<Category> allCategories) {
        List<CategoryVO> children = allCategories.stream()
                .filter(c -> parent.getId().equals(c.getParentId()))
                .map(this::convertToVO)
                .collect(Collectors.toList());

        parent.setChildren(children);

        children.forEach(child -> buildChildren(child, allCategories));
    }

    private CategoryVO convertToVO(Category category) {
        CategoryVO vo = new CategoryVO();
        BeanUtils.copyProperties(category, vo);
        return vo;
    }
}
