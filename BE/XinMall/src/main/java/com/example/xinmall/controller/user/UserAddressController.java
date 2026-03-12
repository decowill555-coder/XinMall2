package com.example.xinmall.controller.user;

import com.example.xinmall.common.result.Result;
import com.example.xinmall.dto.user.request.AddressRequest;
import com.example.xinmall.dto.user.response.UserAddressVO;
import com.example.xinmall.service.user.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "地址接口", description = "用户收货地址管理接口")
@RestController
@RequestMapping("/api/user/address")
@RequiredArgsConstructor
public class UserAddressController {

    private final UserService userService;

    @Operation(summary = "获取地址列表")
    @GetMapping
    public Result<List<UserAddressVO>> getAddressList() {
        List<UserAddressVO> addressList = userService.getAddressList();
        return Result.success(addressList);
    }

    @Operation(summary = "获取地址详情")
    @GetMapping("/{id}")
    public Result<UserAddressVO> getAddressById(@PathVariable Long id) {
        UserAddressVO addressVO = userService.getAddressById(id);
        return Result.success(addressVO);
    }

    @Operation(summary = "添加地址")
    @PostMapping
    public Result<UserAddressVO> addAddress(@Valid @RequestBody AddressRequest request) {
        UserAddressVO addressVO = userService.addAddress(request);
        return Result.created(addressVO);
    }

    @Operation(summary = "更新地址")
    @PutMapping("/{id}")
    public Result<UserAddressVO> updateAddress(@PathVariable Long id, @Valid @RequestBody AddressRequest request) {
        UserAddressVO addressVO = userService.updateAddress(id, request);
        return Result.success(addressVO);
    }

    @Operation(summary = "删除地址")
    @DeleteMapping("/{id}")
    public Result<Void> deleteAddress(@PathVariable Long id) {
        userService.deleteAddress(id);
        return Result.success();
    }

    @Operation(summary = "设为默认地址")
    @PutMapping("/{id}/default")
    public Result<Void> setDefaultAddress(@PathVariable Long id) {
        userService.setDefaultAddress(id);
        return Result.success();
    }
}
