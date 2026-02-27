// src/ui/navigation/MainNavigator.test.tsx
import React from 'react';
import { render } from '@testing-library/react-native';
import MainNavigator from './MainNavigator';
import { useFormState } from '@ui/providers/FormStateProvider';
import { UniversalScreen } from '../screens/UniversalScreen';

// Mocks
jest.mock('@ui/providers/FormStateProvider', () => ({
  useFormState: jest.fn(),
}));

jest.mock('../screens/UniversalScreen', () => ({
  UniversalScreen: jest.fn(() => null),
}));

describe('MainNavigator', () => {
  const mockActiveStep = 'TEST_SCREEN_ID';
  const universalScreenMock = UniversalScreen as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    (useFormState as jest.Mock).mockReturnValue({
      state: {
        activeStep: mockActiveStep,
      },
    });
  });

  it('should call useFormState to get activeStep', () => {
    render(<MainNavigator />);
    expect(useFormState).toHaveBeenCalledTimes(1);
  });

  it('should render UniversalScreen with correct screenId from state', () => {
    render(<MainNavigator />);
    
    const props = universalScreenMock.mock.calls[0][0];
    expect(props).toEqual({ screenId: mockActiveStep });
  });

  it('should update when activeStep changes', () => {
    const { rerender } = render(<MainNavigator />);
    
    // Eerste render
    let props = universalScreenMock.mock.calls[0][0];
    expect(props).toEqual({ screenId: mockActiveStep });
    
    // Simuleer state change met nieuwe activeStep
    const newActiveStep = 'NEW_SCREEN_ID';
    (useFormState as jest.Mock).mockReturnValue({
      state: {
        activeStep: newActiveStep,
      },
    });
    
    universalScreenMock.mockClear();
    rerender(<MainNavigator />);
    
    // UniversalScreen moet opnieuw aangeroepen worden met nieuwe screenId
    props = universalScreenMock.mock.calls[0][0];
    expect(props).toEqual({ screenId: newActiveStep });
  });

  describe('JSDoc claims verification', () => {
    it('should have no UI of its own (only renders UniversalScreen)', () => {
      const { toJSON } = render(<MainNavigator />);
      
      // Check dat er geen andere componenten worden gerenderd
      const props = universalScreenMock.mock.calls[0][0];
      expect(props).toEqual({ screenId: mockActiveStep });
      
      // Snapshot test
      expect(toJSON()).toMatchSnapshot();
    });

    it('should be a "router" that connects state to view', () => {
      render(<MainNavigator />);
      
      // Check dat de component alleen de verbinding maakt
      expect(useFormState).toHaveBeenCalled();
      const props = universalScreenMock.mock.calls[0][0];
      expect(props).toEqual({ screenId: mockActiveStep });
    });
  });

  describe('edge cases', () => {
    it('should handle undefined activeStep gracefully', () => {
      (useFormState as jest.Mock).mockReturnValue({
        state: {
          activeStep: undefined,
        },
      });
      
      render(<MainNavigator />);
      
      const props = universalScreenMock.mock.calls[0][0];
      expect(props).toEqual({ screenId: undefined });
    });

    it('should handle null activeStep gracefully', () => {
      (useFormState as jest.Mock).mockReturnValue({
        state: {
          activeStep: null,
        },
      });
      
      render(<MainNavigator />);
      
      const props = universalScreenMock.mock.calls[0][0];
      expect(props).toEqual({ screenId: null });
    });

    it('should handle missing state gracefully', () => {
      (useFormState as jest.Mock).mockReturnValue({
        state: {}, // Geen activeStep property
      });
      
      render(<MainNavigator />);
      
      const props = universalScreenMock.mock.calls[0][0];
      expect(props).toEqual({ screenId: undefined });
    });
  });

});