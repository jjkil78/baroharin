package com.kbpay.baroharin.order;

import com.kbpay.baroharin.common.ApiResponse;
import com.kbpay.baroharin.common.CurrentUser;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    public record PurchaseRequest(Long dealId) {}

    @PostMapping
    public ApiResponse<OrderDto> purchase(@RequestBody PurchaseRequest req) {
        return ApiResponse.ok(orderService.purchase(CurrentUser.requireUserId(), req.dealId()));
    }

    @PostMapping("/{id}/redeem")
    public ApiResponse<OrderDto> redeem(@PathVariable Long id) {
        return ApiResponse.ok(orderService.redeem(CurrentUser.requireUserId(), id));
    }

    @GetMapping("/me")
    public ApiResponse<List<OrderDto>> myOrders() {
        return ApiResponse.ok(orderService.myOrders(CurrentUser.requireUserId()));
    }
}
