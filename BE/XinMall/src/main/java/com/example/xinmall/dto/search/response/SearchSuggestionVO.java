package com.example.xinmall.dto.search.response;

import lombok.Data;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.List;

@Data
public class SearchSuggestionVO implements Serializable {

    private static final long serialVersionUID = 1L;

    private String keyword;

    private String type;

    private String subtitle;

    private String cover;

    private Long id;
}
