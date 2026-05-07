package com.kbpay.baroharin.card;

import java.time.LocalDateTime;

public record UserCardDto(
        Long id,
        String cardType,
        String cardNumber,
        LocalDateTime registeredAt
) {
    public static UserCardDto from(UserCard c) {
        return new UserCardDto(c.getId(), c.getCardType().name(), c.getCardNumber(), c.getRegisteredAt());
    }
}
