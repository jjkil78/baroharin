package com.kbpay.baroharin.card;

import com.kbpay.baroharin.common.BusinessException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;

@Service
@RequiredArgsConstructor
public class UserCardService {

    private final UserCardRepository userCardRepository;

    private static final SecureRandom RNG = new SecureRandom();

    @Transactional(readOnly = true)
    public UserCardDto getMyCard(Long userId) {
        return userCardRepository.findByUserId(userId)
                .map(UserCardDto::from)
                .orElse(null);
    }

    /** 사용자별 1장 정책: 이미 등록되어 있으면 카드 종류만 교체하고 카드번호는 새로 발급한다. */
    @Transactional
    public UserCardDto register(Long userId, String cardTypeRaw) {
        CardType type = parseType(cardTypeRaw);
        UserCard card = userCardRepository.findByUserId(userId).orElse(null);
        String number = randomCardNumber();
        if (card == null) {
            card = UserCard.builder()
                    .userId(userId)
                    .cardType(type)
                    .cardNumber(number)
                    .build();
        } else {
            card.setCardType(type);
            card.setCardNumber(number);
        }
        userCardRepository.save(card);
        return UserCardDto.from(card);
    }

    @Transactional
    public void unlink(Long userId) {
        userCardRepository.findByUserId(userId).ifPresent(userCardRepository::delete);
    }

    private CardType parseType(String raw) {
        if (raw == null) throw BusinessException.badRequest("카드 종류가 필요합니다.");
        try {
            return CardType.valueOf(raw.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw BusinessException.badRequest("지원하지 않는 카드 종류입니다.");
        }
    }

    private String randomCardNumber() {
        StringBuilder sb = new StringBuilder(16);
        for (int i = 0; i < 16; i++) sb.append(RNG.nextInt(10));
        return sb.toString();
    }
}
