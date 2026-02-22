// src/ui/sections/FieldRenderer.test.tsx

import { render } from 'src/test-utils/render/renderers'; // Jouw custom renderer met providers
import { FieldRenderer } from '@ui/sections/FieldRenderer';
import { PRIMITIVE_TYPES } from '@domain/registry/PrimitiveRegistry';

describe('FieldRenderer', () => {
  it('renders the value from the viewModel correctly', () => {
    // 1. Arrange: Maak een mock ViewModel die past bij de interface
    const mockViewModel = {
      sectionType: PRIMITIVE_TYPES.TEXT,
      fieldId: 'test-field',
      value: 'Gevalideerde waarde',
      label: 'Test Label',
      onValueChange: jest.fn(),
    };

    // 2. Act: Render met de custom 'render' die Theme/Master providers bevat
    const { getByDisplayValue } = render(
      <FieldRenderer viewModel={mockViewModel as any} />
    );

    // 3. Assert: Controleer of de waarde correct in de input staat
    expect(getByDisplayValue('Gevalideerde waarde')).toBeTruthy();
  });

  it('handles empty values gracefully', () => {
    const emptyViewModel = {
      sectionType: PRIMITIVE_TYPES.TEXT,
      fieldId: 'empty',
      value: '', // Simuleer lege waarde
      label: 'Leeg Veld',
      onValueChange: jest.fn(),
    };

    const { getByDisplayValue } = render(
      <FieldRenderer viewModel={emptyViewModel as any} />
    );

    // Check of de input inderdaad leeg is
    expect(getByDisplayValue('')).toBeTruthy();
  });

  it('moet null retourneren bij een onbekend sectionType', () => {
    const unknownViewModel = {
      sectionType: 'INVALID_TYPE',
      fieldId: 'error-field'
    };
  
    // 1. Render de section met de 'foute' data
    const { toJSON, queryByTestId } = render(
      <FieldRenderer viewModel={unknownViewModel as any} />
    );
  
    // 2. Controleer of de output daadwerkelijk leeg is
    expect(toJSON()).toBeNull();
  
    // 3. Extra zekerheid: check dat een bekend ID NIET in de boom staat
    // Gebruik queryBy... (en niet getBy...) want queryBy geeft null terug i.p.v. een error
    expect(queryByTestId('error-field')).toBeNull();
  });
});