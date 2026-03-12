package com.example.xinmall.service.product;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.example.xinmall.dto.product.request.ProductModelQueryRequest;
import com.example.xinmall.dto.product.response.ProductModelDetailVO;
import com.example.xinmall.dto.product.response.ProductModelVO;
import com.example.xinmall.entity.product.ProductModel;

public interface ProductModelService {

    Page<ProductModelVO> search(ProductModelQueryRequest request);

    ProductModelDetailVO getDetailById(Long id);

    void incrementViewCount(Long id);

    ProductModel getById(Long id);
}
