// jest.setup.early.js

/* ============================================================
 * 1. NUCLEAR DE-WINTERIZER (Expo SDK 50/51 Fix)
 * Blokkeert de Winter-runtime globals die crashes veroorzaken in Node/Jest.
 * ============================================================ */
const deadProp = {
  get: () => undefined,
  configurable: true,
  enumerable: false
};

const winterGlobals = [
  'TextDecoderStream', 
  'TextEncoderStream', 
  'CompressionStream', 
  'DecompressionStream', 
  'ReadableStream', 
  'WritableStream', 
  'structuredClone', 
  'fetch', 
  'Request', 
  'Response', 
  'Headers'
];

winterGlobals.forEach(prop => {
  // We definiëren een getter die 'undefined' teruggeeft om polyfills te blokkeren
  Object.defineProperty(global, prop, deadProp);
  if (typeof window !== 'undefined') {
    Object.defineProperty(window, prop, deadProp);
  }
});

// Bevries de Expo Import Registry om import.meta errors te voorkomen
global.__ExpoImportMetaRegistry = {};
Object.freeze(global.__ExpoImportMetaRegistry);

// Blokkeer de winter-modules fysiek in de resolver
jest.mock('expo/src/winter/runtime.native', () => ({}), { virtual: true });
jest.mock('expo/src/winter/installGlobal', () => ({}), { virtual: true });


/* ============================================================
 * 2. CORE REACT NATIVE MOCKS
 * We gebruiken de echte RN module om 'StyleSheet.flatten' te behouden.
 * ============================================================ */
jest.mock('react-native', () => {
  // Haal de echte implementatie op voor JS-only helpers (zoals StyleSheet)
  const RN = jest.requireActual('react-native');

  // Neutraliseer NativeModules die niet bestaan in de test-environment
  RN.NativeModules.SettingsManager = {
    settings: { AppleLocale: 'en_US', AppleLanguages: ['en'] },
  };
  RN.NativeModules.I18nManager = {
    localeIdentifier: 'en_US',
    isRTL: false,
  };
  
  // Voeg missende modules toe om 'undefined' crashes te voorkomen
  RN.NativeModules.RNOSModule = RN.NativeModules.RNOSModule || {}; 

  return RN;
});

// Zorg dat Worklets niet crashen tijdens initialisatie
global.__reanimatedWorkletInit = jest.fn();

if (process.env.DEBUG_JEST) {
  console.log('✅ Jest Early Setup: Winter neutralized & React Native mocked.');
}