package com.example.xinmall.service.product;

import com.example.xinmall.dto.product.response.BrandVO;
import com.example.xinmall.entity.product.Brand;

import java.util.List;

public interface BrandService {

    List<BrandVO> getBrandsByCategoryId(Long categoryId);

    BrandVO getById(Long id);

    List<BrandVO> searchByName(String keyword);
}
