package com.kbpay.baroharin.card;

import com.kbpay.baroharin.common.ApiResponse;
import com.kbpay.baroharin.common.CurrentUser;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users/me/card")
@RequiredArgsConstructor
public class UserCardController {

    private final UserCardService userCardService;

    public record RegisterRequest(String cardType) {}

    @GetMapping
    public ApiResponse<UserCardDto> getMyCard() {
        return ApiResponse.ok(userCardService.getMyCard(CurrentUser.requireUserId()));
    }

    @PostMapping
    public ApiResponse<UserCardDto> register(@RequestBody RegisterRequest req) {
        return ApiResponse.ok(userCardService.register(CurrentUser.requireUserId(), req.cardType()));
    }

    @DeleteMapping
    public ApiResponse<Void> unlink() {
        userCardService.unlink(CurrentUser.requireUserId());
        return ApiResponse.ok(null);
    }
}
