import { useState } from 'react';
import type { PocetnikSetup } from '../types/pocetnik-types';
import { buildFillSession } from '../lib/primary-fill-model';
import { usePracticeDeck } from '../hooks/usePracticeDeck';
import { FeedbackOverlay, PracticeHeader, PrimaryCard, PrimaryShell, PRIMARY_BACKGROUNDS } from './primary/PrimaryShell';
import { AddMarbleButton, MarbleBag } from './primary/FillVisuals';

interface FillPracticeProps {
  setup: PocetnikSetup;
  onBack: () => void;
}

export function FillPractice({ setup, onBack }: FillPracticeProps) {
  const { example, index, goNext } = usePracticeDeck(setup, buildFillSession);
  const [addedCount, setAddedCount] = useState(0);
  const [feedback, setFeedback] = useState<boolean | null>(null);
  const [completed, setCompleted] = useState(false);

  const currentCount = example.startCount + addedCount;
  const remaining = example.target - currentCount;
  const canAdd = !completed && remaining > 0;

  const handleAddMarble = () => {
    if (!canAdd) return;

    const nextCount = currentCount + 1;
    setAddedCount((current) => current + 1);

    if (nextCount === example.target) {
      setFeedback(true);
      setCompleted(true);
      window.setTimeout(() => setFeedback(null), 700);
    }
  };

  const handleNext = () => {
    goNext();
    setAddedCount(0);
    setCompleted(false);
    setFeedback(null);
  };

  return (
    <PrimaryShell background={PRIMARY_BACKGROUNDS.softPurple}>
      {feedback !== null ? <FeedbackOverlay correct={feedback} /> : null}
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '20px 24px 32px' }}>
        <PracticeHeader questionNumber={index + 1} onBack={onBack} onNext={handleNext} canNext={completed} />
        <div style={{ marginBottom: 24, fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 900, color: '#5b4b8a', textTransform: 'uppercase' }}>
          Doplň do {example.target}
        </div>

        <PrimaryCard style={{ padding: '32px 24px', display: 'flex', justifyContent: 'center' }}>
          <MarbleBag
            count={currentCount}
            marbleColor={example.marbleColor}
            onAddMarble={handleAddMarble}
            canAdd={canAdd}
          />
        </PrimaryCard>

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 28 }}>
          <AddMarbleButton marbleColor={example.marbleColor} onClick={handleAddMarble} disabled={!canAdd} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 20 }}>
          {completed ? (
            <div style={hintStyle('#047857')}>Správně. Pokračuj šipkou.</div>
          ) : (
            <div style={hintStyle('#64748b')}>
              {remaining > 0 ? `Doplň ještě ${remaining} ${remaining === 1 ? 'kuličku' : remaining < 5 ? 'kuličky' : 'kuliček'}.` : 'Pytlík je plný.'}
            </div>
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
