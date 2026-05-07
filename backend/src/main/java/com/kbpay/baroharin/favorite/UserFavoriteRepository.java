package com.kbpay.baroharin.favorite;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserFavoriteRepository extends JpaRepository<UserFavorite, Long> {
    List<UserFavorite> findByUserIdOrderByCreatedAtDesc(Long userId);
    Optional<UserFavorite> findByUserIdAndDealId(Long userId, Long dealId);
    void deleteByUserIdAndDealId(Long userId, Long dealId);
}
