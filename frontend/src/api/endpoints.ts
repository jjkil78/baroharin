import { api, unwrap, unwrapNullable } from './client';
import { AuthResponse, Category, Deal, Order, UserCard } from './types';

export const authApi = {
  signup: (body: { username: string; password: string; nickname: string }) =>
    unwrap<AuthResponse>(api.post('/auth/signup', body)),
  login: (body: { username: string; password: string }) =>
    unwrap<AuthResponse>(api.post('/auth/login', body)),
};

export const categoryApi = {
  list: () => unwrap<Category[]>(api.get('/categories')),
};

export const dealApi = {
  list: (params: { categoryId?: number; q?: string; sort?: string }) =>
    unwrap<Deal[]>(api.get('/deals', { params })),
  get: (id: number) => unwrap<Deal>(api.get(`/deals/${id}`)),
};

export const orderApi = {
  purchase: (dealId: number) =>
    unwrap<Order>(api.post('/orders', { dealId })),
  redeem: (orderId: number) =>
    unwrap<Order>(api.post(`/orders/${orderId}/redeem`)),
  myOrders: () => unwrap<Order[]>(api.get('/orders/me')),
};

export const userApi = {
  me: () => unwrap<{ id: number; username: string; nickname: string; balance: number }>(api.get('/users/me')),
  charge: (amount: number) =>
    unwrap<{ id: number; username: string; nickname: string; balance: number }>(
      api.post('/users/me/charge', { amount }),
    ),
};

export const cardApi = {
  myCard: () => unwrapNullable<UserCard>(api.get('/users/me/card')),
  register: (cardType: 'TRAVELERS' | 'MONEYBACK') =>
    unwrap<UserCard>(api.post('/users/me/card', { cardType })),
  unlink: () => unwrapNullable<void>(api.delete('/users/me/card')),
};

export const favoriteApi = {
  list: () => unwrap<number[]>(api.get('/users/me/favorites')),
  add: (dealId: number) => unwrapNullable<void>(api.post(`/users/me/favorites/${dealId}`)),
  remove: (dealId: number) => unwrapNullable<void>(api.delete(`/users/me/favorites/${dealId}`)),
};
