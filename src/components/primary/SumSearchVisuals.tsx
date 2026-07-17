import type { GridCell } from '../../lib/primary-sum-search-model';
import { cellKey, selectionSum } from '../../lib/primary-sum-search-model';

export function SumSearchGrid({
  grid,
  selected,
  onToggleCell,
  disabled = false,
}: {
  grid: number[][];
  selected: GridCell[];
  onToggleCell: (cell: GridCell) => void;
  disabled?: boolean;
}) {
  const selectedKeys = new Set(selected.map((cell) => cellKey(cell)));
  const currentSum = selectionSum(grid, selected);

  return (
    <div className="pocetnik-sum-search">
      <div className="pocetnik-sum-search__grid" style={{ gridTemplateColumns: `repeat(${grid.length}, minmax(0, 1fr))` }}>
        {grid.map((row, rowIndex) =>
          row.map((value, colIndex) => {
            const isSelected = selectedKeys.has(cellKey({ row: rowIndex, col: colIndex }));
            return (
              <button
                key={`${rowIndex}-${colIndex}`}
                type="button"
                className={`pocetnik-sum-search__cell ${isSelected ? 'is-selected' : ''}`}
                onClick={() => onToggleCell({ row: rowIndex, col: colIndex })}
                disabled={disabled}
                aria-pressed={isSelected}
              >
                {value}
              </button>
            );
          }),
        )}
      </div>
      <div className="pocetnik-sum-search__current-sum">
        Vybraný součet: <strong>{currentSum}</strong>
      </div>
    </div>
  );
}
