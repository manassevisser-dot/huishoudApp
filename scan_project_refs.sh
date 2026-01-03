#!/usr/bin/env bash
set -euo pipefail

# === CONFIGURATION ===
SRC_DIR="src"
IMPORTS_CSV=".imports.csv"
EXPORTS_CSV=".exports.csv"

echo "🚀 Starting Project Scan..."

# ==============================================================================
# 1. SCAN IMPORTS
# ==============================================================================
echo "🔍 Scanning Imports..."

# We use the optimized -r replacement method here for speed and simplicity
rg -n --no-heading -g "${SRC_DIR}/**" -g "!**/node_modules/**" \
  -o -P "(?:from\s+|import\s+|require\()\s*['\"]([^'\"]+)['\"]" \
  -r '$1' \
  "$SRC_DIR" \
| awk -F: '{ printf "%s,%s,import,%s\n", $1, $2, $3 }' \
| sort -u > "$IMPORTS_CSV"

echo "✅ Imports saved to $IMPORTS_CSV"

# ==============================================================================
# 2. SCAN EXPORTS
# ==============================================================================
echo "🔍 Scanning Exports..."

# We create a temporary awk script to handle the complex regex logic
# without fighting Bash quoting rules.
cat > .process_exports.awk << 'EOF'
BEGIN { FS=":"; OFS="," }
{
  file = $1
  line = $2
  
  # Strip the filename and line number from the input line to get the code
  # $0 is the full line from rg. We rebuild the code part.
  # This handles colons inside the code itself.
  code = substr($0, length(file) + length(line) + 3)
  
  kind = "export"
  ident = "unknown"

  # 1. Default Export
  if (match(code, /export\s+default\s+(class|function)?\s*([a-zA-Z0-9_$]+)/, m)) {
    ident = "default:" (m[2] ? m[2] : m[1])
  }
  # 2. Named Class/Function/Interface/Type
  else if (match(code, /export\s+(class|function|interface|type|const|let|var)\s+([a-zA-Z0-9_$]+)/, m)) {
    ident = m[1] ":" m[2]
  }
  # 3. Named Export List { Foo, Bar }
  else if (match(code, /export\s*\{([^}]+)\}/, m)) {
    # Check if it is a re-export "from"
    if (match(code, /from\s*['"]([^'"]+)['"]/, from_match)) {
       ident = "re-export:{" m[1] "} from " from_match[1]
    } else {
       ident = "named:{" m[1] "}"
    }
  }
  # 4. Star Re-export (* from ...)
  else if (match(code, /export\s*\*\s*from\s*['"]([^'"]+)['"]/, m)) {
    ident = "re-export:* from " m[1]
  }

  # Clean up whitespace in identifier
  gsub(/\s+/, " ", ident)
  gsub(/^ | $/, "", ident)

  printf "%s,%s,%s,%s\n", file, line, kind, ident
}
EOF

# Run Ripgrep to find lines, then pipe to the awk script
rg -n --no-heading -g "${SRC_DIR}/**" -g "!**/node_modules/**" \
   -P '^\s*export\s+' \
   "$SRC_DIR" \
| awk -f .process_exports.awk \
| sort -u > "$EXPORTS_CSV"

# Cleanup temp file
rm .process_exports.awk

echo "✅ Exports saved to $EXPORTS_CSV"

# ==============================================================================
# 3. SUMMARY
# ==============================================================================
echo ""
echo "📊 Summary:"
echo "   Imports found: $(wc -l < "$IMPORTS_CSV" | tr -d ' ')"
echo "   Exports found: $(wc -l < "$EXPORTS_CSV" | tr -d ' ')"
echo ""
echo "Sample Imports:"
head -n 3 "$IMPORTS_CSV"
echo "..."
echo "Sample Exports:"
head -n 3 "$EXPORTS_CSV"