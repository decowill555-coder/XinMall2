package com.example.xinmall.service.product.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.example.xinmall.common.cache.CacheService;
import com.example.xinmall.common.constant.RedisKey;
import com.example.xinmall.dto.product.response.AlphabetCategoryVO;
import com.example.xinmall.dto.product.response.CategoryItemVO;
import com.example.xinmall.dto.product.response.CategoryVO;
import com.example.xinmall.entity.product.Category;
import com.example.xinmall.entity.product.enums.CommonStatus;
import com.example.xinmall.mapper.product.CategoryMapper;
import com.example.xinmall.service.product.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryMapper categoryMapper;
    private final CacheService cacheService;

    private static final long CATEGORY_CACHE_EXPIRE = 3600;

    @Override
    public List<CategoryVO> getCategoryTree() {
        List<CategoryVO> cachedTree = cacheService.get(RedisKey.CATEGORY_LIST, 
                new com.fasterxml.jackson.core.type.TypeReference<List<CategoryVO>>() {}.getType());
        if (cachedTree != null) {
            return cachedTree;
        }

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

        cacheService.set(RedisKey.CATEGORY_LIST, rootCategories, CATEGORY_CACHE_EXPIRE);

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

    @Override
    public List<AlphabetCategoryVO> getAllCategoriesGroupByLetter() {
        // Get all enabled categories (only top-level categories for alphabet grouping)
        List<Category> allCategories = categoryMapper.selectList(
                new LambdaQueryWrapper<Category>()
                        .eq(Category::getStatus, CommonStatus.ENABLED)
                        .and(wrapper -> wrapper.isNull(Category::getParentId).or().eq(Category::getParentId, 0))
                        .orderByAsc(Category::getSort)
        );

        // Group categories by first letter of name (pinyin for Chinese)
        Map<String, List<CategoryItemVO>> groupedByLetter = new TreeMap<>();

        for (Category category : allCategories) {
            String firstLetter = getFirstLetter(category.getName());
            CategoryItemVO item = new CategoryItemVO();
            item.setId(String.valueOf(category.getId()));
            item.setName(category.getName());
            item.setProductCount(0); // Can be calculated based on actual product count
            item.setLetter(firstLetter);

            groupedByLetter.computeIfAbsent(firstLetter, k -> new ArrayList<>()).add(item);
        }

        // Build result list with all 26 letters
        List<AlphabetCategoryVO> result = new ArrayList<>();
        for (char c = 'A'; c <= 'Z'; c++) {
            String letter = String.valueOf(c);
            AlphabetCategoryVO vo = new AlphabetCategoryVO();
            vo.setLetter(letter);
            vo.setCategories(groupedByLetter.getOrDefault(letter, new ArrayList<>()));
            result.add(vo);
        }

        return result;
    }

    /**
     * Get the first letter of a category name.
     * For Chinese characters, returns the first letter of the pinyin.
     * For English, returns the uppercase first letter.
     */
    private String getFirstLetter(String name) {
        if (name == null || name.isEmpty()) {
            return "#";
        }

        char firstChar = name.charAt(0);

        // If it's an English letter, return uppercase
        if ((firstChar >= 'a' && firstChar <= 'z') || (firstChar >= 'A' && firstChar <= 'Z')) {
            return String.valueOf(Character.toUpperCase(firstChar));
        }

        // For Chinese characters, use pinyin first letter mapping
        // This is a simplified mapping for common categories
        Map<Character, String> chinesePinyinMap = new HashMap<>();
        chinesePinyinMap.put('手', "S");
        chinesePinyinMap.put('电', "D");
        chinesePinyinMap.put('相', "X");
        chinesePinyinMap.put('耳', "E");
        chinesePinyinMap.put('平', "P");
        chinesePinyinMap.put('智', "Z");
        chinesePinyinMap.put('游', "Y");
        chinesePinyinMap.put('轻', "Q");
        chinesePinyinMap.put('拍', "P");
        chinesePinyinMap.put('笔', "B");
        chinesePinyinMap.put('台', "T");
        chinesePinyinMap.put('冰', "B");
        chinesePinyinMap.put('蓝', "L");
        chinesePinyinMap.put('打', "D");
        chinesePinyinMap.put('存', "C");
        chinesePinyinMap.put('电', "D");
        chinesePinyinMap.put('服', "F");
        chinesePinyinMap.put('显', "X");
        chinesePinyinMap.put('硬', "Y");
        chinesePinyinMap.put('路', "L");
        chinesePinyinMap.put('键', "J");
        chinesePinyinMap.put('扩', "K");
        chinesePinyinMap.put('鼠', "S");
        chinesePinyinMap.put('内', "N");
        chinesePinyinMap.put('投', "T");
        chinesePinyinMap.put('驱', "Q");
        chinesePinyinMap.put('摄', "S");
        chinesePinyinMap.put('手', "S");
        chinesePinyinMap.put('U', "U");
        chinesePinyinMap.put('网', "W");
        chinesePinyinMap.put('外', "W");
        chinesePinyinMap.put('主', "Z");

        String letter = chinesePinyinMap.get(firstChar);
        if (letter != null) {
            return letter;
        }

        // Default to '#' for unknown characters
        return "#";
    }
}
