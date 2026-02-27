// src/domain/styles/modules/Forms.test.ts
import { makeForms } from './Fields';
import type { ColorScheme } from '@domain/constants/Colors';
import { Space, Type, Radius } from '@domain/constants/Tokens';
import { Layout } from '@domain/constants/LayoutTokens';
import { FlipInEasyX } from 'react-native-reanimated';

describe('Forms style module', () => {
  // Mock color scheme
  const mockColors: ColorScheme = {
    textPrimary: '#000000',
    textSecondary: '#666666',
    textTertiary: '#999999',
    error: '#FF0000',
    border: '#CCCCCC',
    inputBackground: '#FFFFFF',
  } as ColorScheme; // Alleen de gebruikte properties zijn nodig

  let styles: ReturnType<typeof makeForms>;

  beforeEach(() => {
    styles = makeForms(mockColors);
  });

  describe('makeFormLabels', () => {
    it('should create label styles correctly', () => {
      expect(styles.label).toEqual({
        fontSize: Type.lg,
        fontWeight: '600',
        color: mockColors.textPrimary,
        marginBottom: Space.sm,
      });
    });

    it('should create error label styles', () => {
      expect(styles.labelError).toEqual({
        color: mockColors.error,
      });
    });

    it('should create error text styles', () => {
      expect(styles.errorTextStyle).toEqual({
        color: mockColors.error,
        marginTop: Space.xs,
        fontSize: Type.sm,
      });
    });

    it('should create entry label styles', () => {
      expect(styles.entryLabel).toEqual({
        fontSize: Type.lg,
        fontWeight: '600',
        color: mockColors.textPrimary,
        marginBottom: Space.sm,
      });
    });

    it('should create entry error label styles', () => {
      expect(styles.entryLabelError).toEqual({
        color: mockColors.error,
      });
    });

    it('should create error text styles (alternative)', () => {
      expect(styles.errorText).toEqual({
        color: mockColors.error,
        marginTop: Space.xs,
        fontSize: Type.sm,
      });
    });

    it('should create helper text styles', () => {
      expect(styles.helperText).toEqual({
        fontSize: Type.xs,
        color: mockColors.textSecondary,
        marginTop: Space.xs,
      });
    });
  });

  describe('makeMoneyInputs', () => {
    it('should create money row styles', () => {
      expect(styles.moneyRow).toEqual({
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: mockColors.border,
        borderRadius: Radius.md,
        paddingHorizontal: Space.md,
        backgroundColor: mockColors.inputBackground,
        height: 48,
      });
    });

    it('should create money prefix styles', () => {
      expect(styles.moneyPrefix).toEqual({
        fontSize: Type.md,
        fontWeight: '600',
        color: mockColors.textSecondary,
        marginRight: Space.xs,
      });
    });

    it('should create money text input styles', () => {
      expect(styles.moneyTextInput).toEqual({
        flex: 1,
        height: '100%',
        fontSize: Type.md,
        color: mockColors.textPrimary,
        paddingVertical: 0,
      });
    });
  });

  describe('makeNumericInputs', () => {
    it('should create numeric wrapper styles', () => {
      expect(styles.numericWrapper).toEqual({
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: mockColors.inputBackground,
        borderRadius: Radius.lg,
        borderWidth: 1,
        borderColor: mockColors.border,
        paddingHorizontal: 14,
      });
    });

    it('should create currency prefix styles', () => {
      expect(styles.currencyPrefix).toEqual({
        fontSize: Type.lg,
        color: mockColors.textTertiary,
        marginRight: Space.xs,
      });
    });

    it('should create numeric input styles', () => {
      expect(styles.numericInput).toEqual({
        flex: 1,
        paddingVertical: 14,
        fontSize: Type.lg,
        color: mockColors.textPrimary,
      });
    });

    it('should include money input styles from makeMoneyInputs', () => {
      expect(styles).toHaveProperty('moneyRow');
      expect(styles).toHaveProperty('moneyPrefix');
      expect(styles).toHaveProperty('moneyTextInput');
    });
  });

  describe('makeFormInputs', () => {
    it('should create entry container styles', () => {
      expect(styles.entryContainer).toEqual({
        marginBottom: Space.lg,
      });
    });

    it('should create input styles', () => {
      expect(styles.input).toEqual({
        backgroundColor: mockColors.inputBackground,
        borderRadius: Radius.lg,
        padding: 14,
        fontSize: Type.lg,
        color: mockColors.textPrimary,
        borderWidth: 1,
        borderColor: mockColors.border,
      });
    });

    it('should create input error styles', () => {
      expect(styles.inputError).toEqual({
        borderColor: mockColors.error,
        borderWidth: 2,
      });
    });

    it('should include numeric input styles from makeNumericInputs', () => {
      expect(styles).toHaveProperty('numericWrapper');
      expect(styles).toHaveProperty('currencyPrefix');
      expect(styles).toHaveProperty('numericInput');
    });
  });

  describe('makeFormLegacy', () => {
    it('should create legacy input money row styles', () => {
      expect(styles.inputMoneyRow).toEqual({
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: mockColors.border,
        borderRadius: 8,
        paddingHorizontal: Space.md,
        backgroundColor: mockColors.inputBackground,
        height: 48,
      });
    });

    it('should create legacy money input wrapper styles', () => {
      expect(styles.moneyInputWrapper).toEqual({
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: mockColors.border,
        borderRadius: 8,
        paddingHorizontal: Space.md,
        backgroundColor: mockColors.inputBackground,
        height: 48,
      });
    });

    it('should create legacy currency symbol styles', () => {
      expect(styles.currencySymbol).toEqual({
        fontSize: Type.lg,
        color: mockColors.textSecondary,
        marginRight: Space.sm,
      });
    });

    it('should create legacy text input styles', () => {
      expect(styles.textInput).toEqual({
        flex: 1,
        height: 48,
        fontSize: Type.md,
        color: mockColors.textPrimary,
      });
    });
  });

  describe('makeForms integration', () => {
    it('should combine all style groups into one object', () => {
      // Check dat alle groepen aanwezig zijn
      expect(styles).toHaveProperty('label');
      expect(styles).toHaveProperty('moneyRow');
      expect(styles).toHaveProperty('numericWrapper');
      expect(styles).toHaveProperty('input');
      expect(styles).toHaveProperty('inputMoneyRow');
      
      // Totaal aantal properties (ongeveer 20+)
      const propertyCount = Object.keys(styles).length;
      expect(propertyCount).toBeGreaterThan(15);
    });

    it('should be pure - same input always returns same output', () => {
      const styles1 = makeForms(mockColors);
      const styles2 = makeForms(mockColors);
      
      expect(styles1).toEqual(styles2);
      expect(styles1).not.toBe(styles2); // Different objects
    });

    it('should work with different color schemes', () => {
      const darkColors: ColorScheme = {
        textPrimary: '#FFFFFF',
        textSecondary: '#CCCCCC',
        textTertiary: '#999999',
        error: '#FF4444',
        border: '#333333',
        inputBackground: '#222222',
      } as ColorScheme;

      const darkStyles = makeForms(darkColors);
      
      expect(darkStyles.label.color).toBe('#FFFFFF');
      expect(darkStyles.input.backgroundColor).toBe('#222222');
      expect(darkStyles.errorText.color).toBe('#FF4444');
    });
  });

  describe('type safety', () => {
    it('should have correct TypeScript return type', () => {
      // Dit is meer een compile-time check
      const labelStyle: { fontSize: number; fontWeight: string; color: string; marginBottom: number } = styles.label;
      expect(labelStyle).toBeDefined();
      
      const moneyRowStyle: {
        flexDirection: string;
        alignItems: string;
        borderWidth: number;
        borderColor: string;
        borderRadius: number;
        paddingHorizontal: number;
        backgroundColor: string;
        height: number;
      } = styles.moneyRow;
      expect(moneyRowStyle).toBeDefined();
    });
  });
});