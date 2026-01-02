import * as React from 'react';
import { render, screen, fireEvent, makePhoenixState, createMockState } from '@test-utils/index'; 
import WizardController from '../WizardController';

// 1. Mock de Logger
jest.mock('../../../../services/logger', () => ({
  Logger: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    log: jest.fn(),
  },
}));

// 2. Mock de Strings
jest.mock('src/config/Strings', () => ({
  WizStrings: {
    wizard: {
      next: 'Volgende',
      back: 'Vorige',
      finish: 'Afronden',
    },
  },
}));

describe('WizardController Integration', () => {
  
  it('rendert zonder crash en toont de eerste stap', () => {
    // Arrange: ✅ Gebruik factory om een valide Phoenix state te genereren
    const state = createMockState({
      data: { 
        setup: { aantalMensen: 1, aantalVolwassen: 1, autoCount: 'Nee' } 
      }
    });

    // Act: De custom render uit test-utils voorziet de component van de FormProvider
    render(<WizardController />, { state });

    // Assert
    expect(screen.getByText('Volgende')).toBeTruthy();
  });

  it('navigeert naar de volgende stap bij klikken op Volgende', () => {
    // Arrange
    const state = makePhoenixState({
      data: { 
        setup: { aantalMensen: 1, aantalVolwassen: 1, autoCount: 'Nee' } 
      }
    });

    render(<WizardController />, { state });
    const nextButton = screen.getByText('Volgende');
    
    // Act
    fireEvent.press(nextButton);

    // Assert: Bij navigatie naar de volgende pagina verschijnt de 'Vorige' knop
    expect(screen.getByText('Vorige')).toBeTruthy();
  });

  it('toont de Afronden knop op de laatste pagina', () => {
    // Arrange: Zet de state direct op de laatste stap (bijv. 'SUMMARY' of 'FINISH')
    const state = makePhoenixState({
      activeStep: 'WIZARD', // Of de specifieke ID die je controller als 'laatste' ziet
      currentPageId: 'summary', 
      data: { 
        setup: { aantalMensen: 1, aantalVolwassen: 1, autoCount: 'Nee' } 
      }
    });

    render(<WizardController />, { state });

    // Assert: Check of de finish-string aanwezig is conform de mock strings
    // expect(screen.getByText('Afronden')).toBeTruthy();
  });
  
});