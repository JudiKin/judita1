import type { PocetnikSetup, PayCoinValue, PayItemKind } from '../types/pocetnik-types';

export interface PayExample {
  index: number;
  itemKind: PayItemKind;
  itemLabel: string;
  price: number;
  coinValues: PayCoinValue[];
}

export const PAY_ITEM_LABELS: Record<PayItemKind, string> = {
  apple: 'Jablko',
  ball: 'Míč',
  book: 'Knížka',
  pencil: 'Tužka',
  bread: 'Rohlík',
  toy: 'Hračka',
};

function clampPriceRange(setup: PocetnikSetup): { min: number; max: number } {
  const min = Math.max(1, Math.min(20, Math.floor(setup.primaryPayMinPrice || 1)));
  const max = Math.max(min, Math.min(20, Math.floor(setup.primaryPayMaxPrice || 8)));
  return { min, max };
}

export function buildPayExample(setup: PocetnikSetup, index: number): PayExample {
  const { min, max } = clampPriceRange(setup);
  const span = max - min + 1;
  const price = min + (index % span);
  const itemKinds = setup.primaryPayItems.length > 0 ? setup.primaryPayItems : ['apple', 'ball', 'book'];
  const itemKind = itemKinds[index % itemKinds.length] as PayItemKind;
  const coinValues = (setup.primaryPayCoins.length > 0 ? setup.primaryPayCoins : [1, 2, 5]) as PayCoinValue[];

  return {
    index,
    itemKind,
    itemLabel: PAY_ITEM_LABELS[itemKind],
    price,
    coinValues,
  };
}

export function sumCoins(selected: PayCoinValue[]): number {
  return selected.reduce((total, value) => total + value, 0);
}

export const PAY_COIN_LABELS: Record<PayCoinValue, string> = {
  1: '1 Kč',
  2: '2 Kč',
  5: '5 Kč',
  10: '10 Kč',
};
