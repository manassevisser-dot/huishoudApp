#!/usr/bin/env bash
# chain_check.sh — Architecture Chain Validator voor Project Phoenix
# ══════════════════════════════════════════════════════════════════
# GEEN set -e of pipefail: grep retourneert exit 1 bij 0 matches.

set -u

OUTFILE="chain_report.txt"
STRICT=0

while [[ $# -gt 0 ]]; do
  case "$1" in
    -o|--output) OUTFILE="$2"; shift 2;;
    --strict)    STRICT=1; shift;;
    -h|--help)   echo "Usage: $(basename "$0") [-o output.txt] [--strict]"; exit 0;;
    *)           echo "Onbekende optie: $1" >&2; exit 1;;
  esac
done

ERRORS=0
WARNINGS=0

# ── Helpers ─────────────────────────────────────────────────────

section()    { printf "\n═══ %s ═══\n%s\n" "$1" "----------------------------------------------------------------------"; }
check_pass() { printf "  ✅ %s\n" "$1"; }
check_fail() { printf "  ❌ %s\n" "$1"; ERRORS=$((ERRORS + 1)); }
check_warn() { printf "  ⚠️  %s\n" "$1"; WARNINGS=$((WARNINGS + 1)); }
check_info() { printf "  ℹ️  %s\n" "$1"; }

# Veilige grep — retourneert altijd exit 0
sg() { grep "$@" 2>/dev/null || true; }

# Pipe-veilige grep -v — retourneert altijd exit 0
sg_exclude() { grep -v "$@" 2>/dev/null || true; }

# Tel niet-lege regels
# In count_lines: tel ook regels met alleen whitespace niet mee
count_lines() {
  local input="$1"
  if [ -z "$input" ]; then
    echo "0"
  else
    printf "%s" "$input" | grep -c "." || echo "0"
  fi
}

indent() { sed 's/^/      /'; }

# ── Main ────────────────────────────────────────────────────────

{
  printf "ARCHITECTURE CHAIN REPORT — Project Phoenix\n"
  printf "Generated: %s\n" "$(date '+%Y-%m-%d %H:%M:%S')"
  printf "══════════════════════════════════════════════════════════════\n"

  # ════════════════════════════════════════════════════════════════
  # 1. FAÇADE INTEGRITEIT
  # ════════════════════════════════════════════════════════════════
  section "1. FAÇADE INTEGRITEIT — MasterOrchestrator"

  MASTER="src/app/orchestrators/MasterOrchestrator.ts"
  if [ -f "$MASTER" ]; then
    all_imports=$(sg -n "import" "$MASTER")
    leaks=$(printf "%s" "$all_imports" \
      | sg_exclude "FormStateOrchestrator" \
      | sg_exclude "IUIOrchestrator" \
      | sg_exclude "IDataOrchestrator" \
      | sg_exclude "IBusinessOrchestrator" \
      | sg_exclude "IValidationOrchestrator" \
      | sg_exclude "INavigationOrchestrator" \
      | sg_exclude "IThemeOrchestrator" \
      | sg_exclude "validateAtBoundary" \
      | sg_exclude "AuditLoggerAdapter\|logger" \
      | sg_exclude "MasterOrchestratorAPI" \
      | sg_exclude "^\s*$")

    if [ -n "$leaks" ]; then
      check_fail "Master importeert buiten toegestane interfaces:"
      printf "%s\n" "$leaks" | indent
    else
      check_pass "Master kent alleen interfaces + FSO + validator + logger"
    fi

    all_public=$(sg -n "public " "$MASTER")
    unexpected_public=$(printf "%s" "$all_public" \
     | sg_exclude "public readonly ui\|public readonly navigation\|public isVisible\|public updateField\|public.*handleCsv\|public.*Import\|public validate\|public canNavigate\|public onNavigate\|public.*Theme" \
     | sg_exclude "^\s*$")

    if [ -n "$unexpected_public" ]; then
      check_warn "Onverwachte public members op Master:"
      printf "%s\n" "$unexpected_public" | indent
    else
      check_pass "Public API van Master is minimaal"
    fi
  else
    check_fail "MasterOrchestrator.ts niet gevonden op $MASTER"
  fi

  # ════════════════════════════════════════════════════════════════
  # 2. INTERFACE COMPLIANCE
  # ════════════════════════════════════════════════════════════════
  section "2. INTERFACE COMPLIANCE"

  check_impl() {
    local file="$1" iface="$2"
    if [ -f "$file" ]; then
      if sg -q "implements $iface" "$file"; then
        check_pass "$(basename "$file") implements $iface"
      else
        check_fail "$(basename "$file") mist 'implements $iface'"
      fi
    fi
  }

  for dir in "src/app/orchestrators" "src/app/orchestrators/managers"; do
    [ -f "$dir/UIManager.ts" ]       && check_impl "$dir/UIManager.ts"       "IUIOrchestrator"
    [ -f "$dir/DataManager.ts" ]     && check_impl "$dir/DataManager.ts"     "IDataOrchestrator"
    [ -f "$dir/BusinessManager.ts" ] && check_impl "$dir/BusinessManager.ts" "IBusinessOrchestrator"
  done

  # ════════════════════════════════════════════════════════════════
  # 3. LAAG-GRENZEN
  # ════════════════════════════════════════════════════════════════
  section "3. LAAG-GRENZEN"

  printf "\n  --- Domain puurheid ---\n"

  domain_ui_hits=$(sg -rn "@ui\|from.*ui/" src/domain/ --include="*.ts" --include="*.tsx")
  domain_rn_hits=$(sg -rn "react-native" src/domain/ --include="*.ts" --include="*.tsx")
  domain_app_hits=$(sg -rn "@app\|from.*app/" src/domain/ --include="*.ts" --include="*.tsx")

  domain_ui_count=$(count_lines "$domain_ui_hits")
  domain_rn_count=$(count_lines "$domain_rn_hits")
  domain_app_count=$(count_lines "$domain_app_hits")

  [ "$domain_ui_count" -eq 0 ]  && check_pass "Domain importeert geen @ui" \
                                 || check_fail "Domain importeert @ui ($domain_ui_count hits)"
  [ "$domain_rn_count" -eq 0 ]  && check_pass "Domain importeert geen react-native" \
                                 || check_fail "Domain importeert react-native ($domain_rn_count hits)"
  [ "$domain_app_count" -eq 0 ] && check_pass "Domain importeert geen @app" \
                                 || check_fail "Domain importeert @app ($domain_app_count hits)"

  if [ "$domain_ui_count" -gt 0 ] || [ "$domain_rn_count" -gt 0 ] || [ "$domain_app_count" -gt 0 ]; then
    printf "\n  Details:\n"
    [ -n "$domain_ui_hits" ]  && printf "%s\n" "$domain_ui_hits"  | indent
    [ -n "$domain_rn_hits" ]  && printf "%s\n" "$domain_rn_hits"  | indent
    [ -n "$domain_app_hits" ] && printf "%s\n" "$domain_app_hits" | indent
  fi

  printf "\n  --- Orchestrator → UI grens ---\n"

  orch_all=$(sg -rn "@ui\|from.*ui/" src/app/orchestrators/ --include="*.ts" --include="*.tsx")
  orch_ui=$(printf "%s" "$orch_all" \
    | sg_exclude "UiComponentStyles" \
    | sg_exclude "^\s*$")

  if [ -n "$orch_ui" ]; then
    check_fail "Orchestrators importeren uit UI-laag:"
    printf "%s\n" "$orch_ui" | indent
  else
    check_pass "Orchestrators importeren niet uit UI-laag"
  fi

  printf "\n  --- UI → Orchestrator grens ---\n"

  screen_all=$(sg -rn "from.*orchestrators/" src/ui/ --include="*.ts" --include="*.tsx")
  screen_orch=$(printf "%s" "$screen_all" \
    | sg_exclude "node_modules\|__tests__" \
    | sg_exclude "^\s*$")

  if [ -n "$screen_orch" ]; then
    check_warn "UI-bestanden importeren direct uit orchestrators:"
    printf "%s\n" "$screen_orch" | indent
  else
    check_pass "UI importeert geen orchestrators direct"
  fi

  # ════════════════════════════════════════════════════════════════
  # 4. CONTEXT LEAKAGE
  # ════════════════════════════════════════════════════════════════
  section "4. CONTEXT LEAKAGE — dispatch bypass"

  dispatch_all=$(sg -rn "\.dispatch\b" src/ui/ --include="*.tsx" --include="*.ts")
  dispatch_usage=$(printf "%s" "$dispatch_all" \
    | sg_exclude "__tests__\|node_modules\|Provider\|context" \
    | sg_exclude "^\s*$")

  if [ -n "$dispatch_usage" ]; then
    check_warn "UI roept dispatch direct aan (bypass façade):"
    printf "%s\n" "$dispatch_usage" | indent
  else
    check_pass "Geen directe dispatch calls in UI-screens"
  fi

  raw_all=$(sg -rn "state\.data\.\|state\.ui\.\|state\.meta\." src/ui/ --include="*.tsx" --include="*.ts")
  raw_state=$(printf "%s" "$raw_all" \
    | sg_exclude "__tests__\|node_modules\|Provider\|context\|formReducer" \
    | sg_exclude "^\s*$")

  if [ -n "$raw_state" ]; then
    raw_count=$(count_lines "$raw_state")
    check_warn "UI leest raw state direct ($raw_count hits, bypass ViewModel):"
    printf "%s\n" "$raw_state" | head -10 | indent
    [ "$raw_count" -gt 10 ] && check_info "... en nog $((raw_count - 10)) meer"
  else
    check_pass "UI leest geen raw state"
  fi

  # ════════════════════════════════════════════════════════════════
  # 5. TYPE SAFETY & UNKNOWN TRACKER
  #
  # BELANGRIJK — 'unknown' vs 'any':
  #   'any'     = type-checking UIT. Altijd een probleem.
  #   'unknown' = type-checking EXTRA STRENG. Correct op boundaries.
  #
  # unknown is GEEN plaag. Het is een signaal:
  #   - In adapters/validators: ✅ correct (boundary layer)
  #   - In orchestrators:       ℹ️  OK op write-pads, review read-pads
  #   - In domain:              ⚠️  verdacht (domein kent zijn types)
  # ════════════════════════════════════════════════════════════════
  section "5. TYPE SAFETY & UNKNOWN TRACKER"

  # ── 5a. 'as any' — ALTIJD een probleem ───────────────────────
  # 'as any' schakelt type-checking uit. Elk gebruik is een risico.

  any_all=$(sg -rn "as any" src/ --include="*.ts" --include="*.tsx")
 any_filtered=$(printf "%s" "$any_all" \
    | sg_exclude "node_modules\|__tests__\|__mocks__\|test-utils\|tests\|\.test\.ts\|\.spec\.ts" \
    | sg_exclude "^\s*$")
  any_count=$(count_lines "$any_filtered")

  if [ "$any_count" -eq 0 ]; then
    check_pass "Geen 'as any' gevonden"
  else
    check_warn "'as any' gevonden: $any_count hits — schakelt type-safety uit"
    printf "%s\n" "$any_filtered" | head -10 | indent
  fi

  # ── 5b. '(state as any)' — KRITIEK ───────────────────────────
  # Wijst op ontbrekende FormState types

  state_any_hits=$(sg -rn "(state as any)" src/ --include="*.ts" --include="*.tsx" \
    | sg_exclude "__tests__\|__mocks__\|test-utils\|tests\|\.test\.ts\|\.spec\.ts")
  state_any_count=$(count_lines "$state_any_hits")

  if [ "$state_any_count" -gt 0 ]; then
    check_fail "(state as any) casts: $state_any_count hits — FormState type incompleet"
    printf "%s\n" "$state_any_hits" | indent
  fi

  # ── 5c. ': any' in signatures — PROBLEEM ─────────────────────
  # Parameters/returns getypt als 'any' laten onveilige data door

  sig_any_all=$(sg -rn ": any\b\|: any;" src/ --include="*.ts" --include="*.tsx")
sig_any=$(printf "%s" "$sig_any_all" \
    | sg_exclude "node_modules\|__tests__\|__mocks__\|test-utils\|tests\|\.test\.ts\|\.spec\.ts\|as any" \
    | sg_exclude "^\s*$")
  sig_any_count=$(count_lines "$sig_any")

  if [ "$sig_any_count" -eq 0 ]; then
    check_pass "Geen ': any' in signatures"
  else
    check_warn "': any' in signatures: $sig_any_count hits — overweeg specifieke types"
    printf "%s\n" "$sig_any" | head -10 | indent
  fi

  # ── 5d. 'unknown' per laag — INFORMATIEF ─────────────────────

  printf "\n  --- unknown-gebruik per laag (informatief, geen fout) ---\n"

  # unknown in domain = verdacht (domain kent zijn types)
  domain_unknown_all=$(sg -rn ": unknown\b\|unknown>" src/domain/ --include="*.ts")
  domain_unknown=$(printf "%s" "$domain_unknown_all" \
    | sg_exclude "node_modules\|__tests__" \
    | sg_exclude "^\s*$")
  domain_unknown_count=$(count_lines "$domain_unknown")

  if [ "$domain_unknown_count" -eq 0 ]; then
    check_pass "Geen 'unknown' in domain/ (domein kent zijn types)"
  else
    check_info "unknown in domain/: $domain_unknown_count hits — review of dit boundary-input is"
    printf "%s\n" "$domain_unknown" | head -5 | indent
  fi

  # unknown in adapters/validators = correct (daar hoort het)
  adapter_unknown_all=$(sg -rn ": unknown\b\|unknown>" src/adapters/ --include="*.ts")
  adapter_unknown=$(printf "%s" "$adapter_unknown_all" \
    | sg_exclude "node_modules\|__tests__" \
    | sg_exclude "^\s*$")
  adapter_unknown_count=$(count_lines "$adapter_unknown")

  if [ "$adapter_unknown_count" -gt 0 ]; then
    check_pass "unknown in adapters/: $adapter_unknown_count hits (correct — boundary layer)"
  fi

  # unknown in orchestrators = acceptabel op write-pads
  orch_unknown_all=$(sg -rn ": unknown\b\|unknown>" src/app/orchestrators/ --include="*.ts")
  orch_unknown=$(printf "%s" "$orch_unknown_all" \
    | sg_exclude "node_modules\|__tests__" \
    | sg_exclude "^\s*$")
  orch_unknown_count=$(count_lines "$orch_unknown")

  if [ "$orch_unknown_count" -gt 0 ]; then
    check_info "unknown in orchestrators/: $orch_unknown_count hits — OK op write-pads, verdacht op read-pads"
  fi

  # ── 5e. Dubbele type/interface definities ─────────────────────

  printf "\n  --- Dubbele type/interface definities ---\n"

  type_exports=$(sg -rn "export \(interface\|type\) " src/ --include="*.ts" --include="*.tsx")
  type_filtered=$(printf "%s" "$type_exports" | sg_exclude "node_modules\|__tests__")
  type_names=$(printf "%s" "$type_filtered" \
    | sed -E 's/.*export (interface|type) ([A-Za-z]+).*/\2/' \
    | sort | uniq -c | sort -rn)
  dupes=$(printf "%s" "$type_names" | awk '$1 > 1' || true)

  if [ -n "$dupes" ]; then
    check_warn "Types met meerdere definities:"
    printf "%s\n" "$dupes" | indent
  else
    check_pass "Geen dubbele type-definities"
  fi

  # ════════════════════════════════════════════════════════════════
  # 6. STYLE CHAIN
  # ════════════════════════════════════════════════════════════════
  section "6. STYLE CHAIN VALIDATIE"

  platform_hits=$(sg -rn "Platform\.\|from 'react-native'" src/domain/ --include="*.ts")
  platform_count=$(count_lines "$platform_hits")

  if [ "$platform_count" -eq 0 ]; then
    check_pass "Geen Platform/react-native in domain/"
  else
    check_fail "Platform/react-native in domain/ ($platform_count hits):"
    printf "%s\n" "$platform_hits" | indent
  fi

  if [ -d "src/domain/styles/modules" ]; then
    layout_all=$(sg -rn "flexDirection:\|justifyContent:\|alignItems:" src/domain/styles/modules/ --include="*.ts")
    inline_layout=$(printf "%s" "$layout_all" \
      | sg_exclude "LayoutTokens\|Layout\.\|flex-start\|from\|import" \
      | sg_exclude "^\s*$")

    if [ -n "$inline_layout" ]; then
      il_count=$(count_lines "$inline_layout")
      check_warn "Inline layout-patronen in modules ($il_count):"
      printf "%s\n" "$inline_layout" | head -5 | indent
    else
      check_pass "Modules gebruiken LayoutTokens"
    fi
  else
    check_info "src/domain/styles/modules/ bestaat nog niet"
  fi

  mod_all=$(sg -rn "from.*styles/modules/" src/ --include="*.ts" --include="*.tsx")
  direct_mod=$(printf "%s" "$mod_all" \
    | sg_exclude "StyleRegistry\|modules/index\|__tests__\|node_modules" \
    | sg_exclude "src/domain/styles/modules/\|src/domain/registry/" \
    | sg_exclude "^\s*$")

  if [ -n "$direct_mod" ]; then
    check_warn "Directe module-imports buiten StyleRegistry om:"
    printf "%s\n" "$direct_mod" | indent
  else
    check_pass "Alle module-imports gaan via StyleRegistry"
  fi

  # ════════════════════════════════════════════════════════════════
  # 7. COMPONENTORCHESTRATOR
  # ════════════════════════════════════════════════════════════════
  section "7. COMPONENTORCHESTRATOR"

  COMP_ORCH="src/app/orchestrators/ComponentOrchestrator.ts"
  if [ -f "$COMP_ORCH" ]; then
    export_count=$(sg -c "export class\|export default\|export function" "$COMP_ORCH")
    if [ "$export_count" -gt 0 ]; then
      check_pass "ComponentOrchestrator heeft exports"
    else
      check_fail "ComponentOrchestrator heeft GEEN exports"
    fi

    comp_ui_all=$(sg "from.*@ui" "$COMP_ORCH")
    comp_ui=$(printf "%s" "$comp_ui_all" | sg_exclude "UiComponentStyles" | sg_exclude "^\s*$")
    if [ -n "$comp_ui" ]; then
      check_fail "ComponentOrchestrator importeert @ui (niet-UiComponentStyles):"
      printf "%s\n" "$comp_ui" | indent
    else
      check_pass "ComponentOrchestrator @ui imports OK"
    fi

    comp_rn=$(sg "react-native" "$COMP_ORCH")
    if [ -n "$comp_rn" ]; then
      check_fail "ComponentOrchestrator importeert react-native:"
      printf "%s\n" "$comp_rn" | indent
    else
      check_pass "ComponentOrchestrator is react-native vrij"
    fi
  else
    check_info "ComponentOrchestrator niet gevonden op $COMP_ORCH"
  fi

  # ════════════════════════════════════════════════════════════════
  # 8. HOOK / PROVIDER CHAIN
  # ════════════════════════════════════════════════════════════════
  section "8. HOOK / PROVIDER CHAIN"

  HOOK=""
  for candidate in "src/app/context/useStableOrchestrator.ts" "src/ui/providers/useStableOrchestrator.ts"; do
    [ -f "$candidate" ] && HOOK="$candidate" && break
  done

  if [ -n "$HOOK" ]; then
    check_info "Gevonden: $HOOK"
    for cluster in UIManager DataManager BusinessManager; do
      if sg -q "new $cluster" "$HOOK"; then
        check_pass "Hook instantieert $cluster"
      else
        check_fail "Hook instantieert $cluster NIET"
      fi
    done

    # ADR-02: Master verwacht cluster-objecten
    if sg -q "new MasterOrchestrator(fso, {" "$HOOK"; then
      check_pass "Master gebruikt correcte cluster-objecten (ADR-02)"
    else
      check_fail "Master mist cluster-syntax. Verwacht: new MasterOrchestrator(fso, { data... }, { ui... })"
    fi
  else
    check_warn "useStableOrchestrator niet gevonden"
  fi

  # ════════════════════════════════════════════════════════════════
  # 9. FIELD RENDERER & FIELDS
  # ════════════════════════════════════════════════════════════════
  section "9. FIELD RENDERER & FIELDS"

  if [ -d "src/ui/components/fields" ]; then
    fd_all=$(sg -rn "@domain" src/ui/components/fields/ --include="*.tsx" --include="*.ts")
    field_domain=$(printf "%s" "$fd_all" | sg_exclude "__tests__" | sg_exclude "^\s*$")

    if [ -n "$field_domain" ]; then
      check_warn "Field components importeren uit @domain:"
      printf "%s\n" "$field_domain" | indent
    else
      check_pass "Field components zijn domain-vrij"
    fi

    fl_all=$(sg -rn "if.*state\.\|switch.*state\.\|useMemo.*state\." src/ui/components/fields/ --include="*.tsx")
    field_logic=$(printf "%s" "$fl_all" | sg_exclude "__tests__" | sg_exclude "^\s*$")

    if [ -n "$field_logic" ]; then
      check_warn "Field components bevatten state-logica:"
      printf "%s\n" "$field_logic" | head -5 | indent
    else
      check_pass "Field components bevatten geen state-logica"
    fi
  else
    check_info "src/ui/components/fields/ niet gevonden"
  fi

  # ════════════════════════════════════════════════════════════════
  # 10. ORPHAN CHECK
  # ════════════════════════════════════════════════════════════════
  section "10. ORPHAN CHECK (orchestrators)"

  printf "\n"
  for f in src/app/orchestrators/*.ts; do
    [ -f "$f" ] || continue
    stem=$(basename "$f" | sed -E 's/\.(ts|tsx)$//')
    imp_all=$(sg -rn "from.*$stem" src/ --include="*.ts" --include="*.tsx")
    imp_filtered=$(printf "%s" "$imp_all" \
      | sg_exclude "^$f:" \
      | sg_exclude "__tests__\|node_modules" \
      | sg_exclude "^\s*$")
    imp_count=$(count_lines "$imp_filtered")

    if [ "$imp_count" -eq 0 ]; then
      check_warn "$(basename "$f") heeft geen importers — orphan?"
    fi
  done

  # ════════════════════════════════════════════════════════════════
  # 11. ZOD ISOLATION (ADR-01)
  # ════════════════════════════════════════════════════════════════
  section "11. ZOD ISOLATION (ADR-01)"

  # sg_exclude ipv --exclude-dir (werkt betrouwbaarder met onze sg helper)
  zod_all=$(sg -rn "from 'zod'\|from \"zod\"\|import.*zod" src/ --include="*.ts" --include="*.tsx")
  zod_leaks=$(printf "%s" "$zod_all" \
    | sg_exclude "adapters/validation\|node_modules\|__tests__" \
    | sg_exclude "^\s*$")

  if [ -n "$zod_leaks" ]; then
    check_fail "Zod wordt buiten de Adapter-laag gebruikt:"
    printf "%s\n" "$zod_leaks" | indent
  else
    check_pass "Zod is correct geïsoleerd in de Adapter-laag"
  fi

  # ════════════════════════════════════════════════════════════════
  # SAMENVATTING
  # ════════════════════════════════════════════════════════════════
  section "SAMENVATTING"

  printf "\n"
  printf "  Fouten:         %d\n" "$ERRORS"
  printf "  Waarschuwingen: %d\n" "$WARNINGS"
  printf "\n"

  if [ "$ERRORS" -eq 0 ] && [ "$WARNINGS" -eq 0 ]; then
    printf "  🏆 Keten is schoon!\n"
  elif [ "$ERRORS" -eq 0 ]; then
    printf "  ✅ Geen blokkers, maar %d waarschuwingen om te bekijken.\n" "$WARNINGS"
  else
    printf "  🚨 %d fout(en) gevonden — fix deze eerst.\n" "$ERRORS"
  fi

} > "$OUTFILE" 2>&1

cat "$OUTFILE"
printf "\n📄 Rapport geschreven naar: %s\n" "$OUTFILE"

[ "$STRICT" -eq 1 ] && [ "$ERRORS" -gt 0 ] && exit 1
exit 0