package com.kbpay.baroharin.order;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserIdOrderByPaidAtDesc(Long userId);

    Optional<Order> findByBarcode(String barcode);
}
