import { Link, useNavigate } from 'react-router-dom';
import { Deal } from '../api/types';
import CountdownTimer from './CountdownTimer';
import { useAuthStore } from '../store/auth';
import { useFavoritesStore } from '../store/favorites';

export default function DealCard({ deal }: { deal: Deal }) {
  const navigate = useNavigate();
  const token = useAuthStore((s) => s.token);
  const isFavorite = useFavoritesStore((s) => s.ids.has(deal.id));
  const toggle = useFavoritesStore((s) => s.toggle);
  const soldRate = deal.stockQuantity > 0
    ? Math.min(100, Math.round((deal.soldCount / deal.stockQuantity) * 100))
    : 0;

  function openHistory(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/orders?brand=${encodeURIComponent(deal.brandName)}`);
  }

  function onToggleFavorite(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!token) {
      navigate('/login');
      return;
    }
    toggle(deal.id);
  }

  return (
    <Link
      to={`/deals/${deal.id}`}
      className="kb-card flex flex-col items-center p-3 text-center transition active:scale-[0.99]"
    >
      <div className="flex w-full justify-end">
        <button
          type="button"
          onClick={openHistory}
          className="rounded-full border border-gray-200 px-1.5 py-0.5 text-[9px] font-semibold text-kb-gray hover:bg-gray-50"
        >
          이용내역
        </button>
      </div>

      <div className="relative mt-1 h-16 w-16">
        <div className="h-full w-full overflow-hidden rounded-full border border-gray-100 bg-white">
          <img
            src={deal.imageUrl}
            alt={deal.brandName}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </div>
        <button
          type="button"
          onClick={onToggleFavorite}
          aria-label={isFavorite ? '즐겨찾기 해제' : '즐겨찾기'}
          aria-pressed={isFavorite}
          className={`absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full border border-gray-200 shadow-sm transition ${
            isFavorite ? 'bg-red-500' : 'bg-white'
          }`}
        >
          <svg
            viewBox="0 0 24 24"
            className={`h-3 w-3 ${isFavorite ? 'fill-white stroke-white' : 'fill-none stroke-gray-400'}`}
            strokeWidth="2.2"
          >
            <path d="M12 21s-7-4.35-9.5-8.5C.6 9.4 2.1 5 6 5c2 0 3.5 1 6 3 2.5-2 4-3 6-3 3.9 0 5.4 4.4 3.5 7.5C19 16.65 12 21 12 21z" />
          </svg>
        </button>
      </div>

      <div className="mt-2 truncate w-full text-xs font-bold text-kb-dark">
        {deal.brandName}
      </div>
      <div className="flex items-center justify-center gap-1 text-[11px] font-semibold text-red-500">
        <span>{deal.discountRate}% 할인</span>
        {deal.eventDiscountRate && deal.eventDiscountRate > 0 ? (
          <span className="rounded-full bg-red-500 px-1.5 py-[1px] text-[9px] font-extrabold leading-none text-white">
            +{deal.eventDiscountRate}%
          </span>
        ) : null}
      </div>

      <div className="mt-2 w-full space-y-1">
        <div className="flex items-center justify-between text-[9px] text-kb-gray">
          <span>{soldRate}% 소진</span>
          <CountdownTimer until={deal.validUntil} compact />
        </div>
        <div className="h-1 overflow-hidden rounded-full bg-gray-100">
          <div
            className="h-full bg-kb-yellow transition-all"
            style={{ width: `${soldRate}%` }}
          />
        </div>
      </div>
    </Link>
  );
}
