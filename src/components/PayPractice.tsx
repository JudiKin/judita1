import { useMemo, useState } from 'react';
import type { PayCoinValue, PocetnikSetup } from '../types/pocetnik-types';
import { buildPayExample, sumCoins } from '../lib/primary-pay-model';
import { FeedbackOverlay, PracticeHeader, PrimaryCard, PrimaryShell, PRIMARY_BACKGROUNDS } from './primary/PrimaryShell';
import { CoinButton, PriceTag, SelectedCoin, ShopItem } from './primary/PayVisuals';

interface PayPracticeProps {
  setup: PocetnikSetup;
  onBack: () => void;
}

export function PayPractice({ setup, onBack }: PayPracticeProps) {
  const [index, setIndex] = useState(0);
  const [selectedCoins, setSelectedCoins] = useState<PayCoinValue[]>([]);
  const [feedback, setFeedback] = useState<boolean | null>(null);
  const [completed, setCompleted] = useState(false);
  const [hint, setHint] = useState<string | null>(null);

  const example = useMemo(() => buildPayExample(setup, index), [setup, index]);
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
    setIndex((current) => current + 1);
    setSelectedCoins([]);
    setCompleted(false);
    setFeedback(null);
    setHint(null);
  };

  return (
    <PrimaryShell background={PRIMARY_BACKGROUNDS.softBlue}>
      {feedback !== null ? <FeedbackOverlay correct={feedback} /> : null}
      <div style={{ maxWidth: 960, margin: '0 auto', padding: '20px 24px 32px' }}>
        <PracticeHeader questionNumber={index + 1} onBack={onBack} onNext={handleNext} canNext={completed} />
        <div style={{ marginBottom: 24, fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 900, color: '#1d4ed8', textTransform: 'uppercase' }}>
          Zaplať
        </div>

        <PrimaryCard style={{ padding: '28px 24px' }}>
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

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 24 }}>
          <button type="button" className="pocetnik-pay-submit" onClick={handlePay} disabled={completed || selectedCoins.length === 0}>
            Zaplatit
          </button>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 20 }}>
          {completed ? (
            <div style={hintStyle('#047857')}>Správně. Pokračuj šipkou.</div>
          ) : hint ? (
            <div style={hintStyle('#dc2626')}>{hint}</div>
          ) : (
            <div style={hintStyle('#64748b')}>Vyber mince a zaplať přesně podle cenovky.</div>
          )}
        </div>
      </div>
    </PrimaryShell>
  );
}

function hintStyle(color: string): React.CSSProperties {
  return {
    borderRadius: 999,
    background: '#fff',
    padding: '12px 20px',
    fontWeight: 800,
    color,
    boxShadow: '0 8px 20px rgb(0 0 0 / 0.06)',
  };
}
