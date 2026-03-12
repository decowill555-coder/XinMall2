package com.example.xinmall.service.product;

import com.example.xinmall.dto.product.response.CategoryVO;
import com.example.xinmall.entity.product.Category;

import java.util.List;

public interface CategoryService {

    List<CategoryVO> getCategoryTree();

    List<CategoryVO> getChildrenByParentId(Long parentId);

    Category getById(Long id);
}
