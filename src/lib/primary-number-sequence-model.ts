import type { NumberSequenceStep, PocetnikSetup } from '../types/pocetnik-types';
import { createRng, shuffleInPlace } from './practice-shuffle';

export interface NumberSequenceExample {
  index: number;
  step: NumberSequenceStep;
  start: number;
  values: number[];
  missingIndex: number;
  answer: number;
  options: number[];
}

const DEFAULT_STEPS: NumberSequenceStep[] = [1, 2, 5, 10];

function clampLength(setup: PocetnikSetup): number {
  const raw = Number(setup.primaryNumberSequenceLength);
  return Number.isFinite(raw) ? Math.max(4, Math.min(8, Math.floor(raw))) : 6;
}

function clampMax(setup: PocetnikSetup): number {
  const raw = Number(setup.primaryNumberSequenceMax);
  return Number.isFinite(raw) ? Math.max(10, Math.min(100, Math.floor(raw))) : 20;
}

function availableSteps(setup: PocetnikSetup): NumberSequenceStep[] {
  const steps = setup.primaryNumberSequenceSteps.filter((step): step is NumberSequenceStep =>
    DEFAULT_STEPS.includes(step as NumberSequenceStep),
  );
  return steps.length > 0 ? steps : DEFAULT_STEPS;
}

function pickStart(step: NumberSequenceStep, max: number, length: number, random: () => number): number | null {
  const lastOffset = (length - 1) * step;
  const candidates: number[] = [];

  if (step === 1) {
    for (let start = 0; start <= max - lastOffset; start += 1) {
      candidates.push(start);
    }
  } else if (step === 2) {
    for (let start = 0; start <= max - lastOffset; start += 2) {
      candidates.push(start);
    }
  } else if (step === 5) {
    for (const start of [0, 5]) {
      if (start + lastOffset <= max) candidates.push(start);
    }
  } else {
    for (const start of [0, 10]) {
      if (start + lastOffset <= max) candidates.push(start);
    }
  }

  if (candidates.length === 0) return null;
  return candidates[Math.floor(random() * candidates.length)];
}

function buildOptions(answer: number, step: NumberSequenceStep, random: () => number): number[] {
  const candidates = new Set<number>([
    answer,
    answer - step,
    answer + step,
    answer - 1,
    answer + 1,
    answer - step * 2,
    answer + step * 2,
  ]);

  const options = Array.from(candidates)
    .filter((value) => value >= 0)
    .sort((a, b) => a - b);

  if (!options.includes(answer)) {
    options.push(answer);
  }

  shuffleInPlace(options, random);

  const result = [answer];
  for (const value of options) {
    if (result.length >= 4) break;
    if (value !== answer) result.push(value);
  }

  shuffleInPlace(result, random);
  return result;
}

function buildExampleAt(index: number, setup: PocetnikSetup, random: () => number): NumberSequenceExample | null {
  const length = clampLength(setup);
  const max = clampMax(setup);
  const steps = availableSteps(setup);
  const step = steps[Math.floor(random() * steps.length)];
  const start = pickStart(step, max, length, random);
  if (start === null) return null;

  const values = Array.from({ length }, (_, position) => start + position * step);
  const missingIndex = 1 + Math.floor(random() * Math.max(1, length - 2));
  const answer = values[missingIndex];

  return {
    index,
    step,
    start,
    values,
    missingIndex,
    answer,
    options: buildOptions(answer, step, random),
  };
}

export function buildNumberSequenceSession(setup: PocetnikSetup, count: number, seed: number): NumberSequenceExample[] {
  const random = createRng(seed);
  const examples: NumberSequenceExample[] = [];
  let guard = 0;

  while (examples.length < count && guard < count * 30) {
    guard += 1;
    const example = buildExampleAt(examples.length, setup, random);
    if (example) {
      examples.push(example);
    }
  }

  if (examples.length === 0) {
    return [
      {
        index: 0,
        step: 2,
        start: 0,
        values: [0, 2, 4, 6, 8, 10],
        missingIndex: 3,
        answer: 6,
        options: [4, 5, 6, 8],
      },
    ];
  }

  return examples;
}

export function buildNumberSequenceExample(setup: PocetnikSetup, index: number): NumberSequenceExample {
  return buildNumberSequenceSession(setup, index + 1, 918273)[index];
}

export const NUMBER_SEQUENCE_STEP_LABELS: Record<NumberSequenceStep, string> = {
  1: 'Po jedné',
  2: 'Po dvou',
  5: 'Po pěti',
  10: 'Po deseti',
};
