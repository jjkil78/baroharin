package com.kbpay.baroharin.deal;

import com.kbpay.baroharin.common.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/deals")
@RequiredArgsConstructor
public class DealController {

    private final DealService dealService;

    @GetMapping
    public ApiResponse<List<DealDto>> list(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String q,
            @RequestParam(required = false, defaultValue = "popular") String sort
    ) {
        return ApiResponse.ok(dealService.search(categoryId, q, sort));
    }

    @GetMapping("/{id}")
    public ApiResponse<DealDto> get(@PathVariable Long id) {
        return ApiResponse.ok(dealService.get(id));
    }
}
