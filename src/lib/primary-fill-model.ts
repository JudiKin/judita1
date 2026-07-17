import type { FillMarbleColor, PocetnikSetup } from '../types/pocetnik-types';
import { createRng, shuffleInPlace } from './practice-shuffle';

export interface FillExample {
  index: number;
  target: number;
  startCount: number;
  marbleColor: FillMarbleColor;
}

function clampTarget(setup: PocetnikSetup): number {
  return Math.max(2, Math.min(20, Math.floor(setup.primaryFillTarget || 7)));
}

function clampMinStart(setup: PocetnikSetup, target: number): number {
  const min = Math.max(0, Math.min(target - 1, Math.floor(setup.primaryFillMinStart || 0)));
  return min;
}

export function buildFillSession(setup: PocetnikSetup, count: number, seed: number): FillExample[] {
  const target = clampTarget(setup);
  const minStart = clampMinStart(setup, target);
  const colors: FillMarbleColor[] = ['red', 'orange'];
  const random = createRng(seed);

  const startCounts = Array.from(
    { length: count },
    () => minStart + Math.floor(random() * (target - minStart)),
  );
  const marbleColors = Array.from(
    { length: count },
    () => colors[Math.floor(random() * colors.length)],
  );

  shuffleInPlace(startCounts, random);
  shuffleInPlace(marbleColors, random);

  return startCounts.map((startCount, index) => ({
    index,
    target,
    startCount,
    marbleColor: marbleColors[index],
  }));
}
