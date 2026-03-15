package com.example.xinmall.service.system.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.example.xinmall.entity.product.enums.CommonStatus;
import com.example.xinmall.entity.system.Banner;
import com.example.xinmall.mapper.system.BannerMapper;
import com.example.xinmall.service.system.BannerService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BannerServiceImpl implements BannerService {

    private final BannerMapper bannerMapper;

    @Override
    public List<Banner> getBannerList() {
        return bannerMapper.selectList(
                new LambdaQueryWrapper<Banner>()
                        .eq(Banner::getStatus, CommonStatus.ENABLED.getCode())
                        .orderByAsc(Banner::getSort)
        );
    }
}
