#!/bin/bash
set -e

echo "🔧 State Helper repareren (Circular dependency fix)..."

cat > src/test-utils/state.ts << 'EOF'
import { FormState } from '@shared-types/form';

// Geen import van zichzelf meer!

export function makePhoenixState(
  overrides?: Partial<Omit<FormState, 'data'>> & { data?: Partial<FormState['data']> }
): FormState {
  const base: FormState = {
    schemaVersion: '1.0',
    activeStep: 'LANDING',
    currentPageId: 'setupHousehold',
    isValid: false,
    data: {
      setup: {},
      household: { members: [] },
      finance: { income: { items: [] }, expenses: { items: [] } },
    },
    meta: {
      lastModified: new Date().toISOString(),
      version: 1,
    },
  };

  return {
    ...base,
    ...overrides,
    data: { ...base.data, ...overrides?.data },
  } as FormState;
}
EOF

echo "✅ State helper gerepareerd."
echo "👉 Draai nu: npx tsc --noEmit"