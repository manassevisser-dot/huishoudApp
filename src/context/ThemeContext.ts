import * as React from 'react';

export type Theme = 'light' | 'dark';
const ThemeContext = React.createContext<{ theme: Theme; setTheme?: (t: Theme) => void }>({ theme: 'light' });

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = React.useState<Theme>('light');
  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
};

export function useTheme() {
  return React.useContext(ThemeContext);
}
