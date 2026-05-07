package com.kbpay.baroharin.user;

import com.kbpay.baroharin.common.BusinessException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public UserDto getMe(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> BusinessException.unauthorized("로그인이 필요합니다."));
        return UserDto.from(user);
    }

    @Transactional
    public UserDto charge(Long userId, long amount) {
        if (amount <= 0 || amount > 1_000_000) {
            throw BusinessException.badRequest("충전 금액은 1원 ~ 1,000,000원 사이여야 합니다.");
        }
        User user = userRepository.findByIdForUpdate(userId)
                .orElseThrow(() -> BusinessException.unauthorized("로그인이 필요합니다."));
        user.addBalance(amount);
        return UserDto.from(user);
    }
}
