// jest.setup.early.js

/* ============================================================
 * 1. NUCLEAR DE-WINTERIZER
 * Neutraliseert Winter / Web-runtime globals (Expo SDK 50+)
 * MOET vóór alle imports draaien
 * ============================================================ */
const deadProp = {
    get: () => undefined,
    configurable: true,
    enumerable: false,
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
    'Headers',
  ];
  
  winterGlobals.forEach(prop => {
    Object.defineProperty(global, prop, deadProp);
    if (typeof window !== 'undefined') {
      Object.defineProperty(window, prop, deadProp);
    }
  });
  
  // Bevries Expo import.meta registry
  global.__ExpoImportMetaRegistry = {};
  Object.freeze(global.__ExpoImportMetaRegistry);
  
  // Blokkeer Winter modules in de resolver
  jest.mock('expo/src/winter/runtime.native', () => ({}), { virtual: true });
  jest.mock('expo/src/winter/installGlobal', () => ({}), { virtual: true });
  
  /* ============================================================
   * 2. CORE REACT NATIVE MOCK
   * Behoudt echte JS helpers (StyleSheet.flatten etc.)
   * ============================================================ */
  jest.mock('react-native', () => {
    const RN = jest.requireActual('react-native');
  
    RN.NativeModules.SettingsManager = {
      settings: { AppleLocale: 'en_US', AppleLanguages: ['en'] },
    };
  
    RN.NativeModules.I18nManager = {
      localeIdentifier: 'en_US',
      isRTL: false,
    };
  
    RN.NativeModules.RNOSModule = RN.NativeModules.RNOSModule || {};
  
    return RN;
  });
  
  // Voorkom Reanimated / Worklet init crashes
  global.__reanimatedWorkletInit = jest.fn();
  
  /* ============================================================
   * 3. NODE / JSDOM STABILITY FIXES
   * Lage-impact polyfills
   * ============================================================ */
  global.setImmediate =
    global.setImmediate || ((fn, ...args) => global.setTimeout(fn, 0, ...args));
  
  if (typeof window !== 'undefined') {
    window.matchMedia =
      window.matchMedia ||
      function () {
        return {
          matches: false,
          addListener() {},
          removeListener() {},
        };
      };
  }
  
  /* ============================================================
   * 4. DIAGNOSTIEK
   * ============================================================ */
  if (process.env.DEBUG_JEST) {
    console.log('✅ Jest Early Setup: Winter neutralized, RN mocked, env stable.');
  }
  