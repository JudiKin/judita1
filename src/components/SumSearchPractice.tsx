import { useState } from 'react';
import type { PocetnikSetup } from '../types/pocetnik-types';
import {
  buildSumSearchSession,
  isContiguousLine,
  isValidSumSelection,
  toggleCellSelection,
  type GridCell,
} from '../lib/primary-sum-search-model';
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
import { SumSearchGrid } from './primary/SumSearchVisuals';

interface SumSearchPracticeProps {
  setup: PocetnikSetup;
  onBack: () => void;
}

export function SumSearchPractice({ setup, onBack }: SumSearchPracticeProps) {
  const { example, index, goNext } = usePracticeDeck(setup, buildSumSearchSession);
  const [selected, setSelected] = useState<GridCell[]>([]);
  const [feedback, setFeedback] = useState<boolean | null>(null);
  const [completed, setCompleted] = useState(false);

  if (!example) {
    return (
      <PrimaryShell background={PRIMARY_BACKGROUNDS.softPurple}>
        <PracticeLayout>
          <PracticeHeader questionNumber={1} onBack={onBack} onNext={onBack} canNext />
          <PracticeHint tone="error">Nepodařilo se načíst úlohu. Zkus to znovu z menu.</PracticeHint>
        </PracticeLayout>
      </PrimaryShell>
    );
  }

  const handleToggleCell = (cell: GridCell) => {
    if (completed) return;
    setSelected((current) => toggleCellSelection(current, cell));
  };

  const handleCheck = () => {
    if (completed || selected.length === 0) return;

    const isCorrect = isValidSumSelection(example.grid, selected, example.targetSum);
    setFeedback(isCorrect);
    if (isCorrect) {
      setCompleted(true);
    }
    window.setTimeout(() => setFeedback(null), 700);
  };

  const handleClear = () => {
    if (completed) return;
    setSelected([]);
    setFeedback(null);
  };

  const handleNext = () => {
    goNext();
    setSelected([]);
    setCompleted(false);
    setFeedback(null);
  };

  return (
    <PrimaryShell background={PRIMARY_BACKGROUNDS.softPurple}>
      {feedback !== null ? <FeedbackOverlay correct={feedback} /> : null}
      <PracticeLayout>
        <PracticeHeader questionNumber={index + 1} onBack={onBack} onNext={handleNext} canNext={completed} />
        <PracticeTitle color="#6d28d9">Křížovka – najdi součet {example.targetSum}</PracticeTitle>

        <PrimaryCard className="pocetnik-practice-card pocetnik-sum-search-card">
          <SumSearchGrid grid={example.grid} selected={selected} onToggleCell={handleToggleCell} disabled={completed} />
        </PrimaryCard>

        <div className="pocetnik-sum-search-actions">
          <button type="button" className="pocetnik-sum-search-action" onClick={handleClear} disabled={completed || selected.length === 0}>
            Vyčistit
          </button>
          <button type="button" className="pocetnik-sum-search-action pocetnik-sum-search-action--primary" onClick={handleCheck} disabled={completed || selected.length === 0}>
            Ověřit
          </button>
        </div>

        {completed ? (
          <PracticeHint tone="success">Správně. Pokračuj šipkou.</PracticeHint>
        ) : feedback === false ? (
          <PracticeHint tone="error">
            {!isContiguousLine(selected)
              ? 'Vyber sousední čísla v řadě nebo ve sloupci.'
              : 'Součet zatím nesedí. Zkus to znovu.'}
          </PracticeHint>
        ) : (
          <PracticeHint tone="neutral">Označ sousední čísla v řadě nebo sloupci, která dají dohromady {example.targetSum}.</PracticeHint>
        )}
      </PracticeLayout>
    </PrimaryShell>
  );
}
