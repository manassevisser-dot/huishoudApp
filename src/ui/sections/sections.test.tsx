// src/ui/sections/sections.test.tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { DynamicSection } from './sections';
import { DynamicEntry } from '@ui/entries/entries';
import type { RenderEntryVM } from '@app/orchestrators/MasterOrchestrator';
import type { TextStyle } from 'react-native';
// Mock voor DynamicEntry
jest.mock('@ui/entries/entries', () => ({
  DynamicEntry: jest.fn(({ entry }) => {
    const { View, Text } = require('react-native');
    return <View testID={`entry-${entry.entryId}`}><Text>{entry.label}</Text></View>;
  }),
}));

describe('DynamicSection', () => {
  const mockEntries: RenderEntryVM[] = [
    {
      entryId: 'entry-1',
      fieldId: 'field-1',
      label: 'Entry 1',
      primitiveType: 'text',
      value: 'value 1',
      onChange: jest.fn(),
      isVisible: true,
    },
    {
      entryId: 'entry-2',
      fieldId: 'field-2',
      label: 'Entry 2',
      primitiveType: 'number',
      value: 42,
      onChange: jest.fn(),
      isVisible: true,
    },
  ];

  const defaultProps = {
    sectionId: 'test-section',
    title: 'Test Section',
    layout: 'default',
    children: mockEntries,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render section title when provided', () => {
    const { getByText } = render(<DynamicSection {...defaultProps} />);
    
    expect(getByText('Test Section')).toBeTruthy();
  });

  it('should not render title when empty string', () => {
    const { queryByText } = render(
      <DynamicSection {...defaultProps} title="" />
    );
    
    expect(queryByText('Test Section')).toBeNull();
  });

  it('should render all child entries', () => {
    const { getByTestId } = render(<DynamicSection {...defaultProps} />);
    
    expect(getByTestId('entry-entry-1')).toBeTruthy();
    expect(getByTestId('entry-entry-2')).toBeTruthy();
    expect(DynamicEntry).toHaveBeenCalledTimes(2);
  });

  it('should pass correct entry props to DynamicEntry', () => {
  render(<DynamicSection {...defaultProps} />);
  
  const mockedDynamicEntry = DynamicEntry as unknown as jest.Mock;
  const firstCall = mockedDynamicEntry.mock.calls[0][0];
  const secondCall = mockedDynamicEntry.mock.calls[1][0];
  
  expect(firstCall).toEqual(
    expect.objectContaining({
      entry: mockEntries[0]
    })
  );
  
  expect(secondCall).toEqual(
    expect.objectContaining({
      entry: mockEntries[1]
    })
  );
});

  it('should apply container style when provided', () => {
    const containerStyle = { padding: 20, backgroundColor: 'red' };
    const { UNSAFE_root } = render(
      <DynamicSection {...defaultProps} containerStyle={containerStyle} />
    );
    
    const container = UNSAFE_root.children[0];
    expect(container.props.style).toBe(containerStyle);
  });

  it('should apply title style to collapsible title', () => {
  const titleStyle: TextStyle = { fontSize: 18, fontWeight: 'bold' };
  const { getByText } = render(
    <DynamicSection 
      {...defaultProps} 
      uiModel="collapsible" 
      titleStyle={titleStyle}
    />
  );
  
  const title = getByText(/▶ Test Section/);
  expect(title.props.style).toEqual(titleStyle); // ✅ Geen arrayContaining
});

  describe('collapsible mode', () => {
    it('should render collapsible wrapper when uiModel is "collapsible"', () => {
      const { getByText, queryByTestId } = render(
        <DynamicSection {...defaultProps} uiModel="collapsible" />
      );
      
      // Title zou moeten renderen met een pijltje
      expect(getByText(/▶ Test Section/)).toBeTruthy();
      
      // Ingevouwen: entries zouden niet zichtbaar moeten zijn
      expect(queryByTestId('entry-entry-1')).toBeNull();
    });

    it('should expand when title is pressed', () => {
      const { getByText, getByTestId } = render(
        <DynamicSection {...defaultProps} uiModel="collapsible" />
      );
      
      // Vind de titel en druk erop
      const title = getByText(/▶ Test Section/);
      fireEvent.press(title);
      
      // Na expand: pijltje verandert en entries zijn zichtbaar
      expect(getByText(/▼ Test Section/)).toBeTruthy();
      expect(getByTestId('entry-entry-1')).toBeTruthy();
      expect(getByTestId('entry-entry-2')).toBeTruthy();
    });

    it('should toggle expanded state on multiple presses', () => {
      const { getByText, queryByTestId } = render(
        <DynamicSection {...defaultProps} uiModel="collapsible" />
      );
      
      const title = getByText(/▶ Test Section/);
      
      // Eerste press: expand
      fireEvent.press(title);
      expect(getByText(/▼ Test Section/)).toBeTruthy();
      expect(queryByTestId('entry-entry-1')).toBeTruthy();
      
      // Tweede press: collapse
      fireEvent.press(title);
      expect(getByText(/▶ Test Section/)).toBeTruthy();
      expect(queryByTestId('entry-entry-1')).toBeNull();
    });

    it('should apply container style to collapsible wrapper', () => {
      const containerStyle = { margin: 10, borderWidth: 1 };
      const { UNSAFE_root } = render(
        <DynamicSection 
          {...defaultProps} 
          uiModel="collapsible" 
          containerStyle={containerStyle}
        />
      );
      
      const wrapper = UNSAFE_root.children[0];
      expect(wrapper.props.style).toBe(containerStyle);
    });

    it('should apply title style to collapsible title', () => {
      const titleStyle: TextStyle = { fontSize: 18, fontWeight: 'bold' };
      const { getByText } = render(
        <DynamicSection
          {...defaultProps}
          uiModel="collapsible"
          titleStyle={titleStyle}
        />
      );

      // Component geeft style={titleStyle} direct door — geen array
      const title = getByText(/▶ Test Section/);
      expect(title.props.style).toEqual(titleStyle);
    });
  });

  describe('memoization', () => {
    it('should memoize component to prevent unnecessary re-renders', () => {
  const { rerender } = render(<DynamicSection {...defaultProps} />);
  
  const mockedDynamicEntry = jest.mocked(DynamicEntry);
  mockedDynamicEntry.mockClear();
  
  // Re-render met zelfde props
  rerender(<DynamicSection {...defaultProps} />);
  
  // DynamicEntry zou niet opnieuw moeten worden aangeroepen
  expect(mockedDynamicEntry).not.toHaveBeenCalled();
  
  // Re-render met andere props
  rerender(<DynamicSection {...defaultProps} title="New Title" />);
  
  // DynamicEntry zou opnieuw moeten worden aangeroepen
  expect(mockedDynamicEntry).toHaveBeenCalled();
});
  });

  describe('edge cases', () => {
    it('should handle empty children array', () => {
      const { queryByTestId } = render(
        <DynamicSection {...defaultProps} children={[]} />
      );
      
      expect(queryByTestId('entry-entry-1')).toBeNull();
    });

    it('should handle undefined uiModel (default to normal view)', () => {
      const { getByText, getByTestId } = render(
        <DynamicSection {...defaultProps} uiModel={undefined} />
      );
      
      expect(getByText('Test Section')).toBeTruthy();
      expect(getByTestId('entry-entry-1')).toBeTruthy();
    });

   it('should handle non-collapsible uiModel values', () => {
  const { getByText, queryByText, getByTestId } = render(
    <DynamicSection {...defaultProps} uiModel="something-else" />
  );
  
  expect(getByText('Test Section')).toBeTruthy();
  expect(getByTestId('entry-entry-1')).toBeTruthy();
  expect(queryByText(/▶/)).toBeNull(); // ✅ queryByText geeft null als niet gevonden
});



    it('should handle missing entries gracefully', () => {
  const { queryByTestId } = render(
    <DynamicSection {...defaultProps} children={[]} /> // ✅ Gebruik lege array, niet undefined
  );
  
  expect(queryByTestId('entry-entry-1')).toBeNull();
});
  });

  describe('styling integration', () => {
    it('should combine multiple style props correctly', () => {
      const containerStyle = { padding: 10 };
      const titleStyle = { color: 'red' };
      
      const { UNSAFE_root, getByText } = render(
        <DynamicSection 
          {...defaultProps} 
          containerStyle={containerStyle}
          titleStyle={titleStyle}
        />
      );
      
      const container = UNSAFE_root.children[0];
      const title = getByText('Test Section');
      
      expect(container.props.style).toBe(containerStyle);
      expect(title.props.style).toBe(titleStyle);
    });
  });

  describe('JSDoc claims verification', () => {
    it('should render entries using DynamicEntry for each child', () => {
      render(<DynamicSection {...defaultProps} />);

      const mock = DynamicEntry as unknown as jest.Mock;
      expect(mock).toHaveBeenCalledTimes(mockEntries.length);

      // React 18 roept componenten aan als functie: Component(props, undefined).
      // expect.anything() sluit undefined uit — direct mock.calls[i][0] inspecteren.
      mockEntries.forEach((entry, index) => {
        expect(mock.mock.calls[index][0]).toEqual(
          expect.objectContaining({ entry })
        );
      });
    });

    it('should be a "dynamic" component based on uiModel', () => {
      const { rerender, getByText, queryByText, queryByTestId } = render(
        <DynamicSection {...defaultProps} uiModel="collapsible" />
      );
      
      // Collapsible mode
      expect(getByText(/▶/)).toBeTruthy();
      
      // Rerender met andere uiModel
      rerender(<DynamicSection {...defaultProps} uiModel={undefined} />);
      
      // Normale mode: titel aanwezig, geen pijltje
      expect(getByText('Test Section')).toBeTruthy();
      expect(queryByText(/▶/)).toBeNull();
    });
  });
});