import { useMemo, useState } from 'react';

type TermKey = 'collect' | 'provide' | 'service';

type Term = {
  key: TermKey;
  title: string;
  detail: string;
};

const TERMS: Term[] = [
  {
    key: 'collect',
    title: '개인(신용)정보 수집·이용 동의',
    detail:
      '바로할인 서비스 제공을 위해 아래 항목을 수집·이용합니다.\n\n• 수집 항목: 아이디, 닉네임, 결제내역, 쿠폰 사용내역\n• 이용 목적: 바로할인 쿠폰 발급·결제·정산\n• 보유 기간: 회원 탈퇴 시까지 (관계 법령에 따른 보존 기간 포함)\n\n동의를 거부할 권리가 있으며, 거부 시 바로할인 서비스 이용이 제한됩니다.',
  },
  {
    key: 'provide',
    title: '개인(신용)정보 제3자 제공 동의',
    detail:
      '바로할인 쿠폰 정산을 위해 제휴사에 아래 정보를 제공합니다.\n\n• 제공받는 자: 제휴 가맹점 및 정산 대행사\n• 제공 항목: 결제금액, 쿠폰번호, 사용일시\n• 제공 목적: 쿠폰 사용 확인 및 정산\n• 보유 기간: 정산 완료 후 5년\n\n동의를 거부할 권리가 있으며, 거부 시 바로할인 서비스 이용이 제한됩니다.',
  },
  {
    key: 'service',
    title: '바로할인 서비스 이용 동의',
    detail:
      '바로할인은 한정 수량·시간으로 제공되는 즉시 할인 쿠폰 서비스입니다.\n\n• 결제 즉시 쿠폰이 발급되며, 발급 후 환불·취소가 제한될 수 있습니다.\n• 쿠폰은 표시된 유효기간 내 오프라인 매장에서만 사용 가능합니다.\n• 부정 사용이 확인되는 경우 쿠폰이 무효 처리될 수 있습니다.',
  },
];

type Props = {
  onAgree: () => void;
  onClose: () => void;
};

export default function DiscountAgreementModal({ onAgree, onClose }: Props) {
  const [checked, setChecked] = useState<Record<TermKey, boolean>>({
    collect: false,
    provide: false,
    service: false,
  });
  const [expanded, setExpanded] = useState<TermKey | null>(null);

  const allChecked = useMemo(
    () => TERMS.every((t) => checked[t.key]),
    [checked],
  );

  function toggle(key: TermKey) {
    setChecked((c) => ({ ...c, [key]: !c[key] }));
  }

  function toggleAll() {
    const next = !allChecked;
    setChecked({ collect: next, provide: next, service: next });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50">
      <div className="kb-card w-full max-w-md rounded-b-none p-5">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-extrabold">바로할인 약관 동의</h2>
            <p className="mt-1 text-xs text-kb-gray">
              바로할인 서비스 이용을 위해 아래 약관에 동의해주세요.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="-mr-1 -mt-1 flex h-8 w-8 items-center justify-center rounded-full text-xl leading-none text-kb-gray hover:bg-gray-100"
          >
            ×
          </button>
        </div>

        <label className="mt-4 flex cursor-pointer items-center gap-3 rounded-xl bg-gray-100 px-4 py-3">
          <input
            type="checkbox"
            checked={allChecked}
            onChange={toggleAll}
            className="h-5 w-5 accent-kb-yellow"
          />
          <span className="text-sm font-bold">전체 동의하기</span>
        </label>

        <ul className="mt-3 space-y-2">
          {TERMS.map((t) => {
            const open = expanded === t.key;
            return (
              <li key={t.key} className="rounded-xl border border-gray-100">
                <div className="flex items-center gap-3 px-4 py-3">
                  <input
                    id={`term-${t.key}`}
                    type="checkbox"
                    checked={checked[t.key]}
                    onChange={() => toggle(t.key)}
                    className="h-4 w-4 accent-kb-yellow"
                  />
                  <label
                    htmlFor={`term-${t.key}`}
                    className="flex-1 cursor-pointer text-sm"
                  >
                    <span className="font-semibold text-red-500">[필수]</span>{' '}
                    {t.title}
                  </label>
                  <button
                    type="button"
                    onClick={() => setExpanded(open ? null : t.key)}
                    className="text-xs text-kb-gray underline"
                  >
                    {open ? '닫기' : '보기'}
                  </button>
                </div>
                {open && (
                  <div className="whitespace-pre-line border-t border-gray-100 bg-gray-50 px-4 py-3 text-xs text-kb-gray">
                    {t.detail}
                  </div>
                )}
              </li>
            );
          })}
        </ul>

        <button
          type="button"
          onClick={onAgree}
          disabled={!allChecked}
          className="kb-button mt-5 disabled:opacity-40"
        >
          동의하고 시작하기
        </button>
      </div>
    </div>
  );
}
