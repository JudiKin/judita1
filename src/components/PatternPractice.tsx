import { useMemo, useState } from 'react';
import type { PocetnikSetup } from '../types/pocetnik-types';
import { buildPatternExample, chunkPositions, symbolAt } from '../lib/primary-pattern-model';
import { FeedbackOverlay, PracticeHeader, PrimaryCard, PrimaryShell, PRIMARY_BACKGROUNDS } from './primary/PrimaryShell';
import { PatternSymbolView } from './primary/PrimaryVisuals';

interface PatternPracticeProps {
  setup: PocetnikSetup;
  onBack: () => void;
}

export function PatternPractice({ setup, onBack }: PatternPracticeProps) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Array<{ id: string }>>([]);
  const [feedback, setFeedback] = useState<boolean | null>(null);

  const example = useMemo(() => buildPatternExample(setup, index), [setup, index]);
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
    setIndex((current) => current + 1);
    setAnswers([]);
    setFeedback(null);
  };

  return (
    <PrimaryShell background={PRIMARY_BACKGROUNDS.softGreen}>
      {feedback !== null ? <FeedbackOverlay correct={feedback} /> : null}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '20px 24px 32px' }}>
        <PracticeHeader questionNumber={index + 1} onBack={onBack} onNext={handleNext} canNext={completed} />
        <div style={{ marginBottom: 20, fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 900, color: '#065f46', textTransform: 'uppercase' }}>
          Postav a pokračuj
        </div>
        <PrimaryCard style={{ padding: '24px 28px' } as React.CSSProperties}>
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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 16, marginTop: 24 }}>
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
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 20 }}>
          {completed ? (
            <div style={hintStyle('#047857')}>Vzor je doplněný. Pokračuj šipkou.</div>
          ) : feedback === false ? (
            <div style={hintStyle('#dc2626')}>Zkus jiný symbol.</div>
          ) : (
            <div style={hintStyle('#64748b')}>Klikni na symbol, který má následovat.</div>
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
