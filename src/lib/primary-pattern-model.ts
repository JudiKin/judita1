import type { PocetnikSetup, SequenceItemKind, SequencePatternKind } from '../types/pocetnik-types';

export interface PatternSymbol {
  id: SequenceItemKind;
  label: string;
}

export interface PatternExample {
  index: number;
  patternType: SequencePatternKind;
  unit: PatternSymbol[];
  visibleCount: number;
  blankCount: number;
  rowCount: number;
  palette: PatternSymbol[];
}

const PATTERN_OBJECTS: Record<SequenceItemKind, PatternSymbol> = {
  'yellow-cube': { id: 'yellow-cube', label: 'Žlutá kostka' },
  'green-cube': { id: 'green-cube', label: 'Zelená kostka' },
  'purple-cube': { id: 'purple-cube', label: 'Fialová kostka' },
  'red-cube': { id: 'red-cube', label: 'Červená kostka' },
  'yellow-circle': { id: 'yellow-circle', label: 'Žluté kolečko' },
  'purple-square': { id: 'purple-square', label: 'Fialový čtverec' },
  'red-plus': { id: 'red-plus', label: 'Červené plus' },
};

const PATTERN_UNITS: Record<SequencePatternKind, string[]> = {
  AB: ['A', 'B'],
  AAB: ['A', 'A', 'B'],
  AAAB: ['A', 'A', 'A', 'B'],
  ABC: ['A', 'B', 'C'],
  AABB: ['A', 'A', 'B', 'B'],
  ABAC: ['A', 'B', 'A', 'C'],
};

function availableObjects(setup: PocetnikSetup): PatternSymbol[] {
  const selected = setup.primaryPatternObjects.filter((id) => id in PATTERN_OBJECTS);
  const pool = selected.length > 0 ? selected : Object.keys(PATTERN_OBJECTS) as SequenceItemKind[];
  const group = setup.primaryPatternSymbolSet;
  return pool
    .filter((id) => (group === 'blocks' ? id.includes('cube') : !id.includes('cube')))
    .map((id) => PATTERN_OBJECTS[id]);
}

function availablePatternTypes(setup: PocetnikSetup, objectCount: number): SequencePatternKind[] {
  const selected = setup.primaryPatternTypes.filter((type) => type in PATTERN_UNITS);
  const fallback: SequencePatternKind[] = ['AB', 'AAB', 'AAAB'];
  return (selected.length > 0 ? selected : fallback).filter((type) => {
    const unique = new Set(PATTERN_UNITS[type]);
    return objectCount >= Math.min(unique.size, 2);
  });
}

function buildUnit(type: SequencePatternKind, objects: PatternSymbol[], seed: number): PatternSymbol[] {
  const letters = Array.from(new Set(PATTERN_UNITS[type]));
  const rotated = objects.map((_, index) => objects[(index + seed) % objects.length]);
  const map = new Map(letters.map((letter, index) => [letter, rotated[index % rotated.length]]));
  return PATTERN_UNITS[type].map((letter) => map.get(letter) ?? rotated[0]);
}

export function buildPatternExample(setup: PocetnikSetup, index: number): PatternExample {
  const objects = availableObjects(setup);
  const types = availablePatternTypes(setup, objects.length);
  const patternType = types[index % types.length] ?? 'AB';
  const unit = buildUnit(patternType, objects, index);
  const rowCount = setup.primaryPatternRows;
  const blankMultiplier = setup.primaryPatternDifficulty === 'hard' ? 3 : setup.primaryPatternDifficulty === 'medium' ? 2 : 1;
  const visibleCount = Math.max(unit.length * (rowCount + 1) + (index % unit.length), rowCount * 4);
  const blankCount = rowCount * blankMultiplier;
  const palette = Array.from(new Map(unit.map((symbol) => [symbol.id, symbol])).values());

  return {
    index,
    patternType,
    unit,
    visibleCount,
    blankCount,
    rowCount,
    palette,
  };
}

export function symbolAt(example: PatternExample, position: number): PatternSymbol {
  return example.unit[position % example.unit.length];
}

export function chunkPositions(total: number, rowCount: number): number[][] {
  const rows = Math.max(1, rowCount);
  const perRow = Math.ceil(total / rows);
  return Array.from({ length: rows }, (_, row) =>
    Array.from({ length: perRow }, (_, col) => row * perRow + col).filter((position) => position < total),
  );
}
