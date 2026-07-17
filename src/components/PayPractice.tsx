import { useState } from 'react';
import type { PayCoinValue, PocetnikSetup } from '../types/pocetnik-types';
import { buildPaySession, sumCoins } from '../lib/primary-pay-model';
import { usePracticeDeck } from '../hooks/usePracticeDeck';
import {
  FeedbackOverlay,
  PracticeHeader,
  PracticeHint,
  PracticeLayout,
  PracticeTitle,
  PrimaryCard,
  PrimaryShell,
  PRIMARY_BACKGROUNDS,
} from './primary/PrimaryShell';
import { CoinButton, PriceTag, SelectedCoin, ShopItem } from './primary/PayVisuals';

interface PayPracticeProps {
  setup: PocetnikSetup;
  onBack: () => void;
}

export function PayPractice({ setup, onBack }: PayPracticeProps) {
  const { example, index, goNext } = usePracticeDeck(setup, buildPaySession);
  const [selectedCoins, setSelectedCoins] = useState<PayCoinValue[]>([]);
  const [feedback, setFeedback] = useState<boolean | null>(null);
  const [completed, setCompleted] = useState(false);
  const [hint, setHint] = useState<string | null>(null);

  const currentSum = sumCoins(selectedCoins);

  const addCoin = (value: PayCoinValue) => {
    if (completed) return;
    setSelectedCoins((current) => [...current, value]);
    setHint(null);
  };

  const removeCoin = (coinIndex: number) => {
    if (completed) return;
    setSelectedCoins((current) => current.filter((_, position) => position !== coinIndex));
    setHint(null);
  };

  const handlePay = () => {
    if (completed || selectedCoins.length === 0) return;

    if (currentSum === example.price) {
      setFeedback(true);
      setCompleted(true);
      setHint(null);
      window.setTimeout(() => setFeedback(null), 700);
      return;
    }

    setFeedback(false);
    setHint(currentSum < example.price ? 'Ještě ti chybí pár korun.' : 'Platíš moc. Zkus mince odebrat.');
    window.setTimeout(() => setFeedback(null), 700);
  };

  const handleNext = () => {
    goNext();
    setSelectedCoins([]);
    setCompleted(false);
    setFeedback(null);
    setHint(null);
  };

  return (
    <PrimaryShell background={PRIMARY_BACKGROUNDS.softBlue}>
      {feedback !== null ? <FeedbackOverlay correct={feedback} /> : null}
      <PracticeLayout>
        <PracticeHeader questionNumber={index + 1} onBack={onBack} onNext={handleNext} canNext={completed} />
        <PracticeTitle color="#1d4ed8">Zaplať</PracticeTitle>

        <PrimaryCard className="pocetnik-practice-card pocetnik-practice-card--center">
          <div className="pocetnik-pay-shop">
            <div className="pocetnik-pay-shop__item-wrap">
              <ShopItem kind={example.itemKind} label={example.itemLabel} />
              <PriceTag price={example.price} />
            </div>
          </div>
        </PrimaryCard>

        <div className="pocetnik-pay-tray">
          <div className="pocetnik-pay-tray__header">
            <span>Vybrané mince</span>
            <strong>{currentSum} Kč</strong>
          </div>
          <div className="pocetnik-pay-tray__coins">
            {selectedCoins.length === 0 ? (
              <span className="pocetnik-pay-tray__empty">Vyber mince dole</span>
            ) : (
              selectedCoins.map((value, coinIndex) => (
                <SelectedCoin key={`${value}-${coinIndex}`} value={value} onRemove={() => removeCoin(coinIndex)} />
              ))
            )}
          </div>
        </div>

        <div className="pocetnik-pay-coins">
          {example.coinValues.map((value) => (
            <CoinButton key={value} value={value} onClick={() => addCoin(value)} disabled={completed} />
          ))}
        </div>

        <div className="pocetnik-practice-actions">
          <button type="button" className="pocetnik-pay-submit" onClick={handlePay} disabled={completed || selectedCoins.length === 0}>
            Zaplatit
          </button>
        </div>

        {completed ? (
          <PracticeHint tone="success">Správně. Pokračuj šipkou.</PracticeHint>
        ) : hint ? (
          <PracticeHint tone="error">{hint}</PracticeHint>
        ) : (
          <PracticeHint tone="neutral">Vyber mince a zaplať přesně podle cenovky.</PracticeHint>
        )}
      </PracticeLayout>
    </PrimaryShell>
  );
}
