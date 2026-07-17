import type { FillMarbleColor } from '../../types/pocetnik-types';

/** Volně rozestoupené pozice uvnitř pytlíku (viewBox 240×180). */
const MARBLE_LAYOUTS: Record<number, Array<{ x: number; y: number }>> = {
  1: [{ x: 120, y: 102 }],
  2: [
    { x: 98, y: 98 },
    { x: 142, y: 108 },
  ],
  3: [
    { x: 88, y: 104 },
    { x: 120, y: 92 },
    { x: 152, y: 106 },
  ],
  4: [
    { x: 82, y: 96 },
    { x: 112, y: 112 },
    { x: 128, y: 92 },
    { x: 158, y: 104 },
  ],
  5: [
    { x: 78, y: 108 },
    { x: 104, y: 90 },
    { x: 120, y: 112 },
    { x: 136, y: 90 },
    { x: 162, y: 106 },
  ],
  6: [
    { x: 76, y: 94 },
    { x: 102, y: 112 },
    { x: 118, y: 88 },
    { x: 134, y: 112 },
    { x: 150, y: 92 },
    { x: 176, y: 108 },
  ],
  7: [
    { x: 74, y: 106 },
    { x: 98, y: 88 },
    { x: 114, y: 112 },
    { x: 126, y: 90 },
    { x: 142, y: 110 },
    { x: 158, y: 88 },
    { x: 182, y: 104 },
  ],
  8: [
    { x: 72, y: 92 },
    { x: 96, y: 110 },
    { x: 110, y: 86 },
    { x: 126, y: 112 },
    { x: 138, y: 90 },
    { x: 154, y: 108 },
    { x: 168, y: 86 },
    { x: 192, y: 102 },
  ],
  9: [
    { x: 70, y: 108 },
    { x: 92, y: 90 },
    { x: 108, y: 112 },
    { x: 120, y: 88 },
    { x: 132, y: 110 },
    { x: 148, y: 90 },
    { x: 164, y: 112 },
    { x: 178, y: 88 },
    { x: 198, y: 106 },
  ],
  10: [
    { x: 68, y: 94 },
    { x: 90, y: 112 },
    { x: 104, y: 86 },
    { x: 118, y: 110 },
    { x: 130, y: 88 },
    { x: 144, y: 112 },
    { x: 158, y: 90 },
    { x: 172, y: 108 },
    { x: 186, y: 86 },
    { x: 206, y: 102 },
  ],
};

const MARBLE_PALETTE: Record<FillMarbleColor, { base: string; light: string; dark: string; shine: string }> = {
  red: { base: '#ef4444', light: '#fecaca', dark: '#b91c1c', shine: '#fff5f5' },
  orange: { base: '#f59e0b', light: '#fde68a', dark: '#b45309', shine: '#fffbeb' },
};

function layoutForCount(count: number) {
  const clamped = Math.max(0, Math.min(10, count));
  return MARBLE_LAYOUTS[clamped] ?? MARBLE_LAYOUTS[10];
}

function MarbleDot({ x, y, color, index }: { x: number; y: number; color: FillMarbleColor; index: number }) {
  const palette = MARBLE_PALETTE[color];
  const gradientId = `marble-fill-${color}-${index}`;

  return (
    <g>
      <circle cx={x} cy={y + 2} r={14} fill="rgb(15 23 42 / 0.12)" />
      <circle cx={x} cy={y} r={14} fill={palette.dark} />
      <circle cx={x} cy={y} r={14} fill={`url(#${gradientId})`} stroke={palette.dark} strokeWidth="1.5" />
      <ellipse cx={x - 5} cy={y - 6} rx={5.5} ry={3.8} fill={palette.shine} opacity={0.72} />
      <circle cx={x + 4} cy={y + 5} r={2.2} fill={palette.light} opacity={0.35} />
    </g>
  );
}

function MarbleGradientDefs({ color, index }: { color: FillMarbleColor; index: number }) {
  const palette = MARBLE_PALETTE[color];
  const gradientId = `marble-fill-${color}-${index}`;

  return (
    <radialGradient id={gradientId} cx="35%" cy="30%" r="68%">
      <stop offset="0%" stopColor={palette.light} />
      <stop offset="55%" stopColor={palette.base} />
      <stop offset="100%" stopColor={palette.dark} />
    </radialGradient>
  );
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

  return (
    <button
      type="button"
      className={`pocetnik-marble-bag ${canAdd ? 'pocetnik-marble-bag--clickable' : ''}`}
      onClick={canAdd ? onAddMarble : undefined}
      disabled={!canAdd}
      aria-label={canAdd ? 'Přidej kuličku do pytlíku' : `Pytlík s ${count} kuličkami`}
    >
      <svg viewBox="0 0 240 180" width={300} height={225} aria-hidden="true" className="pocetnik-marble-bag__svg">
        <defs>
          {positions.map((_, index) => (
            <MarbleGradientDefs key={index} color={marbleColor} index={index} />
          ))}
        </defs>
        <path
          d="M48 48 C48 32, 192 32, 192 48 L202 68 C208 82, 208 138, 192 150 L48 150 C32 138, 32 82, 38 68 Z"
          fill="#ffffff"
          stroke="#5b4b8a"
          strokeWidth="4"
        />
        <path d="M48 48 C72 38, 168 38, 192 48 L192 68 L48 68 Z" fill="#6d5cae" />
        <path d="M102 38 C108 28, 132 28, 138 38" stroke="#5a4a96" strokeWidth="5" fill="none" strokeLinecap="round" />
        <ellipse cx="120" cy="40" rx="22" ry="9" fill="#6d5cae" />
        <ellipse cx="120" cy="118" rx="68" ry="24" fill="rgb(91 75 138 / 0.06)" />
        {positions.map((point, index) => (
          <MarbleDot key={index} x={point.x} y={point.y} color={marbleColor} index={index} />
        ))}
      </svg>
    </button>
  );
}

export function AddMarbleButton({
  marbleColor,
  onClick,
  disabled,
}: {
  marbleColor: FillMarbleColor;
  onClick: () => void;
  disabled?: boolean;
}) {
  const palette = MARBLE_PALETTE[marbleColor];

  return (
    <button type="button" className="pocetnik-add-marble" onClick={onClick} disabled={disabled} aria-label="Přidej kuličku">
      <svg viewBox="0 0 40 40" width={40} height={40} aria-hidden="true" className="pocetnik-add-marble__svg">
        <defs>
          <radialGradient id="add-marble-grad" cx="35%" cy="30%" r="68%">
            <stop offset="0%" stopColor={palette.light} />
            <stop offset="55%" stopColor={palette.base} />
            <stop offset="100%" stopColor={palette.dark} />
          </radialGradient>
        </defs>
        <circle cx="20" cy="21" r="14" fill="rgb(15 23 42 / 0.12)" />
        <circle cx="20" cy="20" r="14" fill="url(#add-marble-grad)" stroke={palette.dark} strokeWidth="1.5" />
        <ellipse cx="15" cy="14" rx="5" ry="3.5" fill={palette.shine} opacity={0.72} />
      </svg>
      <span className="pocetnik-add-marble__label">+1</span>
    </button>
  );
}
