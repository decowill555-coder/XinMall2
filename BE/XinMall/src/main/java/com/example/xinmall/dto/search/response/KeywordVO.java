package com.example.xinmall.dto.search.response;

import lombok.Data;

import java.io.Serializable;

@Data
public class KeywordVO implements Serializable {

    private static final long serialVersionUID = 1L;

    private String keyword;

    private String category;
}
