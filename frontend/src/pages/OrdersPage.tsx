import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { orderApi } from '../api/endpoints';
import { useOrdersStore } from '../store/orders';
import { formatDateTime, formatKRW } from '../utils/format';
import BarcodeModal from '../components/BarcodeModal';
import { Order } from '../api/types';

type PeriodKind = 'month' | 'm1' | 'w1' | 'custom';
type StatusKind = 'all' | 'paid' | 'cancelled';

function pad2(n: number) {
  return String(n).padStart(2, '0');
}

function defaultMonthValue() {
  const d = new Date();
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}`;
}

function dateInputValue(d: Date) {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

const PERIODS: { id: PeriodKind; label: string }[] = [
  { id: 'month',  label: '월별' },
  { id: 'm1',     label: '1개월' },
  { id: 'w1',     label: '일주일' },
  { id: 'custom', label: '직접입력' },
];

const STATUSES: { id: StatusKind; label: string }[] = [
  { id: 'all',       label: '전체' },
  { id: 'paid',      label: '결제' },
  { id: 'cancelled', label: '결제취소' },
];

export default function OrdersPage() {
  const orders = useOrdersStore((s) => s.orders);
  const loaded = useOrdersStore((s) => s.loaded);
  const refresh = useOrdersStore((s) => s.refresh);
  const upsert = useOrdersStore((s) => s.upsert);
  const [loading, setLoading] = useState(!loaded);
  const [active, setActive] = useState<Order | null>(null);
  const [redeemLoading, setRedeemLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const brandFilter = searchParams.get('brand');

  const [period, setPeriod] = useState<PeriodKind>('month');
  const [monthValue, setMonthValue] = useState(defaultMonthValue);
  const [customStart, setCustomStart] = useState(() => {
    const d = new Date();
    d.setMonth(d.getMonth() - 1);
    return dateInputValue(d);
  });
  const [customEnd, setCustomEnd] = useState(() => dateInputValue(new Date()));
  const [status, setStatus] = useState<StatusKind>('all');

  useEffect(() => {
    setLoading(true);
    refresh().finally(() => setLoading(false));
  }, [refresh]);

  const range = useMemo<{ from: number; to: number } | null>(() => {
    const now = new Date();
    if (period === 'm1') {
      const from = new Date(now);
      from.setMonth(from.getMonth() - 1);
      return { from: from.getTime(), to: now.getTime() };
    }
    if (period === 'w1') {
      const from = new Date(now);
      from.setDate(from.getDate() - 7);
      return { from: from.getTime(), to: now.getTime() };
    }
    if (period === 'month') {
      const [y, m] = monthValue.split('-').map(Number);
      if (!y || !m) return null;
      const from = new Date(y, m - 1, 1, 0, 0, 0).getTime();
      const to = new Date(y, m, 0, 23, 59, 59).getTime();
      return { from, to };
    }
    if (period === 'custom') {
      if (!customStart || !customEnd) return null;
      const from = new Date(`${customStart}T00:00:00`).getTime();
      const to = new Date(`${customEnd}T23:59:59`).getTime();
      if (Number.isNaN(from) || Number.isNaN(to) || from > to) return null;
      return { from, to };
    }
    return null;
  }, [period, monthValue, customStart, customEnd]);

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      if (brandFilter && o.deal?.brandName !== brandFilter) return false;
      if (range) {
        const t = new Date(o.paidAt).getTime();
        if (t < range.from || t > range.to) return false;
      }
      if (status === 'paid' && o.status === 'CANCELLED') return false;
      if (status === 'cancelled' && o.status !== 'CANCELLED') return false;
      return true;
    });
  }, [orders, brandFilter, range, status]);

  const totals = useMemo(() => {
    let usage = 0;
    let benefit = 0;
    let paidCount = 0;
    let cancelledCount = 0;
    for (const o of filteredOrders) {
      if (o.status === 'CANCELLED') {
        cancelledCount += 1;
        continue;
      }
      paidCount += 1;
      usage += o.finalPrice;
      if (o.deal) benefit += Math.max(0, o.deal.originalPrice - o.finalPrice);
    }
    return { usage, benefit, paidCount, cancelledCount };
  }, [filteredOrders]);

  function clearBrandFilter() {
    searchParams.delete('brand');
    setSearchParams(searchParams);
  }

  async function handleRedeem() {
    if (!active) return;
    setRedeemLoading(true);
    try {
      const updated = await orderApi.redeem(active.id);
      upsert(updated);
      setActive(updated);
    } catch (e: any) {
      alert(e?.response?.data?.error ?? '사용 처리 실패');
    } finally {
      setRedeemLoading(false);
    }
  }

  return (
    <div className="p-4">
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-lg font-bold">
          {brandFilter ? `${brandFilter} 이용내역` : '이용내역'}
        </h1>
        {brandFilter && (
          <button
            type="button"
            onClick={clearBrandFilter}
            className="rounded-full border border-gray-200 px-2.5 py-1 text-[11px] font-semibold text-kb-gray hover:bg-gray-50"
          >
            전체보기
          </button>
        )}
      </div>

      <div className="mt-3 kb-card p-4">
        <div className="text-[11px] font-semibold text-kb-gray">조회기간</div>
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {PERIODS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setPeriod(p.id)}
              className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                period === p.id
                  ? 'bg-kb-dark text-white'
                  : 'bg-gray-100 text-kb-gray'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {period === 'month' && (
          <input
            type="month"
            value={monthValue}
            onChange={(e) => setMonthValue(e.target.value)}
            className="mt-2 h-9 w-full rounded-lg bg-gray-50 px-3 text-xs"
          />
        )}
        {period === 'custom' && (
          <div className="mt-2 flex items-center gap-1.5">
            <input
              type="date"
              value={customStart}
              onChange={(e) => setCustomStart(e.target.value)}
              className="h-9 flex-1 rounded-lg bg-gray-50 px-3 text-xs"
            />
            <span className="text-xs text-kb-gray">~</span>
            <input
              type="date"
              value={customEnd}
              onChange={(e) => setCustomEnd(e.target.value)}
              className="h-9 flex-1 rounded-lg bg-gray-50 px-3 text-xs"
            />
          </div>
        )}

        <div className="mt-3 text-[11px] font-semibold text-kb-gray">이용구분</div>
        <div className="mt-1.5 flex gap-1.5">
          {STATUSES.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setStatus(s.id)}
              className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                status === s.id
                  ? 'bg-kb-dark text-white'
                  : 'bg-gray-100 text-kb-gray'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2 border-t border-gray-100 pt-3">
          <div>
            <div className="text-[11px] text-kb-gray">총 이용금액</div>
            <div className="mt-0.5 text-base font-extrabold text-kb-dark">
              {formatKRW(totals.usage)}
            </div>
            <div className="mt-0.5 text-[10px] text-kb-gray">
              결제 {totals.paidCount}건
              {totals.cancelledCount > 0 ? ` · 취소 ${totals.cancelledCount}건` : ''}
            </div>
          </div>
          <div>
            <div className="text-[11px] text-kb-gray">총 혜택금액</div>
            <div className="mt-0.5 text-base font-extrabold text-red-500">
              {formatKRW(totals.benefit)}
            </div>
            <div className="mt-0.5 text-[10px] text-kb-gray">
              바로할인으로 절약한 금액
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="p-6 text-center text-sm text-kb-gray">불러오는 중...</div>
      ) : filteredOrders.length === 0 ? (
        <div className="p-8 text-center text-sm text-kb-gray">
          조건에 맞는 이용 내역이 없어요.
          <div className="mt-3">
            <Link to="/" className="text-kb-dark underline">
              제휴사 보러가기 →
            </Link>
          </div>
        </div>
      ) : (
        <ul className="mt-3 space-y-3">
          {filteredOrders.map((o) => {
            const used = o.status === 'USED';
            const cancelled = o.status === 'CANCELLED';
            const benefit = o.deal ? Math.max(0, o.deal.originalPrice - o.finalPrice) : 0;
            return (
              <li
                key={o.id}
                className="kb-card p-3 cursor-pointer transition active:scale-[0.99]"
                onClick={() => !cancelled && setActive(o)}
              >
                <div className="flex items-center gap-3">
                  {o.deal && (
                    <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full border border-gray-100 bg-white">
                      <img
                        src={o.deal.imageUrl}
                        alt={o.deal.brandName}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="text-xs text-kb-gray">{o.deal?.brandName ?? '알 수 없는 제휴사'}</div>
                    <div className="text-sm font-extrabold text-red-500">
                      {o.deal ? `${o.deal.discountRate}% 바로할인` : '바로할인'}
                    </div>
                    <div className="mt-0.5 text-[11px] text-kb-gray">
                      {used && o.usedAt ? formatDateTime(o.usedAt) : formatDateTime(o.paidAt)}
                    </div>
                  </div>
                  <div className="text-right">
                    {cancelled ? (
                      <div className="kb-pill bg-gray-100 text-gray-500">취소</div>
                    ) : used ? (
                      <div className="kb-pill bg-gray-100 text-gray-500">사용완료</div>
                    ) : (
                      <div className="kb-pill bg-yellow-100 text-yellow-700">사용대기</div>
                    )}
                    <div className="mt-1 text-sm font-bold text-kb-dark">
                      {formatKRW(o.finalPrice)}
                    </div>
                    {!cancelled && benefit > 0 && (
                      <div className="mt-0.5 text-[10px] font-semibold text-red-500">
                        혜택 -{formatKRW(benefit)}
                      </div>
                    )}
                    {!cancelled && (
                      <div className="mt-0.5 text-[10px] text-kb-gray">바코드 →</div>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {active && (
        <BarcodeModal
          order={active}
          onClose={() => setActive(null)}
          onRedeem={handleRedeem}
          redeemLoading={redeemLoading}
        />
      )}
    </div>
  );
}
