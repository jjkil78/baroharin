import { NavLink } from 'react-router-dom';

const items = [
  { to: '/', label: '홈', icon: '🏠' },
  { to: '/orders', label: '이용내역', icon: '🧾' },
  { to: '/me', label: '마이', icon: '👤' },
];

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-1/2 z-20 w-full max-w-md -translate-x-1/2 border-t border-gray-200 bg-white">
      <ul className="grid grid-cols-3">
        {items.map((it) => (
          <li key={it.to}>
            <NavLink
              to={it.to}
              end={it.to === '/'}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 py-2.5 text-xs ${
                  isActive ? 'text-kb-dark font-bold' : 'text-kb-gray'
                }`
              }
            >
              <span className="text-lg leading-none">{it.icon}</span>
              <span>{it.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
