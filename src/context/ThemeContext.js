import React from 'react';

const ThemeContext = React.createContext({ theme: 'light' });

export const ThemeProvider = ({ children }) => (
  <ThemeContext.Provider value={{ theme: 'light' }}>
    {children}
  </ThemeContext.Provider>
);

export function useTheme() {
  return React.useContext(ThemeContext);
}
