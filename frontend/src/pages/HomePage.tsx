import { useEffect, useMemo, useState } from 'react';
import { categoryApi, dealApi } from '../api/endpoints';
import { Category, Deal } from '../api/types';
import CategoryTabs, { CategorySelection } from '../components/CategoryTabs';
import DealCard from '../components/DealCard';
import DiscountAgreementModal from '../components/DiscountAgreementModal';
import { useAuthStore } from '../store/auth';
import { useFavoritesStore } from '../store/favorites';

const sorts = [
  { id: 'popular',  label: '인기순' },
  { id: 'discount', label: '할인율' },
  { id: 'ending',   label: '마감임박' },
];

export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [selection, setSelection] = useState<CategorySelection>({ kind: 'all' });
  const [sort, setSort] = useState('popular');
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(false);
  const token = useAuthStore((s) => s.token);
  const needsDiscountAgreement = useAuthStore((s) => s.needsDiscountAgreement);
  const setNeedsDiscountAgreement = useAuthStore((s) => s.setNeedsDiscountAgreement);
  const favoriteIds = useFavoritesStore((s) => s.ids);

  useEffect(() => {
    categoryApi.list().then(setCategories).catch(() => {});
  }, []);

  // 특수 카테고리(할인율/인기순)는 정렬을 강제로 동기화
  useEffect(() => {
    if (selection.kind === 'special') {
      if (selection.slug === 'discount') setSort('discount');
      else if (selection.slug === 'popular') setSort('popular');
    }
  }, [selection]);

  // 백엔드 호출용 파라미터: 실제 카테고리만 전달, 특수는 클라이언트에서 처리
  useEffect(() => {
    setLoading(true);
    const categoryId = selection.kind === 'category' ? selection.id : undefined;
    dealApi
      .list({ categoryId, sort, q: q || undefined })
      .then(setDeals)
      .catch(() => setDeals([]))
      .finally(() => setLoading(false));
  }, [selection, sort, q]);

  const visibleDeals = useMemo(() => {
    if (selection.kind === 'special') {
      if (selection.slug === 'favorites') return deals.filter((d) => favoriteIds.has(d.id));
      if (selection.slug === 'event') {
        return deals.filter((d) => (d.eventDiscountRate ?? 0) > 0);
      }
    }
    return deals;
  }, [deals, selection, favoriteIds]);

  const emptyMessage =
    selection.kind === 'special' && selection.slug === 'favorites'
      ? token
        ? '즐겨찾기한 제휴사가 없어요. 카드 우측 상단의 하트를 눌러 등록하세요.'
        : '로그인하면 즐겨찾기를 사용할 수 있어요.'
      : selection.kind === 'special' && selection.slug === 'event'
      ? '진행 중인 이벤트 딜이 없어요.'
      : '표시할 딜이 없어요';

  return (
    <div>
      {token && needsDiscountAgreement && (
        <DiscountAgreementModal
          onAgree={() => setNeedsDiscountAgreement(false)}
          onClose={() => setNeedsDiscountAgreement(false)}
        />
      )}
      <div className="px-4 pt-4">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="제휴사 검색"
          className="h-11 w-full rounded-xl bg-gray-100 px-4 text-sm placeholder:text-kb-gray focus:outline-none focus:ring-2 focus:ring-kb-yellow"
        />
      </div>

      <CategoryTabs
        categories={categories}
        selection={selection}
        onSelect={setSelection}
      />

      <div className="flex items-center gap-1.5 px-4 pb-2">
        {sorts.map((s) => (
          <button
            key={s.id}
            onClick={() => setSort(s.id)}
            className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
              sort === s.id
                ? 'bg-kb-dark text-white'
                : 'bg-white text-kb-gray border border-gray-200'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="p-8 text-center text-sm text-kb-gray">불러오는 중...</div>
      ) : visibleDeals.length === 0 ? (
        <div className="p-8 text-center text-sm text-kb-gray">{emptyMessage}</div>
      ) : (
        <div className="grid grid-cols-3 gap-2 px-3 pb-6">
          {visibleDeals.map((d) => (
            <DealCard key={d.id} deal={d} />
          ))}
        </div>
      )}
    </div>
  );
}
