import type { ModelCellState } from '../../lib/primary-model-write-model';

export function TenFrameGrid({ cells }: { cells: ModelCellState[] }) {
  const rows = [cells.slice(0, 10), cells.slice(10, 20)];

  return (
    <div className="pocetnik-ten-frame" aria-hidden="true">
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className="pocetnik-ten-frame__row">
          {row.map((cell, cellIndex) => (
            <div key={`${rowIndex}-${cellIndex}`} className="pocetnik-ten-frame__cell">
              {cell === 'red' ? <span className="pocetnik-ten-frame__dot pocetnik-ten-frame__dot--red" /> : null}
              {cell === 'blue' ? <span className="pocetnik-ten-frame__dot pocetnik-ten-frame__dot--blue" /> : null}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export function ModelWriteEquation({
  mode,
  left,
  right,
  pickedFirst,
  pickedSecond,
}: {
  mode: 'add' | 'subtract';
  left: number;
  right: number;
  pickedFirst: number | null;
  pickedSecond: number | null;
}) {
  const operator = mode === 'add' ? '+' : '−';

  return (
    <div className="pocetnik-model-equation" aria-label={`Rovnice ${left} ${operator} ${right}`}>
      <span>{left}</span>
      <span className="pocetnik-model-equation__operator">{operator}</span>
      <span>{right}</span>
      <span className="pocetnik-model-equation__equals">=</span>
      <span>{left}</span>
      <span className="pocetnik-model-equation__operator">{mode === 'add' ? '+' : '−'}</span>
      <span className={`pocetnik-model-equation__blank ${pickedFirst !== null ? 'is-filled' : ''}`}>
        {pickedFirst ?? '□'}
      </span>
      <span className="pocetnik-model-equation__operator">{mode === 'add' ? '+' : '−'}</span>
      <span className={`pocetnik-model-equation__blank ${pickedSecond !== null ? 'is-filled' : ''}`}>
        {pickedSecond ?? '□'}
      </span>
    </div>
  );
}
