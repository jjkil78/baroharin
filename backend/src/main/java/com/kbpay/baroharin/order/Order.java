package com.kbpay.baroharin.order;

import com.kbpay.baroharin.card.CardType;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "orders")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false)
    private Long dealId;

    @Column(nullable = false)
    private Long finalPrice;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private OrderStatus status;

    @Column(nullable = false, unique = true, length = 32)
    private String barcode;

    @Column(nullable = false)
    private LocalDateTime paidAt;

    @Column
    private LocalDateTime usedAt;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private CardType cardType;

    @Column(length = 16)
    private String cardNumber;

    @PrePersist
    void prePersist() {
        if (paidAt == null) paidAt = LocalDateTime.now();
        if (status == null) status = OrderStatus.ISSUED;
    }
}
