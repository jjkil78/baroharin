package com.kbpay.baroharin.deal;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "deals")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Deal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 120)
    private String title;

    @Column(nullable = false, length = 60)
    private String brandName;

    @Column(length = 1000)
    private String description;

    @Column(nullable = false)
    private Long categoryId;

    @Column(nullable = false)
    private Long originalPrice;

    @Column(nullable = false)
    private Long discountedPrice;

    @Column(length = 500)
    private String imageUrl;

    @Column(nullable = false)
    private Integer stockQuantity;

    @Column(nullable = false)
    private Integer soldCount;

    @Column(nullable = false)
    private LocalDateTime validFrom;

    @Column(nullable = false)
    private LocalDateTime validUntil;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private DealStatus status;

    @Column
    private Integer eventDiscountRate;

    public int getDiscountRate() {
        if (originalPrice == null || originalPrice == 0) return 0;
        return (int) Math.round((1 - (double) discountedPrice / originalPrice) * 100);
    }

    public int getRemainingStock() {
        return Math.max(0, stockQuantity - soldCount);
    }

    public boolean isPurchasable() {
        LocalDateTime now = LocalDateTime.now();
        return status == DealStatus.ACTIVE
                && getRemainingStock() > 0
                && !now.isBefore(validFrom)
                && !now.isAfter(validUntil);
    }

    public void increaseSold() {
        this.soldCount += 1;
        if (getRemainingStock() == 0) {
            this.status = DealStatus.SOLD_OUT;
        }
    }
}
