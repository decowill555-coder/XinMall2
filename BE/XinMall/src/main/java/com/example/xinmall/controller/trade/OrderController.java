package com.example.xinmall.controller.trade;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.example.xinmall.common.result.Result;
import com.example.xinmall.dto.trade.request.OrderCreateRequest;
import com.example.xinmall.dto.trade.request.ShipRequest;
import com.example.xinmall.dto.trade.response.OrderDetailVO;
import com.example.xinmall.dto.trade.response.OrderVO;
import com.example.xinmall.entity.trade.enums.OrderStatus;
import com.example.xinmall.service.trade.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@Tag(name = "订单接口", description = "订单管理相关接口")
@RestController
@RequestMapping("/api/order")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @Operation(summary = "创建订单")
    @PostMapping
    public Result<Long> create(@Valid @RequestBody OrderCreateRequest request) {
        Long id = orderService.create(request);
        return Result.created(id);
    }

    @Operation(summary = "订单列表")
    @GetMapping
    public Result<IPage<OrderVO>> getList(
            @RequestParam(required = false) OrderStatus status,
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size) {
        IPage<OrderVO> result = orderService.getMyOrders(status, page, size);
        return Result.success(result);
    }

    @Operation(summary = "订单详情")
    @GetMapping("/{id}")
    public Result<OrderDetailVO> getDetail(@PathVariable Long id) {
        OrderDetailVO detail = orderService.getDetailById(id);
        return Result.success(detail);
    }

    @Operation(summary = "取消订单")
    @PutMapping("/{id}/cancel")
    public Result<Void> cancel(@PathVariable Long id, @RequestParam(required = false) String reason) {
        orderService.cancel(id, reason);
        return Result.success();
    }

    @Operation(summary = "发货")
    @PutMapping("/{id}/ship")
    public Result<Void> ship(@PathVariable Long id, @Valid @RequestBody ShipRequest request) {
        orderService.ship(id, request.getExpressCompany(), request.getExpressNo());
        return Result.success();
    }

    @Operation(summary = "确认收货")
    @PutMapping("/{id}/receive")
    public Result<Void> receive(@PathVariable Long id) {
        orderService.receive(id);
        return Result.success();
    }

    @Operation(summary = "申请退款")
    @PutMapping("/{id}/refund")
    public Result<Void> refund(@PathVariable Long id, @RequestParam(required = false) String reason) {
        orderService.refund(id, reason);
        return Result.success();
    }

    @Operation(summary = "卖家订单列表")
    @GetMapping("/seller")
    public Result<IPage<OrderVO>> getSellerOrders(
            @RequestParam(required = false) OrderStatus status,
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size) {
        IPage<OrderVO> result = orderService.getMySales(status, page, size);
        return Result.success(result);
    }
}
