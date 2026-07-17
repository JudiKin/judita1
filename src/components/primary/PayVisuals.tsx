import type { PayCoinValue, PayItemKind } from '../../types/pocetnik-types';

const ITEM_COLORS: Record<PayItemKind, { main: string; accent: string }> = {
  apple: { main: '#ef4444', accent: '#22c55e' },
  ball: { main: '#3b82f6', accent: '#fbbf24' },
  book: { main: '#8b5cf6', accent: '#f59e0b' },
  pencil: { main: '#f59e0b', accent: '#ef4444' },
  bread: { main: '#d97706', accent: '#fcd34d' },
  toy: { main: '#ec4899', accent: '#06b6d4' },
};

export function ShopItem({ kind, label }: { kind: PayItemKind; label: string }) {
  const colors = ITEM_COLORS[kind];

  return (
    <div className="pocetnik-shop-item" aria-label={label}>
      <svg viewBox="0 0 160 160" width={160} height={160} aria-hidden="true">
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
          <>
            <rect x="48" y="72" width="84" height="18" rx="8" fill={colors.main} transform="rotate(-18 90 81)" />
            <polygon points="48,81 34,72 34,90" fill={colors.accent} transform="rotate(-18 90 81)" />
            <rect x="118" y="66" width="16" height="30" rx="4" fill="#fde68a" transform="rotate(-18 90 81)" />
          </>
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
      <span className="pocetnik-shop-item__label">{label}</span>
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
