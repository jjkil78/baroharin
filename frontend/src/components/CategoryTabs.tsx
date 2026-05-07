import { Category } from '../api/types';

export type CategorySelection =
  | { kind: 'all' }
  | { kind: 'special'; slug: 'favorites' | 'event' | 'discount' | 'popular' }
  | { kind: 'category'; id: number };

type Props = {
  categories: Category[];
  selection: CategorySelection;
  onSelect: (s: CategorySelection) => void;
};

const SPECIALS: { slug: 'favorites' | 'event' | 'discount' | 'popular'; label: string; emoji: string }[] = [
  { slug: 'favorites', label: '즐겨찾기', emoji: '❤️' },
  { slug: 'event',     label: '이벤트',   emoji: '🎉' },
  { slug: 'discount',  label: '할인율',   emoji: '🔥' },
  { slug: 'popular',   label: '인기순',   emoji: '⭐' },
];

function pillClass(active: boolean) {
  return `whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-semibold ${
    active ? 'bg-kb-dark text-white' : 'bg-gray-100 text-kb-gray'
  }`;
}

export default function CategoryTabs({ categories, selection, onSelect }: Props) {
  return (
    <div className="overflow-x-auto">
      <div className="flex w-max gap-2 px-4 py-3">
        <button
          onClick={() => onSelect({ kind: 'all' })}
          className={pillClass(selection.kind === 'all')}
        >
          전체
        </button>

        {SPECIALS.map((s) => (
          <button
            key={s.slug}
            onClick={() => onSelect({ kind: 'special', slug: s.slug })}
            className={pillClass(selection.kind === 'special' && selection.slug === s.slug)}
          >
            <span className="mr-1">{s.emoji}</span>
            {s.label}
          </button>
        ))}

        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => onSelect({ kind: 'category', id: c.id })}
            className={pillClass(selection.kind === 'category' && selection.id === c.id)}
          >
            <span className="mr-1">{c.iconEmoji}</span>
            {c.name}
          </button>
        ))}
      </div>
    </div>
  );
}
