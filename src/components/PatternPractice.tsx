import { useState } from 'react';
import type { PocetnikSetup } from '../types/pocetnik-types';
import { buildPatternSession, chunkPositions, symbolAt } from '../lib/primary-pattern-model';
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
import { PatternSymbolView } from './primary/PrimaryVisuals';

interface PatternPracticeProps {
  setup: PocetnikSetup;
  onBack: () => void;
}

export function PatternPractice({ setup, onBack }: PatternPracticeProps) {
  const { example, index, goNext } = usePracticeDeck(setup, buildPatternSession);
  const [answers, setAnswers] = useState<Array<{ id: string }>>([]);
  const [feedback, setFeedback] = useState<boolean | null>(null);
  const totalCells = example.visibleCount + example.blankCount;
  const rows = chunkPositions(totalCells, example.rowCount);
  const currentBlankIndex = example.visibleCount + answers.length;
  const completed = answers.length >= example.blankCount;

  const handlePick = (symbol: { id: string }) => {
    if (completed) return;
    const expected = symbolAt(example, currentBlankIndex);
    const isCorrect = symbol.id === expected.id;
    setFeedback(isCorrect);
    window.setTimeout(() => setFeedback(null), 650);
    if (isCorrect) {
      setAnswers((current) => [...current, symbol]);
    }
  };

  const handleNext = () => {
    goNext();
    setAnswers([]);
    setFeedback(null);
  };

  return (
    <PrimaryShell background={PRIMARY_BACKGROUNDS.softGreen}>
      {feedback !== null ? <FeedbackOverlay correct={feedback} /> : null}
      <PracticeLayout>
        <PracticeHeader questionNumber={index + 1} onBack={onBack} onNext={handleNext} canNext={completed} />
        <PracticeTitle color="#065f46">Postav a pokračuj</PracticeTitle>
        <PrimaryCard className="pocetnik-practice-card">
          <div style={{ display: 'grid', gap: 20 }}>
            {rows.map((row, rowIndex) => (
              <div key={rowIndex} style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center' }}>
                {row.map((position) => {
                  if (position < example.visibleCount) {
                    return <PatternSymbolView key={position} symbol={symbolAt(example, position)} />;
                  }
                  const answerIndex = position - example.visibleCount;
                  const answer = answers[answerIndex];
                  if (answer) {
                    return <PatternSymbolView key={position} symbol={{ id: answer.id as never, label: '' }} />;
                  }
                  return <PatternSymbolView key={position} symbol={symbolAt(example, position)} ghost />;
                })}
              </div>
            ))}
          </div>
        </PrimaryCard>
        <PracticeOptions>
          {example.palette.map((symbol) => (
            <button
              key={symbol.id}
              type="button"
              className="pocetnik-primary-option"
              onClick={() => handlePick(symbol)}
              disabled={completed}
              aria-label={symbol.label}
              style={{ minHeight: 112, display: 'grid', placeItems: 'center' }}
            >
              <PatternSymbolView symbol={symbol} />
            </button>
          ))}
        </PracticeOptions>
        {completed ? (
          <PracticeHint tone="success">Vzor je doplněný. Pokračuj šipkou.</PracticeHint>
        ) : feedback === false ? (
          <PracticeHint tone="error">Zkus jiný symbol.</PracticeHint>
        ) : (
          <PracticeHint tone="neutral">Klikni na symbol, který má následovat.</PracticeHint>
        )}
      </PracticeLayout>
    </PrimaryShell>
  );
}
