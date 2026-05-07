package com.kbpay.baroharin.user;

public record UserDto(Long id, String username, String nickname, Long balance) {
    public static UserDto from(User u) {
        return new UserDto(u.getId(), u.getUsername(), u.getNickname(), u.getBalance());
    }
}
