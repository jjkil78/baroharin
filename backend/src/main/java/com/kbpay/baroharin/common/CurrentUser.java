package com.kbpay.baroharin.common;

import org.springframework.security.core.context.SecurityContextHolder;

public class CurrentUser {

    private CurrentUser() {}

    public static Long requireUserId() {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !(auth.getPrincipal() instanceof Long userId)) {
            throw BusinessException.unauthorized("로그인이 필요합니다.");
        }
        return userId;
    }
}
