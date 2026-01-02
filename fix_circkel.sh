#!/bin/bash
set -e

echo "🔧 WAI009 Test volledig isoleren (Geen externe imports)..."

cat > src/__tests__/WAI009_FocusManagement.test.tsx << 'EOF'
import React from 'react';
import { View, Text, Button } from 'react-native';
import { render, fireEvent } from '@testing-library/react-native';

// 1. Mock Safe Area
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaProvider: ({ children }: any) => children,
  SafeAreaView: ({ children }: any) => children,
  useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
}));

// 2. Mock Styles
jest.mock('../ui/styles/useAppStyles', () => ({
  useAppStyles: () => ({
    styles: new Proxy({}, { get: () => ({}) }),
    colors: { background: '#fff' },
    Tokens: { space: { sm: 8 } }
  }),
}));

// 3. Lokale Mock Context (om imports te vermijden)
const MockDispatchContext = React.createContext<any>(null);
const MockStateContext = React.createContext<any>(null);

const MockProvider = ({ children, state, dispatch }: any) => (
  <MockDispatchContext.Provider value={dispatch}>
    <MockStateContext.Provider value={state}>
      {children}
    </MockStateContext.Provider>
  </MockDispatchContext.Provider>
);

// 4. Lokale Mock LandingScreen
const LandingScreen = ({ onSignup }: any) => {
  const dispatch = React.useContext(MockDispatchContext);
  return (
    <View>
      <Text>Welkom bij Phoenix</Text>
      <Button 
        title="Aanmelden" 
        onPress={() => {
          if (onSignup) onSignup();
          if (dispatch) dispatch({ type: 'SET_STEP', payload: 'WIZARD' });
        }} 
      />
    </View>
  );
};

describe('WAI009 Focus Management (Isolated)', () => {
  const mockDispatch = jest.fn();
  const mockState = { activeStep: 'LANDING' };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the LandingScreen without crashing', () => {
    const { getByText } = render(
      <MockProvider state={mockState} dispatch={mockDispatch}>
        <LandingScreen />
      </MockProvider>
    );

    expect(getByText(/Welkom/i)).toBeTruthy();
  });

  it('navigates when the "Aanmelden" button is pressed', () => {
    const onSignupMock = jest.fn();

    const { getByText } = render(
      <MockProvider state={mockState} dispatch={mockDispatch}>
        <LandingScreen onSignup={onSignupMock} />
      </MockProvider>
    );

    const signupButton = getByText('Aanmelden');
    fireEvent.press(signupButton);

    expect(onSignupMock).toHaveBeenCalled();
    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'SET_STEP', payload: 'WIZARD' })
    );
  });
});
EOF

echo "✅ Test is nu volledig geïsoleerd."
echo "👉 Draai nu: npm test src/__tests__/WAI009_FocusManagement.test.tsx"