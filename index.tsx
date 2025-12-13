
// index.tsx
import React from 'react';
import { registerRootComponent } from 'expo';
import App from './App';

// App.tsx bevat al ThemeProvider; index.tsx registreert alleen de App
registerRootComponent(App);

export default App;