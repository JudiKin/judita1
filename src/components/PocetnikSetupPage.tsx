import { useState } from 'react';
import {
  DEFAULT_POCETNIK_SETUP,
  PRIMARY_ENVIRONMENT_LABELS,
  PRIMARY_ENVIRONMENT_SHORT,
  type PocetnikSetup,
  type PrimaryEnvironment,
} from '../types/pocetnik-types';

interface PocetnikSetupPageProps {
  onStart: (setup: PocetnikSetup) => void;
}

export function PocetnikSetupPage({ onStart }: PocetnikSetupPageProps) {
  const [setup, setSetup] = useState<PocetnikSetup>(DEFAULT_POCETNIK_SETUP);

  const updateEnvironment = (primaryEnvironment: PrimaryEnvironment) => {
    setSetup((current) => ({ ...current, primaryEnvironment }));
  };

  return (
    <div className="pocetnik-setup">
      <div className="pocetnik-setup__panel">
        <p style={{ margin: 0, fontWeight: 800, color: '#047857' }}>Početník · {setup.gradeLabel}</p>
        <h1 className="pocetnik-setup__title">Procvičování pro 1. ročník</h1>
        <p className="pocetnik-setup__subtitle">Vyber prostředí a nastav jeho gradaci.</p>

        <div className="pocetnik-setup__env-grid" role="tablist" aria-label="Prostředí">
          {(Object.keys(PRIMARY_ENVIRONMENT_SHORT) as PrimaryEnvironment[]).map((environment) => (
            <button
              key={environment}
              type="button"
              role="tab"
              aria-selected={setup.primaryEnvironment === environment}
              className={`pocetnik-setup__env-button ${setup.primaryEnvironment === environment ? 'is-active' : ''}`}
              onClick={() => updateEnvironment(environment)}
            >
              {PRIMARY_ENVIRONMENT_SHORT[environment]}
            </button>
          ))}
        </div>

        <div style={{ marginTop: 18, padding: '16px 18px', borderRadius: 18, background: '#ecfdf5' }}>
          <strong style={{ color: '#065f46' }}>{PRIMARY_ENVIRONMENT_LABELS[setup.primaryEnvironment]}</strong>
          <p style={{ margin: '8px 0 0', color: 'rgb(6 95 70 / 0.8)', lineHeight: 1.5 }}>
            {setup.primaryEnvironment === 'patterns'
              ? 'Doplň symboly ve vzoru AB, AAB nebo AAAB.'
              : setup.primaryEnvironment === 'counting'
                ? 'Spočítej objekty a vyber správný počet.'
                : setup.primaryEnvironment === 'moreLess'
                  ? 'Porovnej dvě skupiny a vyber, jestli je vpravo stejně, o kolik víc, nebo o kolik míň.'
                  : setup.primaryEnvironment === 'pay'
                    ? 'Podívej se na cenovku a vyber mince, aby sis mohl předmět koupit.'
                    : setup.primaryEnvironment === 'findErrors'
                      ? 'Podívej se na příklad a urči, jestli je správně, nebo obsahuje chybu.'
                      : 'Doplň kuličky do pytlíku na zvolený počet.'}
          </p>
        </div>

        {setup.primaryEnvironment === 'patterns' ? (
          <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
            <label className="pocetnik-setup__field">
              Obtížnost
              <select
                value={setup.primaryPatternDifficulty}
                onChange={(event) => setSetup((current) => ({ ...current, primaryPatternDifficulty: event.target.value as PocetnikSetup['primaryPatternDifficulty'] }))}
              >
                <option value="easy">Lehká</option>
                <option value="medium">Střední</option>
                <option value="hard">Náročná</option>
              </select>
            </label>
            <label className="pocetnik-setup__field">
              Řádky vzoru
              <select
                value={setup.primaryPatternRows}
                onChange={(event) => setSetup((current) => ({ ...current, primaryPatternRows: Number(event.target.value) as 1 | 2 | 3 }))}
              >
                <option value={1}>1 řádek</option>
                <option value={2}>2 řádky</option>
                <option value={3}>3 řádky</option>
              </select>
            </label>
          </div>
        ) : null}

        {setup.primaryEnvironment === 'counting' ? (
          <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
            <label className="pocetnik-setup__field">
              Minimum
              <input
                type="number"
                min={1}
                max={20}
                value={setup.primaryCountingMin}
                onChange={(event) => {
                  const value = Number(event.target.value);
                  setSetup((current) => ({
                    ...current,
                    primaryCountingMin: Number.isFinite(value) ? Math.max(1, Math.min(20, Math.floor(value))) : 1,
                  }));
                }}
              />
            </label>
            <label className="pocetnik-setup__field">
              Maximum
              <input
                type="number"
                min={1}
                max={20}
                value={setup.primaryCountingMax}
                onChange={(event) => {
                  const value = Number(event.target.value);
                  setSetup((current) => {
                    const nextMax = Number.isFinite(value) ? Math.max(1, Math.min(20, Math.floor(value))) : 6;
                    return {
                      ...current,
                      primaryCountingMax: Math.max(current.primaryCountingMin, nextMax),
                    };
                  });
                }}
              />
            </label>
          </div>
        ) : null}

        {setup.primaryEnvironment === 'moreLess' ? (
          <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
            <label className="pocetnik-setup__field">
              Minimum objektů
              <input
                type="number"
                min={1}
                max={20}
                value={setup.primaryMoreLessMin}
                onChange={(event) => setSetup((current) => ({ ...current, primaryMoreLessMin: Number(event.target.value) }))}
              />
            </label>
            <label className="pocetnik-setup__field">
              Maximum objektů
              <input
                type="number"
                min={1}
                max={20}
                value={setup.primaryMoreLessMax}
                onChange={(event) => setSetup((current) => ({ ...current, primaryMoreLessMax: Number(event.target.value) }))}
              />
            </label>
            <label className="pocetnik-setup__field">
              Rozsah odpovědí (±)
              <select
                value={setup.primaryMoreLessMaxDelta}
                onChange={(event) => setSetup((current) => ({ ...current, primaryMoreLessMaxDelta: Number(event.target.value) }))}
              >
                <option value={1}>±1</option>
                <option value={2}>±2</option>
                <option value={3}>±3</option>
              </select>
            </label>
          </div>
        ) : null}

        {setup.primaryEnvironment === 'pay' ? (
          <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
            <label className="pocetnik-setup__field">
              Nejnižší cena (Kč)
              <input
                type="number"
                min={1}
                max={20}
                value={setup.primaryPayMinPrice}
                onChange={(event) => setSetup((current) => ({ ...current, primaryPayMinPrice: Number(event.target.value) }))}
              />
            </label>
            <label className="pocetnik-setup__field">
              Nejvyšší cena (Kč)
              <input
                type="number"
                min={1}
                max={20}
                value={setup.primaryPayMaxPrice}
                onChange={(event) => setSetup((current) => ({ ...current, primaryPayMaxPrice: Number(event.target.value) }))}
              />
            </label>
            <label className="pocetnik-setup__field">
              Dostupné mince
              <select
                value={setup.primaryPayCoins.join(',')}
                onChange={(event) => {
                  const mapping: Record<string, PocetnikSetup['primaryPayCoins']> = {
                    '1,2': [1, 2],
                    '1,2,5': [1, 2, 5],
                    '1,2,5,10': [1, 2, 5, 10],
                  };
                  setSetup((current) => ({ ...current, primaryPayCoins: mapping[event.target.value] ?? [1, 2, 5] }));
                }}
              >
                <option value="1,2">1 Kč a 2 Kč</option>
                <option value="1,2,5">1 Kč, 2 Kč a 5 Kč</option>
                <option value="1,2,5,10">1 Kč, 2 Kč, 5 Kč a 10 Kč</option>
              </select>
            </label>
          </div>
        ) : null}

        {setup.primaryEnvironment === 'fill' ? (
          <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
            <label className="pocetnik-setup__field">
              Doplň do (počet)
              <input
                type="number"
                min={2}
                max={10}
                value={setup.primaryFillTarget}
                onChange={(event) => setSetup((current) => ({ ...current, primaryFillTarget: Number(event.target.value) }))}
              />
            </label>
            <label className="pocetnik-setup__field">
              Nejméně kuliček na začátku
              <input
                type="number"
                min={0}
                max={9}
                value={setup.primaryFillMinStart}
                onChange={(event) => setSetup((current) => ({ ...current, primaryFillMinStart: Number(event.target.value) }))}
              />
            </label>
          </div>
        ) : null}

        {setup.primaryEnvironment === 'findErrors' ? (
          <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
            <label className="pocetnik-setup__field">
              Minimum objektů
              <input
                type="number"
                min={1}
                max={20}
                value={setup.primaryFindErrorsMin}
                onChange={(event) => setSetup((current) => ({ ...current, primaryFindErrorsMin: Number(event.target.value) }))}
              />
            </label>
            <label className="pocetnik-setup__field">
              Maximum objektů
              <input
                type="number"
                min={1}
                max={20}
                value={setup.primaryFindErrorsMax}
                onChange={(event) => setSetup((current) => ({ ...current, primaryFindErrorsMax: Number(event.target.value) }))}
              />
            </label>
          </div>
        ) : null}

        <button type="button" className="pocetnik-setup__start" onClick={() => onStart(setup)}>
          Spustit {PRIMARY_ENVIRONMENT_LABELS[setup.primaryEnvironment].toLowerCase()}
        </button>
      </div>
    </div>
  );
}
