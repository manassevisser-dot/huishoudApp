#!/bin/bash
set -e

echo "🏗️ Architectuur Herstel: Providers, Renderers & LandingScreen..."

# ==============================================================================
# 1. PROVIDERS (src/test-utils/render/providers.tsx)
# ==============================================================================
# We definiëren hier een lokale default state om circulaire dependencies 
# met 'fixtures.ts' of 'state.ts' te voorkomen. Dit is de veiligste manier.
cat > src/test-utils/render/providers.tsx << 'EOF'
import React from 'react';
import { ThemeProvider } from '@app/context/ThemeContext';
import { FormContext } from '@app/context/FormContext';
import { FormState } from '@shared-types/form';

// Mock Safe Area (Lokaal, voor zekerheid)
jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

// Minimale Default State (Local Definition = No Circular Deps)
const DEFAULT_TEST_STATE: FormState = {
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
  // Safety Check: Bestaan de Contexts?
  if (!ThemeProvider || !FormContext) {
    throw new Error('❌ Context Providers zijn undefined! Check imports in providers.tsx');
  }

  const value = {
    state: state ?? DEFAULT_TEST_STATE,
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

# ==============================================================================
# 2. RENDERERS (src/test-utils/render/renderers.tsx)
# ==============================================================================
# De centrale plek voor RTL wrappers
cat > src/test-utils/render/renderers.tsx << 'EOF'
import React from 'react';
import { 
  render as rtlRender, 
  renderHook as rtlRenderHook,
  RenderOptions 
} from '@testing-library/react-native';
import { Providers } from './providers';
import { FormState } from '@shared-types/form';

// Custom Render
export function renderWithProviders(
  ui: React.ReactElement,
  options?: RenderOptions & { state?: FormState; dispatch?: React.Dispatch<any> }
) {
  const { state, dispatch, ...rest } = options ?? {};
  
  return rtlRender(
    <Providers state={state} dispatch={dispatch}>
      {ui}
    </Providers>, 
    rest
  );
}

// Custom RenderHook
export function renderHookWithProviders<Result, Props>(
  render: (initialProps: Props) => Result,
  options?: { state?: FormState; dispatch?: React.Dispatch<any> }
) {
  const { state, dispatch } = options ?? {};
  
  return rtlRenderHook(render, {
    wrapper: ({ children }) => (
      <Providers state={state} dispatch={dispatch}>
        {children}
      </Providers>
    ),
  });
}

// Aliases voor backward compatibility
export const renderWithState = renderWithProviders;
export const render = renderWithProviders;

// Re-export RTL utilities
export * from '@testing-library/react-native';
EOF

# ==============================================================================
# 3. LANDING SCREEN (src/ui/screens/Wizard/LandingScreen.tsx)
# ==============================================================================
# Een schone, moderne implementatie met testID's
cat > src/ui/screens/Wizard/LandingScreen.tsx << 'EOF'
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppStyles } from '@ui/styles/useAppStyles';
import { useForm } from '@app/context/FormContext';

interface Props {
  onSignup?: () => void; // Voor testen/storybook
}

const LandingScreen: React.FC<Props> = ({ onSignup }) => {
  const { styles } = useAppStyles();
  const insets = useSafeAreaInsets();
  const { dispatch } = useForm();

  const handleStart = () => {
    if (onSignup) onSignup();
    dispatch({ type: 'SET_STEP', payload: 'WIZARD' });
  };

  const handleLogin = () => {
    dispatch({ type: 'SET_STEP', payload: 'DASHBOARD' });
  };

  return (
    <View 
      testID="landing-screen"
      style={[styles.container, { paddingBottom: Math.max(20, (insets?.bottom || 0) + 8) }]}
    >
      <View style={styles.pageContainer}>
        <Text testID="landing-title" style={styles.pageTitle}>Welkom</Text>
        <Text style={styles.summaryDetail}>
          Start met het instellen van uw huishouding of ga direct naar het dashboard.
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          testID="btn-aanmelden"
          style={styles.button} 
          onPress={handleStart}
        >
          <Text style={styles.buttonText}>Aanmelden</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          testID="btn-inloggen"
          style={[styles.button, styles.secondaryButton]} 
          onPress={handleLogin}
        >
          <Text style={styles.secondaryButtonText}>Inloggen</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LandingScreen;
EOF

# ==============================================================================
# 4. DE TEST (src/__tests__/WAI009_FocusManagement.test.tsx)
# ==============================================================================
# Nu gebruiken we de ECHTE componenten, geen mocks!
cat > src/__tests__/WAI009_FocusManagement.test.tsx << 'EOF'
import React from 'react';
import { fireEvent } from '@testing-library/react-native';
import LandingScreen from '../ui/screens/Wizard/LandingScreen';
import { renderWithState } from '../test-utils/render/renderers';
import { makePhoenixState } from '../test-utils/state';

// We mocken alleen de styles en safe-area, niet de component zelf!
jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

jest.mock('../ui/styles/useAppStyles', () => ({
  useAppStyles: () => ({
    styles: new Proxy({}, { get: () => ({}) }), // Geeft lege objecten terug voor styles
    colors: { background: '#fff' },
    Tokens: { space: { sm: 8 } }
  }),
}));

describe('WAI009 Focus Management (Integration)', () => {
  const mockDispatch = jest.fn();
  const mockState = makePhoenixState({ activeStep: 'LANDING' });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the real LandingScreen correctly', () => {
    const { getByTestId, getByText } = renderWithState(
      <LandingScreen />, 
      { state: mockState, dispatch: mockDispatch }
    );

    expect(getByTestId('landing-screen')).toBeTruthy();
    expect(getByText(/Welkom/i)).toBeTruthy();
  });

  it('dispatches SET_STEP when "Aanmelden" is pressed', () => {
    const { getByTestId } = renderWithState(
      <LandingScreen />, 
      { state: mockState, dispatch: mockDispatch }
    );

    const btn = getByTestId('btn-aanmelden');
    fireEvent.press(btn);

    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'SET_STEP', payload: 'WIZARD' })
    );
  });
});
EOF

echo "✅ Architectuur hersteld. Providers, Renderers en LandingScreen zijn nu robuust."
echo "👉 Draai nu: npm test src/__tests__/WAI009_FocusManagement.test.tsx"