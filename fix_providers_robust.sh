#!/bin/bash
set -e

echo "🔧 Providers robuuster maken (Safety Checks)..."

cat > src/test-utils/render/providers.tsx << 'EOF'
import React from 'react';
import { ThemeProvider } from '@app/context/ThemeContext';
import { FormContext } from '@app/context/FormContext';
import { FormStateFixture } from '../fixtures';
import { FormState } from '@shared-types/form';

// Mock Safe Area (Lokaal, voor zekerheid)
jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

type ProvidersProps = {
  children: React.ReactNode;
  state?: FormState;
  dispatch?: React.Dispatch<any>;
  theme?: 'light' | 'dark';
};

export function Providers({ children, state, dispatch }: ProvidersProps) {
  // Safety Check: Bestaan de Providers wel?
  if (!ThemeProvider) {
    console.error('❌ ThemeProvider is undefined! Check imports in providers.tsx');
    return null;
  }
  if (!FormContext) {
    console.error('❌ FormContext is undefined! Check imports in providers.tsx');
    return null;
  }

  const value = {
    state: state ?? FormStateFixture,
    dispatch: dispatch ?? jest.fn(),
  };

  return (
    <ThemeProvider>
      <FormContext.Provider value={value}>
        {children}
      </FormContext.Provider>
    </ThemeProvider>
  );
}

export default Providers;
EOF

echo "✅ Providers geüpdatet met safety checks."
echo "👉 Draai nu: npm test src/__tests__/WAI009_FocusManagement.test.tsx"