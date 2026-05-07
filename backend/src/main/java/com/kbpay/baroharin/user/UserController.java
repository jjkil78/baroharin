package com.kbpay.baroharin.user;

import com.kbpay.baroharin.common.ApiResponse;
import com.kbpay.baroharin.common.CurrentUser;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public ApiResponse<UserDto> me() {
        return ApiResponse.ok(userService.getMe(CurrentUser.requireUserId()));
    }

    public record ChargeRequest(Long amount) {}

    @PostMapping("/me/charge")
    public ApiResponse<UserDto> charge(@RequestBody ChargeRequest req) {
        return ApiResponse.ok(userService.charge(CurrentUser.requireUserId(), req.amount()));
    }
}
