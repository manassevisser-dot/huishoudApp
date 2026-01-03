#!/bin/bash
set -e

echo "🏗️ Herstel Operatie: Renderers & LandingScreen..."

# ==============================================================================
# 1. RENDERERS (De brug tussen Test en Providers)
# ==============================================================================
# We zorgen dat renderWithState de Providers gebruikt die we eerder gefixt hebben.
cat > src/test-utils/render/renderers.tsx << 'EOF'
import React from 'react';
import { 
  render as rtlRender, 
  RenderOptions 
} from '@testing-library/react-native';
import { Providers } from './providers';
import { FormState } from '@shared-types/form';

// Custom Render functie die automatisch Providers toevoegt
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

// Aliases voor backward compatibility met je bestaande tests
export const renderWithState = renderWithProviders;
export const render = renderWithProviders;

// Re-export alles van RTL zodat je maar 1 import nodig hebt
export * from '@testing-library/react-native';
EOF

# ==============================================================================
# 2. LANDING SCREEN (De Echte Component)
# ==============================================================================
# We zorgen voor een schone implementatie met testID's en correcte hooks.
cat > src/ui/screens/Wizard/LandingScreen.tsx << 'EOF'
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppStyles } from '@ui/styles/useAppStyles';
import { useForm } from '@app/context/FormContext';

interface Props {
  onSignup?: () => void; // Optionele prop voor testen
  onSignin?: () => void;
}

const LandingScreen: React.FC<Props> = ({ onSignup, onSignin }) => {
  const { styles } = useAppStyles();
  const insets = useSafeAreaInsets();
  
  // We halen dispatch veilig op
  const { dispatch } = useForm();

  const handleStart = () => {
    if (onSignup) onSignup();
    dispatch({ type: 'SET_STEP', payload: 'WIZARD' });
  };

  const handleLogin = () => {
    if (onSignin) onSignin();
    dispatch({ type: 'SET_STEP', payload: 'DASHBOARD' });
  };

  return (
    <View 
      style={[styles.container, { paddingBottom: Math.max(20, (insets?.bottom || 0) + 8) }]}
    >
      <View style={styles.pageContainer}>
        <Text style={styles.pageTitle}>Welkom</Text>
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
# 3. DE TEST (Terug naar Integratie)
# ==============================================================================
# We verwijderen de lokale mocks en importeren de echte bestanden.
cat > src/__tests__/WAI009_FocusManagement.test.tsx << 'EOF'
import React from 'react';
import { fireEvent } from '@testing-library/react-native';

// 1. Importeer de ECHTE component
import LandingScreen from '../ui/screens/Wizard/LandingScreen';

// 2. Importeer de ECHTE renderer (die Providers gebruikt)
import { renderWithState } from '../test-utils/render/renderers';
import { makePhoenixState } from '../test-utils/state';

// 3. Mock alleen de randzaken (Styles & Safe Area)
jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

jest.mock('../ui/styles/useAppStyles', () => ({
  useAppStyles: () => ({
    styles: new Proxy({}, { get: () => ({}) }), // Geeft lege objecten terug
    colors: { background: '#fff' },
    Tokens: { space: { sm: 8 } }
  }),
}));

describe('WAI009 Focus Management (Real Integration)', () => {
  const mockDispatch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the real LandingScreen correctly', () => {
    const state = makePhoenixState({ activeStep: 'LANDING' });
    
    // Hier testen we nu de hele keten: Renderer -> Provider -> Component
    const { getByText, getByTestId } = renderWithState(
      <LandingScreen />, 
      { state, dispatch: mockDispatch }
    );

    expect(getByText(/Welkom/i)).toBeTruthy();
    expect(getByTestId('btn-aanmelden')).toBeTruthy();
  });

  it('dispatches SET_STEP when "Aanmelden" is pressed', () => {
    const state = makePhoenixState({ activeStep: 'LANDING' });
    
    const { getByTestId } = renderWithState(
      <LandingScreen />, 
      { state, dispatch: mockDispatch }
    );

    const btn = getByTestId('btn-aanmelden');
    fireEvent.press(btn);

    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'SET_STEP', payload: 'WIZARD' })
    );
  });
});
EOF

echo "✅ Bestanden hersteld naar echte implementatie."
echo "👉 Draai nu: npm test src/__tests__/WAI009_FocusManagement.test.tsx"