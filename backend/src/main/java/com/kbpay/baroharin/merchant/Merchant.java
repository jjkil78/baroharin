package com.kbpay.baroharin.merchant;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(
    name = "merchants",
    uniqueConstraints = @UniqueConstraint(columnNames = "brand_name")
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Merchant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 60)
    private String brandName;

    @Column(nullable = false, length = 100)
    private String storeName;

    @Column(nullable = false, length = 30)
    private String representativeName;

    @Column(nullable = false, length = 20)
    private String businessRegNo;

    @Column(nullable = false, length = 200)
    private String address;

    @Column(nullable = false, length = 30)
    private String phone;
}
