import type { ReactNode } from 'react';

export const PRIMARY_BACKGROUNDS = {
  softGreen: '#E7F9EE',
  beige: '#F5E6D0',
  softOrange: '#FFF3E0',
  softBlue: '#E8F4FD',
  softPurple: '#F3EEFC',
  softRose: '#FFF1F2',
} as const;

interface PrimaryShellProps {
  background?: string;
  className?: string;
  children: ReactNode;
}

export function PrimaryShell({ background = PRIMARY_BACKGROUNDS.beige, className = '', children }: PrimaryShellProps) {
  return (
    <div className={`pocetnik-primary pocetnik-primary-shell ${className}`} style={{ ['--p1-bg' as string]: background }}>
      {children}
    </div>
  );
}

export function PrimaryCard({
  className = '',
  style,
  children,
}: {
  className?: string;
  style?: React.CSSProperties;
  children: ReactNode;
}) {
  return (
    <div className={`pocetnik-primary-card ${className}`} style={style}>
      {children}
    </div>
  );
}

export function FeedbackOverlay({
  correct,
  correctText = 'SPRÁVNĚ!',
  wrongText = 'ZKUS TO!',
}: {
  correct: boolean;
  correctText?: string;
  wrongText?: string;
}) {
  return (
    <div className={`pocetnik-primary-feedback ${correct ? '' : 'pocetnik-primary-feedback--wrong'}`} aria-live="polite">
      <div className="pocetnik-primary-feedback__text">{correct ? correctText : wrongText}</div>
    </div>
  );
}

export function PracticeHeader({
  questionNumber,
  onBack,
  onNext,
  canNext,
}: {
  questionNumber: number;
  onBack: () => void;
  onNext: () => void;
  canNext: boolean;
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
      <button type="button" onClick={onBack} aria-label="Zpět" style={iconButtonStyle}>
        ←
      </button>
      <div style={badgeStyle}>{questionNumber}</div>
      <button type="button" onClick={onNext} disabled={!canNext} aria-label="Další" style={{ ...iconButtonStyle, background: canNext ? '#f7a800' : '#cbd5e1', color: '#fff' }}>
        →
      </button>
    </div>
  );
}

const iconButtonStyle: React.CSSProperties = {
  border: 'none',
  borderRadius: 999,
  width: 48,
  height: 48,
  background: 'rgb(255 255 255 / 0.8)',
  boxShadow: '0 4px 12px rgb(0 0 0 / 0.08)',
  fontSize: '1.4rem',
  cursor: 'pointer',
};

const badgeStyle: React.CSSProperties = {
  borderRadius: 999,
  padding: '8px 20px',
  background: '#047857',
  color: '#fff',
  fontSize: '1.6rem',
  fontWeight: 900,
};

export function PracticeLayout({ children }: { children: ReactNode }) {
  return <div className="pocetnik-practice-layout">{children}</div>;
}

export function PracticeTitle({ children, color }: { children: ReactNode; color: string }) {
  return (
    <h2 className="pocetnik-practice-title" style={{ color }}>
      {children}
    </h2>
  );
}

export function PracticeHint({
  children,
  tone = 'neutral',
}: {
  children: ReactNode;
  tone?: 'success' | 'error' | 'neutral';
}) {
  return (
    <div className="pocetnik-practice-hint-wrap">
      <div className={`pocetnik-practice-hint pocetnik-practice-hint--${tone}`}>{children}</div>
    </div>
  );
}

export function PracticeOptions({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`pocetnik-practice-options ${className}`.trim()}>{children}</div>;
}
