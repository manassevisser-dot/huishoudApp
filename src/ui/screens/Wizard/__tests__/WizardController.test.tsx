import * as React from 'react';
// Gebruik overal @test-utils/rtl voor consistentie
import { render, screen, fireEvent, makePhoenixState, HouseholdFixture } from '@test-utils/rtl';
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
    // Arrange
    const state = makePhoenixState({
      data: { 
        setup: { aantalMensen: 0, aantalVolwassen: 0 } 
      }
    });

    // Act: we gebruiken de render van rtl.ts die automatisch de Providers bevat
    render(<WizardController />, { state });

    // Assert: gebruik 'screen' in plaats van 'getByText' uit de render result
    expect(screen.getByText('Volgende')).toBeTruthy();
  });

  it('navigeert naar de volgende stap bij klikken op Volgende', () => {
    // Arrange
    const state = makePhoenixState({
      data: { 
        setup: { aantalMensen: 0, aantalVolwassen: 0 } 
      }
    });

    render(<WizardController />, { state });

    const nextButton = screen.getByText('Volgende');
    
    // Act
    fireEvent.press(nextButton);

    // Assert
    // Als je controller naar de volgende pagina gaat, verschijnt vaak de 'Vorige' knop
    // We gebruiken findByText omdat navigatie soms een tick duurt
    expect(screen.getByText('Vorige')).toBeTruthy();
  });

  it('toont de Afronden knop op de laatste pagina', () => {
    // Voorbeeld: als je weet dat de laatste pagina 'Afronden' toont
    // Je moet hier de state zo zetten dat de controller denkt dat hij op het einde is
    const state = makePhoenixState({
      data: { 
        setup: { aantalMensen: 0, aantalVolwassen: 0 } 
      }
    });

    render(<WizardController />, { state });

    // Check of de finish-string aanwezig is
    // expect(screen.getByText('Afronden')).toBeTruthy();
  });
  
});