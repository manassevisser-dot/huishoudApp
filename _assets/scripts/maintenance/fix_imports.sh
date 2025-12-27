#!/usr/bin/env bash
# Ultimate Import Path Fixer v2.0
# Migreert alleen relatieve imports (zonder @) naar moderne @ aliases

set -euo pipefail

# === ERROR HANDLING ===
on_error() {
    echo -e "${RED}${ICON_FAIL} Script failed at line $1${NC}" >&2
    exit 1
}
trap 'on_error $LINENO' ERR

# === CONFIGURATION ===
DRY_RUN=false
VERBOSE=false
BACKUP=true
STATS_ENABLED=true

# Parse arguments
while [[ $# -gt 0 ]]; do
    case "$1" in
        --dry-run|-d) DRY_RUN=true; shift ;;
        --verbose|-v) VERBOSE=true; shift ;;
        --no-backup) BACKUP=false; shift ;;
        --help|-h)
            cat <<'HELP'
Usage: fix-imports.sh [OPTIONS]

Migrates relative imports to @ aliases in TypeScript files.
Only processes imports WITHOUT @ prefix (skips already migrated paths).

Options:
  --dry-run, -d      Show what would change without modifying files
  --verbose, -v      Show detailed processing information
  --no-backup        Skip creating .bak files
  --help, -h         Show this help message

Examples:
  ./fix-imports.sh                    # Normal run with backups
  ./fix-imports.sh --dry-run          # Preview changes
  ./fix-imports.sh -d -v              # Preview with details
  ./fix-imports.sh --no-backup        # Skip backups (faster)
HELP
            exit 0
            ;;
        *) echo "Unknown option: $1"; exit 1 ;;
    esac
done

# === UI SETUP ===
if [[ -t 1 ]] && [[ -z "${NO_COLOR:-}" ]]; then
    ICON_OK="✅"; ICON_FAIL="❌"; ICON_WARN="⚠️"; ICON_INFO="ℹ️"
    GREEN='\033[0;32m'; YELLOW='\033[0;33m'; RED='\033[0;31m'
    BLUE='\033[0;34m'; BOLD='\033[1m'; DIM='\033[2m'; NC='\033[0m'
else
    ICON_OK="[OK]"; ICON_FAIL="[FAIL]"; ICON_WARN="[WARN]"; ICON_INFO="[INFO]"
    GREEN=''; YELLOW=''; RED=''; BLUE=''; BOLD=''; DIM=''; NC=''
fi

# === PORTABLE SED DETECTION ===
if sed --version >/dev/null 2>&1; then
    SED_INPLACE=(-i)  # GNU sed
else
    SED_INPLACE=(-i '')  # BSD/macOS sed
fi

# === STATISTICS ===
declare -A STATS=(
    [files_scanned]=0
    [files_modified]=0
    [imports_fixed]=0
    [backups_created]=0
)

# === LOGGING ===
log_info() { echo -e "${BLUE}${ICON_INFO} $*${NC}"; }
log_success() { echo -e "${GREEN}${ICON_OK} $*${NC}"; }
log_warn() { echo -e "${YELLOW}${ICON_WARN} $*${NC}"; }
log_error() { echo -e "${RED}${ICON_FAIL} $*${NC}" >&2; }
log_verbose() { [[ "$VERBOSE" == "true" ]] && echo -e "${DIM}   [DEBUG] $*${NC}"; }

# === HELPER FUNCTIONS ===

# Escape string for use in sed pattern/replacement
escape_sed() {
    printf '%s' "$1" | sed -e 's/[\/&]/\\&/g' -e 's/[.[\*^$]/\\&/g'
}

# Find TS files containing a specific string (literal match)

find_ts_files_with() {
  local needle="$1"
  # Non-blocking: start grep alleen als find daadwerkelijk files oplevert (GNU+macOS compatibel)
  find src -type f \( -name '*.ts' -o -name '*.tsx' \) -exec grep -lF -- "$needle" {} + 2>/dev/null || true
}


# Check if file contains imports that are already using @ aliases
has_at_prefix() {
    local pattern="$1"
    local file="$2"
    # Check if the file has the pattern with @ prefix already
    grep -qF "@${pattern#src/}" "$file" 2>/dev/null && return 0
    return 1
}

# Create backup of file
create_backup() {
    local file="$1"
    local backup="${file}.bak.$(date -u +%Y%m%d_%H%M%S)"
    cp -p "$file" "$backup"
    log_verbose "Backup created: $backup"
    ((STATS[backups_created]++))
}

# Process a single migration pattern
update_imports() {
    local old_pattern="$1"
    local new_pattern="$2"
    local label="$3"
    
    echo -e "\n${BOLD}${label}${NC}"
    log_verbose "Pattern: '$old_pattern' → '$new_pattern'"
    
    # Find files with the OLD pattern (literal match)
    mapfile -t files < <(find_ts_files_with "$old_pattern")
    
    if [[ ${#files[@]} -eq 0 ]]; then
        echo -e "${DIM}   (no matches found)${NC}"
        return
    fi
    
    ((STATS[files_scanned]+=${#files[@]}))
    
    # Escape for sed
    local esc_old esc_new
    esc_old="$(escape_sed "$old_pattern")"
    esc_new="$(escape_sed "$new_pattern")"
    
    local files_changed=0
    
    for file in "${files[@]}"; do
        # Skip if already migrated (has @ prefix)
        if has_at_prefix "$old_pattern" "$file"; then
            log_verbose "Skip (already migrated): $file"
            continue
        fi
        
        # Count occurrences before change
        local count_before
        count_before=$(grep -cF "$old_pattern" "$file" 2>/dev/null || echo 0)
        
        if [[ "$count_before" -eq 0 ]]; then
            log_verbose "Skip (no literal matches): $file"
            continue
        fi
        
        echo -e "   ${GREEN}→${NC} $file ${DIM}(${count_before} imports)${NC}"
        
        if [[ "$DRY_RUN" == "false" ]]; then
            # Create backup if enabled
            [[ "$BACKUP" == "true" ]] && create_backup "$file"
            
            # Perform replacement
            sed "${SED_INPLACE[@]}" "s|${esc_old}|${esc_new}|g" "$file"
            
            # Verify change
            local count_after
            count_after=$(grep -cF "$old_pattern" "$file" 2>/dev/null || echo 0)
            
            if [[ "$count_after" -lt "$count_before" ]]; then
                ((files_changed++))
                ((STATS[imports_fixed]+=$((count_before - count_after))))
            else
                log_warn "No changes applied to $file (pattern might be regex-special)"
            fi
        else
            ((files_changed++))
            ((STATS[imports_fixed]+=count_before))
        fi
    done
    
    ((STATS[files_modified]+=files_changed))
    
    if [[ "$files_changed" -gt 0 ]]; then
        echo -e "   ${GREEN}${ICON_OK} Updated ${files_changed} file(s)${NC}"
    fi
}

# === MAIN EXECUTION ===
echo -e "${BOLD}${BLUE}🔧 Ultimate Import Path Fixer v2.0${NC}"

if [[ "$DRY_RUN" == "true" ]]; then
    log_warn "DRY-RUN MODE (no files will be modified)"
fi

# Check if src directory exists
if [[ ! -d "src" ]]; then
    log_error "Directory 'src' not found. Run from project root."
    exit 1
fi

# === MIGRATION PATTERNS ===
# Format: old_pattern new_pattern label

echo -e "\n${BOLD}📦 Context Migration${NC}"
update_imports "src/context" "@app/context" "src/context → @app/context"
update_imports "../../context" "@app/context" "../../context → @app/context"
update_imports "../context" "@app/context" "../context → @app/context"
update_imports "./context" "@app/context" "./context → @app/context (same-level)"

echo -e "\n${BOLD}🧭 Navigation Migration${NC}"
update_imports "src/navigation" "@ui/navigation" "src/navigation → @ui/navigation"
update_imports "../../navigation" "@ui/navigation" "../../navigation → @ui/navigation"
update_imports "../navigation" "@ui/navigation" "../navigation → @ui/navigation"

echo -e "\n${BOLD}🖥  Screens Migration${NC}"
update_imports "src/screens" "@ui/screens" "src/screens → @ui/screens"
update_imports "../../screens" "@ui/screens" "../../screens → @ui/screens"
update_imports "../screens" "@ui/screens" "../screens → @ui/screens"

# === ADDITIONAL COMMON PATTERNS ===
echo -e "\n${BOLD}🎨 Styles Migration${NC}"
update_imports "src/styles" "@ui/styles" "src/styles → @ui/styles"
update_imports "../../styles" "@ui/styles" "../../styles → @ui/styles"
update_imports "../styles" "@ui/styles" "../styles → @ui/styles"

echo -e "\n${BOLD}🧩 Components Migration${NC}"
update_imports "src/components" "@ui/components" "src/components → @ui/components"
update_imports "../../components" "@ui/components" "../../components → @ui/components"
update_imports "../components" "@ui/components" "../components → @ui/components"

echo -e "\n${BOLD}🔧 Utils Migration${NC}"
update_imports "src/utils" "@/utils" "src/utils → @/utils"
update_imports "../../utils" "@/utils" "../../utils → @/utils"
update_imports "../utils" "@/utils" "../utils → @/utils"

echo -e "\n${BOLD}📊 Domain Migration${NC}"
update_imports "src/domain" "@/domain" "src/domain → @/domain"
update_imports "../../domain" "@/domain" "../../domain → @/domain"
update_imports "../domain" "@/domain" "../domain → @/domain"

echo -e "\n${BOLD}🔌 Services Migration${NC}"
update_imports "src/services" "@/services" "src/services → @/services"
update_imports "../../services" "@/services" "../../services → @/services"
update_imports "../services" "@/services" "../services → @/services"

# === STATISTICS REPORT ===
if [[ "$STATS_ENABLED" == "true" ]]; then
    echo -e "\n${BOLD}${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BOLD}📊 Migration Statistics${NC}"
    echo -e "${BOLD}${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "Files scanned:    ${BOLD}${STATS[files_scanned]}${NC}"
    echo -e "Files modified:   ${BOLD}${GREEN}${STATS[files_modified]}${NC}"
    echo -e "Imports fixed:    ${BOLD}${GREEN}${STATS[imports_fixed]}${NC}"
    
    if [[ "$BACKUP" == "true" && "$DRY_RUN" == "false" ]]; then
        echo -e "Backups created:  ${BOLD}${STATS[backups_created]}${NC}"
    fi
    
    echo -e "${BOLD}${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
fi

# === FINAL STATUS ===
echo ""
if [[ "$DRY_RUN" == "true" ]]; then
    log_success "Dry-run completed — no files modified"
    log_info "Run without --dry-run to apply changes"
else
    log_success "Import migration completed!"
    
    if [[ "${STATS[files_modified]}" -eq 0 ]]; then
        log_info "All imports are already up-to-date"
    else
        log_info "Modified ${STATS[files_modified]} file(s)"
        
        if [[ "$BACKUP" == "true" ]]; then
            log_info "Backups saved with .bak.* extension"
            echo -e "${DIM}   To remove backups: find src -name '*.bak.*' -delete${NC}"
        fi
    fi
fi

# === VERIFICATION SUGGESTION ===
if [[ "$DRY_RUN" == "false" && "${STATS[files_modified]}" -gt 0 ]]; then
    echo ""
    log_info "Recommended verification steps:"
    echo -e "${DIM}   1. Run your linter: npm run lint${NC}"
    echo -e "${DIM}   2. Check TypeScript: npx tsc --noEmit${NC}"
    echo -e "${DIM}   3. Run tests: npm test${NC}"
    echo -e "${DIM}   4. Git diff: git diff src/${NC}"
fi

exit 0