import { useMemo, useState } from 'react';
import type { PocetnikSetup } from '../types/pocetnik-types';
import { buildDominoWriteSession, buildNumberChoices } from '../lib/primary-domino-write-model';
import { createRng } from '../lib/practice-shuffle';
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
import { DominoEquation, DominoTile } from './primary/DominoWriteVisuals';

interface DominoWritePracticeProps {
  setup: PocetnikSetup;
  onBack: () => void;
}

type ActiveField = 'left' | 'right' | 'result';

export function DominoWritePractice({ setup, onBack }: DominoWritePracticeProps) {
  const { example, index, goNext } = usePracticeDeck(setup, buildDominoWriteSession);
  const [leftValue, setLeftValue] = useState<number | null>(null);
  const [rightValue, setRightValue] = useState<number | null>(null);
  const [resultValue, setResultValue] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<boolean | null>(null);
  const [completed, setCompleted] = useState(false);

  const activeField: ActiveField | null = completed
    ? null
    : leftValue === null
      ? 'left'
      : rightValue === null
        ? 'right'
        : resultValue === null
          ? 'result'
          : null;

  const numberOptions = useMemo(() => {
    if (!example || activeField === null) return [];
    const max = setup.primaryDominoMaxDots === 6 ? 6 : 9;
    const choiceMax = activeField === 'result' ? max * 2 : max;
    const target =
      activeField === 'left'
        ? example.leftDots
        : activeField === 'right'
          ? example.rightDots
          : example.answer;
    const seed = example.index * 31 + (activeField === 'left' ? 1 : activeField === 'right' ? 2 : 3);
    return buildNumberChoices(target, choiceMax, createRng(seed));
  }, [activeField, example, setup.primaryDominoMaxDots]);

  if (!example) {
    return (
      <PrimaryShell background={PRIMARY_BACKGROUNDS.softOrange}>
        <PracticeLayout>
          <PracticeHeader questionNumber={1} onBack={onBack} onNext={onBack} canNext />
          <PracticeHint tone="error">Nepodařilo se načíst úlohu. Zkus to znovu z menu.</PracticeHint>
        </PracticeLayout>
      </PrimaryShell>
    );
  }

  const handlePick = (value: number) => {
    if (completed || activeField === null) return;

    if (activeField === 'left') {
      const isCorrect = value === example.leftDots;
      setLeftValue(value);
      setFeedback(isCorrect);
      if (!isCorrect) {
        window.setTimeout(() => {
          setFeedback(null);
          setLeftValue(null);
        }, 700);
        return;
      }
      window.setTimeout(() => setFeedback(null), 500);
      return;
    }

    if (activeField === 'right') {
      const isCorrect = value === example.rightDots;
      setRightValue(value);
      setFeedback(isCorrect);
      if (!isCorrect) {
        window.setTimeout(() => {
          setFeedback(null);
          setRightValue(null);
        }, 700);
        return;
      }
      window.setTimeout(() => setFeedback(null), 500);
      return;
    }

    const isCorrect = value === example.answer;
    setResultValue(value);
    setFeedback(isCorrect);
    setCompleted(isCorrect);
    window.setTimeout(() => setFeedback(null), 700);
  };

  const handleNext = () => {
    goNext();
    setLeftValue(null);
    setRightValue(null);
    setResultValue(null);
    setCompleted(false);
    setFeedback(null);
  };

  const title = example.mode === 'add' ? 'Zapiš a sečti' : 'Zapiš a odečti';

  return (
    <PrimaryShell background={PRIMARY_BACKGROUNDS.softOrange}>
      {feedback !== null ? <FeedbackOverlay correct={feedback} /> : null}
      <PracticeLayout>
        <PracticeHeader questionNumber={index + 1} onBack={onBack} onNext={handleNext} canNext={completed} />
        <PracticeTitle color="#9a3412">{title}</PracticeTitle>

        <PrimaryCard className="pocetnik-practice-card pocetnik-domino-card">
          <DominoTile leftDots={example.leftDots} rightDots={example.rightDots} />
          <DominoEquation
            mode={example.mode}
            leftValue={leftValue}
            rightValue={rightValue}
            resultValue={resultValue}
            activeField={activeField}
          />
        </PrimaryCard>

        <PracticeOptions>
          {numberOptions.map((value) => (
            <button
              key={value}
              type="button"
              className="pocetnik-primary-option pocetnik-domino-option"
              onClick={() => handlePick(value)}
              disabled={completed || activeField === null}
            >
              {value}
            </button>
          ))}
        </PracticeOptions>

        {completed ? (
          <PracticeHint tone="success">Správně. Pokračuj šipkou.</PracticeHint>
        ) : feedback === false ? (
          <PracticeHint tone="error">Zkus to znovu — spočítej tečky na domino.</PracticeHint>
        ) : (
          <PracticeHint tone="neutral">
            {activeField === 'left'
              ? 'Kolik teček je vlevo?'
              : activeField === 'right'
                ? 'Kolik teček je vpravo?'
                : example.mode === 'add'
                  ? 'Kolik je dohromady?'
                  : 'Kolik zůstane?'}
          </PracticeHint>
        )}
      </PracticeLayout>
    </PrimaryShell>
  );
}
