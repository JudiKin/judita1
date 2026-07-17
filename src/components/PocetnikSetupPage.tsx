import { useState } from 'react';
import {
  DEFAULT_POCETNIK_SETUP,
  PRIMARY_ENVIRONMENT_LABELS,
  PRIMARY_ENVIRONMENT_ORDER,
  PRIMARY_ENVIRONMENT_SHORT,
  type DominoWriteMode,
  type ModelWriteMode,
  type NumberSequenceStep,
  type PocetnikSetup,
  type PrimaryEnvironment,
} from '../types/pocetnik-types';

interface PocetnikSetupPageProps {
  onStart: (setup: PocetnikSetup) => void;
}

export function PocetnikSetupPage({ onStart }: PocetnikSetupPageProps) {
  const [setup, setSetup] = useState<PocetnikSetup>(DEFAULT_POCETNIK_SETUP);
  const modelWriteModes = setup.primaryModelWriteModes ?? DEFAULT_POCETNIK_SETUP.primaryModelWriteModes;
  const numberSequenceSteps = setup.primaryNumberSequenceSteps ?? DEFAULT_POCETNIK_SETUP.primaryNumberSequenceSteps;
  const dominoWriteModes = setup.primaryDominoWriteModes ?? DEFAULT_POCETNIK_SETUP.primaryDominoWriteModes;
  const sumSearchTargets = setup.primarySumSearchTargets ?? DEFAULT_POCETNIK_SETUP.primarySumSearchTargets;

  const updateEnvironment = (primaryEnvironment: PrimaryEnvironment) => {
    setSetup((current) => ({
      ...DEFAULT_POCETNIK_SETUP,
      ...current,
      primaryEnvironment,
      primaryModelWriteModes: current.primaryModelWriteModes ?? DEFAULT_POCETNIK_SETUP.primaryModelWriteModes,
      primarySumSearchTargets: current.primarySumSearchTargets ?? DEFAULT_POCETNIK_SETUP.primarySumSearchTargets,
      primarySumSearchGridSize: current.primarySumSearchGridSize ?? DEFAULT_POCETNIK_SETUP.primarySumSearchGridSize,
    }));
  };

  return (
    <div className="pocetnik-setup">
      <div className="pocetnik-setup__panel">
        <p style={{ margin: 0, fontWeight: 800, color: '#047857' }}>Početník · {setup.gradeLabel}</p>
        <h1 className="pocetnik-setup__title">Procvičování pro 1. ročník</h1>
        <p className="pocetnik-setup__subtitle">Vyber prostředí a nastav jeho gradaci.</p>

        <div className="pocetnik-setup__env-grid" role="tablist" aria-label="Prostředí">
          {PRIMARY_ENVIRONMENT_ORDER.map((environment) => (
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
                      : setup.primaryEnvironment === 'modelWrite'
                        ? 'Modeluj sčítání nebo odčítání s tečkami a zapisuj rozdělení přes desítku.'
                        : setup.primaryEnvironment === 'numberSequence'
                          ? 'Doplň chybějící číslo v číselné řadě, např. 0, 2, 4, ?, 8, 10.'
                          : setup.primaryEnvironment === 'dominoWrite'
                            ? 'Spočítej tečky na domino, zapiš sčítání nebo odčítání a výsledek.'
                            : setup.primaryEnvironment === 'sumSearch'
                              ? 'Najdi sousední čísla v řadě nebo sloupci, která dohromady dají zadaný součet.'
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
            {setup.primaryCountingMax > 6 ? (
              <p style={{ margin: 0, gridColumn: '1 / -1', color: '#92400e', fontWeight: 700, lineHeight: 1.5 }}>
                Při maximu nad 6 se odpovědi zobrazují jako čísla (tečky jdou jen do 6).
              </p>
            ) : null}
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

        {setup.primaryEnvironment === 'modelWrite' ? (
          <div className="pocetnik-setup__mode-list">
            <label className={`pocetnik-setup__mode-option ${modelWriteModes.includes('add') ? 'is-active' : ''}`}>
              <input
                type="checkbox"
                checked={modelWriteModes.includes('add')}
                onChange={(event) => {
                  setSetup((current) => {
                    const currentModes = current.primaryModelWriteModes ?? DEFAULT_POCETNIK_SETUP.primaryModelWriteModes;
                    const next = event.target.checked
                      ? [...new Set([...currentModes, 'add' as ModelWriteMode])]
                      : currentModes.filter((mode) => mode !== 'add');
                    return { ...current, primaryModelWriteModes: next.length > 0 ? next : ['add'] };
                  });
                }}
              />
              Sčítej s tečkami
            </label>
            <label className={`pocetnik-setup__mode-option ${modelWriteModes.includes('subtract') ? 'is-active' : ''}`}>
              <input
                type="checkbox"
                checked={modelWriteModes.includes('subtract')}
                onChange={(event) => {
                  setSetup((current) => {
                    const currentModes = current.primaryModelWriteModes ?? DEFAULT_POCETNIK_SETUP.primaryModelWriteModes;
                    const next = event.target.checked
                      ? [...new Set([...currentModes, 'subtract' as ModelWriteMode])]
                      : currentModes.filter((mode) => mode !== 'subtract');
                    return { ...current, primaryModelWriteModes: next.length > 0 ? next : ['subtract'] };
                  });
                }}
              />
              Odčítej s tečkami
            </label>
          </div>
        ) : null}

        {setup.primaryEnvironment === 'numberSequence' ? (
          <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
            <div className="pocetnik-setup__mode-list" style={{ gridColumn: '1 / -1' }}>
              {([1, 2, 5, 10] as NumberSequenceStep[]).map((step) => (
                <label
                  key={step}
                  className={`pocetnik-setup__mode-option ${numberSequenceSteps.includes(step) ? 'is-active' : ''}`}
                >
                  <input
                    type="checkbox"
                    checked={numberSequenceSteps.includes(step)}
                    onChange={(event) => {
                      setSetup((current) => {
                        const currentSteps = current.primaryNumberSequenceSteps ?? DEFAULT_POCETNIK_SETUP.primaryNumberSequenceSteps;
                        const next = event.target.checked
                          ? [...new Set([...currentSteps, step])]
                          : currentSteps.filter((value) => value !== step);
                        return {
                          ...current,
                          primaryNumberSequenceSteps: next.length > 0 ? next : [step],
                        };
                      });
                    }}
                  />
                  {step === 1 ? 'Po jedné' : step === 2 ? 'Po dvou' : step === 5 ? 'Po pěti' : 'Po deseti'}
                </label>
              ))}
            </div>
            <label className="pocetnik-setup__field">
              Počet čísel v řadě
              <select
                value={setup.primaryNumberSequenceLength}
                onChange={(event) =>
                  setSetup((current) => ({ ...current, primaryNumberSequenceLength: Number(event.target.value) }))
                }
              >
                <option value={5}>5 čísel</option>
                <option value={6}>6 čísel</option>
                <option value={7}>7 čísel</option>
                <option value={8}>8 čísel</option>
              </select>
            </label>
            <label className="pocetnik-setup__field">
              Nejvýše do
              <select
                value={setup.primaryNumberSequenceMax}
                onChange={(event) =>
                  setSetup((current) => ({ ...current, primaryNumberSequenceMax: Number(event.target.value) }))
                }
              >
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </label>
          </div>
        ) : null}

        {setup.primaryEnvironment === 'sumSearch' ? (
          <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
            <div className="pocetnik-setup__mode-list" style={{ gridColumn: '1 / -1' }}>
              {[5, 6, 7, 8, 9, 10].map((target) => (
                <label
                  key={target}
                  className={`pocetnik-setup__mode-option ${sumSearchTargets.includes(target) ? 'is-active' : ''}`}
                >
                  <input
                    type="checkbox"
                    checked={sumSearchTargets.includes(target)}
                    onChange={(event) => {
                      setSetup((current) => {
                        const currentTargets = current.primarySumSearchTargets ?? DEFAULT_POCETNIK_SETUP.primarySumSearchTargets;
                        const next = event.target.checked
                          ? [...new Set([...currentTargets, target])]
                          : currentTargets.filter((value) => value !== target);
                        return {
                          ...current,
                          primarySumSearchTargets: next.length > 0 ? next : [target],
                        };
                      });
                    }}
                  />
                  Součet {target}
                </label>
              ))}
            </div>
            <label className="pocetnik-setup__field">
              Velikost mřížky
              <select
                value={setup.primarySumSearchGridSize ?? DEFAULT_POCETNIK_SETUP.primarySumSearchGridSize}
                onChange={(event) =>
                  setSetup((current) => ({
                    ...current,
                    primarySumSearchGridSize: Number(event.target.value) as PocetnikSetup['primarySumSearchGridSize'],
                  }))
                }
              >
                <option value={3}>3 × 3</option>
                <option value={4}>4 × 4</option>
                <option value={5}>5 × 5</option>
              </select>
            </label>
          </div>
        ) : null}

        {setup.primaryEnvironment === 'dominoWrite' ? (
          <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
            <div className="pocetnik-setup__mode-list" style={{ gridColumn: '1 / -1' }}>
              <label className={`pocetnik-setup__mode-option ${dominoWriteModes.includes('add') ? 'is-active' : ''}`}>
                <input
                  type="checkbox"
                  checked={dominoWriteModes.includes('add')}
                  onChange={(event) => {
                    setSetup((current) => {
                      const currentModes = current.primaryDominoWriteModes ?? DEFAULT_POCETNIK_SETUP.primaryDominoWriteModes;
                      const next = event.target.checked
                        ? [...new Set([...currentModes, 'add' as DominoWriteMode])]
                        : currentModes.filter((mode) => mode !== 'add');
                      return { ...current, primaryDominoWriteModes: next.length > 0 ? next : ['add'] };
                    });
                  }}
                />
                Sčítání
              </label>
              <label className={`pocetnik-setup__mode-option ${dominoWriteModes.includes('subtract') ? 'is-active' : ''}`}>
                <input
                  type="checkbox"
                  checked={dominoWriteModes.includes('subtract')}
                  onChange={(event) => {
                    setSetup((current) => {
                      const currentModes = current.primaryDominoWriteModes ?? DEFAULT_POCETNIK_SETUP.primaryDominoWriteModes;
                      const next = event.target.checked
                        ? [...new Set([...currentModes, 'subtract' as DominoWriteMode])]
                        : currentModes.filter((mode) => mode !== 'subtract');
                      return { ...current, primaryDominoWriteModes: next.length > 0 ? next : ['subtract'] };
                    });
                  }}
                />
                Odčítání
              </label>
            </div>
            <label className="pocetnik-setup__field">
              Maximum teček na polovině
              <select
                value={setup.primaryDominoMaxDots}
                onChange={(event) =>
                  setSetup((current) => ({ ...current, primaryDominoMaxDots: Number(event.target.value) as 6 | 9 }))
                }
              >
                <option value={6}>0–6 (klasické domino)</option>
                <option value={9}>0–9</option>
              </select>
            </label>
          </div>
        ) : null}

        <button
          type="button"
          className="pocetnik-setup__start"
          onClick={() => onStart({ ...DEFAULT_POCETNIK_SETUP, ...setup })}
        >
          Spustit {PRIMARY_ENVIRONMENT_LABELS[setup.primaryEnvironment].toLowerCase()}
        </button>
      </div>
    </div>
  );
}
