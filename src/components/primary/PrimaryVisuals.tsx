import type { PatternSymbol } from '../../lib/primary-pattern-model';
import type { MoreLessObjectKind, PayItemKind, SequenceItemKind } from '../../types/pocetnik-types';
import { ShopItem } from './PayVisuals';

const PATTERN_KINDS = new Set<SequenceItemKind>([
  'yellow-cube',
  'green-cube',
  'purple-cube',
  'red-cube',
  'yellow-circle',
  'purple-square',
  'red-plus',
]);

const PAY_KINDS = new Set<PayItemKind>(['apple', 'ball', 'book', 'pencil', 'bread', 'toy']);

const DEFAULT_STICKER_URL =
  'https://qypiuvqglsmxdsnyazih.supabase.co/storage/v1/object/public/competition_files/stickers/4_geometricke%20symboly/Samolepky_1_1_circle.svg';

function isPatternKind(kind: MoreLessObjectKind): kind is SequenceItemKind {
  return PATTERN_KINDS.has(kind as SequenceItemKind);
}

function isPayKind(kind: MoreLessObjectKind): kind is PayItemKind {
  return PAY_KINDS.has(kind as PayItemKind);
}

const COLORS: Record<string, { top: string; left: string; right: string }> = {
  'yellow-cube': { top: '#ffd54f', left: '#ffb300', right: '#ff8f00' },
  'green-cube': { top: '#81c784', left: '#43a047', right: '#2e7d32' },
  'purple-cube': { top: '#ba68c8', left: '#8e24aa', right: '#6a1b9a' },
  'red-cube': { top: '#ef5350', left: '#e53935', right: '#c62828' },
};

export function PatternSymbolView({ symbol, ghost = false }: { symbol: PatternSymbol; ghost?: boolean }) {
  if (symbol.id.includes('cube')) {
    const colors = COLORS[symbol.id] ?? COLORS['yellow-cube'];
    return (
      <svg viewBox="0 0 96 82" width={80} height={70} aria-hidden="true" style={{ opacity: ghost ? 0.35 : 1 }}>
        <path d="M20 18h54l16 18H36z" fill={colors.top} />
        <path d="M36 36h54v42H36z" fill={colors.left} />
        <path d="M20 18l16 18v42L20 60z" fill={colors.right} />
        <path d="M36 36h54" stroke="#3cae8c" strokeWidth="2" />
        <path d="M63 36v42" stroke="#3cae8c" strokeWidth="2" />
      </svg>
    );
  }

  const shapeStyles: Record<string, React.CSSProperties> = {
    'yellow-circle': { background: '#ffd54f', borderRadius: '999px' },
    'purple-square': { background: '#ba68c8', borderRadius: 12 },
    'red-plus': { background: '#ef5350', borderRadius: 12, position: 'relative' },
  };

  return (
    <div
      aria-hidden="true"
      style={{
        width: 72,
        height: 72,
        opacity: ghost ? 0.35 : 1,
        ...shapeStyles[symbol.id],
      }}
    >
      {symbol.id === 'red-plus' ? (
        <span style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', color: '#fff', fontSize: 42, fontWeight: 900 }}>+</span>
      ) : null}
    </div>
  );
}

export function CoconutObject({ index }: { index: number }) {
  return (
    <div style={{ position: 'relative', width: 80, height: 80, transform: `rotate(${index % 2 === 0 ? -12 : 14}deg)` }} aria-hidden="true">
      <div style={{ position: 'absolute', inset: 4, borderRadius: 999, background: '#8d2f1f', boxShadow: '0 8px 16px rgb(0 0 0 / 0.15)' }} />
      <div style={{ position: 'absolute', left: 16, top: 16, width: 48, height: 48, borderRadius: 999, background: '#ead8b6' }} />
    </div>
  );
}

export function CubeObject({ index }: { index: number }) {
  const offset = index % 3;
  return (
    <svg viewBox="0 0 96 82" width={80} height={70} aria-hidden="true" style={{ transform: `translateY(${offset * 4}px)` }}>
      <path d="M20 18h54l16 18H36z" fill="#72f0c6" />
      <path d="M36 36h54v42H36z" fill="#60bf9e" />
      <path d="M20 18l16 18v42L20 60z" fill="#079666" />
    </svg>
  );
}

export function StickerObject({ url, index }: { url: string; index: number }) {
  return (
    <div style={{ width: 80, height: 80, display: 'grid', placeItems: 'center', transform: `rotate(${index % 2 === 0 ? -8 : 9}deg)` }}>
      <img src={url} alt="" draggable={false} style={{ maxWidth: 80, maxHeight: 80, objectFit: 'contain' }} />
    </div>
  );
}

export function CompareObject({
  kind,
  index,
  stickerUrl,
}: {
  kind: MoreLessObjectKind;
  index: number;
  stickerUrl?: string;
}) {
  if (kind === 'stickers') {
    return <StickerObject url={stickerUrl ?? DEFAULT_STICKER_URL} index={index} />;
  }
  if (kind === 'coconuts') return <CoconutObject index={index} />;
  if (kind === 'cubes') return <CubeObject index={index} />;
  if (isPatternKind(kind)) return <PatternSymbolView symbol={{ id: kind, label: '' }} />;
  if (isPayKind(kind)) return <ShopItem kind={kind} label="" size={72} showLabel={false} />;
  return <CoconutObject index={index} />;
}

export function ObjectGroup({
  count,
  objectKind,
  stickerUrl,
}: {
  count: number;
  objectKind: MoreLessObjectKind;
  stickerUrl?: string;
}) {
  const safeCount = Number.isFinite(count) ? Math.max(1, Math.floor(count)) : 1;
  const densityClass =
    safeCount > 12 ? 'pocetnik-object-group--dense' : safeCount > 8 ? 'pocetnik-object-group--compact' : '';

  return (
    <div className={`pocetnik-object-group ${densityClass}`.trim()} aria-label={`Skupina ${safeCount} objektů`}>
      {Array.from({ length: safeCount }, (_, index) => (
        <CompareObject key={index} kind={objectKind} index={index} stickerUrl={stickerUrl} />
      ))}
    </div>
  );
}

export function DotsAnswer({ value }: { value: number }) {
  const positions: Record<number, string[]> = {
    1: ['center'],
    2: ['top-left', 'bottom-right'],
    3: ['top-left', 'center', 'bottom-right'],
    4: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
    5: ['top-left', 'top-right', 'center', 'bottom-left', 'bottom-right'],
    6: ['top-left', 'top-right', 'middle-left', 'middle-right', 'bottom-left', 'bottom-right'],
  };
  const coords: Record<string, string> = {
    'top-left': 'left: 18%; top: 18%;',
    'top-right': 'right: 18%; top: 18%;',
    'middle-left': 'left: 18%; top: 50%; transform: translateY(-50%);',
    'middle-right': 'right: 18%; top: 50%; transform: translateY(-50%);',
    center: 'left: 50%; top: 50%; transform: translate(-50%, -50%);',
    'bottom-left': 'left: 18%; bottom: 18%;',
    'bottom-right': 'right: 18%; bottom: 18%;',
  };

  return (
    <div style={{ position: 'relative', width: 96, height: 96, borderRadius: 24, background: '#6c48f5', boxShadow: 'inset 0 0 0 1px rgb(255 255 255 / 0.15)' }}>
      {(positions[value] ?? positions[6]).map((key) => (
        <span
          key={key}
          style={{
            position: 'absolute',
            width: 20,
            height: 20,
            borderRadius: 999,
            background: '#fff',
            ...(Object.fromEntries(coords[key].split(';').filter(Boolean).map((part) => {
              const [k, v] = part.split(':').map((piece) => piece.trim());
              return [k.replace(/-([a-z])/g, (_, char: string) => char.toUpperCase()), v];
            })) as React.CSSProperties),
          }}
        />
      ))}
    </div>
  );
}

export function MarksAnswer({ value }: { value: number }) {
  const safeValue = Math.max(1, Math.min(20, Math.floor(value)));
  const fullGroups = Math.floor(safeValue / 5);
  const remainder = safeValue % 5;

  return (
    <div className="pocetnik-marks-answer" aria-hidden="true">
      {Array.from({ length: fullGroups }, (_, groupIndex) => (
        <div key={`group-${groupIndex}`} className="pocetnik-marks-answer__group">
          {Array.from({ length: 5 }, (_, markIndex) => (
            <span key={markIndex} className="pocetnik-marks-answer__mark" />
          ))}
        </div>
      ))}
      {remainder > 0 ? (
        <div className="pocetnik-marks-answer__group">
          {Array.from({ length: remainder }, (_, markIndex) => (
            <span key={markIndex} className="pocetnik-marks-answer__mark" />
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function NumberAnswer({ value }: { value: number }) {
  return <span style={{ fontSize: '4rem', fontWeight: 900, color: '#6c48f5' }}>{value}</span>;
}
