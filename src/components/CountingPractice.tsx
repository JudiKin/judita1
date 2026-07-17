import { useState } from 'react';
import type { PocetnikSetup } from '../types/pocetnik-types';
import { buildCountingSession } from '../lib/primary-counting-model';
import { usePracticeDeck } from '../hooks/usePracticeDeck';
import { FeedbackOverlay, PracticeHeader, PrimaryShell, PRIMARY_BACKGROUNDS } from './primary/PrimaryShell';
import { DotsAnswer, NumberAnswer, ObjectGroup } from './primary/PrimaryVisuals';

interface CountingPracticeProps {
  setup: PocetnikSetup;
  onBack: () => void;
}

export function CountingPractice({ setup, onBack }: CountingPracticeProps) {
  const { example, index, goNext } = usePracticeDeck(setup, buildCountingSession);
  const [feedback, setFeedback] = useState<boolean | null>(null);
  const [completed, setCompleted] = useState(false);

  const handlePick = (value: number) => {
    if (completed) return;
    const isCorrect = value === example.count;
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
    <PrimaryShell background={PRIMARY_BACKGROUNDS.beige}>
      {feedback !== null ? <FeedbackOverlay correct={feedback} /> : null}
      <div style={{ maxWidth: 960, margin: '0 auto', padding: '20px 24px 32px' }}>
        <PracticeHeader questionNumber={index + 1} onBack={onBack} onNext={handleNext} canNext={completed} />
        <div style={{ textAlign: 'center', marginBottom: 24, fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 900, color: '#92400e', textTransform: 'uppercase' }}>
          Počítej
        </div>
        <div style={{ maxWidth: 520, margin: '0 auto' }}>
          <ObjectGroup count={example.count} objectType={example.objectType} stickerUrl={example.stickerUrl} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 16, marginTop: 32 }}>
          {example.options.map((value, optionIndex) => (
            <button
              key={value}
              type="button"
              className="pocetnik-primary-option"
              onClick={() => handlePick(value)}
              disabled={completed}
              style={{ minHeight: 140, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8 }}
            >
              <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#64748b' }}>{String.fromCharCode(65 + optionIndex)}</span>
              {example.answerMode === 'numbers' ? <NumberAnswer value={value} /> : <DotsAnswer value={Math.max(1, Math.min(6, value))} />}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 20 }}>
          {completed ? (
            <div style={hintStyle('#047857')}>Správně. Pokračuj šipkou.</div>
          ) : feedback === false ? (
            <div style={hintStyle('#dc2626')}>Zkus jinou možnost.</div>
          ) : (
            <div style={hintStyle('#64748b')}>Klikni na počet, který vidíš.</div>
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
