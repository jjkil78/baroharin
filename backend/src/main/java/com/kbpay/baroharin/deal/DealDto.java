package com.kbpay.baroharin.deal;

import com.kbpay.baroharin.merchant.MerchantDto;

import java.time.LocalDateTime;

public record DealDto(
        Long id,
        String title,
        String brandName,
        String description,
        Long categoryId,
        Long originalPrice,
        Long discountedPrice,
        Integer discountRate,
        Integer eventDiscountRate,
        String imageUrl,
        Integer stockQuantity,
        Integer soldCount,
        Integer remainingStock,
        LocalDateTime validFrom,
        LocalDateTime validUntil,
        String status,
        MerchantDto merchant
) {
    public static DealDto from(Deal d) {
        return from(d, null);
    }

    public static DealDto from(Deal d, MerchantDto merchant) {
        return new DealDto(
                d.getId(), d.getTitle(), d.getBrandName(), d.getDescription(),
                d.getCategoryId(), d.getOriginalPrice(), d.getDiscountedPrice(),
                d.getDiscountRate(), d.getEventDiscountRate(), d.getImageUrl(),
                d.getStockQuantity(), d.getSoldCount(), d.getRemainingStock(),
                d.getValidFrom(), d.getValidUntil(), d.getStatus().name(),
                merchant
        );
    }
}
