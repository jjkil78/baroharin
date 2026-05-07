package com.kbpay.baroharin.category;

public record CategoryDto(Long id, String name, String slug, String iconEmoji, Integer sortOrder) {
    public static CategoryDto from(Category c) {
        return new CategoryDto(c.getId(), c.getName(), c.getSlug(), c.getIconEmoji(), c.getSortOrder());
    }
}
