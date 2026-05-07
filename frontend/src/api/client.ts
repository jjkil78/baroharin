import axios from 'axios';
import { useAuthStore } from '../store/auth';

export const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
});

api.interceptors.request.use((cfg) => {
  const token = useAuthStore.getState().token;
  if (token) {
    cfg.headers.Authorization = `Bearer ${token}`;
  }
  return cfg;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err?.response?.status;
    if (status === 401 || status === 403) {
      useAuthStore.getState().clear();
    }
    return Promise.reject(err);
  },
);

export type ApiResponse<T> = { success: boolean; data: T | null; error: string | null };

export async function unwrap<T>(p: Promise<{ data: ApiResponse<T> }>): Promise<T> {
  const res = await p;
  if (!res.data.success || res.data.data === null) {
    throw new Error(res.data.error ?? '요청 처리 중 오류가 발생했습니다.');
  }
  return res.data.data;
}

export async function unwrapNullable<T>(p: Promise<{ data: ApiResponse<T> }>): Promise<T | null> {
  const res = await p;
  if (!res.data.success) {
    throw new Error(res.data.error ?? '요청 처리 중 오류가 발생했습니다.');
  }
  return res.data.data;
}
