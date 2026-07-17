import type { CountingObjectType, PocetnikSetup } from '../types/pocetnik-types';
import { COUNTING_OBJECT_LABELS } from './primary-counting-model';

export interface MoreLessExample {
  index: number;
  leftCount: number;
  rightCount: number;
  delta: number;
  objectType: CountingObjectType;
  stickerUrl?: string;
  options: number[];
}

const STICKER_URLS = [
  'https://qypiuvqglsmxdsnyazih.supabase.co/storage/v1/object/public/competition_files/stickers/4_geometricke%20symboly/Samolepky_1_1_circle.svg',
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

export function buildMoreLessExample(setup: PocetnikSetup, index: number): MoreLessExample {
  const { min, max, maxDelta } = clampRange(setup);
  const objectTypes = setup.primaryMoreLessObjectTypes.length > 0 ? setup.primaryMoreLessObjectTypes : ['coconuts'];
  const objectType = objectTypes[index % objectTypes.length] as CountingObjectType;

  const leftCount = min + ((index * 2) % (max - min + 1));
  const deltas = [-maxDelta, -1, 0, 1, maxDelta].filter((delta) => delta >= -maxDelta && delta <= maxDelta);
  const delta = deltas[index % deltas.length] ?? 0;
  const rightCount = Math.max(min, Math.min(max, leftCount + delta));

  return {
    index,
    leftCount,
    rightCount,
    delta: rightCount - leftCount,
    objectType,
    stickerUrl: objectType === 'stickers' ? STICKER_URLS[index % STICKER_URLS.length] : undefined,
    options: buildDeltaOptions(rightCount - leftCount, maxDelta),
  };
}

export { COUNTING_OBJECT_LABELS as MORE_LESS_OBJECT_LABELS };
