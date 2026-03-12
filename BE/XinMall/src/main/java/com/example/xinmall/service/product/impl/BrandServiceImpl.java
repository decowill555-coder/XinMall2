package com.example.xinmall.service.product.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.example.xinmall.dto.product.response.BrandVO;
import com.example.xinmall.entity.product.Brand;
import com.example.xinmall.entity.product.BrandCategory;
import com.example.xinmall.entity.product.enums.CommonStatus;
import com.example.xinmall.mapper.product.BrandCategoryMapper;
import com.example.xinmall.mapper.product.BrandMapper;
import com.example.xinmall.service.product.BrandService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BrandServiceImpl implements BrandService {

    private final BrandMapper brandMapper;
    private final BrandCategoryMapper brandCategoryMapper;

    @Override
    public List<BrandVO> getBrandsByCategoryId(Long categoryId) {
        List<BrandCategory> brandCategories = brandCategoryMapper.selectList(
                new LambdaQueryWrapper<BrandCategory>()
                        .eq(BrandCategory::getCategoryId, categoryId)
        );

        List<Long> brandIds = brandCategories.stream()
                .map(BrandCategory::getBrandId)
                .collect(Collectors.toList());

        if (brandIds.isEmpty()) {
            return List.of();
        }

        List<Brand> brands = brandMapper.selectList(
                new LambdaQueryWrapper<Brand>()
                        .in(Brand::getId, brandIds)
                        .eq(Brand::getStatus, CommonStatus.ENABLED)
                        .orderByAsc(Brand::getSort)
        );

        return brands.stream().map(this::convertToVO).collect(Collectors.toList());
    }

    @Override
    public BrandVO getById(Long id) {
        Brand brand = brandMapper.selectById(id);
        if (brand == null || brand.getStatus() != CommonStatus.ENABLED) {
            return null;
        }
        return convertToVO(brand);
    }

    @Override
    public List<BrandVO> searchByName(String keyword) {
        List<Brand> brands = brandMapper.selectList(
                new LambdaQueryWrapper<Brand>()
                        .like(Brand::getName, keyword)
                        .eq(Brand::getStatus, CommonStatus.ENABLED)
                        .orderByAsc(Brand::getSort)
        );
        return brands.stream().map(this::convertToVO).collect(Collectors.toList());
    }

    private BrandVO convertToVO(Brand brand) {
        BrandVO vo = new BrandVO();
        BeanUtils.copyProperties(brand, vo);
        return vo;
    }
}
