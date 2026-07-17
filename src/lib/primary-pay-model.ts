import type { PocetnikSetup, PayCoinValue, PayItemKind } from '../types/pocetnik-types';
import { createRng, shuffleInPlace } from './practice-shuffle';

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

export function buildPaySession(setup: PocetnikSetup, count: number, seed: number): PayExample[] {
  const { min, max } = clampPriceRange(setup);
  const span = max - min + 1;
  const itemKinds = setup.primaryPayItems.length > 0 ? setup.primaryPayItems : ['apple', 'ball', 'book'];
  const coinValues = (setup.primaryPayCoins.length > 0 ? setup.primaryPayCoins : [1, 2, 5]) as PayCoinValue[];
  const random = createRng(seed);

  const prices = Array.from({ length: count }, () => min + Math.floor(random() * span));
  const items = Array.from({ length: count }, () => itemKinds[Math.floor(random() * itemKinds.length)] as PayItemKind);
  shuffleInPlace(prices, random);
  shuffleInPlace(items, random);

  return prices.map((price, index) => {
    const itemKind = items[index];
    return {
      index,
      itemKind,
      itemLabel: PAY_ITEM_LABELS[itemKind],
      price,
      coinValues,
    };
  });
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
