import React from 'react';
// We gebruiken de standaard render van RTL voor isolatie,
// OF je eigen render util als je de FormContext wilt testen.
import { render, fireEvent } from '@testing-library/react-native';
import LandingScreen from '@ui/screens/Wizard/LandingScreen';

// 1. MOCK REACT NATIVE -> VERWIJDERD (gebeurt in jest.setup.early.js)

// 2. Mock Hooks (Deze zijn prima voor ISOLATIE)
const mockDispatch = jest.fn();
jest.mock('@app/context/FormContext', () => ({
  useForm: () => ({ dispatch: mockDispatch }),
}));

jest.mock('@styles/useAppStyles', () => ({
  useAppStyles: () => ({
    styles: {}, // Je setup regelt StyleSheet.flatten al
    colors: {},
    Tokens: {},
  }),
}));

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ bottom: 0 }),
}));

describe('LandingScreen Isolation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders correctly', () => {
    const { getByText } = render(<LandingScreen />);
    expect(getByText(/Welkom/i)).toBeTruthy();
  });

  test('buttons work and dispatch actions', () => {
    const onSignup = jest.fn();
    const { getByText } = render(<LandingScreen onSignup={onSignup} />);

    // RTL's getByText werkt nu correct omdat StyleSheet.flatten bestaat
    fireEvent.press(getByText('Aanmelden'));

    // Check of de callback werkt
    expect(onSignup).toHaveBeenCalled();

    // Check of de Phoenix dispatch werkt
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'SET_STEP',
      payload: 'WIZARD',
    });
  });
});
