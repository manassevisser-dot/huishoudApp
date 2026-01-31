import { TouchableOpacityProps, TextInputProps } from 'react-native';

export interface BaseFieldProps {
  label?: string;
  error?: string;
  disabled?: boolean;
}

export interface ChipButtonProps extends TouchableOpacityProps, BaseFieldProps {
  selected?: boolean;
  onPress: () => void;
}

export interface ToggleSwitchProps extends BaseFieldProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
}

export interface FormFieldProps extends TextInputProps, BaseFieldProps {
  onChangeText: (text: string) => void;
}

export interface DateFieldProps extends BaseFieldProps {
  value?: Date;
  onChange: (date: Date) => void;
  minimumDate?: Date;
  maximumDate?: Date;
}

export interface FieldRendererProps {
  field: {
    key: string;
    type: string;
    label?: string;
    // Add other field properties
  };
  value: unknown;
  onChange: (value: unknown) => void;
}