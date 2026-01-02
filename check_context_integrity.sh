#!/bin/bash
set -e

echo "🔍 Context Integrity Check..."

# 1. Check Circulaire Dependencies
echo "   • Checking circular deps..."
if grep -q "FormContext" src/app/context/ThemeContext.tsx; then
    echo "❌ ThemeContext importeert FormContext! (Circulair risico)"
else
    echo "✅ ThemeContext is schoon."
fi

if grep -q "ThemeContext" src/app/context/FormContext.tsx; then
    echo "❌ FormContext importeert ThemeContext! (Circulair risico)"
else
    echo "✅ FormContext is schoon."
fi

# 2. Check Exports
echo "   • Checking exports..."
if grep -q "export const ThemeProvider" src/app/context/ThemeContext.tsx; then
    echo "✅ ThemeProvider exported."
else
    echo "❌ ThemeProvider export mist!"
fi

if grep -q "export const FormContext" src/app/context/FormContext.tsx; then
    echo "✅ FormContext exported."
else
    echo "❌ FormContext export mist!"
fi

# 3. Check Providers.tsx imports
echo "   • Checking providers.tsx imports..."
grep "import.*ThemeContext" src/test-utils/render/providers.tsx || echo "❌ ThemeContext import mist in providers.tsx"
grep "import.*FormContext" src/test-utils/render/providers.tsx || echo "❌ FormContext import mist in providers.tsx"

# 4. Madge Check (Optioneel, als madge geïnstalleerd is)
if command -v npx >/dev/null; then
    echo "   • Running Madge (Circular Dependency Check)..."
    npx madge --circular --extensions ts,tsx src/app/context || echo "⚠️ Madge check failed (tool missing?)"
fi

echo "Done."