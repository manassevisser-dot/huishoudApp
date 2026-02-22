#!/bin/bash
set -e

echo "🧹 Test Utils Consolideren..."

# 1. Fixtures (Statische Data)
cat > src/test-utils/fixtures.ts << 'EOF'
import { FormState } from '@shared-types/form';

export const HouseholdFixture = {
  householdId: 'h-1',
  members: [
    {
      entityId: 'adult-1', fieldId: 'member-adult-1', memberType: 'adult' as const,
      firstName: 'Jan', lastName: '', gender: 'man', dateOfBirth: '1985-06-15',
    },
    {
      entityId: 'child-1', fieldId: 'member-child-1', memberType: 'child' as const,
      firstName: 'Mia', lastName: '', gender: 'vrouw', dateOfBirth: '2015-03-20',
    },
  ],
  lastUpdated: '2025-01-01T12:00:00Z',
};

export const FinanceFixture = {
  income: { items: [{ id: 'inc-1', amountCents: 200000, frequency: 'month' }] },
  expenses: { items: [{ id: 'exp-1', amountCents: 50000, frequency: 'month' }] },
};

export const FormStateFixture: FormState = {
  activeStep: 'WIZARD',
  currentScreenId: 'setupHousehold',
  isValid: false,
  schemaVersion: '1.0',
  data: {
    setup: { aantalMensen: 3, aantalVolwassen: 2 },
    household: HouseholdFixture,
    finance: FinanceFixture,
  },
};
EOF

# 2. Mocks (Generators)
cat > src/test-utils/mocks.ts << 'EOF'
import { Member } from '@domain/household';

export function makeMember(index = 1, type: 'adult' | 'child' = 'adult', overrides?: Partial<Member>): Member {
  const id = `${type}-${index}`;
  return {
    entityId: overrides?.entityId ?? id,
    fieldId: overrides?.fieldId ?? `member-${id}`,
    memberType: overrides?.memberType ?? type,
    firstName: overrides?.firstName ?? `${type}`,
    lastName: overrides?.lastName ?? `${index}`,
    gender: overrides?.gender,
    dateOfBirth: overrides?.dateOfBirth,
  };
}

export function makeMembers(count: number, type: 'adult' | 'child' = 'adult'): Member[] {
  return Array.from({ length: count }, (_, i) => makeMember(i + 1, type));
}

export function makeMixedHousehold(adults = 2, children = 0): Member[] {
  return [...makeMembers(adults, 'adult'), ...makeMembers(children, 'child')];
}
EOF

# 3. State Helper
cat > src/test-utils/state.ts << 'EOF'
import { FormState } from '@shared-types/form';

export function makePhoenixState(
  overrides?: Partial<Omit<FormState, 'data'>> & { data?: Partial<FormState['data']> }
): FormState {
  const base: FormState = {
    schemaVersion: '1.0',
    activeStep: 'LANDING',
    currentScreenId: 'setupHousehold',
    isValid: false,
    data: {
      setup: {},
      household: { members: [] },
      finance: { income: { items: [] }, expenses: { items: [] } },
    },
  };

  return {
    ...base,
    ...overrides,
    data: { ...base.data, ...overrides?.data },
  } as FormState;
}
EOF

# 4. Render (De enige echte render functie)
cat > src/test-utils/render.tsx << 'EOF'
import * as React from 'react';
import { render as rtlRender, RenderOptions } from '@testing-library/react-native';
import { ThemeProvider } from '@app/context/ThemeContext';
import { FormContext } from '@app/context/FormContext';
import { FormStateFixture } from './fixtures';
import { FormState } from '@shared-types/form';

// Mock Safe Area
jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

type ProvidersProps = {
  children: React.ReactNode;
  state?: FormState;
  dispatch?: React.Dispatch<any>;
};

export function Providers({ children, state, dispatch }: ProvidersProps) {
  const value = {
    state: state ?? FormStateFixture,
    dispatch: dispatch ?? jest.fn(),
  };
  return (
    <ThemeProvider>
      <FormContext.Provider value={value}>{children}</FormContext.Provider>
    </ThemeProvider>
  );
}

export function renderWithProviders(
  ui: React.ReactElement,
  options?: RenderOptions & { state?: FormState; dispatch?: React.Dispatch<any> }
) {
  const { state, dispatch, ...rest } = options ?? {};
  return rtlRender(
    <Providers state={state} dispatch={dispatch}>{ui}</Providers>, 
    rest
  );
}

// Alias voor backward compatibility
export const renderWithState = renderWithProviders;
EOF

# 5. Opruimen van overbodige bestanden
rm src/test-utils/rtl.tsx src/test-utils/renderHook.tsx src/test-utils/renderWithState.tsx src/test-utils/wrapper.tsx 2>/dev/null || true

echo "✅ Test Utils geconsolideerd."
echo "👉 Update je imports in tests naar '@test-utils/render' en '@test-utils/state'."
```

### Uitvoeren

1.  `chmod +x consolidate_test_utils.sh`
2.  `./consolidate_test_utils.sh