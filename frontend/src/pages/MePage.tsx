import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cardApi, userApi } from '../api/endpoints';
import { CardType, UserCard } from '../api/types';
import { useAuthStore } from '../store/auth';
import { useOrdersStore } from '../store/orders';
import { formatKRW, maskCardNumber } from '../utils/format';

const CARD_NAME: Record<CardType, string> = {
  TRAVELERS: '트래블러스 체크카드 (토심이)',
  MONEYBACK: 'KB Pay 머니백카드',
};

const chargePresets = [10_000, 50_000, 100_000];

export default function MePage() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const setLinkedCardId = useAuthStore((s) => s.setLinkedCardId);
  const clear = useAuthStore((s) => s.clear);
  const clearOrders = useOrdersStore((s) => s.clear);
  const [loading, setLoading] = useState(false);
  const [card, setCard] = useState<UserCard | null>(null);

  useEffect(() => {
    userApi
      .me()
      .then((u) =>
        setUser({ userId: u.id, username: u.username, nickname: u.nickname, balance: u.balance }),
      )
      .catch(() => {});
    cardApi
      .myCard()
      .then((c) => {
        setCard(c);
        setLinkedCardId(c?.cardType ?? null);
      })
      .catch(() => {});
  }, []);

  async function charge(amount: number) {
    setLoading(true);
    try {
      const u = await userApi.charge(amount);
      setUser({ userId: u.id, username: u.username, nickname: u.nickname, balance: u.balance });
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    clear();
    clearOrders();
    navigate('/login', { replace: true });
  }

  return (
    <div className="p-4">
      <div className="kb-card p-4">
        <div className="text-xs text-kb-gray">반갑습니다</div>
        <div className="mt-1 text-base font-bold">{user?.nickname ?? '게스트'}</div>
        <div className="mt-4 rounded-xl bg-kb-yellow/30 p-4">
          <div className="text-xs text-kb-dark/70">KB Pay 머니</div>
          <div className="mt-1 text-2xl font-extrabold">{formatKRW(user?.balance ?? 0)}</div>
        </div>
      </div>

      <div className="kb-card mt-3 p-4">
        <div className="text-sm font-bold">충전 (데모)</div>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {chargePresets.map((amt) => (
            <button
              key={amt}
              onClick={() => charge(amt)}
              disabled={loading}
              className="rounded-xl border border-gray-200 py-2 text-sm font-semibold text-kb-dark hover:bg-gray-50 disabled:opacity-50"
            >
              +{formatKRW(amt)}
            </button>
          ))}
        </div>
        <p className="mt-3 text-[11px] text-kb-gray">
          * 실제 결제 없이 잔액을 추가하는 데모 기능입니다.
        </p>
      </div>

      <button
        onClick={() => navigate('/link-card')}
        className="kb-card mt-3 flex w-full items-center justify-between p-4 text-left"
      >
        <div className="min-w-0 flex-1">
          <div className="text-sm font-bold">바로할인 연결카드</div>
          {card ? (
            <>
              <div className="mt-0.5 truncate text-xs text-kb-gray">
                {CARD_NAME[card.cardType]}
              </div>
              <div className="mt-0.5 font-mono text-[12px] tracking-wider text-kb-dark">
                {maskCardNumber(card.cardNumber)}
              </div>
            </>
          ) : (
            <div className="mt-0.5 text-xs text-kb-gray">
              아직 등록되지 않았어요. 등록하고 할인받기 →
            </div>
          )}
        </div>
        <span className="ml-2 shrink-0 text-kb-gray">›</span>
      </button>

      <button
        onClick={logout}
        className="mt-6 w-full rounded-xl border border-gray-200 py-3 text-sm font-semibold text-kb-gray hover:bg-gray-50"
      >
        로그아웃
      </button>
    </div>
  );
}
