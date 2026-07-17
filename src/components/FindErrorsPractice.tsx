import { useState } from 'react';
import type { PocetnikSetup } from '../types/pocetnik-types';
import { buildFindErrorsSession } from '../lib/primary-find-errors-model';
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
import { NumberAnswer, ObjectGroup, PatternSymbolView } from './primary/PrimaryVisuals';

interface FindErrorsPracticeProps {
  setup: PocetnikSetup;
  onBack: () => void;
}

export function FindErrorsPractice({ setup, onBack }: FindErrorsPracticeProps) {
  const { example, index, goNext } = usePracticeDeck(setup, buildFindErrorsSession);
  const [feedback, setFeedback] = useState<boolean | null>(null);
  const [completed, setCompleted] = useState(false);

  const handlePick = (userSaysCorrect: boolean) => {
    if (completed) return;
    const isCorrect = userSaysCorrect === !example.hasError;
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
    <PrimaryShell background={PRIMARY_BACKGROUNDS.softRose}>
      {feedback !== null ? <FeedbackOverlay correct={feedback} /> : null}
      <PracticeLayout>
        <PracticeHeader questionNumber={index + 1} onBack={onBack} onNext={handleNext} canNext={completed} />
        <PracticeTitle color="#be123c">Najdi chyby</PracticeTitle>
        <PrimaryCard className="pocetnik-practice-card pocetnik-find-errors-card">
          {example.kind === 'counting' && example.objectKind && example.actualCount !== undefined ? (
            <div className="pocetnik-find-errors-counting">
              <ObjectGroup count={example.actualCount} objectKind={example.objectKind} stickerUrl={example.stickerUrl} />
              <div className="pocetnik-find-errors-claim">
                <NumberAnswer value={example.displayedCount ?? example.actualCount} />
              </div>
            </div>
          ) : null}

          {example.kind === 'comparison' &&
          example.objectKind &&
          example.leftCount !== undefined &&
          example.rightCount !== undefined ? (
            <div className="pocetnik-find-errors-comparison">
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
            </div>
          ) : null}

          {example.kind === 'pattern' && example.patternSymbols ? (
            <div className="pocetnik-find-errors-pattern">
              {example.patternSymbols.map((symbol, symbolIndex) => (
                <PatternSymbolView key={`${symbol.id}-${symbolIndex}`} symbol={symbol} />
              ))}
            </div>
          ) : null}

          <p className="pocetnik-find-errors-claim-text">{example.claimText}</p>
        </PrimaryCard>

        <PracticeOptions className="pocetnik-verdict-options">
          <button
            type="button"
            className="pocetnik-verdict-option pocetnik-verdict-option--correct"
            onClick={() => handlePick(true)}
            disabled={completed}
            aria-label="Příklad je správně"
          >
            <span className="pocetnik-verdict-option__icon" aria-hidden="true">
              ✓
            </span>
            <span className="pocetnik-verdict-option__label">Správně</span>
          </button>
          <button
            type="button"
            className="pocetnik-verdict-option pocetnik-verdict-option--wrong"
            onClick={() => handlePick(false)}
            disabled={completed}
            aria-label="Příklad je špatně"
          >
            <span className="pocetnik-verdict-option__icon" aria-hidden="true">
              ✗
            </span>
            <span className="pocetnik-verdict-option__label">Chyba</span>
          </button>
        </PracticeOptions>

        {completed ? (
          <PracticeHint tone="success">Správně. Pokračuj šipkou.</PracticeHint>
        ) : feedback === false ? (
          <PracticeHint tone="error">Zkus to znovu — je příklad správně, nebo ne?</PracticeHint>
        ) : (
          <PracticeHint tone="neutral">Podívej se na příklad a klikni na fajfku nebo křížek.</PracticeHint>
        )}
      </PracticeLayout>
    </PrimaryShell>
  );
}
