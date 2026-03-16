package com.example.xinmall.common.result;

import com.baomidou.mybatisplus.core.metadata.IPage;
import lombok.Data;

import java.io.Serializable;
import java.util.Collections;
import java.util.List;

@Data
public class PageResult<T> implements Serializable {

    private static final long serialVersionUID = 1L;

    private List<T> list;
    private Long total;
    private Boolean hasMore;
    private Long page;
    private Long size;
    private Long pages;

    public PageResult() {
    }

    public PageResult(List<T> list, Long total, Long page, Long size) {
        this.list = list;
        this.total = total;
        this.page = page;
        this.size = size;
        this.pages = size > 0 ? (total + size - 1) / size : 0L;
        this.hasMore = page < this.pages;
    }

    public static <T> PageResult<T> of(List<T> list, Long total, Long page, Long size) {
        return new PageResult<>(list, total, page, size);
    }

    public static <T> PageResult<T> of(IPage<T> page) {
        PageResult<T> result = new PageResult<>();
        result.setList(page.getRecords());
        result.setTotal(page.getTotal());
        result.setPage(page.getCurrent());
        result.setSize(page.getSize());
        result.setPages(page.getPages());
        result.setHasMore(page.getCurrent() < page.getPages());
        return result;
    }

    public static <T> PageResult<T> empty() {
        PageResult<T> result = new PageResult<>(Collections.emptyList(), 0L, 1L, 10L);
        result.setHasMore(false);
        return result;
    }

    public static <T> PageResult<T> empty(Long page, Long size) {
        PageResult<T> result = new PageResult<>(Collections.emptyList(), 0L, page, size);
        result.setHasMore(false);
        return result;
    }

    public boolean hasNext() {
        return page < pages;
    }

    public boolean hasPrevious() {
        return page > 1;
    }
}
