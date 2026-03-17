package com.example.xinmall.dto.product.response;

import lombok.Data;

import java.io.Serializable;
import java.util.List;

@Data
public class AlphabetCategoryVO implements Serializable {

    private static final long serialVersionUID = 1L;

    private String letter;

    private List<CategoryItemVO> categories;
}
