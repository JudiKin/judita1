import type { FillMarbleColor } from '../../types/pocetnik-types';

const MARBLE_LAYOUTS: Record<number, Array<{ x: number; y: number }>> = {
  1: [{ x: 80, y: 92 }],
  2: [
    { x: 68, y: 88 },
    { x: 92, y: 96 },
  ],
  3: [
    { x: 62, y: 92 },
    { x: 80, y: 84 },
    { x: 98, y: 94 },
  ],
  4: [
    { x: 58, y: 94 },
    { x: 74, y: 82 },
    { x: 90, y: 90 },
    { x: 104, y: 98 },
  ],
  5: [
    { x: 54, y: 96 },
    { x: 68, y: 84 },
    { x: 82, y: 92 },
    { x: 96, y: 82 },
    { x: 110, y: 94 },
  ],
  6: [
    { x: 52, y: 98 },
    { x: 66, y: 86 },
    { x: 80, y: 94 },
    { x: 94, y: 84 },
    { x: 108, y: 92 },
    { x: 122, y: 98 },
  ],
  7: [
    { x: 48, y: 96 },
    { x: 62, y: 84 },
    { x: 76, y: 92 },
    { x: 90, y: 82 },
    { x: 104, y: 90 },
    { x: 118, y: 84 },
    { x: 132, y: 96 },
  ],
  8: [
    { x: 46, y: 98 },
    { x: 58, y: 86 },
    { x: 70, y: 94 },
    { x: 82, y: 82 },
    { x: 94, y: 90 },
    { x: 106, y: 84 },
    { x: 118, y: 94 },
    { x: 130, y: 88 },
  ],
  9: [
    { x: 44, y: 96 },
    { x: 56, y: 84 },
    { x: 68, y: 92 },
    { x: 80, y: 82 },
    { x: 92, y: 90 },
    { x: 104, y: 84 },
    { x: 116, y: 92 },
    { x: 128, y: 86 },
    { x: 140, y: 96 },
  ],
  10: [
    { x: 42, y: 98 },
    { x: 54, y: 86 },
    { x: 66, y: 94 },
    { x: 78, y: 82 },
    { x: 90, y: 90 },
    { x: 102, y: 84 },
    { x: 114, y: 92 },
    { x: 126, y: 86 },
    { x: 138, y: 94 },
    { x: 150, y: 88 },
  ],
};

const MARBLE_COLORS: Record<FillMarbleColor, string> = {
  red: '#ef4444',
  orange: '#f59e0b',
};

function layoutForCount(count: number) {
  const clamped = Math.max(0, Math.min(10, count));
  return MARBLE_LAYOUTS[clamped] ?? MARBLE_LAYOUTS[10];
}

export function MarbleBag({
  count,
  marbleColor,
  onAddMarble,
  canAdd,
}: {
  count: number;
  marbleColor: FillMarbleColor;
  onAddMarble?: () => void;
  canAdd?: boolean;
}) {
  const positions = layoutForCount(count);
  const fill = MARBLE_COLORS[marbleColor];

  return (
    <button
      type="button"
      className={`pocetnik-marble-bag ${canAdd ? 'pocetnik-marble-bag--clickable' : ''}`}
      onClick={canAdd ? onAddMarble : undefined}
      disabled={!canAdd}
      aria-label={canAdd ? 'Přidej kuličku do pytlíku' : `Pytlík s ${count} kuličkami`}
    >
      <svg viewBox="0 0 180 150" width={220} height={185} aria-hidden="true">
        <path
          d="M36 42 C36 28, 144 28, 144 42 L152 58 C156 68, 156 118, 144 128 L36 128 C24 118, 24 68, 28 58 Z"
          fill="#ffffff"
          stroke="#5b4b8a"
          strokeWidth="4"
        />
        <path d="M36 42 C54 34, 126 34, 144 42 L144 58 L36 58 Z" fill="#6d5cae" />
        <path d="M78 34 C84 26, 96 26, 102 34" stroke="#6d5cae" strokeWidth="5" fill="none" strokeLinecap="round" />
        <ellipse cx="90" cy="36" rx="18" ry="8" fill="#6d5cae" />
        {positions.map((point, index) => (
          <circle key={index} cx={point.x} cy={point.y} r="11" fill={fill} />
        ))}
      </svg>
    </button>
  );
}

export function AddMarbleButton({ marbleColor, onClick, disabled }: { marbleColor: FillMarbleColor; onClick: () => void; disabled?: boolean }) {
  return (
    <button type="button" className="pocetnik-add-marble" onClick={onClick} disabled={disabled} aria-label="Přidej kuličku">
      <span className="pocetnik-add-marble__dot" style={{ background: MARBLE_COLORS[marbleColor] }} />
      <span className="pocetnik-add-marble__label">+1</span>
    </button>
  );
}
