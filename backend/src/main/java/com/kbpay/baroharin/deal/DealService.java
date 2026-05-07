package com.kbpay.baroharin.deal;

import com.kbpay.baroharin.common.BusinessException;
import com.kbpay.baroharin.merchant.MerchantDto;
import com.kbpay.baroharin.merchant.MerchantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DealService {

    private final DealRepository dealRepository;
    private final MerchantRepository merchantRepository;

    @Transactional(readOnly = true)
    public List<DealDto> search(Long categoryId, String q, String sort) {
        Specification<Deal> spec = Specification.where(activeOnly());
        if (categoryId != null) spec = spec.and(byCategory(categoryId));
        if (q != null && !q.isBlank()) spec = spec.and(byKeyword(q.trim()));

        List<Deal> deals = dealRepository.findAll(spec);

        Comparator<Deal> cmp = switch (sort == null ? "popular" : sort) {
            case "discount" -> Comparator.comparingInt(Deal::getDiscountRate).reversed();
            case "ending"   -> Comparator.comparing(Deal::getValidUntil);
            default         -> Comparator.comparingInt(Deal::getSoldCount).reversed();
        };
        return deals.stream().sorted(cmp).map(this::toDto).toList();
    }

    @Transactional(readOnly = true)
    public DealDto get(Long id) {
        Deal deal = dealRepository.findById(id)
                .orElseThrow(() -> BusinessException.notFound("딜을 찾을 수 없습니다."));
        return toDto(deal);
    }

    private DealDto toDto(Deal d) {
        MerchantDto merchant = merchantRepository.findByBrandName(d.getBrandName())
                .map(MerchantDto::from)
                .orElse(null);
        return DealDto.from(d, merchant);
    }

    private static Specification<Deal> activeOnly() {
        return (root, query, cb) -> cb.equal(root.get("status"), DealStatus.ACTIVE);
    }

    private static Specification<Deal> byCategory(Long categoryId) {
        return (root, query, cb) -> cb.equal(root.get("categoryId"), categoryId);
    }

    private static Specification<Deal> byKeyword(String q) {
        String like = "%" + q.toLowerCase() + "%";
        return (root, query, cb) -> cb.or(
                cb.like(cb.lower(root.get("title")), like),
                cb.like(cb.lower(root.get("brandName")), like)
        );
    }
}
