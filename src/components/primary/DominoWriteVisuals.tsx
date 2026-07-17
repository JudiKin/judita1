const PIP_LAYOUTS: Record<number, string[]> = {
  0: [],
  1: ['center'],
  2: ['top-left', 'bottom-right'],
  3: ['top-left', 'center', 'bottom-right'],
  4: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
  5: ['top-left', 'top-right', 'center', 'bottom-left', 'bottom-right'],
  6: ['top-left', 'top-right', 'middle-left', 'middle-right', 'bottom-left', 'bottom-right'],
  7: ['top-left', 'top-right', 'middle-left', 'middle-right', 'bottom-left', 'bottom-right', 'center'],
  8: ['top-left', 'top-center', 'top-right', 'middle-left', 'middle-right', 'bottom-left', 'bottom-center', 'bottom-right'],
  9: ['top-left', 'top-center', 'top-right', 'middle-left', 'center', 'middle-right', 'bottom-left', 'bottom-center', 'bottom-right'],
};

const PIP_COORDS: Record<string, string> = {
  'top-left': 'left: 18%; top: 18%;',
  'top-center': 'left: 50%; top: 18%; transform: translateX(-50%);',
  'top-right': 'right: 18%; top: 18%;',
  'middle-left': 'left: 18%; top: 50%; transform: translateY(-50%);',
  center: 'left: 50%; top: 50%; transform: translate(-50%, -50%);',
  'middle-right': 'right: 18%; top: 50%; transform: translateY(-50%);',
  'bottom-left': 'left: 18%; bottom: 18%;',
  'bottom-center': 'left: 50%; bottom: 18%; transform: translateX(-50%);',
  'bottom-right': 'right: 18%; bottom: 18%;',
};

function DominoHalf({ dots, filledValue }: { dots: number | null; filledValue?: number | null }) {
  const displayDots = dots ?? filledValue ?? null;

  if (displayDots === null) {
    return (
      <div className="pocetnik-domino__half">
        <span className="pocetnik-domino__blank" />
      </div>
    );
  }

  return (
    <div className="pocetnik-domino__half">
      {(PIP_LAYOUTS[displayDots] ?? PIP_LAYOUTS[0]).map((key) => (
        <span
          key={key}
          className="pocetnik-domino__pip"
          style={Object.fromEntries(
            PIP_COORDS[key]
              .split(';')
              .filter(Boolean)
              .map((part) => {
                const [k, v] = part.split(':').map((piece) => piece.trim());
                return [k.replace(/-([a-z])/g, (_, char: string) => char.toUpperCase()), v];
              }),
          )}
        />
      ))}
    </div>
  );
}

export function DominoTile({
  leftDots,
  rightDots,
  filledLeft,
  filledRight,
}: {
  leftDots: number | null;
  rightDots: number | null;
  filledLeft?: number | null;
  filledRight?: number | null;
}) {
  return (
    <div className="pocetnik-domino" aria-hidden="true">
      <DominoHalf dots={leftDots} filledValue={filledLeft} />
      <div className="pocetnik-domino__divider" />
      <DominoHalf dots={rightDots} filledValue={filledRight} />
    </div>
  );
}

export function DominoEquation({
  mode,
  leftValue,
  rightValue,
  resultValue,
  activeField,
}: {
  mode: 'add' | 'subtract' | 'fillAdd';
  leftValue: number | null;
  rightValue: number | null;
  resultValue: number | null;
  activeField: 'left' | 'right' | 'result' | null;
}) {
  const operator = mode === 'subtract' ? '−' : '+';

  return (
    <div className="pocetnik-domino-equation">
      <div className="pocetnik-domino-equation__row">
        <span className={`pocetnik-domino-equation__box ${activeField === 'left' ? 'is-active' : ''} ${leftValue !== null ? 'is-filled' : ''}`}>
          {leftValue ?? ''}
        </span>
        <span className="pocetnik-domino-equation__operator">{operator}</span>
        <span className={`pocetnik-domino-equation__box ${activeField === 'right' ? 'is-active' : ''} ${rightValue !== null ? 'is-filled' : ''}`}>
          {rightValue ?? ''}
        </span>
      </div>
      {mode !== 'fillAdd' ? (
        <span className={`pocetnik-domino-equation__result ${activeField === 'result' ? 'is-active' : ''} ${resultValue !== null ? 'is-filled' : ''}`}>
          {resultValue ?? ''}
        </span>
      ) : null}
    </div>
  );
}

export function DominoTargetSum({ value }: { value: number }) {
  return (
    <div className="pocetnik-domino-target">
      <span className="pocetnik-domino-target__value">{value}</span>
    </div>
  );
}
