import { useState } from 'react';
import type { PocetnikSetup } from '../types/pocetnik-types';
import { buildModelWriteSession } from '../lib/primary-model-write-model';
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
import { ModelWriteEquation, TenFrameGrid } from './primary/ModelWriteVisuals';

interface ModelWritePracticeProps {
  setup: PocetnikSetup;
  onBack: () => void;
}

export function ModelWritePractice({ setup, onBack }: ModelWritePracticeProps) {
  const { example, index, goNext } = usePracticeDeck(setup, buildModelWriteSession);
  const [feedback, setFeedback] = useState<boolean | null>(null);
  const [completed, setCompleted] = useState(false);
  const [pickedSplit, setPickedSplit] = useState<{ first: number; second: number } | null>(null);

  if (!example) {
    return (
      <PrimaryShell background={PRIMARY_BACKGROUNDS.softBlue}>
        <PracticeLayout>
          <PracticeHeader questionNumber={1} onBack={onBack} onNext={onBack} canNext />
          <PracticeHint tone="error">Nepodařilo se načíst úlohu. Zkus to znovu z menu.</PracticeHint>
        </PracticeLayout>
      </PrimaryShell>
    );
  }

  const handlePick = (first: number, second: number) => {
    if (completed) return;
    setPickedSplit({ first, second });
    const isCorrect = first === example.splitFirst && second === example.splitSecond;
    setFeedback(isCorrect);
    setCompleted(isCorrect);
    window.setTimeout(() => setFeedback(null), 700);
  };

  const handleNext = () => {
    goNext();
    setCompleted(false);
    setFeedback(null);
    setPickedSplit(null);
  };

  const title = example.mode === 'add' ? 'Sčítej s tečkami' : 'Odčítej s tečkami';

  return (
    <PrimaryShell background={PRIMARY_BACKGROUNDS.softBlue}>
      {feedback !== null ? <FeedbackOverlay correct={feedback} /> : null}
      <PracticeLayout>
        <PracticeHeader questionNumber={index + 1} onBack={onBack} onNext={handleNext} canNext={completed} />
        <PracticeTitle color="#1d4ed8">Modeluj, zapisuj</PracticeTitle>
        <p className="pocetnik-model-subtitle">{title}</p>

        <PrimaryCard className="pocetnik-practice-card pocetnik-model-card">
          <TenFrameGrid cells={example.cells} />
          <ModelWriteEquation
            mode={example.mode}
            left={example.left}
            right={example.right}
            pickedFirst={pickedSplit?.first ?? null}
            pickedSecond={pickedSplit?.second ?? null}
          />
        </PrimaryCard>

        <PracticeOptions className="pocetnik-model-options">
          {example.options.map((option) => (
            <button
              key={`${option.first}-${option.second}`}
              type="button"
              className="pocetnik-primary-option pocetnik-model-option"
              onClick={() => handlePick(option.first, option.second)}
              disabled={completed}
            >
              <span className="pocetnik-model-option__value">
                {option.first} a {option.second}
              </span>
            </button>
          ))}
        </PracticeOptions>

        {completed ? (
          <PracticeHint tone="success">Správně. Pokračuj šipkou.</PracticeHint>
        ) : feedback === false ? (
          <PracticeHint tone="error">Zkus jiné rozdělení čísla.</PracticeHint>
        ) : (
          <PracticeHint tone="neutral">
            {example.mode === 'add'
              ? 'Podívej se na tečky a vyber, jak rozdělit druhé číslo přes desítku.'
              : 'Podívej se na tečky a vyber, jak rozdělit odčítané přes desítku.'}
          </PracticeHint>
        )}
      </PracticeLayout>
    </PrimaryShell>
  );
}
