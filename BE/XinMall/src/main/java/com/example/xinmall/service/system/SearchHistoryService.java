package com.example.xinmall.service.system;

import com.example.xinmall.dto.system.response.SearchHistoryVO;

import java.util.List;

public interface SearchHistoryService {

    void saveSearchHistory(Long userId, String keyword, Integer searchType, Integer resultCount, String ip);

    List<SearchHistoryVO> getUserSearchHistory(Long userId, Integer limit);

    void clearUserSearchHistory(Long userId);

    List<String> getHotSearchList(Integer searchType, Integer limit);

    void incrementHotSearch(String keyword, Integer searchType);
}
