import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { cardApi } from '../api/endpoints';
import { CardType, UserCard } from '../api/types';
import { LinkedCardId, useAuthStore } from '../store/auth';
import { maskCardNumber } from '../utils/format';

type CardOption = {
  id: LinkedCardId;
  name: string;
  subtitle: string;
  initial: string;
  bg: string;
  fg: string;
};

const CARDS: CardOption[] = [
  {
    id: 'TRAVELERS',
    name: '트래블러스 체크카드 (토심이)',
    subtitle: '해외 결제 수수료 면제 · 토심이 에디션',
    initial: '토',
    bg: 'bg-pink-100',
    fg: 'text-pink-600',
  },
  {
    id: 'MONEYBACK',
    name: 'KB Pay 머니백카드',
    subtitle: 'KB Pay 결제 시 캐시백 적립',
    initial: 'KB',
    bg: 'bg-kb-yellow/40',
    fg: 'text-kb-dark',
  },
];

export default function LinkCardPage() {
  const navigate = useNavigate();
  const location = useLocation() as { state?: { redirect?: string } };
  const setLinkedCardId = useAuthStore((s) => s.setLinkedCardId);
  const [myCard, setMyCard] = useState<UserCard | null>(null);
  const [selected, setSelected] = useState<CardType | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    cardApi
      .myCard()
      .then((c) => {
        setMyCard(c);
        setSelected(c?.cardType ?? null);
        setLinkedCardId(c?.cardType ?? null);
      })
      .catch((e) => setError(e?.message ?? '카드 정보를 불러오지 못했습니다.'))
      .finally(() => setLoading(false));
  }, []);

  const alreadyLinked = !!myCard;

  async function onRegister() {
    if (!selected) return;
    setSubmitting(true);
    setError(null);
    try {
      const saved = await cardApi.register(selected);
      setMyCard(saved);
      setLinkedCardId(saved.cardType);
      const redirect = location.state?.redirect;
      if (redirect) navigate(redirect, { replace: true });
      else navigate(-1);
    } catch (e: any) {
      setError(e?.response?.data?.error ?? e?.message ?? '카드 등록에 실패했습니다.');
    } finally {
      setSubmitting(false);
    }
  }

  async function onUnlink() {
    setSubmitting(true);
    setError(null);
    try {
      await cardApi.unlink();
      setMyCard(null);
      setSelected(null);
      setLinkedCardId(null);
    } catch (e: any) {
      setError(e?.response?.data?.error ?? e?.message ?? '등록 해제에 실패했습니다.');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return <div className="p-6 text-center text-sm text-kb-gray">불러오는 중...</div>;
  }

  return (
    <div className="p-4 pb-32">
      <div className="kb-card p-5">
        <h1 className="text-lg font-extrabold">바로할인 연결카드 등록</h1>
        <p className="mt-1 text-xs text-kb-gray">
          연결카드를 등록해야 제휴사 바로할인이 적용됩니다. 카드는 1개만 등록할 수 있어요.
        </p>
      </div>

      {error && (
        <div className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>
      )}

      <ul className="mt-3 space-y-2">
        {CARDS.map((c) => {
          const checked = selected === c.id;
          const isMine = myCard?.cardType === c.id;
          return (
            <li key={c.id}>
              <label
                className={`kb-card flex cursor-pointer items-center gap-3 p-4 ${
                  checked ? 'ring-2 ring-kb-yellow' : ''
                }`}
              >
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${c.bg} ${c.fg} text-base font-extrabold`}
                >
                  {c.initial}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-bold text-kb-dark">{c.name}</div>
                  <div className="mt-0.5 font-mono text-[11px] tracking-wider text-kb-dark/80">
                    {isMine && myCard
                      ? maskCardNumber(myCard.cardNumber)
                      : '등록 시 카드번호가 발급됩니다'}
                  </div>
                  <div className="mt-0.5 truncate text-[11px] text-kb-gray">{c.subtitle}</div>
                </div>
                <input
                  type="radio"
                  name="linkedCard"
                  className="sr-only"
                  checked={checked}
                  onChange={() => setSelected(c.id)}
                />
                <span
                  role="switch"
                  aria-checked={checked}
                  onClick={(e) => {
                    e.preventDefault();
                    setSelected(c.id);
                  }}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition ${
                    checked ? 'bg-kb-yellow' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition ${
                      checked ? 'translate-x-5' : 'translate-x-1'
                    }`}
                  />
                </span>
              </label>
            </li>
          );
        })}
      </ul>

      <p className="mt-3 px-1 text-[11px] text-kb-gray">
        * 데모 환경에서는 실제 카드 인증 없이 선택 시 16자리 카드번호가 임의로 발급됩니다.
      </p>

      <div className="fixed bottom-16 left-1/2 z-10 w-full max-w-md -translate-x-1/2 border-t border-gray-100 bg-white p-3">
        <button
          onClick={onRegister}
          disabled={!selected || submitting || (alreadyLinked && selected === myCard?.cardType)}
          className="kb-button disabled:opacity-50"
        >
          {submitting
            ? '처리 중...'
            : alreadyLinked && selected === myCard?.cardType
            ? '등록됨'
            : alreadyLinked
            ? '연결카드 변경'
            : '연결카드 등록'}
        </button>
        {alreadyLinked && (
          <button
            onClick={onUnlink}
            disabled={submitting}
            className="mt-2 w-full rounded-xl border border-gray-200 py-2.5 text-sm font-semibold text-kb-gray hover:bg-gray-50 disabled:opacity-50"
          >
            등록 해제
          </button>
        )}
      </div>
    </div>
  );
}
