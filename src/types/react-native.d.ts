// src/types/react-native.d.ts
import { ViewStyle, TextStyle, ImageStyle } from 'react-native';

export type Style = ViewStyle | TextStyle | ImageStyle;
export type StyleProp<T> = T | T[] | null | undefined;

// For components that accept style
export interface StylableProps {
  style?: StyleProp<ViewStyle>;
}