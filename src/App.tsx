import { useState } from 'react';
import type { PocetnikSetup } from './types/pocetnik-types';
import { PocetnikSetupPage } from './components/PocetnikSetupPage';
import { PatternPractice } from './components/PatternPractice';
import { CountingPractice } from './components/CountingPractice';
import { MoreLessPractice } from './components/MoreLessPractice';
import { PayPractice } from './components/PayPractice';
import { FillPractice } from './components/FillPractice';

type Screen = 'setup' | 'practice';

export default function App() {
  const [screen, setScreen] = useState<Screen>('setup');
  const [setup, setSetup] = useState<PocetnikSetup | null>(null);

  if (screen === 'practice' && setup) {
    if (setup.primaryEnvironment === 'counting') {
      return <CountingPractice setup={setup} onBack={() => setScreen('setup')} />;
    }
    if (setup.primaryEnvironment === 'moreLess') {
      return <MoreLessPractice setup={setup} onBack={() => setScreen('setup')} />;
    }
    if (setup.primaryEnvironment === 'pay') {
      return <PayPractice setup={setup} onBack={() => setScreen('setup')} />;
    }
    if (setup.primaryEnvironment === 'fill') {
      return <FillPractice setup={setup} onBack={() => setScreen('setup')} />;
    }
    return <PatternPractice setup={setup} onBack={() => setScreen('setup')} />;
  }

  return (
    <PocetnikSetupPage
      onStart={(nextSetup) => {
        setSetup(nextSetup);
        setScreen('practice');
      }}
    />
  );
}
