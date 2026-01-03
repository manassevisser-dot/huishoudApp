#!/usr/bin/env bash
# Field ID Migration: field.id → field.fieldId
# Hardened version V5 (With Suggestions Block)

set -euo pipefail

# === ERROR HANDLING ===
on_error() {
    local line=$1
    echo "❌ Script failed at line $line" >&2
    [[ -f "${TMP_COUNT:-}" ]] && rm -f "$TMP_COUNT"
    [[ -f "${BACKUP_LIST:-}" ]] && {
        echo "🔄 Restoring backups..." >&2
        while IFS= read -r backup; do
            [[ -f "$backup" ]] && {
                original="${backup%.bak.*}"
                mv "$backup" "$original"
                echo "   Restored: $original" >&2
            }
        done < "$BACKUP_LIST"
        rm -f "$BACKUP_LIST"
    }
    exit 1
}
trap 'on_error $LINENO' ERR

# === CONFIGURATION ===
TARGET_DIR="${1:-src/ui}"
# Lees environment variabelen, default naar false/true
DRY_RUN="${DRY_RUN:-false}"
BACKUP="${BACKUP:-true}"
VERBOSE="${VERBOSE:-false}"

# Regex patterns
OLD_PATTERN='field\.id'
NEW_PATTERN='field.fieldId'

# Temp files
TMP_COUNT=$(mktemp)
BACKUP_LIST=$(mktemp)
echo "0" > "$TMP_COUNT"

# === PORTABLE SED ===
if sed --version >/dev/null 2>&1; then
    SED_INPLACE=(-i)  # GNU sed
else
    SED_INPLACE=(-i '')  # BSD/macOS sed
fi

# === UI ===
if [[ -t 1 ]] && [[ -z "${NO_COLOR:-}" ]]; then
    ICON_OK="✅"; ICON_FAIL="❌"; ICON_WARN="⚠️"; ICON_INFO="ℹ️"
    GREEN='\033[0;32m'; YELLOW='\033[0;33m'; RED='\033[0;31m'
    BLUE='\033[0;34m'; BOLD='\033[1m'; DIM='\033[2m'; NC='\033[0m'
else
    ICON_OK="[OK]"; ICON_FAIL="[FAIL]"; ICON_WARN="[WARN]"; ICON_INFO="[INFO]"
    GREEN=''; YELLOW=''; RED=''; BLUE=''; BOLD=''; DIM=''; NC=''
fi

log_info() { echo -e "${BLUE}${ICON_INFO} $*${NC}"; }
log_ok() { echo -e "${GREEN}${ICON_OK} $*${NC}"; }
log_warn() { echo -e "${YELLOW}${ICON_WARN} $*${NC}"; }
log_error() { echo -e "${RED}${ICON_FAIL} $*${NC}" >&2; }
log_verbose() { [[ "$VERBOSE" == "true" ]] && echo -e "${DIM}   [DEBUG] $*${NC}"; }

# === PRE-FLIGHT CHECKS ===
log_info "🔍 Field ID Migration: field.id → field.fieldId"

if [[ ! -d "$TARGET_DIR" ]]; then
    log_error "Target directory not found: $TARGET_DIR"
    exit 1
fi

if [[ "$DRY_RUN" == "true" ]]; then
    log_warn "DRY-RUN MODE (no files will be modified)"
fi

# Check if pattern exists anywhere
if ! grep -rq "$OLD_PATTERN" "$TARGET_DIR" --include="*.tsx" 2>/dev/null; then
    log_ok "No files found needing migration"
    rm -f "$TMP_COUNT" "$BACKUP_LIST"
    exit 0
fi

echo ""
log_info "Scanning: $TARGET_DIR"
log_verbose "Pattern: '$OLD_PATTERN' → '$NEW_PATTERN'"
echo ""

# === MIGRATION ===
while IFS= read -r file; do
    # Check if file contains pattern
    if ! grep -q "$OLD_PATTERN" "$file" 2>/dev/null; then
        continue
    fi
    
    # Count occurrences (SAFE MODE)
    count=$(grep -oE "$OLD_PATTERN" "$file" 2>/dev/null | wc -l | tr -d ' ' || echo "0")
    
    echo -e "${GREEN}→${NC} $file ${DIM}(${count} occurrences)${NC}"
    
    if [[ "$DRY_RUN" == "false" ]]; then
        # Create backup
        if [[ "$BACKUP" == "true" ]]; then
            backup="${file}.bak.$(date -u +%Y%m%d_%H%M%S)"
            cp -p "$file" "$backup"
            echo "$backup" >> "$BACKUP_LIST"
            log_verbose "Backup: $backup"
        fi
        
        # Perform replacement (atomic)
        tmp="${file}.tmp.$$"
        
        # FIX: Gebruik altijd standaard sed zonder -i, schrijf naar tmp file
        sed "s/${OLD_PATTERN}/${NEW_PATTERN}/g" "$file" > "$tmp"
        
        # Verify change was made
        if ! grep -qF "field.fieldId" "$tmp" 2>/dev/null; then
            log_warn "No changes detected in: $file (sed might have failed matching)"
            rm -f "$tmp"
            continue
        fi
        
        # Atomic move
        mv "$tmp" "$file"
    fi
    
    # Increment counter
    curr=$(cat "$TMP_COUNT")
    echo $((curr + 1)) > "$TMP_COUNT"
    
done < <(find "$TARGET_DIR" -name "*.tsx" -type f)

# === SUMMARY ===
FINAL_COUNT=$(cat "$TMP_COUNT")
rm -f "$TMP_COUNT"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [[ "$FINAL_COUNT" -eq 0 ]]; then
    log_ok "No files needed migration"
else
    if [[ "$DRY_RUN" == "true" ]]; then
        log_ok "Dry-run complete: Would modify $FINAL_COUNT file(s)"
        log_info "Run without DRY_RUN=true to apply changes"
    else
        log_ok "Migration complete: Modified $FINAL_COUNT file(s)"
        
        if [[ "$BACKUP" == "true" ]] && [[ -s "$BACKUP_LIST" ]]; then
            backup_count=$(wc -l < "$BACKUP_LIST" | tr -d ' ')
            log_info "Created $backup_count backup(s) with .bak.* extension"
            echo -e "${DIM}   To remove: find $TARGET_DIR -name '*.bak.*' -delete${NC}"
        fi
    fi
fi

# Clean up backup list
[[ -f "$BACKUP_LIST" ]] && rm -f "$BACKUP_LIST"

# === VALIDATION ===
if [[ "$DRY_RUN" == "false" ]] && [[ "$FINAL_COUNT" -gt 0 ]]; then
    echo ""
    log_info "🧪 Running TypeScript validation..."
    
    if npx tsc --noEmit; then
        log_ok "TEST PASSED: No type errors found"
    else
        log_error "TEST FAILED: TypeScript errors detected"
        echo ""
        log_warn "Check output above for details"
        log_info "Backups available in $TARGET_DIR/*.bak.*"
        exit 1
    fi
fi

echo ""
log_ok "✨ Migration complete!"

# === SUGGESTIONS (Hersteld) ===
if [[ "$DRY_RUN" == "false" ]] && [[ "$FINAL_COUNT" -gt 0 ]]; then
    echo ""
    log_info "Recommended next steps:"
    echo -e "${DIM}   1. Review changes: git diff $TARGET_DIR${NC}"
    echo -e "${DIM}   2. Run tests: npm test${NC}"
    echo -e "${DIM}   3. Check linting: npm run lint${NC}"
    echo -e "${DIM}   4. Stage changes: git add $TARGET_DIR${NC}"
fi

exit 0