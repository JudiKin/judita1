import type { ModelWriteMode, PocetnikSetup } from '../types/pocetnik-types';
import { createRng, shuffleInPlace } from './practice-shuffle';

export type ModelCellState = 'empty' | 'red' | 'blue';

export interface ModelWriteSplit {
  first: number;
  second: number;
}

export interface ModelWriteExample {
  index: number;
  mode: ModelWriteMode;
  left: number;
  right: number;
  splitFirst: number;
  splitSecond: number;
  cells: ModelCellState[];
  options: ModelWriteSplit[];
}

const GRID_SIZE = 20;

function emptyGrid(): ModelCellState[] {
  return Array.from({ length: GRID_SIZE }, () => 'empty' as ModelCellState);
}

function buildAddGrid(left: number, right: number): ModelCellState[] {
  const cells = emptyGrid();
  for (let index = 0; index < left; index += 1) {
    cells[index] = 'red';
  }
  for (let index = left; index < left + right; index += 1) {
    cells[index] = 'blue';
  }
  return cells;
}

function buildSubtractGrid(minuend: number, splitFirst: number, splitSecond: number): ModelCellState[] {
  const cells = emptyGrid();
  for (let index = 0; index < minuend; index += 1) {
    cells[index] = 'red';
  }

  for (let index = minuend - splitFirst; index < minuend; index += 1) {
    cells[index] = 'blue';
  }

  for (let index = 10 - splitSecond; index < 10; index += 1) {
    if (splitSecond > 0 && index < minuend) {
      cells[index] = 'blue';
    }
  }

  return cells;
}

function computeAddSplit(left: number, right: number): { splitFirst: number; splitSecond: number } {
  const splitFirst = 10 - left;
  return { splitFirst, splitSecond: right - splitFirst };
}

function computeSubtractSplit(minuend: number, subtrahend: number): { splitFirst: number; splitSecond: number } {
  const ones = minuend % 10;
  const splitFirst = ones;
  return { splitFirst, splitSecond: subtrahend - splitFirst };
}

function buildSplitOptions(
  correctFirst: number,
  correctSecond: number,
  total: number,
  random: () => number,
): ModelWriteSplit[] {
  const options = new Map<string, ModelWriteSplit>();
  const addOption = (first: number, second: number) => {
    if (first < 0 || second < 0 || first + second !== total) return;
    options.set(`${first}-${second}`, { first, second });
  };

  addOption(correctFirst, correctSecond);

  for (let first = 0; first <= total; first += 1) {
    addOption(first, total - first);
  }

  for (let offset = 1; options.size < 4; offset += 1) {
    addOption(Math.max(0, correctFirst - offset), total - Math.max(0, correctFirst - offset));
    addOption(Math.min(total, correctFirst + offset), total - Math.min(total, correctFirst + offset));
  }

  const list = Array.from(options.values()).filter(
    (option) => !(option.first === correctFirst && option.second === correctSecond),
  );
  shuffleInPlace(list, random);

  const result: ModelWriteSplit[] = [{ first: correctFirst, second: correctSecond }, ...list.slice(0, 3)];
  shuffleInPlace(result, random);
  return result;
}

function buildAddExample(index: number, random: () => number): ModelWriteExample | null {
  const left = 2 + Math.floor(random() * 8);
  const minRight = 11 - left;
  const maxRight = 20 - left;
  if (minRight > maxRight) return null;

  const right = minRight + Math.floor(random() * (maxRight - minRight + 1));
  const { splitFirst, splitSecond } = computeAddSplit(left, right);

  return {
    index,
    mode: 'add',
    left,
    right,
    splitFirst,
    splitSecond,
    cells: buildAddGrid(left, right),
    options: buildSplitOptions(splitFirst, splitSecond, right, random),
  };
}

function buildSubtractExample(index: number, random: () => number): ModelWriteExample | null {
  const minuend = 11 + Math.floor(random() * 9);
  const ones = minuend % 10;
  if (ones === 0) return null;

  const minSubtrahend = ones + 1;
  const maxSubtrahend = Math.min(9, minuend - 1);
  if (minSubtrahend > maxSubtrahend) return null;

  const subtrahend = minSubtrahend + Math.floor(random() * (maxSubtrahend - minSubtrahend + 1));
  const { splitFirst, splitSecond } = computeSubtractSplit(minuend, subtrahend);

  return {
    index,
    mode: 'subtract',
    left: minuend,
    right: subtrahend,
    splitFirst,
    splitSecond,
    cells: buildSubtractGrid(minuend, splitFirst, splitSecond),
    options: buildSplitOptions(splitFirst, splitSecond, subtrahend, random),
  };
}

export function buildModelWriteSession(setup: PocetnikSetup, count: number, seed: number): ModelWriteExample[] {
  const random = createRng(seed);
  const modes = setup.primaryModelWriteModes.length > 0 ? setup.primaryModelWriteModes : ['add', 'subtract'];
  const pickedModes = Array.from({ length: count }, () => modes[Math.floor(random() * modes.length)] as ModelWriteMode);

  shuffleInPlace(pickedModes, random);

  const examples: ModelWriteExample[] = [];
  let guard = 0;

  for (let index = 0; examples.length < count && guard < count * 20; guard += 1) {
    const mode = pickedModes[index % pickedModes.length] ?? 'add';
    const example = mode === 'subtract' ? buildSubtractExample(examples.length, random) : buildAddExample(examples.length, random);
    if (example) {
      examples.push({ ...example, index: examples.length });
      index += 1;
    }
  }

  return examples;
}

export function buildModelWriteExample(setup: PocetnikSetup, index: number): ModelWriteExample {
  return buildModelWriteSession(setup, index + 1, 918273)[index];
}
