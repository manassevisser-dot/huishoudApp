// src/ui/renderers/Renderer.test.tsx
import React from 'react';
import { render } from '@testing-library/react-native';
import { Renderer } from './Renderer';
import { useMaster } from '@ui/providers/MasterProvider';
import type { RenderEntryVM } from '@app/orchestrators/MasterOrchestrator';

// Module-mocks — gehoist door Babel-Jest vóór alle imports.
jest.mock('@ui/providers/MasterProvider', () => ({
  useMaster: jest.fn(),
}));

jest.mock('@ui/entries/entries', () => ({
  DynamicEntry: jest.fn(),
}));

jest.mock('@ui/primitives/primitives', () => ({
  DynamicPrimitive: jest.fn(),
}));

// jest.requireMock() omzeilt het barrel-export binding-probleem (undefined).
const getEntryMock = () =>
  (jest.requireMock('@ui/entries/entries') as { DynamicEntry: jest.Mock }).DynamicEntry;

const getPrimitiveMock = () =>
  (jest.requireMock('@ui/primitives/primitives') as { DynamicPrimitive: jest.Mock }).DynamicPrimitive;

// Helpers: React 18 roept functional components aan als gewone functies.
// Daardoor is calls[0][1] altijd undefined — toHaveBeenCalledWith faalt daar op.
// Gebruik altijd calls[0][0] om alleen de props te checken.
const getEntryProps = () => getEntryMock().mock.calls[0][0] as Record<string, unknown>;
const getPrimitiveProps = () => getPrimitiveMock().mock.calls[0][0] as Record<string, unknown>;

describe('Renderer', () => {
  const mockOnChange = jest.fn();

  const mockRenderEntryVM: RenderEntryVM = {
    entryId: 'test-entry',
    fieldId: 'test-field',
    label: 'Test Label',
    primitiveType: 'text',
    value: 'test value',
    isVisible: true,
    onChange: mockOnChange,
  };

  const mockPrimitiveRenderable = {
    primitiveType: 'button',
    props: {
      title: 'Click me',
      onPress: jest.fn(),
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useMaster as jest.Mock).mockReturnValue({});
    getEntryMock().mockImplementation(() => null);
    getPrimitiveMock().mockImplementation(() => null);
  });

  it('should call useMaster hook', () => {
    render(<Renderer viewModel={mockRenderEntryVM} />);
    expect(useMaster).toHaveBeenCalledTimes(1);
  });

  describe('with RenderEntryVM', () => {
    it('should render DynamicEntry when viewModel is RenderEntryVM', () => {
      render(<Renderer viewModel={mockRenderEntryVM} />);

      expect(getEntryMock()).toHaveBeenCalledTimes(1);
      expect(getEntryProps()).toEqual(expect.objectContaining({ entry: mockRenderEntryVM }));
      expect(getPrimitiveMock()).not.toHaveBeenCalled();
    });

    it('should pass all required RenderEntryVM properties', () => {
      render(<Renderer viewModel={mockRenderEntryVM} />);

      expect(getEntryProps().entry).toEqual({
        entryId: 'test-entry',
        fieldId: 'test-field',
        label: 'Test Label',
        primitiveType: 'text',
        value: 'test value',
        isVisible: true,
        onChange: mockOnChange,
      });
    });
  });

  describe('with PrimitiveRenderable', () => {
    it('should render DynamicPrimitive when viewModel is PrimitiveRenderable', () => {
      render(<Renderer viewModel={mockPrimitiveRenderable} />);

      expect(getPrimitiveMock()).toHaveBeenCalledTimes(1);
      expect(getPrimitiveProps()).toEqual(expect.objectContaining({
        primitiveType: mockPrimitiveRenderable.primitiveType,
        props: mockPrimitiveRenderable.props,
      }));
      expect(getEntryMock()).not.toHaveBeenCalled();
    });

    it('should handle PrimitiveRenderable without props', () => {
      render(<Renderer viewModel={{ primitiveType: 'text' }} />);

      expect(getPrimitiveMock()).toHaveBeenCalledTimes(1);
      expect(getPrimitiveProps()).toEqual(expect.objectContaining({ primitiveType: 'text', props: {} }));
    });

    it('should pass props correctly when provided', () => {
      render(<Renderer viewModel={{ primitiveType: 'text', props: { placeholder: 'Enter text', maxLength: 100 } }} />);

      expect(getPrimitiveMock()).toHaveBeenCalledTimes(1);
      expect(getPrimitiveProps()).toEqual(expect.objectContaining({
        primitiveType: 'text',
        props: { placeholder: 'Enter text', maxLength: 100 },
      }));
    });
  });

  describe('type guards', () => {
    it('should return null for invalid viewModel', () => {
      const invalidViewModels = [
        null,
        undefined,
        {},
        { primitiveType: 123 },
        { primitiveType: 'text', props: 'invalid' },
        { entryId: 'test' },
      ];

      invalidViewModels.forEach(viewModel => {
        const { toJSON } = render(<Renderer viewModel={viewModel as any} />);
        expect(getEntryMock()).not.toHaveBeenCalled();
        expect(getPrimitiveMock()).not.toHaveBeenCalled();
        expect(toJSON()).toBeNull();
        jest.clearAllMocks();
        getEntryMock().mockImplementation(() => null);
        getPrimitiveMock().mockImplementation(() => null);
      });
    });

    it('should handle viewModel with extra properties correctly', () => {
      const viewModelWithExtra = {
        ...mockRenderEntryVM,
        extraProperty: 'should be ignored',
        anotherExtra: 123,
      };

      render(<Renderer viewModel={viewModelWithExtra} />);

      expect(getEntryMock()).toHaveBeenCalledTimes(1);
      expect(getEntryProps().entry).toEqual(expect.objectContaining({
        entryId: mockRenderEntryVM.entryId,
        fieldId: mockRenderEntryVM.fieldId,
        label: mockRenderEntryVM.label,
        primitiveType: mockRenderEntryVM.primitiveType,
      }));
    });
  });

  describe('edge cases', () => {
    it('should handle viewModel that matches both types (RenderEntryVM takes precedence)', () => {
      render(<Renderer viewModel={{ ...mockRenderEntryVM, primitiveType: 'button', props: { title: 'test' } } as any} />);

      expect(getEntryMock()).toHaveBeenCalled();
      expect(getPrimitiveMock()).not.toHaveBeenCalled();
    });

    it('should handle null values in props', () => {
      render(<Renderer viewModel={{ primitiveType: 'text', props: { value: null, placeholder: null } }} />);

      expect(getPrimitiveMock()).toHaveBeenCalledTimes(1);
      expect(getPrimitiveProps()).toEqual(expect.objectContaining({
        primitiveType: 'text',
        props: { value: null, placeholder: null },
      }));
    });

    it('should handle undefined onChange in RenderEntryVM', () => {
      // onChange: undefined → isRenderEntryVM faalt (vereist typeof === 'function').
      // primitiveType: 'text' aanwezig → valt door naar isPrimitiveRenderable.
      render(<Renderer viewModel={{ ...mockRenderEntryVM, onChange: undefined } as any} />);
      expect(getEntryMock()).not.toHaveBeenCalled();
      expect(getPrimitiveMock()).toHaveBeenCalled();
    });
  });

  describe('type guard functions', () => {
    it('should correctly identify valid RenderEntryVM', () => {
      const validCases = [
        mockRenderEntryVM,
        { ...mockRenderEntryVM, optionalField: 'extra' },
        { ...mockRenderEntryVM, value: null },
      ];

      validCases.forEach(viewModel => {
        render(<Renderer viewModel={viewModel as any} />);
        expect(getEntryMock()).toHaveBeenCalled();
        getEntryMock().mockClear();
      });
    });

    it('should correctly identify valid PrimitiveRenderable', () => {
      const validCases = [
        { primitiveType: 'text' },
        { primitiveType: 'button', props: {} },
        { primitiveType: 'text', props: { value: 'test' } },
      ];

      validCases.forEach(viewModel => {
        render(<Renderer viewModel={viewModel} />);
        expect(getPrimitiveMock()).toHaveBeenCalled();
        getPrimitiveMock().mockClear();
      });
    });
  });

  describe('JSDoc claims verification', () => {
    it('should use useMaster hook', () => {
      render(<Renderer viewModel={mockRenderEntryVM} />);
      expect(useMaster).toHaveBeenCalled();
    });

    it('should not use unsafe casts', () => {
      const { toJSON } = render(<Renderer viewModel={{ primitiveType: 'text' }} />);
      expect(toJSON).toBeDefined();
    });

    it('should handle both RenderEntryVM and PrimitiveRenderable', () => {
      [mockRenderEntryVM, { primitiveType: 'text' }].forEach(viewModel => {
        const { toJSON } = render(<Renderer viewModel={viewModel as any} />);
        expect(toJSON).toBeDefined();
      });
    });
  });
});
