import { create } from 'zustand';
import { favoriteApi } from '../api/endpoints';

type FavoritesState = {
  ids: Set<number>;
  loaded: boolean;
  refresh: () => Promise<void>;
  isFavorite: (dealId: number) => boolean;
  toggle: (dealId: number) => Promise<void>;
  clear: () => void;
};

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  ids: new Set(),
  loaded: false,
  refresh: async () => {
    try {
      const list = await favoriteApi.list();
      set({ ids: new Set(list), loaded: true });
    } catch {
      set({ ids: new Set(), loaded: true });
    }
  },
  isFavorite: (dealId) => get().ids.has(dealId),
  toggle: async (dealId) => {
    const { ids } = get();
    const next = new Set(ids);
    if (ids.has(dealId)) {
      next.delete(dealId);
      set({ ids: next });
      try {
        await favoriteApi.remove(dealId);
      } catch {
        const revert = new Set(get().ids);
        revert.add(dealId);
        set({ ids: revert });
      }
    } else {
      next.add(dealId);
      set({ ids: next });
      try {
        await favoriteApi.add(dealId);
      } catch {
        const revert = new Set(get().ids);
        revert.delete(dealId);
        set({ ids: revert });
      }
    }
  },
  clear: () => set({ ids: new Set(), loaded: false }),
}));
