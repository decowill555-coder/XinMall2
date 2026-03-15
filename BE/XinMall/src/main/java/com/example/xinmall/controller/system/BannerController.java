package com.example.xinmall.controller.system;

import com.example.xinmall.common.result.Result;
import com.example.xinmall.entity.system.Banner;
import com.example.xinmall.service.system.BannerService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Tag(name = "Banner接口", description = "轮播图管理相关接口")
@RestController
@RequestMapping("/api/banner")
@RequiredArgsConstructor
public class BannerController {

    private final BannerService bannerService;

    @Operation(summary = "获取Banner列表")
    @GetMapping("/list")
    public Result<List<Banner>> getBannerList() {
        List<Banner> banners = bannerService.getBannerList();
        return Result.success(banners);
    }
}
