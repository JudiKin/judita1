import { useState } from 'react';
import type { PocetnikSetup } from '../types/pocetnik-types';
import { buildCountingSession } from '../lib/primary-counting-model';
import { usePracticeDeck } from '../hooks/usePracticeDeck';
import {
  FeedbackOverlay,
  PracticeHeader,
  PracticeHint,
  PracticeLayout,
  PracticeOptions,
  PracticeTitle,
  PrimaryCard,
  PrimaryShell,
  PRIMARY_BACKGROUNDS,
} from './primary/PrimaryShell';
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
      <PracticeLayout>
        <PracticeHeader questionNumber={index + 1} onBack={onBack} onNext={handleNext} canNext={completed} />
        <PracticeTitle color="#92400e">Počítej</PracticeTitle>
        <PrimaryCard className="pocetnik-practice-card pocetnik-practice-card--center">
          <ObjectGroup count={example.count} objectType={example.objectType} stickerUrl={example.stickerUrl} />
        </PrimaryCard>
        <PracticeOptions>
          {example.options.map((value, optionIndex) => (
            <button
              key={value}
              type="button"
              className="pocetnik-primary-option"
              onClick={() => handlePick(value)}
              disabled={completed}
              style={{ minHeight: 140, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8 }}
            >
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#64748b' }}>{String.fromCharCode(65 + optionIndex)}</span>
              {example.answerMode === 'numbers' ? <NumberAnswer value={value} /> : <DotsAnswer value={Math.max(1, Math.min(6, value))} />}
            </button>
          ))}
        </PracticeOptions>
        {completed ? (
          <PracticeHint tone="success">Správně. Pokračuj šipkou.</PracticeHint>
        ) : feedback === false ? (
          <PracticeHint tone="error">Zkus jinou možnost.</PracticeHint>
        ) : (
          <PracticeHint tone="neutral">Klikni na počet, který vidíš.</PracticeHint>
        )}
      </PracticeLayout>
    </PrimaryShell>
  );
}
