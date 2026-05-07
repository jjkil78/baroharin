import { FormEvent, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { authApi } from '../api/endpoints';
import { useAuthStore } from '../store/auth';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation() as { state?: { redirect?: string } };
  const setAuth = useAuthStore((s) => s.setAuth);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await authApi.login({ username, password });
      setAuth(res.token, {
        userId: res.userId,
        username: res.username,
        nickname: res.nickname,
        balance: res.balance,
      });
      navigate(location.state?.redirect ?? '/', { replace: true });
    } catch (e: any) {
      setError(e?.response?.data?.error ?? e?.message ?? '로그인에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-extrabold">KB Pay 바로할인</h1>
      <p className="mt-1 text-sm text-kb-gray">로그인 후 바로할인 혜택을 받으세요</p>

      <form onSubmit={onSubmit} className="mt-6 space-y-3">
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="아이디"
          className="h-12 w-full rounded-xl bg-gray-100 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-kb-yellow"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="비밀번호"
          className="h-12 w-full rounded-xl bg-gray-100 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-kb-yellow"
        />
        {error && <div className="text-sm text-red-500">{error}</div>}
        <button type="submit" disabled={loading} className="kb-button">
          {loading ? '로그인 중...' : '로그인'}
        </button>
      </form>

      <div className="mt-4 text-center text-sm text-kb-gray">
        아직 계정이 없다면?{' '}
        <Link to="/signup" className="font-semibold text-kb-dark underline">
          회원가입
        </Link>
      </div>
    </div>
  );
}
