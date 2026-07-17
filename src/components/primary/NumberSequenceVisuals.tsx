export function NumberSequenceRow({
  values,
  missingIndex,
  filledValue = null,
}: {
  values: number[];
  missingIndex: number;
  filledValue?: number | null;
}) {
  return (
    <div className="pocetnik-number-sequence" aria-label="Číselná řada">
      {values.map((value, index) => (
        <div key={`${value}-${index}`} className="pocetnik-number-sequence__item">
          {index === missingIndex ? (
            <span className={`pocetnik-number-sequence__blank ${filledValue !== null ? 'is-filled' : ''}`}>
              {filledValue ?? '?'}
            </span>
          ) : (
            <span className="pocetnik-number-sequence__value">{value}</span>
          )}
        </div>
      ))}
      <span className="pocetnik-number-sequence__ellipsis" aria-hidden="true">
        …
      </span>
    </div>
  );
}
