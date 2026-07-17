import { useState } from 'react';
import type { PocetnikSetup } from '../types/pocetnik-types';
import { buildMoreLessSession, formatDeltaLabel } from '../lib/primary-more-less-model';
import { usePracticeDeck } from '../hooks/usePracticeDeck';
import { FeedbackOverlay, PracticeHeader, PrimaryCard, PrimaryShell, PRIMARY_BACKGROUNDS } from './primary/PrimaryShell';
import { ObjectGroup } from './primary/PrimaryVisuals';

interface MoreLessPracticeProps {
  setup: PocetnikSetup;
  onBack: () => void;
}

export function MoreLessPractice({ setup, onBack }: MoreLessPracticeProps) {
  const { example, index, goNext } = usePracticeDeck(setup, buildMoreLessSession);
  const [feedback, setFeedback] = useState<boolean | null>(null);
  const [completed, setCompleted] = useState(false);

  const handlePick = (delta: number) => {
    if (completed) return;
    const isCorrect = delta === example.delta;
    setFeedback(isCorrect);
    setCompleted(isCorrect);
    window.setTimeout(() => setFeedback(null), 700);
  };

  const handleNext = () => {
    goNext();
    setCompleted(false);
    setFeedback(null);
  };

  return (
    <PrimaryShell background={PRIMARY_BACKGROUNDS.softOrange}>
      {feedback !== null ? <FeedbackOverlay correct={feedback} /> : null}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '20px 24px 32px' }}>
        <PracticeHeader questionNumber={index + 1} onBack={onBack} onNext={handleNext} canNext={completed} />
        <div style={{ marginBottom: 20, fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 900, color: '#9a3412', textTransform: 'uppercase' }}>
          Porovnej počet
        </div>
        <PrimaryCard style={{ padding: '24px 28px' } as React.CSSProperties}>
          <div className="pocetnik-compare-groups">
            <div>
              <div style={{ textAlign: 'center', marginBottom: 12, fontWeight: 800, color: '#475569' }}>Levá skupina</div>
              <ObjectGroup count={example.leftCount} objectType={example.objectType} stickerUrl={example.stickerUrl} />
            </div>
            <div className="pocetnik-compare-groups__divider" aria-hidden="true">
              ?
            </div>
            <div>
              <div style={{ textAlign: 'center', marginBottom: 12, fontWeight: 800, color: '#475569' }}>Pravá skupina</div>
              <ObjectGroup count={example.rightCount} objectType={example.objectType} stickerUrl={example.stickerUrl} />
            </div>
          </div>
        </PrimaryCard>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 16, marginTop: 28 }}>
          {example.options.map((delta) => (
            <button
              key={delta}
              type="button"
              className="pocetnik-primary-option pocetnik-delta-option"
              onClick={() => handlePick(delta)}
              disabled={completed}
            >
              <span className="pocetnik-delta-option__label">{formatDeltaLabel(delta)}</span>
              <span className="pocetnik-delta-option__hint">
                {delta === 0 ? 'Stejný počet' : delta > 0 ? 'Vpravo je víc' : 'Vpravo je míň'}
              </span>
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 20 }}>
          {completed ? (
            <div style={hintStyle('#047857')}>Správně. Pokračuj šipkou.</div>
          ) : feedback === false ? (
            <div style={hintStyle('#dc2626')}>Zkus jinou možnost.</div>
          ) : (
            <div style={hintStyle('#64748b')}>Porovnej skupiny a vyber, jestli je vpravo stejně, víc, nebo míň.</div>
          )}
        </div>
      </div>
    </PrimaryShell>
  );
}

function hintStyle(color: string): React.CSSProperties {
  return {
    borderRadius: 999,
    background: '#fff',
    padding: '12px 20px',
    fontWeight: 800,
    color,
    boxShadow: '0 8px 20px rgb(0 0 0 / 0.06)',
  };
}
