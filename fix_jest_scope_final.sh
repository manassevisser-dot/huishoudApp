#!/bin/bash
set -e

echo "🔧 Jest Scope Error definitief repareren (Minimal Shield)..."

cat > jest.setup.early.js << 'EOF'
// jest.setup.early.js
// Phoenix Winter Shield (Minimal & Safe)

// 1. Polyfill Globals (voorkomt crashes in moderne Expo libs)
if (typeof global.TextDecoder === 'undefined') {
  const { TextDecoder, TextEncoder } = require('util');
  global.TextDecoder = TextDecoder;
  global.TextEncoder = TextEncoder;
}

if (typeof global.structuredClone === 'undefined') {
  global.structuredClone = (obj) => JSON.parse(JSON.stringify(obj));
}

// 2. Mock Expo Modules Core (zonder interne paden)
// Dit voorkomt dat jest-expo probeert de native runtime te laden
jest.mock('expo-modules-core', () => {
  return {
    NativeModulesProxy: new Proxy({}, { get: () => jest.fn() }),
    EventEmitter: jest.fn(() => ({
      addListener: jest.fn(),
      removeSubscription: jest.fn(),
    })),
    requireNativeModule: jest.fn(() => ({})),
  };
}, { virtual: true });

// 3. Mock Expo Constants (vaak een boosdoener)
jest.mock('expo-constants', () => ({
  manifest: {},
}), { virtual: true });
EOF

echo "✅ Jest Early Setup is nu minimaal en veilig."
echo "👉 Draai nu: npm test"