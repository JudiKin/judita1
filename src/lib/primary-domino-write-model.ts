import type { DominoWriteMode, PocetnikSetup } from '../types/pocetnik-types';
import { createRng, shuffleInPlace } from './practice-shuffle';

export interface DominoWriteExample {
  index: number;
  mode: DominoWriteMode;
  leftDots: number;
  rightDots: number;
  answer: number;
}

function availableModes(setup: PocetnikSetup): DominoWriteMode[] {
  const modes = setup.primaryDominoWriteModes.filter((mode): mode is DominoWriteMode => mode === 'add' || mode === 'subtract');
  return modes.length > 0 ? modes : ['add', 'subtract'];
}

function maxDots(setup: PocetnikSetup): number {
  const raw = Number(setup.primaryDominoMaxDots);
  return raw === 6 ? 6 : 9;
}

function randomDots(max: number, random: () => number): number {
  return Math.floor(random() * (max + 1));
}

function buildExample(index: number, mode: DominoWriteMode, max: number, random: () => number): DominoWriteExample {
  if (mode === 'subtract') {
    let leftDots = randomDots(max, random);
    let rightDots = randomDots(max, random);
    if (rightDots > leftDots) {
      [leftDots, rightDots] = [rightDots, leftDots];
    }
    while (leftDots === 0 && rightDots === 0) {
      leftDots = randomDots(max, random);
      rightDots = randomDots(max, random);
      if (rightDots > leftDots) {
        [leftDots, rightDots] = [rightDots, leftDots];
      }
    }
    return {
      index,
      mode,
      leftDots,
      rightDots,
      answer: leftDots - rightDots,
    };
  }

  return {
    index,
    mode: 'add',
    leftDots: randomDots(max, random),
    rightDots: randomDots(max, random),
    answer: 0,
  };
}

export function buildDominoWriteSession(setup: PocetnikSetup, count: number, seed: number): DominoWriteExample[] {
  const random = createRng(seed);
  const modes = availableModes(setup);
  const dotMax = maxDots(setup);
  const pickedModes = Array.from({ length: count }, () => modes[Math.floor(random() * modes.length)] as DominoWriteMode);

  shuffleInPlace(pickedModes, random);

  return pickedModes.map((mode, index) => {
    const example = buildExample(index, mode, dotMax, random);
    if (mode === 'add') {
      return { ...example, answer: example.leftDots + example.rightDots };
    }
    return example;
  });
}

export function buildDominoWriteExample(setup: PocetnikSetup, index: number): DominoWriteExample {
  return buildDominoWriteSession(setup, index + 1, 918273)[index];
}

export function buildNumberChoices(correct: number, max: number, random: () => number): number[] {
  const values = new Set<number>([correct]);
  for (let offset = 1; values.size < 6 && offset <= max + 2; offset += 1) {
    if (correct - offset >= 0) values.add(correct - offset);
    if (correct + offset <= max * 2) values.add(correct + offset);
  }
  for (let candidate = 0; values.size < 6 && candidate <= max * 2; candidate += 1) {
    values.add(candidate);
  }

  const options = Array.from(values);
  shuffleInPlace(options, random);
  return options.slice(0, Math.min(6, options.length)).sort((a, b) => a - b);
}
