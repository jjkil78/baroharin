import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type AuthUser = {
  userId: number;
  username: string;
  nickname: string;
  balance: number;
};

export type LinkedCardId = 'TRAVELERS' | 'MONEYBACK';

type AuthState = {
  token: string | null;
  user: AuthUser | null;
  needsDiscountAgreement: boolean;
  linkedCardId: LinkedCardId | null;
  setAuth: (token: string, user: AuthUser) => void;
  setUser: (user: AuthUser) => void;
  setNeedsDiscountAgreement: (needs: boolean) => void;
  setLinkedCardId: (id: LinkedCardId | null) => void;
  clear: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      needsDiscountAgreement: false,
      linkedCardId: null,
      setAuth: (token, user) => set({ token, user }),
      setUser: (user) => set({ user }),
      setNeedsDiscountAgreement: (needs) => set({ needsDiscountAgreement: needs }),
      setLinkedCardId: (id) => set({ linkedCardId: id }),
      clear: () =>
        set({
          token: null,
          user: null,
          needsDiscountAgreement: false,
          linkedCardId: null,
        }),
    }),
    { name: 'kbpay-auth' },
  ),
);
