import type { PocetnikSetup } from '../types/pocetnik-types';
import { createRng } from './practice-shuffle';

export interface GridCell {
  row: number;
  col: number;
}

export interface SumSearchExample {
  index: number;
  targetSum: number;
  grid: number[][];
  solution: GridCell[];
}

const DEFAULT_TARGETS = [5, 6, 7, 8, 9, 10];

function gridSize(setup: PocetnikSetup): number {
  const raw = Number(setup.primarySumSearchGridSize);
  return Number.isFinite(raw) ? Math.max(3, Math.min(5, Math.floor(raw))) : 4;
}

function availableTargets(setup: PocetnikSetup): number[] {
  const configured = setup.primarySumSearchTargets ?? DEFAULT_TARGETS;
  const targets = configured.filter((value) => Number.isFinite(value) && value >= 3 && value <= 15);
  return targets.length > 0 ? targets : DEFAULT_TARGETS;
}

function splitSum(target: number, count: number, random: () => number): number[] {
  if (count === 1) return [target];

  const parts: number[] = [];
  let remaining = target;

  for (let index = 0; index < count - 1; index += 1) {
    const slotsLeft = count - index - 1;
    const minPart = Math.max(0, remaining - 9 * slotsLeft);
    const maxPart = Math.min(9, remaining);
    const part = minPart + Math.floor(random() * (maxPart - minPart + 1));
    parts.push(part);
    remaining -= part;
  }

  parts.push(remaining);
  return parts;
}

function plantSolution(size: number, target: number, random: () => number): { grid: number[][]; solution: GridCell[] } {
  const grid = Array.from({ length: size }, () => Array.from({ length: size }, () => 0));
  const horizontal = random() < 0.5;
  const length = 1 + Math.floor(random() * Math.min(3, size));
  const parts = splitSum(target, length, random);

  let startRow = 0;
  let startCol = 0;

  if (horizontal) {
    startRow = Math.floor(random() * size);
    startCol = Math.floor(random() * (size - length + 1));
    for (let index = 0; index < length; index += 1) {
      grid[startRow][startCol + index] = parts[index];
    }
    return {
      grid,
      solution: parts.map((_, index) => ({ row: startRow, col: startCol + index })),
    };
  }

  startRow = Math.floor(random() * (size - length + 1));
  startCol = Math.floor(random() * size);
  for (let index = 0; index < length; index += 1) {
    grid[startRow + index][startCol] = parts[index];
  }

  return {
    grid,
    solution: parts.map((_, index) => ({ row: startRow + index, col: startCol })),
  };
}

function buildExample(index: number, setup: PocetnikSetup, random: () => number): SumSearchExample {
  const size = gridSize(setup);
  const targets = availableTargets(setup);
  const targetSum = targets[Math.floor(random() * targets.length)];
  const planted = plantSolution(size, targetSum, random);
  const grid = planted.grid.map((row) => [...row]);

  for (let row = 0; row < size; row += 1) {
    for (let col = 0; col < size; col += 1) {
      const isSolutionCell = planted.solution.some((cell) => cell.row === row && cell.col === col);
      if (!isSolutionCell) {
        grid[row][col] = Math.floor(random() * 10);
      }
    }
  }

  return {
    index,
    targetSum,
    grid,
    solution: planted.solution,
  };
}

export function buildSumSearchSession(setup: PocetnikSetup, count: number, seed: number): SumSearchExample[] {
  const random = createRng(seed);
  return Array.from({ length: count }, (_, index) => buildExample(index, setup, random));
}

export function buildSumSearchExample(setup: PocetnikSetup, index: number): SumSearchExample {
  return buildSumSearchSession(setup, index + 1, 918273)[index];
}

export function selectionSum(grid: number[][], selected: GridCell[]): number {
  return selected.reduce((total, cell) => total + grid[cell.row][cell.col], 0);
}

export function isContiguousLine(selected: GridCell[]): boolean {
  if (selected.length === 0) return false;

  const rows = selected.map((cell) => cell.row);
  const cols = selected.map((cell) => cell.col);
  const sameRow = rows.every((row) => row === rows[0]);
  const sameCol = cols.every((col) => col === cols[0]);

  if (sameRow) {
    const sorted = [...cols].sort((a, b) => a - b);
    return sorted.every((col, index) => index === 0 || col === sorted[index - 1] + 1);
  }

  if (sameCol) {
    const sorted = [...rows].sort((a, b) => a - b);
    return sorted.every((row, index) => index === 0 || row === sorted[index - 1] + 1);
  }

  return false;
}

export function isValidSumSelection(grid: number[][], selected: GridCell[], targetSum: number): boolean {
  if (!isContiguousLine(selected)) return false;
  return selectionSum(grid, selected) === targetSum;
}

export function cellKey(cell: GridCell): string {
  return `${cell.row}-${cell.col}`;
}

export function toggleCellSelection(selected: GridCell[], cell: GridCell): GridCell[] {
  const key = cellKey(cell);
  if (selected.some((item) => cellKey(item) === key)) {
    return selected.filter((item) => cellKey(item) !== key);
  }
  return [...selected, cell];
}
