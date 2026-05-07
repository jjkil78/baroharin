package com.kbpay.baroharin.order;

import com.kbpay.baroharin.card.UserCard;
import com.kbpay.baroharin.card.UserCardRepository;
import com.kbpay.baroharin.common.BusinessException;
import com.kbpay.baroharin.deal.Deal;
import com.kbpay.baroharin.deal.DealDto;
import com.kbpay.baroharin.deal.DealRepository;
import com.kbpay.baroharin.deal.DealStatus;
import com.kbpay.baroharin.merchant.MerchantDto;
import com.kbpay.baroharin.merchant.MerchantRepository;
import com.kbpay.baroharin.user.User;
import com.kbpay.baroharin.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final DealRepository dealRepository;
    private final UserRepository userRepository;
    private final UserCardRepository userCardRepository;
    private final MerchantRepository merchantRepository;

    private static final SecureRandom RNG = new SecureRandom();

    /**
     * 결제 시뮬레이션 (오프라인 바코드 결제):
     *   1) 사용자 잔액과 딜 재고에 비관적 락
     *   2) 만료/매진/잔액부족 검증
     *   3) 잔액 차감 + 재고 차감 + Order(ISSUED + 16자리 바코드) 발급
     *   4) 사용자는 매장에서 바코드를 보여주고 redeem API 로 USED 처리
     */
    @Transactional
    public OrderDto purchase(Long userId, Long dealId) {
        User user = userRepository.findByIdForUpdate(userId)
                .orElseThrow(() -> BusinessException.unauthorized("로그인이 필요합니다."));

        Deal deal = dealRepository.findByIdForUpdate(dealId)
                .orElseThrow(() -> BusinessException.notFound("딜을 찾을 수 없습니다."));

        LocalDateTime now = LocalDateTime.now();
        if (deal.getStatus() == DealStatus.EXPIRED || now.isAfter(deal.getValidUntil())) {
            throw BusinessException.badRequest("종료된 딜입니다.");
        }
        if (now.isBefore(deal.getValidFrom())) {
            throw BusinessException.badRequest("아직 시작되지 않은 딜입니다.");
        }
        if (deal.getRemainingStock() <= 0 || deal.getStatus() == DealStatus.SOLD_OUT) {
            throw BusinessException.badRequest("매진된 딜입니다.");
        }
        long price = deal.getDiscountedPrice();
        if (user.getBalance() < price) {
            throw BusinessException.badRequest("KB Pay 머니 잔액이 부족합니다.");
        }

        user.deductBalance(price);
        deal.increaseSold();

        UserCard linkedCard = userCardRepository.findByUserId(user.getId()).orElse(null);

        Order order = Order.builder()
                .userId(user.getId())
                .dealId(deal.getId())
                .finalPrice(price)
                .status(OrderStatus.ISSUED)
                .barcode(generateUniqueBarcode())
                .paidAt(LocalDateTime.now())
                .cardType(linkedCard != null ? linkedCard.getCardType() : null)
                .cardNumber(linkedCard != null ? linkedCard.getCardNumber() : null)
                .build();
        orderRepository.save(order);

        return toDto(order, deal);
    }

    /** 오프라인 매장 바코드 스캔 시뮬레이션: ISSUED → USED */
    @Transactional
    public OrderDto redeem(Long userId, Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> BusinessException.notFound("주문을 찾을 수 없습니다."));
        if (!order.getUserId().equals(userId)) {
            throw BusinessException.unauthorized("본인 주문이 아닙니다.");
        }
        if (order.getStatus() == OrderStatus.USED) {
            throw BusinessException.badRequest("이미 사용 처리된 쿠폰입니다.");
        }
        if (order.getStatus() == OrderStatus.CANCELLED) {
            throw BusinessException.badRequest("취소된 주문입니다.");
        }
        order.setStatus(OrderStatus.USED);
        order.setUsedAt(LocalDateTime.now());

        Deal deal = dealRepository.findById(order.getDealId()).orElse(null);
        return toDto(order, deal);
    }

    @Transactional(readOnly = true)
    public List<OrderDto> myOrders(Long userId) {
        return orderRepository.findByUserIdOrderByPaidAtDesc(userId).stream()
                .map(o -> toDto(o, dealRepository.findById(o.getDealId()).orElse(null)))
                .toList();
    }

    private OrderDto toDto(Order o, Deal deal) {
        DealDto dealDto = null;
        if (deal != null) {
            MerchantDto merchant = merchantRepository.findByBrandName(deal.getBrandName())
                    .map(MerchantDto::from)
                    .orElse(null);
            dealDto = DealDto.from(deal, merchant);
        }
        return new OrderDto(
                o.getId(),
                o.getDealId(),
                o.getFinalPrice(),
                o.getStatus().name(),
                o.getBarcode(),
                o.getPaidAt(),
                o.getUsedAt(),
                o.getCardType() != null ? o.getCardType().name() : null,
                o.getCardNumber(),
                dealDto
        );
    }

    private String generateUniqueBarcode() {
        for (int i = 0; i < 5; i++) {
            String code = randomNumericBarcode();
            if (orderRepository.findByBarcode(code).isEmpty()) {
                return code;
            }
        }
        throw BusinessException.badRequest("바코드 발급에 실패했습니다. 다시 시도해주세요.");
    }

    /** 16자리 숫자 바코드 (CODE128 호환) */
    private String randomNumericBarcode() {
        StringBuilder sb = new StringBuilder(16);
        for (int i = 0; i < 16; i++) {
            sb.append(RNG.nextInt(10));
        }
        return sb.toString();
    }
}
