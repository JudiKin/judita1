import type { CountingAnswerMode, MoreLessObjectKind, PocetnikSetup } from '../types/pocetnik-types';
import { MORE_LESS_OBJECT_LABELS } from './primary-more-less-model';
import { createRng, shuffleInPlace } from './practice-shuffle';

export interface CountingExample {
  index: number;
  count: number;
  objectKind: MoreLessObjectKind;
  stickerUrl?: string;
  answerMode: CountingAnswerMode;
  options: number[];
}

const STICKER_URLS = [
  'https://qypiuvqglsmxdsnyazih.supabase.co/storage/v1/object/public/competition_files/stickers/4_geometricke%20symboly/Samolepky_1_1_circle.svg',
  'https://qypiuvqglsmxdsnyazih.supabase.co/storage/v1/object/public/competition_files/stickers/4_geometricke%20symboly/Samolepky_2_1_cross.svg',
  'https://qypiuvqglsmxdsnyazih.supabase.co/storage/v1/object/public/competition_files/stickers/5_barevne%20symboly/Samolepky_3_1_apple.svg',
  'https://qypiuvqglsmxdsnyazih.supabase.co/storage/v1/object/public/competition_files/stickers/7_dalsi%20symboly/Samolepky_1_1_coconut.svg',
];

const COUNTING_AVOID_OBJECT_KINDS = new Set<MoreLessObjectKind>(['stickers', 'book']);

const COUNTING_FALLBACK_OBJECT_KINDS: MoreLessObjectKind[] = [
  'coconuts',
  'cubes',
  'yellow-cube',
  'green-cube',
  'apple',
  'ball',
];

export const DEFAULT_COUNTING_OBJECT_TYPES: MoreLessObjectKind[] = [
  'coconuts',
  'cubes',
  'yellow-cube',
  'green-cube',
  'purple-cube',
  'red-cube',
  'yellow-circle',
  'purple-square',
  'red-plus',
  'apple',
  'ball',
  'pencil',
  'bread',
  'toy',
];

export function visibleCountingObjectKinds(kinds: MoreLessObjectKind[]): MoreLessObjectKind[] {
  const filtered = kinds.filter((kind) => !COUNTING_AVOID_OBJECT_KINDS.has(kind));
  return filtered.length > 0 ? filtered : COUNTING_FALLBACK_OBJECT_KINDS;
}

export function normalizeCountRange(setup: PocetnikSetup): { min: number; max: number } {
  const rawMin = Number(setup.primaryCountingMin);
  const rawMax = Number(setup.primaryCountingMax);
  const min = Math.max(1, Math.min(20, Number.isFinite(rawMin) ? Math.floor(rawMin) : 1));
  const max = Math.max(min, Math.min(20, Number.isFinite(rawMax) ? Math.floor(rawMax) : 6));
  return { min, max };
}

export function normalizeObjectCount(count: number): number {
  if (!Number.isFinite(count)) return 1;
  return Math.max(1, Math.floor(count));
}

function buildOptions(correct: number, min: number, max: number): number[] {
  const safeCorrect = normalizeObjectCount(correct);
  const values = new Set<number>([safeCorrect]);
  for (let offset = 1; values.size < Math.min(6, max - min + 1) && offset <= 6; offset += 1) {
    if (safeCorrect - offset >= min) values.add(safeCorrect - offset);
    if (safeCorrect + offset <= max) values.add(safeCorrect + offset);
  }
  for (let candidate = min; values.size < Math.min(6, max - min + 1) && candidate <= max; candidate += 1) {
    values.add(candidate);
  }
  return Array.from(values).sort((a, b) => a - b);
}

function pickRandomCount(min: number, max: number, random: () => number): number {
  const span = max - min + 1;
  return min + Math.floor(random() * span);
}

export function buildCountingSession(setup: PocetnikSetup, count: number, seed: number): CountingExample[] {
  const { min, max } = normalizeCountRange(setup);
  const objectKinds = visibleCountingObjectKinds(
    setup.primaryCountingObjectTypes.length > 0 ? setup.primaryCountingObjectTypes : DEFAULT_COUNTING_OBJECT_TYPES,
  );
  const answerModes = setup.primaryCountingAnswerModes.length > 0 ? setup.primaryCountingAnswerModes : ['dots'];
  const random = createRng(seed);

  const counts = Array.from({ length: count }, () => pickRandomCount(min, max, random));
  const objectKindsPicked = Array.from(
    { length: count },
    () => objectKinds[Math.floor(random() * objectKinds.length)] as MoreLessObjectKind,
  );
  const answerModesPicked = Array.from(
    { length: count },
    () => answerModes[Math.floor(random() * answerModes.length)] as CountingAnswerMode,
  );
  const stickerIndices = Array.from({ length: count }, () => Math.floor(random() * STICKER_URLS.length));

  shuffleInPlace(counts, random);
  shuffleInPlace(objectKindsPicked, random);
  shuffleInPlace(answerModesPicked, random);
  shuffleInPlace(stickerIndices, random);

  return counts.map((value, index) => {
    const objectKind = objectKindsPicked[index];
    const safeCount = normalizeObjectCount(value);

    return {
      index,
      count: safeCount,
      objectKind,
      stickerUrl: objectKind === 'stickers' ? STICKER_URLS[stickerIndices[index] % STICKER_URLS.length] : undefined,
      answerMode: answerModesPicked[index],
      options: buildOptions(safeCount, min, max),
    };
  });
}

export function buildCountingExample(setup: PocetnikSetup, index: number): CountingExample {
  return buildCountingSession(setup, index + 1, 918273)[index];
}

export const COUNTING_ANSWER_MODE_LABELS: Record<CountingAnswerMode, string> = {
  dots: 'Tečky',
  marks: 'Čárky',
  numbers: 'Čísla',
};

export { MORE_LESS_OBJECT_LABELS as COUNTING_OBJECT_LABELS };
