import type { MoreLessObjectKind, PocetnikSetup, SequenceItemKind } from '../types/pocetnik-types';
import { PAY_ITEM_LABELS } from './primary-pay-model';
import { createRng, shuffleInPlace } from './practice-shuffle';

export interface MoreLessExample {
  index: number;
  leftCount: number;
  rightCount: number;
  delta: number;
  objectKind: MoreLessObjectKind;
  stickerUrl?: string;
  options: number[];
}

const PATTERN_OBJECT_LABELS: Record<SequenceItemKind, string> = {
  'yellow-cube': 'Žlutá kostka',
  'green-cube': 'Zelená kostka',
  'purple-cube': 'Fialová kostka',
  'red-cube': 'Červená kostka',
  'yellow-circle': 'Žluté kolečko',
  'purple-square': 'Fialový čtverec',
  'red-plus': 'Červené plus',
};

export const MORE_LESS_OBJECT_LABELS: Record<MoreLessObjectKind, string> = {
  coconuts: 'Kokosy',
  cubes: 'Kostky',
  stickers: 'Nálepky',
  ...PATTERN_OBJECT_LABELS,
  ...PAY_ITEM_LABELS,
};

const STICKER_URLS = [
  'https://qypiuvqglsmxdsnyazih.supabase.co/storage/v1/object/public/competition_files/stickers/4_geometricke%20symboly/Samolepky_1_1_circle.svg',
  'https://qypiuvqglsmxdsnyazih.supabase.co/storage/v1/object/public/competition_files/stickers/4_geometricke%20symboly/Samolepky_2_1_cross.svg',
  'https://qypiuvqglsmxdsnyazih.supabase.co/storage/v1/object/public/competition_files/stickers/5_barevne%20symboly/Samolepky_3_1_apple.svg',
  'https://qypiuvqglsmxdsnyazih.supabase.co/storage/v1/object/public/competition_files/stickers/7_dalsi%20symboly/Samolepky_1_1_coconut.svg',
];

function clampRange(setup: PocetnikSetup): { min: number; max: number; maxDelta: number } {
  const min = Math.max(1, Math.min(20, Math.floor(setup.primaryMoreLessMin || 1)));
  const max = Math.max(min, Math.min(20, Math.floor(setup.primaryMoreLessMax || 6)));
  const maxDelta = Math.max(1, Math.min(4, Math.floor(setup.primaryMoreLessMaxDelta || 2)));
  return { min, max, maxDelta };
}

export function formatDeltaLabel(delta: number): string {
  if (delta === 0) return 'Stejně';
  if (delta === 1) return 'O 1 víc';
  if (delta === -1) return 'O 1 míň';
  if (delta > 0) return `O ${delta} víc`;
  return `O ${Math.abs(delta)} míň`;
}

function buildDeltaOptions(correct: number, maxDelta: number): number[] {
  const options: number[] = [];
  for (let delta = -maxDelta; delta <= maxDelta; delta += 1) {
    options.push(delta);
  }
  if (!options.includes(correct)) {
    options.push(correct);
    options.sort((a, b) => a - b);
  }
  return options;
}

export function buildMoreLessSession(setup: PocetnikSetup, count: number, seed: number): MoreLessExample[] {
  const { min, max, maxDelta } = clampRange(setup);
  const objectKinds = setup.primaryMoreLessObjectTypes.length > 0 ? setup.primaryMoreLessObjectTypes : ['coconuts'];
  const deltas = Array.from({ length: maxDelta * 2 + 1 }, (_, index) => index - maxDelta);
  const random = createRng(seed);

  const leftCounts = Array.from({ length: count }, () => min + Math.floor(random() * (max - min + 1)));
  const deltaChoices = Array.from({ length: count }, () => deltas[Math.floor(random() * deltas.length)]);
  const objectKindsPicked = Array.from(
    { length: count },
    () => objectKinds[Math.floor(random() * objectKinds.length)] as MoreLessObjectKind,
  );
  const stickerIndices = Array.from({ length: count }, () => Math.floor(random() * STICKER_URLS.length));

  shuffleInPlace(leftCounts, random);
  shuffleInPlace(deltaChoices, random);
  shuffleInPlace(objectKindsPicked, random);
  shuffleInPlace(stickerIndices, random);

  return leftCounts.map((leftCount, index) => {
    const objectKind = objectKindsPicked[index];
    const rightCount = Math.max(min, Math.min(max, leftCount + deltaChoices[index]));
    const delta = rightCount - leftCount;

    return {
      index,
      leftCount,
      rightCount,
      delta,
      objectKind,
      stickerUrl: objectKind === 'stickers' ? STICKER_URLS[stickerIndices[index] % STICKER_URLS.length] : undefined,
      options: buildDeltaOptions(delta, maxDelta),
    };
  });
}

export function buildMoreLessExample(setup: PocetnikSetup, index: number): MoreLessExample {
  return buildMoreLessSession(setup, index + 1, 918273)[index];
}
