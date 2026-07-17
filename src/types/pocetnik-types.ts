export type SchoolStage = 'primary' | 'lower-secondary';

export type PrimaryEnvironment = 'patterns' | 'counting' | 'moreLess' | 'pay' | 'fill' | 'findErrors';

export type FillMarbleColor = 'red' | 'orange';

export type SequencePatternKind = 'AB' | 'AAB' | 'AAAB' | 'ABC' | 'AABB' | 'ABAC';

export type SequenceDifficulty = 'easy' | 'medium' | 'hard';

export type SequenceItemKind = 'yellow-cube' | 'green-cube' | 'purple-cube' | 'red-cube' | 'yellow-circle' | 'purple-square' | 'red-plus';

export type CountingAnswerMode = 'dots' | 'marks' | 'numbers';

export type CountingObjectType = 'coconuts' | 'cubes' | 'stickers';

export type MoreLessObjectKind = CountingObjectType | SequenceItemKind | PayItemKind;

export type PayItemKind = 'apple' | 'ball' | 'book' | 'pencil' | 'bread' | 'toy';

export type PayCoinValue = 1 | 2 | 5 | 10;

export type FindErrorKind = 'counting' | 'comparison' | 'pattern';

export interface PocetnikSetup {
  schoolStage: SchoolStage;
  gradeLabel: string;
  primaryEnvironment: PrimaryEnvironment;
  primaryPatternDifficulty: SequenceDifficulty;
  primaryPatternSymbolSet: 'blocks' | 'shapes';
  primaryPatternObjects: SequenceItemKind[];
  primaryPatternTypes: SequencePatternKind[];
  primaryPatternRows: 1 | 2 | 3;
  primaryCountingMin: number;
  primaryCountingMax: number;
  primaryCountingAnswerModes: CountingAnswerMode[];
  primaryCountingObjectTypes: MoreLessObjectKind[];
  primaryMoreLessMin: number;
  primaryMoreLessMax: number;
  primaryMoreLessMaxDelta: number;
  primaryMoreLessObjectTypes: MoreLessObjectKind[];
  primaryPayMinPrice: number;
  primaryPayMaxPrice: number;
  primaryPayCoins: PayCoinValue[];
  primaryPayItems: PayItemKind[];
  primaryFillTarget: number;
  primaryFillMinStart: number;
  primaryFindErrorsMin: number;
  primaryFindErrorsMax: number;
  primaryFindErrorsKinds: FindErrorKind[];
  primaryFindErrorsObjectTypes: MoreLessObjectKind[];
  maxQuestions: number;
}

export const DEFAULT_POCETNIK_SETUP: PocetnikSetup = {
  schoolStage: 'primary',
  gradeLabel: '1. ročník',
  primaryEnvironment: 'patterns',
  primaryPatternDifficulty: 'easy',
  primaryPatternSymbolSet: 'blocks',
  primaryPatternObjects: ['yellow-cube', 'green-cube', 'purple-cube', 'yellow-circle', 'purple-square', 'red-plus'],
  primaryPatternTypes: ['AB', 'AAB', 'AAAB'],
  primaryPatternRows: 1,
  primaryCountingMin: 1,
  primaryCountingMax: 6,
  primaryCountingAnswerModes: ['dots'],
  primaryCountingObjectTypes: [
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
  ],
  primaryMoreLessMin: 1,
  primaryMoreLessMax: 6,
  primaryMoreLessMaxDelta: 2,
  primaryMoreLessObjectTypes: [
    'coconuts',
    'cubes',
    'stickers',
    'yellow-cube',
    'green-cube',
    'purple-cube',
    'yellow-circle',
    'purple-square',
    'red-plus',
    'apple',
    'ball',
    'book',
    'pencil',
    'bread',
    'toy',
  ],
  primaryPayMinPrice: 1,
  primaryPayMaxPrice: 8,
  primaryPayCoins: [1, 2, 5],
  primaryPayItems: ['apple', 'ball', 'book', 'pencil', 'bread', 'toy'],
  primaryFillTarget: 7,
  primaryFillMinStart: 0,
  primaryFindErrorsMin: 1,
  primaryFindErrorsMax: 6,
  primaryFindErrorsKinds: ['counting', 'comparison', 'pattern'],
  primaryFindErrorsObjectTypes: ['coconuts', 'cubes', 'yellow-cube', 'green-cube', 'apple', 'ball'],
  maxQuestions: 10,
};

export const PRIMARY_ENVIRONMENT_LABELS: Record<PrimaryEnvironment, string> = {
  patterns: 'Pokračuj ve vzoru',
  counting: 'Počítej',
  moreLess: 'Porovnej počet',
  pay: 'Zaplať',
  fill: 'Doplň',
  findErrors: 'Najdi chyby',
};

export const PRIMARY_ENVIRONMENT_SHORT: Record<PrimaryEnvironment, string> = {
  patterns: 'Pokračuj',
  counting: 'Počítej',
  moreLess: 'Porovnej počet',
  pay: 'Zaplať',
  fill: 'Doplň',
  findErrors: 'Najdi chyby',
};
