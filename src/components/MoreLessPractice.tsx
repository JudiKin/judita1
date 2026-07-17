import { useState } from 'react';
import type { PocetnikSetup } from '../types/pocetnik-types';
import { buildMoreLessSession, formatDeltaLabel } from '../lib/primary-more-less-model';
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
      <PracticeLayout>
        <PracticeHeader questionNumber={index + 1} onBack={onBack} onNext={handleNext} canNext={completed} />
        <PracticeTitle color="#9a3412">Porovnej počet</PracticeTitle>
        <PrimaryCard className="pocetnik-practice-card">
          <div className="pocetnik-compare-groups">
            <div>
              <div className="pocetnik-compare-groups__label">Levá skupina</div>
              <ObjectGroup count={example.leftCount} objectKind={example.objectKind} stickerUrl={example.stickerUrl} />
            </div>
            <div className="pocetnik-compare-groups__divider" aria-hidden="true">
              ?
            </div>
            <div>
              <div className="pocetnik-compare-groups__label">Pravá skupina</div>
              <ObjectGroup count={example.rightCount} objectKind={example.objectKind} stickerUrl={example.stickerUrl} />
            </div>
          </div>
        </PrimaryCard>
        <PracticeOptions>
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
        </PracticeOptions>
        {completed ? (
          <PracticeHint tone="success">Správně. Pokračuj šipkou.</PracticeHint>
        ) : feedback === false ? (
          <PracticeHint tone="error">Zkus jinou možnost.</PracticeHint>
        ) : (
          <PracticeHint tone="neutral">Porovnej skupiny a vyber, jestli je vpravo stejně, víc, nebo míň.</PracticeHint>
        )}
      </PracticeLayout>
    </PrimaryShell>
  );
}
