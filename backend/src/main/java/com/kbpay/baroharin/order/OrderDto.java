package com.kbpay.baroharin.order;

import com.kbpay.baroharin.deal.DealDto;

import java.time.LocalDateTime;

public record OrderDto(
        Long id,
        Long dealId,
        Long finalPrice,
        String status,
        String barcode,
        LocalDateTime paidAt,
        LocalDateTime usedAt,
        String cardType,
        String cardNumber,
        DealDto deal
) {}
