/**
 * @file_intent Props-interfaces voor alle primitive UI-componenten.
 * @repo_architecture UI Layer - Primitives/Atoms. Geïsoleerd type-bestand zodat
 *   `primitives.tsx` vrij blijft van interface-definities en deze types
 *   afzonderlijk importeerbaar zijn zonder React-afhankelijkheid.
 */
// src/ui/primitives/primitives.types.ts
import type { StyleProp, ViewStyle, TextStyle } from 'react-native';

export interface InputPrimitiveProps {
  value: string;
  onAction: (text: string) => void;
  placeholder?: string;
  keyboardType?: 'default' | 'numeric' | 'decimal-pad' | 'email-address' | 'phone-pad';
  style?: StyleProp<TextStyle>;
}

export interface DatePrimitiveProps {
  value?: string;
  onDateChange: (date: string) => void;
  placeholder?: string;
  style?: StyleProp<TextStyle>;
}

export interface CounterPrimitiveProps {
  value: number;
  onCounterChange: (newValue: number) => void;
  style?: StyleProp<ViewStyle>;
}

export interface TogglePrimitiveProps {
  value: boolean;
  onToggle: (newValue: boolean) => void;
  style?: StyleProp<ViewStyle>;
}

export interface ButtonPrimitiveProps {
  label: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  testID?: string;
}

export interface LabelPrimitiveProps {
  label: string;
  value: string;
  style?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  valueStyle?: StyleProp<TextStyle>;
}

export interface ChipPrimitiveProps {
  label: string;
  selected: boolean;
  onPress: () => void;
  containerStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  accessibilityLabel?: string;
  testID?: string;
}

export interface RadioOptionProps {
  label: string;
  selected: boolean;
  onSelect: () => void;
}
