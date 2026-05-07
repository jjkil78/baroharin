import Barcode from 'react-barcode';
import { CardType, Order } from '../api/types';
import { formatDateTime, maskCardNumber } from '../utils/format';

const CARD_NAME: Record<CardType, string> = {
  TRAVELERS: '트래블러스 체크카드 (토심이)',
  MONEYBACK: 'KB Pay 머니백카드',
};

type Props = {
  order: Order;
  onClose: () => void;
  onRedeem?: () => void;
  redeemLoading?: boolean;
};

export default function BarcodeModal({ order, onClose, onRedeem, redeemLoading }: Props) {
  const used = order.status === 'USED';

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div
        className="kb-card max-h-[90vh] w-full max-w-sm overflow-y-auto p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div>
            <div className="text-xs text-kb-gray">{order.deal?.brandName ?? '브랜드'}</div>
            <div className="text-sm font-bold">
              {order.deal ? `${order.deal.discountRate}% 바로할인` : '바로할인 바코드'}
            </div>
          </div>
          <button onClick={onClose} className="text-kb-gray text-lg leading-none">×</button>
        </div>

        <div className="mt-3 rounded-xl border border-gray-100 bg-white p-3">
          <div className="flex flex-col items-center">
            {used && (
              <div className="absolute mt-6 -rotate-12 rounded-md border-2 border-gray-400 px-3 py-1 text-xs font-extrabold text-gray-400">
                사용완료
              </div>
            )}
            <div className={used ? 'opacity-30' : ''}>
              <Barcode
                value={order.barcode}
                format="CODE128"
                width={1.6}
                height={70}
                fontSize={12}
                margin={4}
              />
            </div>
          </div>
        </div>

        <div className="mt-3 text-center text-[11px] text-kb-gray">
          {used
            ? `${order.usedAt ? formatDateTime(order.usedAt) : ''} 사용 완료`
            : '오프라인 매장에서 이 바코드를 보여주세요'}
        </div>

        <div className="mt-3 rounded-xl bg-gray-50 p-3 text-xs">
          <div className="flex justify-between py-0.5">
            <span className="text-kb-gray">발급일시</span>
            <span>{formatDateTime(order.paidAt)}</span>
          </div>
          <div className="flex justify-between py-0.5">
            <span className="text-kb-gray">발급번호</span>
            <span>#{order.id}</span>
          </div>
          <div className="flex justify-between py-0.5">
            <span className="text-kb-gray">연결카드</span>
            <span>{order.cardType ? CARD_NAME[order.cardType] : '-'}</span>
          </div>
          <div className="flex justify-between py-0.5">
            <span className="text-kb-gray">카드번호</span>
            <span className="font-mono tracking-wider">
              {order.cardNumber ? maskCardNumber(order.cardNumber) : '-'}
            </span>
          </div>
        </div>

        {order.deal?.merchant && (
          <div className="mt-3 rounded-xl border border-gray-100 p-3 text-xs">
            <div className="mb-1.5 text-[11px] font-bold text-kb-dark">상점 정보</div>
            <div className="flex justify-between gap-2 py-0.5">
              <span className="shrink-0 text-kb-gray">상점명</span>
              <span className="text-right">{order.deal.merchant.storeName}</span>
            </div>
            <div className="flex justify-between gap-2 py-0.5">
              <span className="shrink-0 text-kb-gray">대표자</span>
              <span className="text-right">{order.deal.merchant.representativeName}</span>
            </div>
            <div className="flex justify-between gap-2 py-0.5">
              <span className="shrink-0 text-kb-gray">사업자등록번호</span>
              <span className="text-right">{order.deal.merchant.businessRegNo}</span>
            </div>
            <div className="flex justify-between gap-2 py-0.5">
              <span className="shrink-0 text-kb-gray">주소</span>
              <span className="break-keep text-right">{order.deal.merchant.address}</span>
            </div>
            <div className="flex justify-between gap-2 py-0.5">
              <span className="shrink-0 text-kb-gray">연락처</span>
              <a
                href={`tel:${order.deal.merchant.phone.replace(/[^0-9+]/g, '')}`}
                className="text-right text-kb-dark underline"
              >
                {order.deal.merchant.phone}
              </a>
            </div>
          </div>
        )}

        {!used && onRedeem && (
          <button
            onClick={onRedeem}
            disabled={redeemLoading}
            className="kb-button mt-4 disabled:opacity-50"
          >
            {redeemLoading ? '처리 중...' : '매장 스캔 시뮬 (사용완료)'}
          </button>
        )}
      </div>
    </div>
  );
}
