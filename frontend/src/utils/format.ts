export function formatKRW(value: number | undefined | null): string {
  if (value == null) return '-';
  return `${value.toLocaleString('ko-KR')}원`;
}

export function maskCardNumber(num: string): string {
  if (num.length !== 16) return num;
  const masked = num.slice(0, 6) + '******' + num.slice(12);
  return masked.match(/.{1,4}/g)?.join(' ') ?? masked;
}

export function formatDateTime(value: string): string {
  const d = new Date(value);
  return d.toLocaleString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}
