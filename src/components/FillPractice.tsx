import { useState } from 'react';
import type { PocetnikSetup } from '../types/pocetnik-types';
import { buildFillSession } from '../lib/primary-fill-model';
import { usePracticeDeck } from '../hooks/usePracticeDeck';
import {
  FeedbackOverlay,
  PracticeHeader,
  PracticeHint,
  PracticeLayout,
  PracticeTitle,
  PrimaryCard,
  PrimaryShell,
  PRIMARY_BACKGROUNDS,
} from './primary/PrimaryShell';
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
      <PracticeLayout>
        <PracticeHeader questionNumber={index + 1} onBack={onBack} onNext={handleNext} canNext={completed} />
        <PracticeTitle color="#5b4b8a">Doplň do {example.target}</PracticeTitle>

        <PrimaryCard className="pocetnik-practice-card pocetnik-practice-card--center pocetnik-practice-card--fill">
          <MarbleBag
            count={currentCount}
            marbleColor={example.marbleColor}
            onAddMarble={handleAddMarble}
            canAdd={canAdd}
          />
        </PrimaryCard>

        <div className="pocetnik-practice-actions">
          <AddMarbleButton marbleColor={example.marbleColor} onClick={handleAddMarble} disabled={!canAdd} />
        </div>

        {completed ? (
          <PracticeHint tone="success">Správně. Pokračuj šipkou.</PracticeHint>
        ) : (
          <PracticeHint tone="neutral">
            {remaining > 0 ? `Doplň ještě ${remaining} ${remaining === 1 ? 'kuličku' : remaining < 5 ? 'kuličky' : 'kuliček'}.` : 'Pytlík je plný.'}
          </PracticeHint>
        )}
      </PracticeLayout>
    </PrimaryShell>
  );
}
