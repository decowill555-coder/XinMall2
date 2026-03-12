package com.example.xinmall.service.system;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.example.xinmall.dto.system.request.CollectionRequest;

public interface CollectionService {

    void add(CollectionRequest request);

    void remove(CollectionRequest request);

    boolean isCollected(Long targetId, Integer targetType);

    Page<?> getMyCollections(Integer targetType, Integer page, Integer size);

    Long getCollectionCount(Long targetId, Integer targetType);
}
