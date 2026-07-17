import { useState } from 'react';
import type { PocetnikSetup } from '../types/pocetnik-types';
import { buildNumberSequenceSession } from '../lib/primary-number-sequence-model';
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
import { NumberAnswer } from './primary/PrimaryVisuals';
import { NumberSequenceRow } from './primary/NumberSequenceVisuals';

interface NumberSequencePracticeProps {
  setup: PocetnikSetup;
  onBack: () => void;
}

export function NumberSequencePractice({ setup, onBack }: NumberSequencePracticeProps) {
  const { example, index, goNext } = usePracticeDeck(setup, buildNumberSequenceSession);
  const [feedback, setFeedback] = useState<boolean | null>(null);
  const [completed, setCompleted] = useState(false);
  const [pickedAnswer, setPickedAnswer] = useState<number | null>(null);

  if (!example) {
    return (
      <PrimaryShell background={PRIMARY_BACKGROUNDS.softGreen}>
        <PracticeLayout>
          <PracticeHeader questionNumber={1} onBack={onBack} onNext={onBack} canNext />
          <PracticeHint tone="error">Nepodařilo se načíst úlohu. Zkus to znovu z menu.</PracticeHint>
        </PracticeLayout>
      </PrimaryShell>
    );
  }

  const handlePick = (value: number) => {
    if (completed) return;
    setPickedAnswer(value);
    const isCorrect = value === example.answer;
    setFeedback(isCorrect);
    setCompleted(isCorrect);
    window.setTimeout(() => setFeedback(null), 700);
  };

  const handleNext = () => {
    goNext();
    setCompleted(false);
    setFeedback(null);
    setPickedAnswer(null);
  };

  return (
    <PrimaryShell background={PRIMARY_BACKGROUNDS.softGreen}>
      {feedback !== null ? <FeedbackOverlay correct={feedback} /> : null}
      <PracticeLayout>
        <PracticeHeader questionNumber={index + 1} onBack={onBack} onNext={handleNext} canNext={completed} />
        <PracticeTitle color="#047857">Číselné řady</PracticeTitle>

        <PrimaryCard className="pocetnik-practice-card pocetnik-number-sequence-card">
          <NumberSequenceRow
            values={example.values}
            missingIndex={example.missingIndex}
            filledValue={pickedAnswer}
          />
        </PrimaryCard>

        <PracticeOptions>
          {example.options.map((value, optionIndex) => (
            <button
              key={value}
              type="button"
              className="pocetnik-primary-option"
              onClick={() => handlePick(value)}
              disabled={completed}
              style={{ minHeight: 120, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8 }}
            >
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#64748b' }}>{String.fromCharCode(65 + optionIndex)}</span>
              <NumberAnswer value={value} />
            </button>
          ))}
        </PracticeOptions>

        {completed ? (
          <PracticeHint tone="success">Správně. Pokračuj šipkou.</PracticeHint>
        ) : feedback === false ? (
          <PracticeHint tone="error">Zkus jiné číslo do řady.</PracticeHint>
        ) : (
          <PracticeHint tone="neutral">Doplň chybějící číslo v řadě.</PracticeHint>
        )}
      </PracticeLayout>
    </PrimaryShell>
  );
}
