package com.example.xinmall.service.system;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.example.xinmall.dto.system.request.CollectionRequest;

public interface CollectionService {

    void add(CollectionRequest request);

    void remove(CollectionRequest request);

    boolean isCollected(Long targetId, Integer targetType);

    IPage<?> getMyCollections(Integer targetType, Integer page, Integer size);

    Long getCollectionCount(Long targetId, Integer targetType);
}
