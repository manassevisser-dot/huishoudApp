// index.tsx
import 'react';
import { registerRootComponent } from 'expo';
import App from './src/App';
// App.tsx bevat al ThemeProvider; index.tsx registreert alleen de App
registerRootComponent(App);
export default App;
