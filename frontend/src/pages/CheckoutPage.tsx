import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { dealApi, orderApi, userApi } from '../api/endpoints';
import { Deal, Order } from '../api/types';
import { useAuthStore } from '../store/auth';
import { useOrdersStore } from '../store/orders';
import BarcodeModal from '../components/BarcodeModal';

export default function CheckoutPage() {
  const { dealId } = useParams();
  const navigate = useNavigate();
  const setUser = useAuthStore((s) => s.setUser);
  const linkedCardId = useAuthStore((s) => s.linkedCardId);
  const upsertOrder = useOrdersStore((s) => s.upsert);

  const [deal, setDeal] = useState<Deal | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [issued, setIssued] = useState<Order | null>(null);

  useEffect(() => {
    if (!dealId) return;
    if (!linkedCardId) {
      navigate('/link-card', { state: { redirect: `/checkout/${dealId}` }, replace: true });
      return;
    }
    dealApi.get(Number(dealId)).then(setDeal).catch(() => {});
    userApi.me().then((u) =>
      setUser({ userId: u.id, username: u.username, nickname: u.nickname, balance: u.balance }),
    ).catch(() => {});
  }, [dealId, linkedCardId]);

  async function issue() {
    if (!deal) return;
    setError(null);
    setLoading(true);
    try {
      const order = await orderApi.purchase(deal.id);
      const me = await userApi.me();
      setUser({ userId: me.id, username: me.username, nickname: me.nickname, balance: me.balance });
      upsertOrder(order);
      setIssued(order);
    } catch (e: any) {
      setError(e?.response?.data?.error ?? e?.message ?? '바코드 발급에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }

  if (!deal) return <div className="p-6 text-center text-sm text-kb-gray">불러오는 중...</div>;

  return (
    <div className="p-4 pb-32">
      <div className="kb-card flex flex-col items-center gap-2 p-6 text-center">
        <div className="text-sm font-semibold text-kb-gray">{deal.brandName}</div>
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-extrabold text-red-500 leading-none">
            {deal.discountRate}%
          </span>
          <span className="text-base font-bold text-kb-dark">바로할인</span>
        </div>
      </div>

      <div className="kb-card mt-3 p-4 text-sm">
        <div className="font-bold">바로할인 이용 안내</div>
        <ol className="mt-2 list-decimal pl-5 text-xs text-kb-gray space-y-1">
          <li>{deal.brandName} 매장에서 원하는 상품을 고르세요.</li>
          <li>결제 시 발급된 바코드를 직원에게 제시하세요.</li>
          <li>해당 상품 금액에서 {deal.discountRate}% 할인된 금액이 결제됩니다.</li>
        </ol>
      </div>

      {error && <div className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>}

      <div className="fixed bottom-16 left-1/2 z-10 w-full max-w-md -translate-x-1/2 border-t border-gray-100 bg-white p-3">
        <button onClick={issue} disabled={loading || !!issued} className="kb-button">
          {issued ? '바코드 발급 완료 ✓' : loading ? '발급 중...' : '바로할인 바코드 발급'}
        </button>
      </div>

      {issued && (
        <BarcodeModal
          order={issued}
          onClose={() => {
            setIssued(null);
            navigate('/orders', { replace: true });
          }}
        />
      )}
    </div>
  );
}
