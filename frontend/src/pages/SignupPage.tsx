import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../api/endpoints';
import { useAuthStore } from '../store/auth';

export default function SignupPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);
  const setNeedsDiscountAgreement = useAuthStore((s) => s.setNeedsDiscountAgreement);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await authApi.signup({ username, password, nickname });
      setAuth(res.token, {
        userId: res.userId,
        username: res.username,
        nickname: res.nickname,
        balance: res.balance,
      });
      setNeedsDiscountAgreement(true);
      navigate('/', { replace: true });
    } catch (e: any) {
      setError(e?.response?.data?.error ?? e?.message ?? '회원가입에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-extrabold">회원가입</h1>
      <p className="mt-1 text-sm text-kb-gray">가입 시 100,000원의 KB Pay 머니가 충전돼요 🎁</p>
      <form onSubmit={onSubmit} className="mt-6 space-y-3">
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="아이디 (4~20자)"
          className="h-12 w-full rounded-xl bg-gray-100 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-kb-yellow"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="비밀번호 (4자 이상)"
          className="h-12 w-full rounded-xl bg-gray-100 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-kb-yellow"
        />
        <input
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder="닉네임"
          className="h-12 w-full rounded-xl bg-gray-100 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-kb-yellow"
        />
        {error && <div className="text-sm text-red-500">{error}</div>}
        <button type="submit" disabled={loading} className="kb-button">
          {loading ? '가입 중...' : '가입하고 100,000원 받기'}
        </button>
      </form>
      <div className="mt-4 text-center text-sm text-kb-gray">
        이미 계정이 있다면?{' '}
        <Link to="/login" className="font-semibold text-kb-dark underline">
          로그인
        </Link>
      </div>
    </div>
  );
}
