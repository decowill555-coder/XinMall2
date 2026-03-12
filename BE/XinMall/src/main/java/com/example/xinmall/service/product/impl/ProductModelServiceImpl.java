package com.example.xinmall.service.product.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.LambdaUpdateWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.example.xinmall.common.exception.BusinessException;
import com.example.xinmall.dto.product.request.ProductModelQueryRequest;
import com.example.xinmall.dto.product.response.BrandVO;
import com.example.xinmall.dto.product.response.CategoryVO;
import com.example.xinmall.dto.product.response.ProductModelDetailVO;
import com.example.xinmall.dto.product.response.ProductModelVO;
import com.example.xinmall.entity.product.*;
import com.example.xinmall.entity.product.enums.CommonStatus;
import com.example.xinmall.entity.product.enums.InputType;
import com.example.xinmall.entity.product.enums.ProductModelStatus;
import com.example.xinmall.mapper.product.*;
import com.example.xinmall.service.product.BrandService;
import com.example.xinmall.service.product.CategoryService;
import com.example.xinmall.service.product.ProductModelService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductModelServiceImpl implements ProductModelService {

    private final ProductModelMapper productModelMapper;
    private final ProductModelAttributeMapper productModelAttributeMapper;
    private final AttributeMapper attributeMapper;
    private final AttributeOptionMapper attributeOptionMapper;
    private final BrandService brandService;
    private final CategoryService categoryService;
    private final ObjectMapper objectMapper;

    @Override
    public Page<ProductModelVO> search(ProductModelQueryRequest request) {
        Page<ProductModel> page = new Page<>(request.getPage(), request.getSize());

        LambdaQueryWrapper<ProductModel> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(ProductModel::getStatus, ProductModelStatus.ON_SALE);

        if (StringUtils.hasText(request.getKeyword())) {
            wrapper.like(ProductModel::getName, request.getKeyword());
        }
        if (request.getCategoryId() != null) {
            wrapper.eq(ProductModel::getCategoryId, request.getCategoryId());
        }
        if (request.getBrandId() != null) {
            wrapper.eq(ProductModel::getBrandId, request.getBrandId());
        }
        if (request.getMinPrice() != null) {
            wrapper.ge(ProductModel::getReferencePrice, request.getMinPrice());
        }
        if (request.getMaxPrice() != null) {
            wrapper.le(ProductModel::getReferencePrice, request.getMaxPrice());
        }

        wrapper.orderByDesc(ProductModel::getViewCount);

        Page<ProductModel> result = productModelMapper.selectPage(page, wrapper);

        return result.convert(this::convertToVO);
    }

    @Override
    public ProductModelDetailVO getDetailById(Long id) {
        ProductModel model = productModelMapper.selectById(id);
        if (model == null || model.getStatus() != ProductModelStatus.ON_SALE) {
            throw new BusinessException("产品型号不存在");
        }

        ProductModelDetailVO vo = new ProductModelDetailVO();
        BeanUtils.copyProperties(model, vo);

        if (StringUtils.hasText(model.getImages())) {
            try {
                List<String> images = objectMapper.readValue(model.getImages(), new TypeReference<List<String>>() {});
                vo.setImages(images);
            } catch (JsonProcessingException e) {
                vo.setImages(List.of());
            }
        }

        BrandVO brand = brandService.getById(model.getBrandId());
        if (brand != null) {
            vo.setBrandName(brand.getName());
        }

        CategoryVO category = convertToCategoryVO(categoryService.getById(model.getCategoryId()));
        if (category != null) {
            vo.setCategoryName(category.getName());
        }

        List<ProductModelAttribute> attributeValues = productModelAttributeMapper.selectList(
                new LambdaQueryWrapper<ProductModelAttribute>()
                        .eq(ProductModelAttribute::getModelId, id)
        );

        if (!attributeValues.isEmpty()) {
            List<Long> attributeIds = attributeValues.stream()
                    .map(ProductModelAttribute::getAttributeId)
                    .collect(Collectors.toList());

            List<Attribute> attributes = attributeMapper.selectList(
                    new LambdaQueryWrapper<Attribute>()
                            .in(Attribute::getId, attributeIds)
                            .eq(Attribute::getStatus, CommonStatus.ENABLED)
            );

            List<ProductModelDetailVO.AttributeValueVO> attributeVOs = attributeValues.stream()
                    .map(av -> {
                        ProductModelDetailVO.AttributeValueVO attrVO = new ProductModelDetailVO.AttributeValueVO();
                        attrVO.setAttributeId(av.getAttributeId());
                        attrVO.setValue(av.getValue());

                        attributes.stream()
                                .filter(a -> a.getId().equals(av.getAttributeId()))
                                .findFirst()
                                .ifPresent(attr -> {
                                    attrVO.setAttributeName(attr.getName());
                                    attrVO.setUnit(attr.getUnit());
                                    attrVO.setDisplayValue(getDisplayValue(attr, av.getValue()));
                                });

                        return attrVO;
                    })
                    .collect(Collectors.toList());

            vo.setAttributes(attributeVOs);
        }

        return vo;
    }

    @Override
    public void incrementViewCount(Long id) {
        productModelMapper.update(null,
                new LambdaUpdateWrapper<ProductModel>()
                        .eq(ProductModel::getId, id)
                        .setSql("view_count = view_count + 1")
        );
    }

    @Override
    public ProductModel getById(Long id) {
        return productModelMapper.selectById(id);
    }

    private ProductModelVO convertToVO(ProductModel model) {
        ProductModelVO vo = new ProductModelVO();
        BeanUtils.copyProperties(model, vo);

        BrandVO brand = brandService.getById(model.getBrandId());
        if (brand != null) {
            vo.setBrandName(brand.getName());
        }

        CategoryVO category = convertToCategoryVO(categoryService.getById(model.getCategoryId()));
        if (category != null) {
            vo.setCategoryName(category.getName());
        }

        return vo;
    }

    private CategoryVO convertToCategoryVO(Category category) {
        if (category == null) return null;
        CategoryVO vo = new CategoryVO();
        BeanUtils.copyProperties(category, vo);
        return vo;
    }

    private String getDisplayValue(Attribute attribute, String value) {
        if (value == null) return "";

        if (attribute.getInputType() == InputType.SINGLE_SELECT ||
            attribute.getInputType() == InputType.MULTI_SELECT) {
            List<Long> optionIds = Arrays.stream(value.split(","))
                    .map(String::trim)
                    .filter(StringUtils::hasText)
                    .map(Long::parseLong)
                    .collect(Collectors.toList());

            if (!optionIds.isEmpty()) {
                List<AttributeOption> options = attributeOptionMapper.selectList(
                        new LambdaQueryWrapper<AttributeOption>()
                                .in(AttributeOption::getId, optionIds)
                );
                return options.stream()
                        .map(AttributeOption::getValue)
                        .collect(Collectors.joining(", "));
            }
        }

        String unit = attribute.getUnit();
        if (StringUtils.hasText(unit)) {
            return value + unit;
        }

        return value;
    }
}
