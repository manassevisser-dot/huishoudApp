#!/usr/bin/env bash
set -e

echo "🔍 Collecting debug context..."

# 1. TypeScript errors
echo "→ Running tsc --noEmit"
tsc --noEmit > typecheck.log 2>&1 || true

# 2. ESLint output
echo "→ Running eslint"
eslint . --ext .ts,.tsx > lint.log 2>&1 || true

# 3. Git status
echo "→ Collecting git status"
git status --short > git_status.log

# 4. Installed packages
echo "→ Collecting npm packages"
npm ls --depth=0 > npm_packages.log 2>&1 || true

# 5. TypeScript config
echo "→ Collecting tsconfig.json"
if [ -f tsconfig.json ]; then
  cat tsconfig.json > tsconfig.log
else
  echo "tsconfig.json not found" > tsconfig.log
fi

# 6. Extract files with errors and their imports
echo "→ Extracting files with errors"
> files_with_errors.log

# Parse TypeScript errors for file paths
grep -E "^[^[:space:]].*\([0-9]+,[0-9]+\):" typecheck.log 2>/dev/null | \
  sed -E 's/\([0-9]+,[0-9]+\).*//' | \
  sort -u > error_files.tmp || true

# Parse ESLint errors for file paths
grep -E "^/.*/.*\.(ts|tsx)$" lint.log 2>/dev/null | \
  sort -u >> error_files.tmp || true

# Remove duplicates
sort -u error_files.tmp > error_files_unique.tmp 2>/dev/null || true

# For each file with errors, extract content and imports
while IFS= read -r file; do
  if [ -f "$file" ]; then
    echo "═══════════════════════════════════════════════════════" >> files_with_errors.log
    echo "FILE: $file" >> files_with_errors.log
    echo "═══════════════════════════════════════════════════════" >> files_with_errors.log
    echo "" >> files_with_errors.log
    
    # Extract imports from this file
    echo "--- IMPORTS IN THIS FILE ---" >> files_with_errors.log
    grep -E "^import .* from ['\"].*['\"];?" "$file" 2>/dev/null >> files_with_errors.log || echo "No imports found" >> files_with_errors.log
    echo "" >> files_with_errors.log
    
    # Show full file content
    echo "--- FULL FILE CONTENT ---" >> files_with_errors.log
    cat "$file" >> files_with_errors.log 2>/dev/null || echo "Could not read file" >> files_with_errors.log
    echo "" >> files_with_errors.log
    echo "" >> files_with_errors.log
  fi
done < error_files_unique.tmp

# 7. Extract imported files that cause errors
echo "→ Extracting imported dependencies"
> imported_dependencies.log

while IFS= read -r file; do
  if [ -f "$file" ]; then
    # Extract local imports (relative paths)
    grep -oE "from ['\"](\./|\.\./)[^'\"]+['\"]" "$file" 2>/dev/null | \
      sed -E "s/from ['\"]//" | sed -E "s/['\"]$//" | \
      while IFS= read -r import_path; do
        # Resolve relative path
        dir=$(dirname "$file")
        resolved_path="$dir/$import_path"
        
        # Try with various extensions
        for ext in "" ".ts" ".tsx" "/index.ts" "/index.tsx"; do
          full_path="${resolved_path}${ext}"
          if [ -f "$full_path" ]; then
            echo "═══════════════════════════════════════════════════════" >> imported_dependencies.log
            echo "IMPORTED BY: $file" >> imported_dependencies.log
            echo "FILE: $full_path" >> imported_dependencies.log
            echo "═══════════════════════════════════════════════════════" >> imported_dependencies.log
            echo "" >> imported_dependencies.log
            cat "$full_path" >> imported_dependencies.log 2>/dev/null
            echo "" >> imported_dependencies.log
            echo "" >> imported_dependencies.log
            break
          fi
        done
      done
  fi
done < error_files_unique.tmp

# 8. Create error summary
echo "→ Creating error summary"
> error_summary.log

echo "════════════════════════════════════════════════════════════════" >> error_summary.log
echo "TYPESCRIPT ERRORS SUMMARY" >> error_summary.log
echo "════════════════════════════════════════════════════════════════" >> error_summary.log
grep -E "error TS[0-9]+:" typecheck.log 2>/dev/null | head -50 >> error_summary.log || echo "No TypeScript errors" >> error_summary.log
echo "" >> error_summary.log

echo "════════════════════════════════════════════════════════════════" >> error_summary.log
echo "ESLINT ERRORS SUMMARY" >> error_summary.log
echo "════════════════════════════════════════════════════════════════" >> error_summary.log
grep -E "error " lint.log 2>/dev/null | head -50 >> error_summary.log || echo "No ESLint errors" >> error_summary.log
echo "" >> error_summary.log

# 9. Code snapshots (only if no errors found)
echo "→ Collecting code snapshots"
cat \
  src/kernel/*.ts \
  src/selectors/*.ts \
  src/shared-types/*.ts \
  > code_snapshot.log 2>/dev/null || true

# 10. Test snapshots
echo "→ Collecting test snapshots"
cat \
  src/logic/__tests__/*.ts \
  src/services/__tests__/*.ts \
  > tests_snapshot.log 2>/dev/null || true

# 11. Combine everything
echo "→ Combining into full_context.log"
cat \
  error_summary.log \
  files_with_errors.log \
  imported_dependencies.log \
  typecheck.log \
  lint.log \
  git_status.log \
  npm_packages.log \
  tsconfig.log \
  code_snapshot.log \
  tests_snapshot.log \
  > full_context.log

# Cleanup temp files
rm -f error_files.tmp error_files_unique.tmp

echo "✅ Done."
echo ""
echo "📄 Output files:"
echo "  • full_context.log        (complete context)"
echo "  • error_summary.log       (error overview)"
echo "  • files_with_errors.log   (files causing errors)"
echo "  • imported_dependencies.log (imported files)"
echo ""
echo "💡 Start with error_summary.log for a quick overview"