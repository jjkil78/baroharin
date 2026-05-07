import { useEffect, useState } from 'react';

type Props = { until: string; compact?: boolean };

function diff(target: Date) {
  return Math.max(0, target.getTime() - Date.now());
}

function format(ms: number) {
  const totalSec = Math.floor(ms / 1000);
  const d = Math.floor(totalSec / 86400);
  const h = Math.floor((totalSec % 86400) / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  if (d > 0) return `${d}일 ${h}시간`;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export default function CountdownTimer({ until, compact }: Props) {
  const target = new Date(until);
  const [ms, setMs] = useState(diff(target));

  useEffect(() => {
    const id = setInterval(() => setMs(diff(target)), 1000);
    return () => clearInterval(id);
  }, [until]);

  const ended = ms === 0;
  const urgent = ms > 0 && ms < 60 * 60 * 1000; // < 1h
  const cls = ended ? 'text-kb-gray' : urgent ? 'text-red-500 font-bold' : 'text-kb-dark';

  if (compact) {
    return <span className={cls}>⏰ {ended ? '종료됨' : format(ms)}</span>;
  }
  return (
    <div className={`inline-flex items-center gap-1 ${cls}`}>
      <span>⏰ 마감까지</span>
      <span className="font-mono text-base">{ended ? '종료됨' : format(ms)}</span>
    </div>
  );
}
