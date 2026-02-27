// src/ui/entries/DynamicEntry.test.tsx
import React from 'react';
import { render } from '@testing-library/react-native';
import { DynamicEntry } from './entries';
import { PRIMITIVE_TYPES } from '@ui/kernel';
import type { RenderEntryVM } from '@app/orchestrators/MasterOrchestrator';

// Mocks voor alle entry componenten
// Vervang de mocks (regels 7-25) met:

jest.mock('./entries.components', () => ({
  MoneyEntry: jest.fn(({ viewModel }) => {
    const { View } = require('react-native');
    return <View testID="money-entry" {...viewModel} />;
  }),
  DateEntry: jest.fn(({ viewModel }) => {
    const { View } = require('react-native');
    return <View testID="date-entry" {...viewModel} />;
  }),
  TextEntry: jest.fn(({ viewModel }) => {
    const { View } = require('react-native');
    return <View testID="text-entry" {...viewModel} />;
  }),
  NumberEntry: jest.fn(({ viewModel }) => {
    const { View } = require('react-native');
    return <View testID="number-entry" {...viewModel} />;
  }),
  CounterEntry: jest.fn(({ viewModel }) => {
    const { View } = require('react-native');
    return <View testID="counter-entry" {...viewModel} />;
  }),
  ToggleEntry: jest.fn(({ viewModel }) => {
    const { View } = require('react-native');
    return <View testID="toggle-entry" {...viewModel} />;
  }),
  ChipGroupEntry: jest.fn(({ viewModel }) => {
    const { View } = require('react-native');
    return <View testID="chipgroup-entry" {...viewModel} />;
  }),
  RadioEntry: jest.fn(({ viewModel }) => {
    const { View } = require('react-native');
    return <View testID="radio-entry" {...viewModel} />;
  }),
  LabelEntry: jest.fn(({ viewModel }) => {
    const { View } = require('react-native');
    return <View testID="label-entry" {...viewModel} />;
  }),
  ActionEntry: jest.fn(({ viewModel }) => {
    const { View } = require('react-native');
    return <View testID="action-entry" {...viewModel} />;
  }),
}));

jest.mock('@ui/primitives/primitives', () => ({
  DynamicPrimitive: jest.fn(({ primitiveType, props }) => {
    const { View } = require('react-native');
    return <View testID={`primitive-${primitiveType}`} {...props} />;
  }),
}));

jest.mock('./entry.mappers', () => ({
  toCurrencyViewModel: jest.fn((vm) => ({ ...vm, mapped: 'currency' })),
  toDateViewModel: jest.fn((vm) => ({ ...vm, mapped: 'date' })),
  toTextViewModel: jest.fn((vm) => ({ ...vm, mapped: 'text' })),
  toNumberViewModel: jest.fn((vm) => ({ ...vm, mapped: 'number' })),
  toCounterViewModel: jest.fn((vm) => ({ ...vm, mapped: 'counter' })),
  toToggleViewModel: jest.fn((vm) => ({ ...vm, mapped: 'toggle' })),
  toChipGroupViewModel: jest.fn((vm) => ({ ...vm, mapped: 'chipgroup' })),
  toRadioViewModel: jest.fn((vm) => ({ ...vm, mapped: 'radio' })),
  toLabelViewModel: jest.fn((vm) => ({ ...vm, mapped: 'label' })),
  toActionViewModel: jest.fn((vm) => ({ ...vm, mapped: 'action' })),
}));

describe('DynamicEntry', () => {
  const mockOnChange = jest.fn();

  const baseEntry: RenderEntryVM = {
    entryId: 'test-entry',
    fieldId: 'test-field',
    label: 'Test Label',
    primitiveType: PRIMITIVE_TYPES.TEXT,
    value: 'test value',
    onChange: mockOnChange,
    isVisible: true,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return null when isVisible is false', () => {
    const { queryByTestId } = render(<DynamicEntry entry={{ ...baseEntry, isVisible: false }} />);
    expect(queryByTestId('text-entry')).toBeNull();
    expect(queryByTestId('money-entry')).toBeNull();
    expect(queryByTestId('date-entry')).toBeNull();
    expect(queryByTestId('number-entry')).toBeNull();
    expect(queryByTestId('counter-entry')).toBeNull();
    expect(queryByTestId('toggle-entry')).toBeNull();
    expect(queryByTestId('chipgroup-entry')).toBeNull();
    expect(queryByTestId('radio-entry')).toBeNull();
    expect(queryByTestId('label-entry')).toBeNull();
    expect(queryByTestId('action-entry')).toBeNull();
  });

  describe('primitive type rendering', () => {
    const testCases = [
      {
        type: PRIMITIVE_TYPES.CURRENCY,
        component: 'MoneyEntry',
        mapper: 'toCurrencyViewModel',
        testId: 'money-entry',
      },
      {
        type: PRIMITIVE_TYPES.DATE,
        component: 'DateEntry',
        mapper: 'toDateViewModel',
        testId: 'date-entry',
      },
      {
        type: PRIMITIVE_TYPES.TEXT,
        component: 'TextEntry',
        mapper: 'toTextViewModel',
        testId: 'text-entry',
      },
      {
        type: PRIMITIVE_TYPES.NUMBER,
        component: 'NumberEntry',
        mapper: 'toNumberViewModel',
        testId: 'number-entry',
      },
      {
        type: PRIMITIVE_TYPES.COUNTER,
        component: 'CounterEntry',
        mapper: 'toCounterViewModel',
        testId: 'counter-entry',
      },
      {
        type: PRIMITIVE_TYPES.TOGGLE,
        component: 'ToggleEntry',
        mapper: 'toToggleViewModel',
        testId: 'toggle-entry',
      },
      {
        type: PRIMITIVE_TYPES.CHIP_GROUP,
        component: 'ChipGroupEntry',
        mapper: 'toChipGroupViewModel',
        testId: 'chipgroup-entry',
      },
      {
        type: PRIMITIVE_TYPES.CHIP_GROUP_MULTIPLE,
        component: 'ChipGroupEntry',
        mapper: 'toChipGroupViewModel',
        testId: 'chipgroup-entry',
      },
      {
        type: PRIMITIVE_TYPES.RADIO,
        component: 'RadioEntry',
        mapper: 'toRadioViewModel',
        testId: 'radio-entry',
      },
      {
        type: PRIMITIVE_TYPES.LABEL,
        component: 'LabelEntry',
        mapper: 'toLabelViewModel',
        testId: 'label-entry',
      },
      {
        type: PRIMITIVE_TYPES.ACTION,
        component: 'ActionEntry',
        mapper: 'toActionViewModel',
        testId: 'action-entry',
      },
    ];

    testCases.forEach(({ type, component, mapper, testId }) => {
      it(`should render ${component} for primitive type ${type}`, () => {
        const entry = { ...baseEntry, primitiveType: type };
        const { getByTestId } = render(<DynamicEntry entry={entry} />);

        expect(getByTestId(testId)).toBeTruthy();

        // Check dat de juiste mapper is aangeroepen
        const mapperMock = jest.requireMock('./entry.mappers')[mapper];
        expect(mapperMock).toHaveBeenCalledWith(entry);
      });
    });

    it('should fallback to DynamicPrimitive for unknown primitive types', () => {
      const unknownType = 'UNKNOWN_TYPE';
      const entry = { ...baseEntry, primitiveType: unknownType };
      const { getByTestId } = render(<DynamicEntry entry={entry} />);

      expect(getByTestId(`primitive-${unknownType}`)).toBeTruthy();

      const { DynamicPrimitive } = jest.requireMock('@ui/primitives/primitives');

      // Inspecteer de eerste call
      const call = (DynamicPrimitive as jest.Mock).mock.calls[0];
      expect(call[0]).toEqual({
        primitiveType: unknownType,
        props: { value: entry.value, onAction: entry.onChange },
      });
      // Het tweede argument kan genegeerd worden
    });
  });

  describe('memoization', () => {
    it('should memoize component to prevent unnecessary re-renders', () => {
      const { rerender } = render(<DynamicEntry entry={baseEntry} />);

      // Eerste render
      expect(jest.requireMock('./entries.components').TextEntry).toHaveBeenCalledTimes(1);

      // Re-render met zelfde props (zou memoized moeten zijn)
      rerender(<DynamicEntry entry={baseEntry} />);
      expect(jest.requireMock('./entries.components').TextEntry).toHaveBeenCalledTimes(1);

      // Re-render met andere props
      rerender(<DynamicEntry entry={{ ...baseEntry, value: 'new value' }} />);
      expect(jest.requireMock('./entries.components').TextEntry).toHaveBeenCalledTimes(2);
    });
  });

  describe('entry data transformation', () => {
    it('should pass mapped viewModel to entry components', () => {
      const entry = { ...baseEntry, primitiveType: PRIMITIVE_TYPES.TEXT };
      render(<DynamicEntry entry={entry} />);

      const { TextEntry } = jest.requireMock('./entries.components');

      // Inspecteer de eerste call
      const call = (TextEntry as jest.Mock).mock.calls[0];
      expect(call[0]).toEqual({
        viewModel: expect.objectContaining({ mapped: 'text' }),
      });
    });

    it('should pass all original entry properties through mappers', () => {
      const entry = {
        ...baseEntry,
        primitiveType: PRIMITIVE_TYPES.CURRENCY,
        extraProp: 'should-be-preserved',
      };
      render(<DynamicEntry entry={entry as any} />);

      const { toCurrencyViewModel } = jest.requireMock('./entry.mappers');
      expect(toCurrencyViewModel).toHaveBeenCalledWith(
        expect.objectContaining({
          entryId: 'test-entry',
          fieldId: 'test-field',
          label: 'Test Label',
          value: 'test value',
          extraProp: 'should-be-preserved',
        }),
      );
    });
  });

  describe('edge cases', () => {
    it('should handle undefined onChange gracefully', () => {
      const entry = {
        ...baseEntry,
        primitiveType: PRIMITIVE_TYPES.ACTION,
        onChange: undefined,
      };

      expect(() => render(<DynamicEntry entry={entry as any} />)).not.toThrow();
    });

    it('should handle null value', () => {
      const entry = {
        ...baseEntry,
        primitiveType: PRIMITIVE_TYPES.TEXT,
        value: null,
      };

      const { getByTestId } = render(<DynamicEntry entry={entry as any} />);
      expect(getByTestId('text-entry')).toBeTruthy();
    });

    it('should return null when isVisible is undefined', () => {
      const entry = {
        ...baseEntry,
        isVisible: undefined,
      };

      const { queryByTestId } = render(<DynamicEntry entry={entry as any} />);
      expect(queryByTestId('text-entry')).toBeNull();
    });

    it('should render when isVisible is true', () => {
      const entry = {
        ...baseEntry,
        isVisible: true,
      };

      const { getByTestId } = render(<DynamicEntry entry={entry as any} />);
      expect(getByTestId('text-entry')).toBeTruthy();
    });
});
    describe('integration with primitive types', () => {
      it('should handle all PRIMITIVE_TYPES from registry', () => {
        const allTypes = Object.values(PRIMITIVE_TYPES);

        allTypes.forEach((type) => {
          const entry = { ...baseEntry, primitiveType: type };
          expect(() => render(<DynamicEntry entry={entry} />)).not.toThrow();
        });
      });

      it('should pass correct props to DynamicPrimitive for fallback', () => {
        const entry = {
          ...baseEntry,
          primitiveType: 'custom-type',
          onChange: mockOnChange,
        };

        render(<DynamicEntry entry={entry} />);

        const { DynamicPrimitive } = jest.requireMock('@ui/primitives/primitives');

        // Inspecteer de eerste call
        const call = (DynamicPrimitive as jest.Mock).mock.calls[0];
        expect(call[0]).toEqual({
          primitiveType: 'custom-type',
          props: { value: 'test value', onAction: mockOnChange },
        });
    }); 
  });   
}); 

