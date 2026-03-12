package com.example.xinmall.service.product;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.example.xinmall.dto.product.request.ProductModelQueryRequest;
import com.example.xinmall.dto.product.response.ProductModelDetailVO;
import com.example.xinmall.dto.product.response.ProductModelVO;
import com.example.xinmall.entity.product.ProductModel;

public interface ProductModelService {

    IPage<ProductModelVO> search(ProductModelQueryRequest request);

    ProductModelDetailVO getDetailById(Long id);

    void incrementViewCount(Long id);

    ProductModel getById(Long id);
}
