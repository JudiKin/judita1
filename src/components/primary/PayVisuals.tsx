import type { PayCoinValue, PayItemKind } from '../../types/pocetnik-types';

const ITEM_COLORS: Record<PayItemKind, { main: string; accent: string }> = {
  apple: { main: '#ef4444', accent: '#22c55e' },
  ball: { main: '#3b82f6', accent: '#fbbf24' },
  book: { main: '#8b5cf6', accent: '#f59e0b' },
  pencil: { main: '#f4c430', accent: '#f472b6' },
  bread: { main: '#d97706', accent: '#fcd34d' },
  toy: { main: '#ec4899', accent: '#06b6d4' },
};

export function ShopItem({
  kind,
  label,
  size = 160,
  showLabel = true,
}: {
  kind: PayItemKind;
  label: string;
  size?: number;
  showLabel?: boolean;
}) {
  const colors = ITEM_COLORS[kind];

  return (
    <div className="pocetnik-shop-item" aria-label={label || undefined} style={{ width: size }}>
      <svg viewBox="0 0 160 160" width={size} height={size} aria-hidden="true">
        {kind === 'apple' ? (
          <>
            <circle cx="80" cy="88" r="46" fill={colors.main} />
            <path d="M80 42 C74 28, 88 24, 92 38" stroke="#854d0e" strokeWidth="5" fill="none" />
            <ellipse cx="96" cy="52" rx="16" ry="9" fill={colors.accent} transform="rotate(24 96 52)" />
          </>
        ) : null}
        {kind === 'ball' ? (
          <>
            <circle cx="80" cy="88" r="48" fill={colors.main} />
            <path d="M44 88 C58 58, 102 58, 116 88 C102 118, 58 118, 44 88 Z" fill={colors.accent} opacity="0.85" />
            <path d="M80 40 C92 68, 92 108, 80 136" stroke="#fff" strokeWidth="4" fill="none" opacity="0.7" />
          </>
        ) : null}
        {kind === 'book' ? (
          <>
            <rect x="42" y="48" width="76" height="88" rx="10" fill={colors.main} />
            <rect x="52" y="58" width="56" height="68" rx="6" fill="#fff" opacity="0.92" />
            <rect x="78" y="48" width="10" height="88" fill={colors.accent} />
          </>
        ) : null}
        {kind === 'pencil' ? (
          <g transform="translate(80 82) rotate(-38)">
            <rect x="-72" y="-11" width="20" height="22" rx="5" fill={colors.accent} />
            <rect x="-52" y="-12" width="16" height="24" rx="2" fill="#94a3b8" />
            <line x1="-50" y1="-7" x2="-38" y2="-7" stroke="#64748b" strokeWidth="1.5" />
            <line x1="-50" y1="-1" x2="-38" y2="-1" stroke="#64748b" strokeWidth="1.5" />
            <line x1="-50" y1="5" x2="-38" y2="5" stroke="#64748b" strokeWidth="1.5" />
            <rect x="-36" y="-12" width="88" height="24" rx="4" fill={colors.main} />
            <rect x="-36" y="4" width="88" height="8" rx="2" fill="#d97706" opacity="0.35" />
            <rect x="52" y="-10" width="16" height="20" rx="2" fill="#deb887" />
            <polygon points="68,-10 84,0 68,10" fill="#c4a574" />
            <polygon points="74,-5 84,0 74,5" fill="#1f2937" />
          </g>
        ) : null}
        {kind === 'bread' ? (
          <>
            <ellipse cx="80" cy="96" rx="54" ry="34" fill={colors.main} />
            <path d="M34 96 C42 72, 118 72, 126 96" fill={colors.accent} opacity="0.55" />
            <path d="M52 88 C58 80, 72 80, 78 88" stroke="#92400e" strokeWidth="4" fill="none" opacity="0.5" />
          </>
        ) : null}
        {kind === 'toy' ? (
          <>
            <rect x="48" y="56" width="64" height="64" rx="16" fill={colors.main} />
            <circle cx="68" cy="82" r="8" fill="#fff" />
            <circle cx="92" cy="82" r="8" fill="#fff" />
            <rect x="62" y="98" width="36" height="8" rx="4" fill="#fff" />
            <circle cx="112" cy="72" r="10" fill={colors.accent} />
          </>
        ) : null}
      </svg>
      {showLabel ? <span className="pocetnik-shop-item__label">{label}</span> : null}
    </div>
  );
}

export function PriceTag({ price }: { price: number }) {
  return (
    <div className="pocetnik-price-tag" aria-label={`Cena ${price} korun`}>
      <span className="pocetnik-price-tag__value">{price}</span>
      <span className="pocetnik-price-tag__currency">Kč</span>
    </div>
  );
}

export function CoinButton({
  value,
  onClick,
  disabled = false,
  selected = false,
}: {
  value: PayCoinValue;
  onClick: () => void;
  disabled?: boolean;
  selected?: boolean;
}) {
  const tone = value === 1 ? '#d4a017' : value === 2 ? '#c98910' : value === 5 ? '#b7791f' : '#9a3412';

  return (
    <button
      type="button"
      className={`pocetnik-coin ${selected ? 'pocetnik-coin--selected' : ''}`}
      onClick={onClick}
      disabled={disabled}
      aria-label={`Mince ${value} korun`}
      style={{ ['--coin-tone' as string]: tone }}
    >
      <span className="pocetnik-coin__value">{value}</span>
      <span className="pocetnik-coin__currency">Kč</span>
    </button>
  );
}

export function SelectedCoin({ value, onRemove }: { value: PayCoinValue; onRemove: () => void }) {
  return (
    <button type="button" className="pocetnik-selected-coin" onClick={onRemove} aria-label={`Odebrat minci ${value} korun`}>
      {value} Kč
    </button>
  );
}
