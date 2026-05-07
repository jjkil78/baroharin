import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { dealApi } from '../api/endpoints';
import { Deal } from '../api/types';
import CountdownTimer from '../components/CountdownTimer';
import { useAuthStore } from '../store/auth';
import { formatKRW } from '../utils/format';

export default function DealDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = useAuthStore((s) => s.token);
  const linkedCardId = useAuthStore((s) => s.linkedCardId);
  const [deal, setDeal] = useState<Deal | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    dealApi
      .get(Number(id))
      .then(setDeal)
      .catch((e) => setError(e?.message ?? '제휴사 정보를 불러오지 못했습니다.'));
  }, [id]);

  if (error) return <div className="p-6 text-center text-sm text-red-500">{error}</div>;
  if (!deal) return <div className="p-6 text-center text-sm text-kb-gray">불러오는 중...</div>;

  const soldRate = deal.stockQuantity > 0
    ? Math.min(100, Math.round((deal.soldCount / deal.stockQuantity) * 100))
    : 0;
  const soldOut = deal.remainingStock <= 0 || deal.status !== 'ACTIVE';
  const expired = new Date(deal.validUntil).getTime() <= Date.now();
  const disabled = soldOut || expired;
  const cardLinked = !!linkedCardId;

  function onClickBuy() {
    if (!token) {
      navigate('/login', { state: { redirect: `/checkout/${deal!.id}` } });
      return;
    }
    if (!cardLinked) {
      navigate('/link-card', { state: { redirect: `/deals/${deal!.id}` } });
      return;
    }
    navigate(`/checkout/${deal!.id}`);
  }

  return (
    <div>
      <div className="space-y-4 p-4">
        <div className="kb-card flex flex-col items-center gap-3 p-6">
          <div className="relative h-28 w-28">
            <div className="h-full w-full overflow-hidden rounded-2xl border border-gray-100 bg-white">
              <img
                src={deal.imageUrl}
                alt={deal.brandName}
                className="h-full w-full object-cover"
              />
            </div>
            {deal.merchant?.address && (
              <a
                href={`https://map.kakao.com/link/search/${encodeURIComponent(deal.merchant.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="카카오맵에서 매장 위치 보기"
                className="absolute -right-3 top-2 whitespace-nowrap rounded-full bg-[#FEE500] px-2 py-1 text-[10px] font-bold text-kb-dark shadow"
              >
                매장 위치
              </a>
            )}
          </div>
          <div className="text-base font-bold text-kb-dark">{deal.brandName}</div>
          {cardLinked ? (
            <div className="flex flex-wrap items-baseline justify-center gap-2">
              <span className="text-5xl font-extrabold text-red-500 leading-none">
                {deal.discountRate}%
              </span>
              <span className="text-base font-bold text-kb-dark">바로할인</span>
              {deal.eventDiscountRate && deal.eventDiscountRate > 0 ? (
                <span className="rounded-full bg-red-500 px-2 py-0.5 text-[11px] font-extrabold leading-none text-white">
                  이벤트 +{deal.eventDiscountRate}%
                </span>
              ) : null}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-1">
              <span className="text-2xl font-extrabold text-kb-dark leading-none">
                {formatKRW(deal.originalPrice)}
              </span>
              <span className="text-xs font-semibold text-kb-gray">정상가 (할인 미적용)</span>
            </div>
          )}
          <p className="text-center text-xs text-kb-gray">
            {cardLinked ? (
              <>
                매장에서 결제 시 바로할인 바코드를 제시하면<br />
                상품 금액에 {deal.discountRate}% 할인이 적용됩니다.
                {deal.eventDiscountRate && deal.eventDiscountRate > 0 ? (
                  <>
                    <br />
                    <span className="font-bold text-red-500">
                      이벤트 기간에는 추가 {deal.eventDiscountRate}% 할인
                    </span>
                  </>
                ) : null}
              </>
            ) : (
              <>
                연결카드를 등록하면 <span className="font-bold text-red-500">{deal.discountRate}%</span> 바로할인이 적용됩니다.
              </>
            )}
          </p>
        </div>

        {!cardLinked && (
          <div className="rounded-xl border border-kb-yellow/60 bg-kb-yellow/20 p-3 text-xs text-kb-dark">
            아직 바로할인 연결카드가 등록되지 않았어요. 등록 후 할인 혜택을 받을 수 있습니다.
          </div>
        )}

        <div className="rounded-xl bg-gray-50 p-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-kb-gray">남은 발급 수량</span>
            <span className="font-semibold">{deal.remainingStock.toLocaleString()}건</span>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-gray-200">
            <div className="h-full bg-kb-yellow" style={{ width: `${soldRate}%` }} />
          </div>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-kb-gray">마감</span>
            <CountdownTimer until={deal.validUntil} />
          </div>
        </div>

      </div>

      <div className="fixed bottom-16 left-1/2 z-10 w-full max-w-md -translate-x-1/2 border-t border-gray-100 bg-white p-3">
        <button onClick={onClickBuy} disabled={disabled} className="kb-button">
          {expired
            ? '마감된 할인'
            : soldOut
            ? '발급 마감'
            : !cardLinked
            ? '연결카드 등록하고 할인받기'
            : '바로할인 바코드 발급'}
        </button>
      </div>
    </div>
  );
}
