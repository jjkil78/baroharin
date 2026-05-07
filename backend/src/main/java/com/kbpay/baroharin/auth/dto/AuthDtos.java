package com.kbpay.baroharin.auth.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class AuthDtos {

    public record SignupRequest(
            @NotBlank @Size(min = 4, max = 20) String username,
            @NotBlank @Size(min = 4, max = 64) String password,
            @NotBlank @Size(min = 1, max = 30) String nickname
    ) {}

    public record LoginRequest(
            @NotBlank String username,
            @NotBlank String password
    ) {}

    public record AuthResponse(
            String token,
            Long userId,
            String username,
            String nickname,
            Long balance
    ) {}
}
