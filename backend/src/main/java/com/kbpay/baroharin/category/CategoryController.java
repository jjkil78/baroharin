package com.kbpay.baroharin.category;

import com.kbpay.baroharin.common.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryRepository categoryRepository;

    @GetMapping
    public ApiResponse<List<CategoryDto>> list() {
        List<CategoryDto> result = categoryRepository.findAllByOrderBySortOrderAsc()
                .stream().map(CategoryDto::from).toList();
        return ApiResponse.ok(result);
    }
}
