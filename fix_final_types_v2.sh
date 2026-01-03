#!/bin/bash
set -e

echo "🔧 Providers isoleren (Circular Dependency Fix)..."

cat > src/test-utils/render/providers.tsx << 'EOF'
import React from 'react';
import { ThemeProvider } from '@app/context/ThemeContext';
import { FormContext } from '@app/context/FormContext';
import { FormState } from '@shared-types/form';

// Mock Safe Area (Lokaal, voor zekerheid)
jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

// Minimale default state om crashes te voorkomen
const DEFAULT_STATE: FormState = {
  schemaVersion: '1.0',
  activeStep: 'LANDING',
  currentPageId: 'setupHousehold',
  isValid: false,
  data: {
    setup: {},
    household: { members: [] },
    finance: { income: { items: [] }, expenses: { items: [] } },
  },
  meta: { lastModified: '', version: 1 }
};

type ProvidersProps = {
  children: React.ReactNode;
  state?: FormState;
  dispatch?: React.Dispatch<any>;
  theme?: 'light' | 'dark';
};

export function Providers({ children, state, dispatch }: ProvidersProps) {
  // Safety Check
  if (!ThemeProvider || !FormContext) {
    console.error('❌ Context Providers zijn undefined! Check imports in providers.tsx');
    return null;
  }

  const value = {
    state: state ?? DEFAULT_STATE,
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

echo "✅ Providers geïsoleerd."
echo "👉 Draai nu: npm test src/__tests__/WAI009_FocusManagement.test.tsx"