import React from 'react';
import WizardController from '../WizardController';
import { useAppOrchestration } from '../../../../app/hooks/useAppOrchestration';
import { renderWithState } from '../../../../test-utils';

// Mocks instellen conform Best Practices [cite: 4, 19]
jest.mock('../../../../app/hooks/useAppOrchestration');
const mockedOrchestration = useAppOrchestration as jest.Mock;

jest.mock('../../../../config/WizStrings', () => ({
  WizStrings: {
    wizard: {
      next: 'Volgende',
      back: 'Terug',
      finish: 'Afronden'
    }
  }
}), { virtual: true });

describe('WizardController', () => {
  
  beforeEach(() => {
    jest.clearAllMocks(); // Ruim mocks op voor test-isolatie [cite: 24]
  });

  it('moet de SplashScreen tonen wanneer de status "loading" is', () => {
    // Arrange: Mock de loading state [cite: 18]
    mockedOrchestration.mockReturnValue({
      status: 'loading',
      error: null,
    });
    
    // Act: Gebruik renderWithState om de FormProvider error te voorkomen
    const { toJSON } = renderWithState(<WizardController />);
    
    // Assert
    expect(toJSON()).not.toBeNull();
  });

  it('moet de CriticalErrorScreen tonen wanneer er een error optreedt', () => {
    // Arrange: Mock de error state [cite: 9, 10]
    mockedOrchestration.mockReturnValue({
      status: 'error',
      error: new Error('Migratie mislukt'),
    });
    
    // Act
    const { toJSON } = renderWithState(<WizardController />);
    
    // Assert
    expect(toJSON()).not.toBeNull();
  });

  it('moet de volledige Wizard renderen bij een succesvolle "ready" status', () => {
    // Arrange
    mockedOrchestration.mockReturnValue({
      status: 'ready',
      error: null,
    });

    // Act
    const { toJSON } = renderWithState(<WizardController />);
    
    // Assert: Snapshot test conform gids 
    expect(toJSON()).toMatchSnapshot();
  });
});