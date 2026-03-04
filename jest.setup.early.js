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
  
  // Winter kan TextDecoder/TextEncoder overschrijven met een gebroken versie.
  // Herstel ze expliciet vanuit Node built-ins (beschikbaar sinds Node 11).
  // Dit moet VOOR de winterGlobals.forEach() staan zodat onze versie overleeft.
  const { TextDecoder: NodeTextDecoder, TextEncoder: NodeTextEncoder } = require('util');
  if (typeof global.TextDecoder === 'undefined' || global.TextDecoder !== NodeTextDecoder) {
    global.TextDecoder = NodeTextDecoder;
  }
  if (typeof global.TextEncoder === 'undefined' || global.TextEncoder !== NodeTextEncoder) {
    global.TextEncoder = NodeTextEncoder;
  }
  
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
  
    // AccessibilityInfo stub — is undefined in de jest-expo preset omdat
    // het een native module is zonder test-implementatie.
    // announceForAccessibility wordt als jest.fn() aangeboden zodat tests
    // kunnen controleren of het aangeroepen wordt (WCAG 2.1 SC 4.1.3).
    RN.AccessibilityInfo = {
      ...(RN.AccessibilityInfo || {}),
      announceForAccessibility: jest.fn(),
    };

    // Modal stub — react-native/index.js definieert Modal als lazy getter die
    // bij eerste gebruik de echte Modal.js laadt. Modal.js leest Platform.OS
    // bij module-evaluatie (regel 42). In jsdom is Platform via requireActual
    // geladen maar de intern geneste require-keten in mockComponent gebruikt
    // jest.requireActual, waarmee onze jest.mock('react-native/Libraries/Modal/Modal')
    // volledig omzeild wordt. Oplossing: de lazy getter op het RN-object zelf
    // overschrijven met Object.defineProperty, zodat elke consumer (incl.
    // mockComponent) altijd onze stub terugkrijgt.
    //
    // De stub rendert children wanneer visible=true en behoudt testID en
    // accessibilityViewIsModal voor assertions.
    const MockModal = function MockModal(props) {
      if (!props.visible) return null;
      // Gebruik require('react') ipv import om hoisting-problemen te vermijden.
    
      const React = require('react');
      // RN.View is beschikbaar via requireActual en crasht niet op Platform.OS.
      return React.createElement(
        RN.View,
        { testID: props.testID, accessibilityViewIsModal: props.accessibilityViewIsModal },
        props.children,
      );
    };
    MockModal.displayName = 'Modal';

    // Platform stub — RN.Platform kan undefined zijn als de lazy getter in de
    // react-native index cached is vóór de react-native/Libraries/Utilities/Platform
    // mock in jest.setup.tsx registreert. Door Platform hier expliciet te setten
    // op het RN-object zelf werkt Platform.select() altijd, ook in modules die
    // indirect via useAppStyles -> Feedback.ts -> Platform.select() lopen.
    Object.defineProperty(RN, 'Platform', {
      get: () => ({
        OS: 'ios',
        select: (spec) => {
          if (spec && 'ios' in spec) return spec.ios;
          if (spec && 'default' in spec) return spec.default;
          return undefined;
        },
        isPad: false,
        isTVOS: false,
        isTV: false,
        Version: 0,
      }),
      configurable: true,
      enumerable: true,
    });

    Object.defineProperty(RN, 'Modal', {
      get: () => MockModal,
      configurable: true,
      enumerable: true,
    });

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
  