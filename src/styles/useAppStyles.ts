// src/styles/useAppStyles.ts

import * as React from 'react';
import { getAppStyles } from './AppStyles';
import { useTheme } from '../context/ThemeContext';

/**
 * Hook to get theme-aware styles
 * 
 * Usage:
 *   const styles = useAppStyles();
 *   <View style={styles.container}>...</View>
 * 
 * Performance:
 *   - Memoized with [theme] dependency
 *   - Only recalculates when theme changes
 *   - Returns cached StyleSheet from getAppStyles
 */
export function useAppStyles() {
  const { theme } = useTheme();
  return React.useMemo(() => getAppStyles(theme), [theme]);
}
