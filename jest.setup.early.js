// jest.setup.early.js - The Nuclear De-Winterizer
const deadProp = {
    get: () => undefined,
    configurable: true,
    enumerable: false
  };
  
  // We blokkeren de getters die de crash veroorzaken direct op de globals
  const winterGlobals = [
    'TextDecoderStream', 
    'TextEncoderStream', 
    'ReadableStream', 
    'structuredClone', 
    'fetch', 
    'Request', 
    'Response', 
    'Headers'
  ];
  
  winterGlobals.forEach(prop => {
    Object.defineProperty(global, prop, deadProp);
    if (typeof window !== 'undefined') {
      Object.defineProperty(window, prop, deadProp);
    }
  });
  
  // Bevries de registry
  global.__ExpoImportMetaRegistry = {};
  Object.freeze(global.__ExpoImportMetaRegistry);
  
  // Blokkeer de modules fysiek in de resolver
  jest.mock('expo/src/winter/runtime.native', () => ({}), { virtual: true });
  jest.mock('expo/src/winter/installGlobal', () => ({}), { virtual: true });