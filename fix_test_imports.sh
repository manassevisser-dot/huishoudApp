#!/bin/bash
set -e

echo "🔧 Test Imports & RenderHook herstellen..."

# 1. Voeg renderHook toe aan src/test-utils/render.tsx (was verwijderd)
# We overschrijven render.tsx met een versie die OOK renderHook heeft
cat > src/test-utils/render.tsx << 'EOF'
import * as React from 'react';
import { 
  render as rtlRender, 
  renderHook as rtlRenderHook,
  screen, 
  fireEvent, 
  waitFor,
  RenderOptions 
} from '@testing-library/react-native';
import { ThemeProvider } from '@app/context/ThemeContext';
import { FormContext } from '@app/context/FormContext';
import { FormStateFixture } from './fixtures';
import { FormState } from '@shared-types/form';

// Mock Safe Area
jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

type ProvidersProps = {
  children: React.ReactNode;
  state?: FormState;
  dispatch?: React.Dispatch<any>;
};

export function Providers({ children, state, dispatch }: ProvidersProps) {
  const value = {
    state: state ?? FormStateFixture,
    dispatch: dispatch ?? jest.fn(),
  };
  return (
    <ThemeProvider>
      <FormContext.Provider value={value}>{children}</FormContext.Provider>
    </ThemeProvider>
  );
}

// Custom Render
export function renderWithProviders(
  ui: React.ReactElement,
  options?: RenderOptions & { state?: FormState; dispatch?: React.Dispatch<any> }
) {
  const { state, dispatch, ...rest } = options ?? {};
  return rtlRender(
    <Providers state={state} dispatch={dispatch}>{ui}</Providers>, 
    rest
  );
}

// Custom RenderHook
export function renderHookWithProviders<Result, Props>(
  render: (initialProps: Props) => Result,
  options?: { state?: FormState; dispatch?: React.Dispatch<any> }
) {
  const { state, dispatch } = options ?? {};
  return rtlRenderHook(render, {
    wrapper: ({ children }) => <Providers state={state} dispatch={dispatch}>{children}</Providers>,
  });
}

// Aliases & Re-exports
export const renderWithState = renderWithProviders;
export const render = renderWithProviders;
export { screen, fireEvent, waitFor };
EOF

# 2. Repareer Imports in alle testbestanden
# We gebruiken sed om oude paden te vervangen door nieuwe

# A. Vervang @test-utils/rtl -> @test-utils/render
grep -rl "@test-utils/rtl" src | xargs sed -i "s|@test-utils/rtl|@test-utils/render|g" 2>/dev/null || true

# B. Vervang @test-utils/renderWithState -> @test-utils/render
grep -rl "@test-utils/renderWithState" src | xargs sed -i "s|@test-utils/renderWithState|@test-utils/render|g" 2>/dev/null || true

# C. Vervang @test-utils/renderHook -> @test-utils/render
grep -rl "@test-utils/renderHook" src | xargs sed -i "s|@test-utils/renderHook|@test-utils/render|g" 2>/dev/null || true

# D. makePhoenixState verplaatsen naar @test-utils/state
# Dit is lastiger met sed, maar we proberen de import regel aan te passen
# Zoekt naar: import { ... makePhoenixState ... } from '@test-utils/render'
# En verandert het pad. (Dit werkt niet perfect als er meerdere imports zijn, maar vangt de meeste gevallen)
grep -rl "makePhoenixState" src | xargs sed -i "s|@test-utils/rtl|@test-utils/state|g" 2>/dev/null || true
grep -rl "makePhoenixState" src | xargs sed -i "s|@test-utils/fixtures|@test-utils/state|g" 2>/dev/null || true

# E. Handmatige fix voor bestanden die makePhoenixState nog uit render halen
# We voegen een extra import toe als makePhoenixState mist
grep -rl "makePhoenixState" src | while read -r file; do
    if ! grep -q "@test-utils/state" "$file"; then
        # Als state nog niet geïmporteerd is, verander de bestaande import
        sed -i "s|makePhoenixState,||g" "$file" # Verwijder uit bestaande lijst
        sed -i "s|makePhoenixState||g" "$file"   # Verwijder losse
        # Voeg nieuwe import toe bovenaan (na de laatste import)
        sed -i "/^import.*from/a import { makePhoenixState } from '@test-utils/state';" "$file"
    fi
done

echo "✅ Imports bijgewerkt en renderHook hersteld."
echo "👉 Draai nu: npm test"