import type { MoreLessObjectKind, PocetnikSetup, SequencePatternKind } from '../types/pocetnik-types';
import { formatDeltaLabel } from './primary-more-less-model';
import { buildUnit, type PatternSymbol } from './primary-pattern-model';
import { createRng, shuffleInPlace } from './practice-shuffle';

export type FindErrorKind = 'counting' | 'comparison' | 'pattern';

export interface FindErrorsExample {
  index: number;
  kind: FindErrorKind;
  hasError: boolean;
  claimText: string;
  objectKind?: MoreLessObjectKind;
  stickerUrl?: string;
  actualCount?: number;
  displayedCount?: number;
  leftCount?: number;
  rightCount?: number;
  displayedDelta?: number;
  patternSymbols?: PatternSymbol[];
}

const STICKER_URLS = [
  'https://qypiuvqglsmxdsnyazih.supabase.co/storage/v1/object/public/competition_files/stickers/4_geometricke%20symboly/Samolepky_1_1_circle.svg',
  'https://qypiuvqglsmxdsnyazih.supabase.co/storage/v1/object/public/competition_files/stickers/4_geometricke%20symboly/Samolepky_2_1_cross.svg',
  'https://qypiuvqglsmxdsnyazih.supabase.co/storage/v1/object/public/competition_files/stickers/5_barevne%20symboly/Samolepky_3_1_apple.svg',
  'https://qypiuvqglsmxdsnyazih.supabase.co/storage/v1/object/public/competition_files/stickers/7_dalsi%20symboly/Samolepky_1_1_coconut.svg',
];

const PATTERN_OBJECTS: PatternSymbol[] = [
  { id: 'yellow-cube', label: 'Žlutá kostka' },
  { id: 'green-cube', label: 'Zelená kostka' },
  { id: 'purple-cube', label: 'Fialová kostka' },
  { id: 'yellow-circle', label: 'Žluté kolečko' },
  { id: 'purple-square', label: 'Fialový čtverec' },
  { id: 'red-plus', label: 'Červené plus' },
];

const FIND_ERROR_KINDS: FindErrorKind[] = ['counting', 'comparison', 'pattern'];
const PATTERN_TYPES: SequencePatternKind[] = ['AB', 'AAB', 'AAAB'];

function symbolAtUnit(unit: PatternSymbol[], position: number): PatternSymbol {
  return unit[position % unit.length];
}

function clampRange(setup: PocetnikSetup): { min: number; max: number } {
  const min = Math.max(1, Math.min(20, Math.floor(setup.primaryFindErrorsMin || 1)));
  const max = Math.max(min, Math.min(20, Math.floor(setup.primaryFindErrorsMax || 6)));
  return { min, max };
}

function pickWrongValue(actual: number, min: number, max: number, random: () => number): number {
  const candidates = [-2, -1, 1, 2]
    .map((offset) => actual + offset)
    .filter((value) => value >= min && value <= max && value !== actual);
  if (candidates.length === 0) {
    return actual < max ? actual + 1 : actual - 1;
  }
  return candidates[Math.floor(random() * candidates.length)];
}

function pickWrongDelta(actual: number, min: number, max: number, random: () => number): number {
  const span = max - min;
  const maxDelta = Math.min(3, span);
  const candidates: number[] = [];
  for (let delta = -maxDelta; delta <= maxDelta; delta += 1) {
    if (delta !== actual) candidates.push(delta);
  }
  return candidates[Math.floor(random() * candidates.length)] ?? actual + 1;
}

function buildCountingExample(
  index: number,
  setup: PocetnikSetup,
  hasError: boolean,
  random: () => number,
): FindErrorsExample {
  const { min, max } = clampRange(setup);
  const objectKinds = setup.primaryFindErrorsObjectTypes.length > 0 ? setup.primaryFindErrorsObjectTypes : ['coconuts'];
  const objectKind = objectKinds[Math.floor(random() * objectKinds.length)] as MoreLessObjectKind;
  const actualCount = min + Math.floor(random() * (max - min + 1));
  let displayedCount = actualCount;
  if (hasError) {
    displayedCount = pickWrongValue(actualCount, min, max, random);
    if (displayedCount === actualCount) {
      displayedCount = actualCount < max ? actualCount + 1 : actualCount - 1;
    }
  }

  return {
    index,
    kind: 'counting',
    hasError,
    claimText: `Počet je ${displayedCount}.`,
    objectKind,
    actualCount,
    displayedCount,
    stickerUrl: objectKind === 'stickers' ? STICKER_URLS[Math.floor(random() * STICKER_URLS.length)] : undefined,
  };
}

function buildComparisonExample(
  index: number,
  setup: PocetnikSetup,
  hasError: boolean,
  random: () => number,
): FindErrorsExample {
  const { min, max } = clampRange(setup);
  const objectKinds = setup.primaryFindErrorsObjectTypes.length > 0 ? setup.primaryFindErrorsObjectTypes : ['coconuts'];
  const objectKind = objectKinds[Math.floor(random() * objectKinds.length)] as MoreLessObjectKind;
  const leftCount = min + Math.floor(random() * (max - min + 1));
  const actualDelta = Math.floor(random() * 7) - 3;
  const rightCount = Math.max(min, Math.min(max, leftCount + actualDelta));
  const delta = rightCount - leftCount;
  let displayedDelta = delta;
  if (hasError) {
    displayedDelta = pickWrongDelta(delta, min, max, random);
    if (displayedDelta === delta) {
      displayedDelta = delta === 0 ? 1 : delta > 0 ? delta - 1 : delta + 1;
    }
  }

  return {
    index,
    kind: 'comparison',
    hasError,
    claimText: `${formatDeltaLabel(displayedDelta)} (vpravo).`,
    objectKind,
    leftCount,
    rightCount,
    displayedDelta,
    stickerUrl: objectKind === 'stickers' ? STICKER_URLS[Math.floor(random() * STICKER_URLS.length)] : undefined,
  };
}

function buildPatternExample(index: number, hasError: boolean, random: () => number): FindErrorsExample {
  for (let attempt = 0; attempt < 12; attempt += 1) {
    const patternType = PATTERN_TYPES[Math.floor(random() * PATTERN_TYPES.length)];
    const unit = buildUnit(patternType, PATTERN_OBJECTS, Math.floor(random() * 1000));
    const visibleCount = unit.length * 2 + 1;
    const correctLast = symbolAtUnit(unit, visibleCount - 1);
    const palette = Array.from(new Map(unit.map((symbol) => [symbol.id, symbol])).values());
    const wrongChoices = palette.filter((symbol) => symbol.id !== correctLast.id);

    if (hasError && wrongChoices.length === 0) {
      continue;
    }

    const shownLast = hasError
      ? wrongChoices[Math.floor(random() * wrongChoices.length)]
      : correctLast;
    const patternSymbols = Array.from({ length: visibleCount - 1 }, (_, position) => symbolAtUnit(unit, position));
    patternSymbols.push(shownLast);

    return {
      index,
      kind: 'pattern',
      hasError,
      claimText: 'Vzor pokračuje správně.',
      patternSymbols,
    };
  }

  return buildPatternExample(index, false, random);
}

function buildBalancedErrorFlags(count: number, random: () => number): boolean[] {
  const withError = Math.floor(count / 2);
  const withoutError = count - withError;
  const flags = [...Array.from({ length: withError }, () => true), ...Array.from({ length: withoutError }, () => false)];
  shuffleInPlace(flags, random);
  return flags;
}

export function buildFindErrorsSession(setup: PocetnikSetup, count: number, seed: number): FindErrorsExample[] {
  const kinds = setup.primaryFindErrorsKinds.length > 0 ? setup.primaryFindErrorsKinds : FIND_ERROR_KINDS;
  const random = createRng(seed);

  const pickedKinds = Array.from({ length: count }, () => kinds[Math.floor(random() * kinds.length)] as FindErrorKind);
  const hasErrors = buildBalancedErrorFlags(count, random);

  shuffleInPlace(pickedKinds, random);
  shuffleInPlace(hasErrors, random);

  return pickedKinds.map((kind, index) => {
    const hasError = hasErrors[index];
    if (kind === 'comparison') return buildComparisonExample(index, setup, hasError, random);
    if (kind === 'pattern') return buildPatternExample(index, hasError, random);
    return buildCountingExample(index, setup, hasError, random);
  });
}

export function buildFindErrorsExample(setup: PocetnikSetup, index: number): FindErrorsExample {
  return buildFindErrorsSession(setup, index + 1, 918273)[index];
}
