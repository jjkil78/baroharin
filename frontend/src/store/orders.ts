import { create } from 'zustand';
import { orderApi } from '../api/endpoints';
import { Order } from '../api/types';

type OrdersState = {
  orders: Order[];
  loaded: boolean;
  refresh: () => Promise<void>;
  setOrders: (orders: Order[]) => void;
  upsert: (order: Order) => void;
  clear: () => void;
};

export const useOrdersStore = create<OrdersState>((set, get) => ({
  orders: [],
  loaded: false,
  refresh: async () => {
    try {
      const list = await orderApi.myOrders();
      set({ orders: list, loaded: true });
    } catch {
      set({ orders: [], loaded: true });
    }
  },
  setOrders: (orders) => set({ orders, loaded: true }),
  upsert: (order) => {
    const { orders } = get();
    const idx = orders.findIndex((o) => o.id === order.id);
    if (idx >= 0) {
      const next = orders.slice();
      next[idx] = order;
      set({ orders: next });
    } else {
      set({ orders: [order, ...orders] });
    }
  },
  clear: () => set({ orders: [], loaded: false }),
}));

export function sumThisMonthUsage(orders: Order[]): number {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth();
  return orders.reduce((sum, o) => {
    if (o.status !== 'USED' || !o.usedAt) return sum;
    const d = new Date(o.usedAt);
    if (d.getFullYear() === y && d.getMonth() === m) return sum + o.finalPrice;
    return sum;
  }, 0);
}

/** 최근 3개월 혜택금: paidAt 기준, CANCELLED 제외, originalPrice - finalPrice 합계 */
export function sumLast3MonthsBenefit(orders: Order[]): number {
  const cutoff = new Date();
  cutoff.setMonth(cutoff.getMonth() - 3);
  return orders.reduce((sum, o) => {
    if (o.status === 'CANCELLED' || !o.deal) return sum;
    if (new Date(o.paidAt).getTime() < cutoff.getTime()) return sum;
    const benefit = o.deal.originalPrice - o.finalPrice;
    return benefit > 0 ? sum + benefit : sum;
  }, 0);
}
