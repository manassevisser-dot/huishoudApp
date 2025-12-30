import * as React from 'react';
import { fireEvent, waitFor } from '@testing-library/react-native';
import MainNavigator from '@ui/navigation/MainNavigator';
import { renderWithState, Providers } from '@test-utils/renderWithState';
import { makePhoenixState } from '@test-utils/state';

describe('WAI-009: Focus Management (Project Eis 2025)', () => {
  
  it('focust het juiste invoerveld bij binnenkomst in de WIZARD', async () => {
    const landingState = makePhoenixState({ 
      status: 'ONBOARDING', // DIT IS DE KEY
      activeStep: 'LANDING' 
    });
    
    const { getByText, getByTestId, rerender } = renderWithState(<MainNavigator />, { 
      state: landingState 
    });
  
    // Nu zou hij NIET meer naar Dashboard mogen gaan.
    expect(getByText(/Welkom/i)).toBeTruthy();
  });

    expect(getByText(/Welkom/i)).toBeTruthy();

    // 2. DE SWITCH: Maak de nieuwe state voor de Wizard
    const wizardState = makePhoenixState({
      activeStep: 'WIZARD',
      currentPageId: '1setupHousehold', // Zorg dat dit ID matcht met je router
      status: 'IN_PROGRESS',
      data: {
        setup: { aantalMensen: 0, aantalVolwassen: 0 },
        household: { members: [] },
        finance: { income: { items: [] }, expenses: { items: [] } },
      },
    });

    // 3. HIER MOET HET: Gebruik de Providers wrapper om de context te behouden!
    // Als je dit niet doet, verliest hij de FormContext en krijg je die "must be used within FormProvider" error.
    rerender(
      <Providers state={wizardState}>
        <MainNavigator />
      </Providers>
    );

    // 4. VERVOLG: Wacht tot de nieuwe UI er is
    await waitFor(() => {
      // Zoek naar het label of de testID van de eerste wizard-stap
      expect(getByTestId('input-aantalMensen')).toBeTruthy();
    });

    const inputField = getByTestId('input-aantalMensen');
    // Check of autoFocus aan staat (belangrijk voor WAI-009 / Project Eis 2025)
    expect(inputField.props.autoFocus).toBe(true);
  });
});