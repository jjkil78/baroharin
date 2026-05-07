package com.kbpay.baroharin.auth;

import com.kbpay.baroharin.auth.dto.AuthDtos.*;
import com.kbpay.baroharin.common.BusinessException;
import com.kbpay.baroharin.user.User;
import com.kbpay.baroharin.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtProvider jwtProvider;

    @Value("${app.initial-balance}")
    private long initialBalance;

    @Transactional
    public AuthResponse signup(SignupRequest req) {
        if (userRepository.existsByUsername(req.username())) {
            throw BusinessException.conflict("이미 사용 중인 아이디입니다.");
        }
        User user = User.builder()
                .username(req.username())
                .password(passwordEncoder.encode(req.password()))
                .nickname(req.nickname())
                .balance(initialBalance)
                .build();
        userRepository.save(user);
        String token = jwtProvider.createToken(user.getId(), user.getUsername());
        return new AuthResponse(token, user.getId(), user.getUsername(), user.getNickname(), user.getBalance());
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest req) {
        User user = userRepository.findByUsername(req.username())
                .orElseThrow(() -> BusinessException.unauthorized("아이디 또는 비밀번호가 올바르지 않습니다."));
        if (!passwordEncoder.matches(req.password(), user.getPassword())) {
            throw BusinessException.unauthorized("아이디 또는 비밀번호가 올바르지 않습니다.");
        }
        String token = jwtProvider.createToken(user.getId(), user.getUsername());
        return new AuthResponse(token, user.getId(), user.getUsername(), user.getNickname(), user.getBalance());
    }
}
