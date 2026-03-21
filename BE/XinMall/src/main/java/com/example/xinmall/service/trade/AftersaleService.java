package com.example.xinmall.service.trade;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.example.xinmall.dto.trade.request.AftersaleCreateRequest;
import com.example.xinmall.dto.trade.request.AftersaleLogisticsRequest;
import com.example.xinmall.dto.trade.response.AftersaleDetailVO;
import com.example.xinmall.dto.trade.response.AftersaleVO;
import com.example.xinmall.entity.trade.Aftersale;
import com.example.xinmall.entity.trade.enums.AftersaleStatus;
import com.example.xinmall.entity.trade.enums.AftersaleType;

import java.util.List;

public interface AftersaleService {

    /**
     * 创建售后申请
     */
    Long create(AftersaleCreateRequest request);

    /**
     * 获取售后列表
     */
    IPage<AftersaleVO> getList(AftersaleStatus status, Integer page, Integer size);

    /**
     * 获取售后详情
     */
    AftersaleDetailVO getDetail(Long id);

    /**
     * 取消售后申请
     */
    void cancel(Long id);

    /**
     * 提交物流信息
     */
    void submitLogistics(Long id, AftersaleLogisticsRequest request);

    /**
     * 获取售后原因列表
     */
    List<String> getReasons(AftersaleType type);

    /**
     * 根据ID获取售后
     */
    Aftersale getById(Long id);

    /**
     * 获取卖家售后列表
     */
    IPage<AftersaleVO> getSellerList(AftersaleStatus status, Integer page, Integer size);

    /**
     * 获取卖家售后数量统计
     */
    Long getSellerAftersaleCount();

    /**
     * 同意售后
     */
    void agree(Long id);

    /**
     * 拒绝售后
     */
    void reject(Long id, String reason);
}
