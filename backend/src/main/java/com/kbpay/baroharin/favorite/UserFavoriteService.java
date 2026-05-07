package com.kbpay.baroharin.favorite;

import com.kbpay.baroharin.deal.DealRepository;
import com.kbpay.baroharin.common.BusinessException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserFavoriteService {

    private final UserFavoriteRepository userFavoriteRepository;
    private final DealRepository dealRepository;

    @Transactional(readOnly = true)
    public List<Long> listMyFavoriteDealIds(Long userId) {
        return userFavoriteRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(UserFavorite::getDealId)
                .toList();
    }

    @Transactional
    public void add(Long userId, Long dealId) {
        if (!dealRepository.existsById(dealId)) {
            throw BusinessException.notFound("딜을 찾을 수 없습니다.");
        }
        if (userFavoriteRepository.findByUserIdAndDealId(userId, dealId).isPresent()) {
            return;
        }
        userFavoriteRepository.save(UserFavorite.builder()
                .userId(userId)
                .dealId(dealId)
                .build());
    }

    @Transactional
    public void remove(Long userId, Long dealId) {
        userFavoriteRepository.deleteByUserIdAndDealId(userId, dealId);
    }
}
