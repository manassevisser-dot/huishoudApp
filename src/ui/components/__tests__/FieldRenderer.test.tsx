import { render } from 'src/test-utils/render/renderers'
import { FieldRenderer } from '../FieldRenderer';

describe('FieldRenderer', () => {
    const mockValueProvider = {
      getValue: jest.fn((id: string) => `Waarde voor ${id}`),
    };
  
    it('renders the value from the provider correctly', () => {
      // Deze 'render' gebruikt nu automatisch de ThemeProvider uit providers.tsx
      const { getByText } = render(
        <FieldRenderer fieldId="test-field" valueProvider={mockValueProvider as any} />
      );
  
      expect(getByText('Waarde voor test-field')).toBeTruthy();
    });
  
    it('handles empty values gracefully', () => {
      const emptyProvider = { getValue: () => null };
      const { getByText } = render(
        <FieldRenderer fieldId="empty" valueProvider={emptyProvider as any} />
      );
  
      expect(getByText('')).toBeTruthy();
    });
  });