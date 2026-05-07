package com.kbpay.baroharin.favorite;

import com.kbpay.baroharin.common.ApiResponse;
import com.kbpay.baroharin.common.CurrentUser;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users/me/favorites")
@RequiredArgsConstructor
public class UserFavoriteController {

    private final UserFavoriteService userFavoriteService;

    @GetMapping
    public ApiResponse<List<Long>> myFavorites() {
        return ApiResponse.ok(userFavoriteService.listMyFavoriteDealIds(CurrentUser.requireUserId()));
    }

    @PostMapping("/{dealId}")
    public ApiResponse<Void> add(@PathVariable Long dealId) {
        userFavoriteService.add(CurrentUser.requireUserId(), dealId);
        return ApiResponse.ok(null);
    }

    @DeleteMapping("/{dealId}")
    public ApiResponse<Void> remove(@PathVariable Long dealId) {
        userFavoriteService.remove(CurrentUser.requireUserId(), dealId);
        return ApiResponse.ok(null);
    }
}
