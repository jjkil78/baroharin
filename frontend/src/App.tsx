import { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuthStore } from './store/auth';
import { useFavoritesStore } from './store/favorites';
import { cardApi } from './api/endpoints';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import HomePage from './pages/HomePage';
import DealDetailPage from './pages/DealDetailPage';
import CheckoutPage from './pages/CheckoutPage';
import OrdersPage from './pages/OrdersPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import MePage from './pages/MePage';
import LinkCardPage from './pages/LinkCardPage';

function Protected({ children }: { children: JSX.Element }) {
  const token = useAuthStore((s) => s.token);
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  const token = useAuthStore((s) => s.token);
  const setLinkedCardId = useAuthStore((s) => s.setLinkedCardId);
  const refreshFavorites = useFavoritesStore((s) => s.refresh);
  const clearFavorites = useFavoritesStore((s) => s.clear);

  useEffect(() => {
    if (!token) {
      setLinkedCardId(null);
      clearFavorites();
      return;
    }
    cardApi
      .myCard()
      .then((c) => setLinkedCardId(c?.cardType ?? null))
      .catch(() => {});
    refreshFavorites();
  }, [token]);

  return (
    <div className="mx-auto min-h-screen max-w-md bg-white pb-20">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/deals/:id" element={<DealDetailPage />} />
          <Route
            path="/checkout/:dealId"
            element={
              <Protected>
                <CheckoutPage />
              </Protected>
            }
          />
          <Route
            path="/orders"
            element={
              <Protected>
                <OrdersPage />
              </Protected>
            }
          />
          <Route
            path="/me"
            element={
              <Protected>
                <MePage />
              </Protected>
            }
          />
          <Route
            path="/link-card"
            element={
              <Protected>
                <LinkCardPage />
              </Protected>
            }
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <BottomNav />
    </div>
  );
}
