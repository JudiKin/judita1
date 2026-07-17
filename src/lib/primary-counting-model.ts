import type { CountingAnswerMode, CountingObjectType, PocetnikSetup } from '../types/pocetnik-types';

export interface CountingExample {
  index: number;
  count: number;
  objectType: CountingObjectType;
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

function clampCountRange(setup: PocetnikSetup): { min: number; max: number } {
  const min = Math.max(1, Math.min(20, Math.floor(setup.primaryCountingMin || 1)));
  const max = Math.max(min, Math.min(20, Math.floor(setup.primaryCountingMax || 6)));
  return { min, max };
}

function buildOptions(correct: number, min: number, max: number): number[] {
  const values = new Set<number>([correct]);
  for (let offset = 1; values.size < Math.min(6, max - min + 1) && offset <= 6; offset += 1) {
    if (correct - offset >= min) values.add(correct - offset);
    if (correct + offset <= max) values.add(correct + offset);
  }
  for (let candidate = min; values.size < Math.min(6, max - min + 1) && candidate <= max; candidate += 1) {
    values.add(candidate);
  }
  return Array.from(values).sort((a, b) => a - b);
}

export function buildCountingExample(setup: PocetnikSetup, index: number): CountingExample {
  const { min, max } = clampCountRange(setup);
  const span = max - min + 1;
  const count = min + (index % span);
  const objectTypes = setup.primaryCountingObjectTypes.length > 0 ? setup.primaryCountingObjectTypes : ['coconuts'];
  const answerModes = setup.primaryCountingAnswerModes.length > 0 ? setup.primaryCountingAnswerModes : ['dots'];
  const objectType = objectTypes[index % objectTypes.length] as CountingObjectType;
  const answerMode = answerModes[Math.floor(index / Math.max(1, objectTypes.length)) % answerModes.length] as CountingAnswerMode;

  return {
    index,
    count,
    objectType,
    stickerUrl: objectType === 'stickers' ? STICKER_URLS[index % STICKER_URLS.length] : undefined,
    answerMode,
    options: buildOptions(count, min, max),
  };
}

export const COUNTING_ANSWER_MODE_LABELS: Record<CountingAnswerMode, string> = {
  dots: 'Tečky',
  marks: 'Čárky',
  numbers: 'Čísla',
};

export const COUNTING_OBJECT_LABELS: Record<CountingObjectType, string> = {
  coconuts: 'Kokosy',
  cubes: 'Kostky',
  stickers: 'Nálepky',
};
