import { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/auth';
import { sumLast3MonthsBenefit, useOrdersStore } from '../store/orders';
import { formatKRW } from '../utils/format';

export default function Header() {
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);
  const orders = useOrdersStore((s) => s.orders);
  const loaded = useOrdersStore((s) => s.loaded);
  const refresh = useOrdersStore((s) => s.refresh);

  useEffect(() => {
    if (token && !loaded) refresh();
  }, [token, loaded, refresh]);

  const benefit = useMemo(() => sumLast3MonthsBenefit(orders), [orders]);

  return (
    <header className="sticky top-0 z-20 bg-kb-yellow">
      <div className="flex items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-1.5 text-kb-dark">
          <span className="text-xl font-extrabold tracking-tight">KB Pay</span>
          <span className="text-sm font-bold text-kb-dark/80">바로할인</span>
        </Link>
        <div className="text-right">
          {user ? (
            <Link to="/orders" className="block">
              <div className="text-[10px] text-kb-dark/70">최근 3개월 혜택</div>
              <div className="text-sm font-bold text-kb-dark">{formatKRW(benefit)}</div>
            </Link>
          ) : (
            <Link
              to="/login"
              className="rounded-full bg-kb-dark px-3 py-1 text-xs font-bold text-white"
            >
              로그인
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
