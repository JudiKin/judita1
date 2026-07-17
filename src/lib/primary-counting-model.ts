import type { CountingAnswerMode, CountingObjectType, PocetnikSetup } from '../types/pocetnik-types';
import { createRng, shuffleInPlace } from './practice-shuffle';

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

export function buildCountingSession(setup: PocetnikSetup, count: number, seed: number): CountingExample[] {
  const { min, max } = clampCountRange(setup);
  const span = max - min + 1;
  const objectTypes = setup.primaryCountingObjectTypes.length > 0 ? setup.primaryCountingObjectTypes : ['coconuts'];
  const answerModes = setup.primaryCountingAnswerModes.length > 0 ? setup.primaryCountingAnswerModes : ['dots'];
  const random = createRng(seed);

  const counts = Array.from({ length: count }, () => min + Math.floor(random() * span));
  const objectTypesPicked = Array.from(
    { length: count },
    () => objectTypes[Math.floor(random() * objectTypes.length)] as CountingObjectType,
  );
  const answerModesPicked = Array.from(
    { length: count },
    () => answerModes[Math.floor(random() * answerModes.length)] as CountingAnswerMode,
  );
  const stickerIndices = Array.from({ length: count }, () => Math.floor(random() * STICKER_URLS.length));

  shuffleInPlace(counts, random);
  shuffleInPlace(objectTypesPicked, random);
  shuffleInPlace(answerModesPicked, random);
  shuffleInPlace(stickerIndices, random);

  return counts.map((value, index) => {
    const objectType = objectTypesPicked[index];
    return {
      index,
      count: value,
      objectType,
      stickerUrl: objectType === 'stickers' ? STICKER_URLS[stickerIndices[index] % STICKER_URLS.length] : undefined,
      answerMode: answerModesPicked[index],
      options: buildOptions(value, min, max),
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

export const COUNTING_OBJECT_LABELS: Record<CountingObjectType, string> = {
  coconuts: 'Kokosy',
  cubes: 'Kostky',
  stickers: 'Nálepky',
};
