export type Category = {
  id: number;
  name: string;
  slug: string;
  iconEmoji: string;
  sortOrder: number;
};

export type Merchant = {
  brandName: string;
  storeName: string;
  representativeName: string;
  businessRegNo: string;
  address: string;
  phone: string;
};

export type Deal = {
  id: number;
  title: string;
  brandName: string;
  description: string;
  categoryId: number;
  originalPrice: number;
  discountedPrice: number;
  discountRate: number;
  eventDiscountRate: number | null;
  imageUrl: string;
  stockQuantity: number;
  soldCount: number;
  remainingStock: number;
  validFrom: string;
  validUntil: string;
  status: 'ACTIVE' | 'SOLD_OUT' | 'EXPIRED';
  merchant: Merchant | null;
};

export type OrderStatus = 'ISSUED' | 'USED' | 'CANCELLED';

export type CardType = 'TRAVELERS' | 'MONEYBACK';

export type Order = {
  id: number;
  dealId: number;
  finalPrice: number;
  status: OrderStatus;
  barcode: string;
  paidAt: string;
  usedAt: string | null;
  cardType: CardType | null;
  cardNumber: string | null;
  deal: Deal | null;
};

export type UserCard = {
  id: number;
  cardType: CardType;
  cardNumber: string;
  registeredAt: string;
};

export type AuthResponse = {
  token: string;
  userId: number;
  username: string;
  nickname: string;
  balance: number;
};
