#!/bin/bash
set -e

echo "👨‍⚕️ Start Chirurgische Ingreep (Sed Editie): 'naam' -> 'firstName + lastName'..."

# 1. Mock Data (Single Quotes)
# Van: naam: 'Jan'
# Naar: firstName: 'Jan', lastName: ''
find src -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i "s/naam:[[:space:]]*'\([^']*\)'/firstName: '\1', lastName: ''/g" {} +

# 2. Mock Data (Double Quotes)
# Van: naam: "Jan"
# Naar: firstName: "Jan", lastName: ""
find src -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i 's/naam:[[:space:]]*"\([^"]*\)"/firstName: "\1", lastName: ""/g' {} +

# 3. Property Access
# Van: .naam
# Naar: .firstName
find src -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i 's/\.naam\b/.firstName/g' {} +

# 4. Destructuring
# Van: { naam }
# Naar: { firstName, lastName }
find src -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i 's/{[[:space:]]*naam[[:space:]]*}/{ firstName, lastName }/g' {} +

# 5. Interface Definitie Opschonen
TARGET="src/domain/household.ts"
if [ -f "$TARGET" ]; then
    echo "   • Domain definitie opschonen..."
    sed -i '/naam?: string;/d' "$TARGET"
    sed -i '/naam: string;/d' "$TARGET"
fi

echo "✅ Refactor script voltooid."
echo "👉 Draai nu: npx tsc --noEmit"