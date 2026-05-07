package com.kbpay.baroharin.merchant;

public record MerchantDto(
        String brandName,
        String storeName,
        String representativeName,
        String businessRegNo,
        String address,
        String phone
) {
    public static MerchantDto from(Merchant m) {
        return new MerchantDto(
                m.getBrandName(),
                m.getStoreName(),
                m.getRepresentativeName(),
                m.getBusinessRegNo(),
                m.getAddress(),
                m.getPhone()
        );
    }
}
