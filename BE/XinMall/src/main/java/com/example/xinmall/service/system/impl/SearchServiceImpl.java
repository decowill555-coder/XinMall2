package com.example.xinmall.service.system.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.LambdaUpdateWrapper;
import com.example.xinmall.common.constant.RedisKey;
import com.example.xinmall.dto.system.response.SearchHistoryVO;
import com.example.xinmall.entity.system.HotSearch;
import com.example.xinmall.entity.system.SearchHistory;
import com.example.xinmall.mapper.system.HotSearchMapper;
import com.example.xinmall.mapper.system.SearchHistoryMapper;
import com.example.xinmall.service.system.SearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.ZSetOperations;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class SearchServiceImpl implements SearchService {

    private final SearchHistoryMapper searchHistoryMapper;
    private final HotSearchMapper hotSearchMapper;
    private final StringRedisTemplate redisTemplate;

    @Override
    public void saveSearchHistory(Long userId, String keyword, Integer searchType, Integer resultCount, String ip) {
        SearchHistory history = new SearchHistory();
        history.setUserId(userId);
        history.setKeyword(keyword);
        history.setSearchType(searchType);
        history.setResultCount(resultCount);
        history.setIp(ip);
        history.setCreatedAt(LocalDateTime.now());
        searchHistoryMapper.insert(history);

        incrementHotSearch(keyword, searchType);
    }

    @Override
    public List<SearchHistoryVO> getUserSearchHistory(Long userId, Integer limit) {
        List<SearchHistory> histories = searchHistoryMapper.selectList(
                new LambdaQueryWrapper<SearchHistory>()
                        .eq(SearchHistory::getUserId, userId)
                        .orderByDesc(SearchHistory::getCreatedAt)
                        .last("LIMIT " + limit)
        );

        return histories.stream().map(h -> {
            SearchHistoryVO vo = new SearchHistoryVO();
            BeanUtils.copyProperties(h, vo);
            return vo;
        }).toList();
    }

    @Override
    public void clearUserSearchHistory(Long userId) {
        searchHistoryMapper.delete(
                new LambdaQueryWrapper<SearchHistory>()
                        .eq(SearchHistory::getUserId, userId)
        );
    }

    @Override
    public List<String> getHotSearchList(Integer searchType, Integer limit) {
        String key = RedisKey.SEARCH_HOT + ":" + searchType;
        
        Set<ZSetOperations.TypedTuple<String>> tuples = redisTemplate.opsForZSet()
                .reverseRangeWithScores(key, 0, limit - 1);
        
        if (tuples == null || tuples.isEmpty()) {
            List<HotSearch> hotSearches = hotSearchMapper.selectList(
                    new LambdaQueryWrapper<HotSearch>()
                            .eq(HotSearch::getSearchType, searchType)
                            .eq(HotSearch::getStatus, 1)
                            .orderByDesc(HotSearch::getSearchCount)
                            .last("LIMIT " + limit)
            );
            return hotSearches.stream().map(HotSearch::getKeyword).toList();
        }

        return tuples.stream()
                .map(ZSetOperations.TypedTuple::getValue)
                .toList();
    }

    @Override
    public void incrementHotSearch(String keyword, Integer searchType) {
        String key = RedisKey.SEARCH_HOT + ":" + searchType;
        redisTemplate.opsForZSet().incrementScore(key, keyword, 1);
        redisTemplate.expire(key, 7, TimeUnit.DAYS);

        HotSearch hotSearch = hotSearchMapper.selectOne(
                new LambdaQueryWrapper<HotSearch>()
                        .eq(HotSearch::getKeyword, keyword)
                        .eq(HotSearch::getSearchType, searchType)
        );

        if (hotSearch != null) {
            hotSearchMapper.update(null,
                    new LambdaUpdateWrapper<HotSearch>()
                            .eq(HotSearch::getId, hotSearch.getId())
                            .setSql("search_count = search_count + 1")
            );
        } else {
            hotSearch = new HotSearch();
            hotSearch.setKeyword(keyword);
            hotSearch.setSearchType(searchType);
            hotSearch.setSearchCount(1);
            hotSearch.setStatus(1);
            hotSearch.setCreatedAt(LocalDateTime.now());
            hotSearch.setUpdatedAt(LocalDateTime.now());
            hotSearchMapper.insert(hotSearch);
        }
    }
}
