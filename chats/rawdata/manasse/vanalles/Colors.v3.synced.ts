
// src/styles/Colors.ts
/** App color system met semantische tokens (Light/Dark) */
export const Colors = {
  light: {
    // Backgrounds
    background: '#F2F2F7',
    surface: '#FFFFFF',
    inputBackground: '#FFFFFF',

    // Text
    textPrimary: '#1C1C1E',
    textSecondary: '#6E6E73',
    textTertiary: '#8E8E93',
    inverseText: '#FFFFFF',

    // Borders
    border: '#D1D1D6',
    borderSubtle: '#F2F2F7',

    // Actions
    primary: '#007AFF',
    onPrimary: '#FFFFFF',
    secondary: '#E5E5EA',
    onSecondary: '#1C1C1E',

    // Status
    error: '#FF3B30',
    onError: '#FFFFFF',
    warning: '#FF9500',
    onWarning: '#FFFFFF',
    success: '#34C759',
    onSuccess: '#FFFFFF',

    // Selection
    selected: '#007AFF',
    onSelected: '#FFFFFF',

    // Shadows
    shadow: '#000000',
  },
  dark: {
    background: '#0F172A',
    surface: '#1E293B',
    inputBackground: '#1E293B',

    textPrimary: '#F8FAFC',
    textSecondary: '#94A3B8',
    textTertiary: '#64748B',
    inverseText: '#0F172A',

    border: '#334155',
    borderSubtle: '#1E293B',

    primary: '#38BDF8',
    onPrimary: '#0F172A',
    secondary: '#334155',
    onSecondary: '#F8FAFC',

    error: '#FF453A',
    onError: '#FFFFFF',
    warning: '#FF9F0A',
    onWarning: '#0F172A',
    success: '#30D158',
    onSuccess: '#0F172A',

    selected: '#38BDF8',
    onSelected: '#0F172A',

    shadow: '#000000',
  },
} as const;

export type Theme = 'light' | 'dark';
export type ColorScheme = typeof Colors.light;
