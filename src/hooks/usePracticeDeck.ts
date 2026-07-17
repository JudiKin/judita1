import { useCallback, useMemo, useState } from 'react';
import type { PocetnikSetup } from '../types/pocetnik-types';

export function usePracticeDeck<T>(
  setup: PocetnikSetup,
  buildSession: (setup: PocetnikSetup, count: number, seed: number) => T[],
) {
  const [sessionSeed] = useState(() => Date.now());
  const [deck, setDeck] = useState<T[]>(() => buildSession(setup, setup.maxQuestions, sessionSeed));
  const [index, setIndex] = useState(0);

  const example = useMemo(() => deck[index] ?? deck[0], [deck, index]);

  const goNext = useCallback(() => {
    const nextIndex = index + 1;
    if (nextIndex >= deck.length) {
      setDeck((current) => [
        ...current,
        ...buildSession(setup, setup.maxQuestions, sessionSeed + nextIndex),
      ]);
    }
    setIndex(nextIndex);
  }, [buildSession, deck.length, index, sessionSeed, setup]);

  return { example, index, goNext };
}
