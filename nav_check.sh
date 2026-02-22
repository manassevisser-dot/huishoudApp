#!/usr/bin/env bash
# nav_check_v2.sh — Edge-case audit voor unknown/legacy currentPageId
# Robuust, fail-soft, met duidelijke secties en diffs.

# -------- Settings (fail-soft) --------
set -o errexit
set -o pipefail
# bewust GEEN 'set -u' (onbehandelde lege vars mogen niet aborten)

# -------- Helpers --------
log() { printf "%b\n" "$*"; }
warn() { printf "⚠️  %b\n" "$*" >&2; }
hr() { printf "%s\n" "=========================="; }
section() { hr; printf "%s\n" "$1"; hr; }

safe_grep() {
  # $1 = pattern, $2.. = paths; geen exit bij 'no matches'
  grep -RIn --exclude-dir=node_modules --include="*.ts*" "$1" "$@" 2>/dev/null || true
}

# Maak workspace
WORKDIR="$(mktemp -d 2>/dev/null || mktemp -d -t navcheck)"
UI_IDS="$WORKDIR/ui_config_page_ids.txt"
STATE_IDS="$WORKDIR/literal_state_page_ids.txt"
NAV_IDS="$WORKDIR/navigation_manager_ids.txt"
REG_IDS="$WORKDIR/config_registry_ids.txt"

# Init lege sets (voorkomt comm/awk errors)
: > "$UI_IDS"
: > "$STATE_IDS"
: > "$NAV_IDS"
: > "$REG_IDS"

# -------- 1) Inventarisatie --------
section "1) INVENTARISATIE: Bekende Page-ID's uit codebase"

log "[1A] IDs & calls rond NavigationManager / NavigationOrchestrator:"
safe_grep -E "NavigationManager|SET_CURRENT_PAGE_ID|currentPageId|getNext|getPrevious|navigateNext|navigatePrevious" src/ | sed 's/^/  /'
# (Gebaseerd op jouw eerdere tree; deze lijnen horen te matchen) [1](https://deconnectie-my.sharepoint.com/personal/manasse_visser_arnhem_nl/Documents/Microsoft%20Copilot%20Chat-bestanden/page_nav.txt)

log "\n[1B] pageId's in UI-configs (Wizard pages):"
safe_grep -E "pageId\s*:\s*|UI_SECTIONS\." src/ui/screens/Wizard/pages | sed 's/^/  /'
# (Je UI-configs tonen meerdere pageId's en UI_SECTIONS.*) [1](https://deconnectie-my.sharepoint.com/personal/manasse_visser_arnhem_nl/Documents/Microsoft%20Copilot%20Chat-bestanden/page_nav.txt)

log "\n[1C] Defaults / init / tests met currentPageId:"
safe_grep -E "currentPageId\s*:\s*'[^']+'" src/ src/state src/services src/app | sed 's/^/  /'
# (We zagen o.a. 'landing', 'setup', 'page_1', '1setupHousehold', etc.) [1](https://deconnectie-my.sharepoint.com/personal/manasse_visser_arnhem_nl/Documents/Microsoft%20Copilot%20Chat-bestanden/page_nav.txt)

log "\n[1D] Registry-kandidaten (config/labels/registry):"
safe_grep -E "configRegistry|getPageConfigById|constants/registry|UX_TOKENS|labels\.ts" src/domain src/app | sed 's/^/  /'
# (labels.ts en registry.ts bestaan, maar geen echte configRegistry) [1](https://deconnectie-my.sharepoint.com/personal/manasse_visser_arnhem_nl/Documents/Microsoft%20Copilot%20Chat-bestanden/page_nav.txt)


# -------- 2) Sets & Diff --------
section "2) EXTRACTIE VAN SETS & DIFF"

# 2A. UI-config pageIds
if [ -d "src/ui/screens/Wizard/pages" ]; then
  # Haal waarden na "pageId:" uit regels met quotes of UI_SECTIONS.X
  # Match 'pageId: "foo"' of 'pageId: UI_SECTIONS.BAR' → we extraheren de laatste token.
  grep -Rho --exclude-dir=node_modules --include="*.ts*" -E "pageId\s*:\s*[^,]+" src/ui/screens/Wizard/pages 2>/dev/null \
  | sed -E "s/.*pageId\s*:\s*//" \
  | sed -E "s/['\",]//g" \
  | awk '{gsub(/\s/,"",$0); print $0}' \
  | sort -u > "$UI_IDS" || true
else
  warn "[2A] Directory src/ui/screens/Wizard/pages niet gevonden."
fi

# 2B. State-literals
grep -Rho --exclude-dir=node_modules --include="*.ts*" -E "currentPageId\s*:\s*'[^']+'" src/ 2>/dev/null \
| sed -E "s/.*currentPageId\s*:\s*'([^']+)'.*/\1/" \
| sort -u > "$STATE_IDS" || true

# 2C. NavigationManager (heuristisch: strings in dat bestand)
if [ -f "src/app/orchestrators/managers/NavigationManager.ts" ]; then
  # Pak alle string-achtige tokens, filter obvious noise
  awk '
    /class NavigationManager/ { inNM=1 }
    inNM==1 { print }
  ' src/app/orchestrators/managers/NavigationManager.ts \
  | grep -oE "'[^']+'|\"[^\"]+\"" \
  | sed -E "s/^['\"](.*)['\"]$/\1/" \
  | grep -Ev "NavigationManager|getNext|getPrevious|return|null|undefined|case|switch|\{|\}|\(|\)|:|;|," \
  | sort -u > "$NAV_IDS" || true
else
  warn "[2C] NavigationManager.ts niet gevonden, NAV_IDS blijft leeg."
fi

# 2D. (optioneel) configRegistry keys
if [ -f "src/domain/constants/configRegistry.ts" ]; then
  # Neem key-namen vóór ':' in object-literal (grove heuristiek)
  grep -Rho --include="configRegistry.ts" -E "['\"][^'\":]+['\"]\s*:" src/domain/constants 2>/dev/null \
  | sed -E "s/^['\"]([^'\":]+)['\"]\s*:.*/\1/" \
  | sort -u > "$REG_IDS" || true
fi

# Print sets
log "[2A] UI-config page IDs:"
nl -ba "$UI_IDS" | sed 's/^/  /'
log "\n[2B] Literal state page IDs:"
nl -ba "$STATE_IDS" | sed 's/^/  /'
log "\n[2C] NavManager IDs:"
nl -ba "$NAV_IDS" | sed 's/^/  /'
log "\n[2D] ConfigRegistry IDs (indien aanwezig):"
nl -ba "$REG_IDS" | sed 's/^/  /'

# Diffs (comm vereist gesorteerde inputs - dat zijn ze)
safe_comm() {
  local a="$1"; local b="$2"; local title="$3"
  if [ ! -s "$a" ]; then warn "$title — linker set is leeg ($a)"; return; fi
  if [ ! -s "$b" ]; then warn "$title — rechter set is leeg ($b)"; return; fi
  log "\n$title"
  comm -23 "$a" "$b" | sed 's/^/  - /' || true
}

safe_comm "$STATE_IDS" "$UI_IDS"  "[2E] DIFF: state-literals die GEEN UI-config entry hebben:"
safe_comm "$UI_IDS"   "$NAV_IDS"  "[2F] DIFF: UI-config IDs die NIET in NavigationManager voorkomen:"
safe_comm "$NAV_IDS"  "$UI_IDS"   "[2G] DIFF: NavigationManager IDs die GEEN UI-config entry hebben:"
if [ -s "$REG_IDS" ]; then
  safe_comm "$REG_IDS" "$UI_IDS"  "[2H] DIFF: ConfigRegistry IDs die NIET in UI-configs voorkomen:"
  safe_comm "$UI_IDS"  "$REG_IDS" "[2I] DIFF: UI-config IDs die NIET in ConfigRegistry voorkomen:"
fi


# -------- 3) Gedrag bij onbekende ID --------
section "3) GEDRAGSANALYSE: guards/fallbacks bij onbekende currentPageId"

log "[3A] Guards/fallbacks in navigation/orchestrators/state:"
safe_grep -E "if\s*\(\s*!.*currentPageId|unknown|default|fallback|null|undefined|return\s+null|throw|console\.warn|Logger\.(warn|error)" \
          src/app/orchestrators src/app/context src/app/state | sed 's/^/  /'
# (We zagen al warnings/return null patronen in diverse managers/Orchestrators) [1](https://deconnectie-my.sharepoint.com/personal/manasse_visser_arnhem_nl/Documents/Microsoft%20Copilot%20Chat-bestanden/page_nav.txt)

log "\n[3B] Guards in UI (WizardController/WizardPage) t.a.v. lege/onbekende config:"
grep -RIn --exclude-dir=node_modules --include="*.tsx" -E "currentPageId|default:|return\s+<|return\s+null|!config|config\s*\?|\?\." src/ui/screens/Wizard 2>/dev/null \
| sed 's/^/  /'
# (WizardController switcht nu op activeStep; dat verklaart dove UI) [1](https://deconnectie-my.sharepoint.com/personal/manasse_visser_arnhem_nl/Documents/Microsoft%20Copilot%20Chat-bestanden/page_nav.txt)

log "\n[3C] Restore/migratie: hoe gaat persist met verouderde currentPageId om?"
safe_grep -E "storage|persist|restore|migrat|rehydrat|version|schema|currentPageId" src/services src/app src/state | sed 's/^/  /'
# (migrationService/storageShim kwamen al voorbij) [1](https://deconnectie-my.sharepoint.com/personal/manasse_visser_arnhem_nl/Documents/Microsoft%20Copilot%20Chat-bestanden/page_nav.txt)

log "\n[3D] Reducer: dubbele cases / validatie bij SET_CURRENT_PAGE_ID:"
if [ -f "src/app/state/formReducer.ts" ]; then
  sed -n '1,220p' src/app/state/formReducer.ts | sed 's/^/  /'
else
  warn "formReducer.ts niet gevonden."
fi
# (In jouw output stond SET_CURRENT_PAGE_ID dubbel gedefinieerd) [1](https://deconnectie-my.sharepoint.com/personal/manasse_visser_arnhem_nl/Documents/Microsoft%20Copilot%20Chat-bestanden/page_nav.txt)


# -------- 4) Test-harnas --------
section "4) TEST-HARNASS: smoke runs & test-locaties"

log "[4A] Jest smoke (faalt niet-hard als jest niet aanwezig is):"
npx --yes jest --runInBand --silent --findRelatedTests \
  src/app/orchestrators/NavigationOrchestrator.ts \
  src/ui/screens/Wizard/WizardController.tsx \
  src/ui/navigation/WizardFooter.tsx 2>/dev/null || warn "Jest smoke skipped/failed."

log "\n[4B] Tests die aannames over pagina/stap doen (doorloop voor updates):"
grep -RIn --exclude-dir=node_modules --include="*.test.ts*" -E "currentPageId|SET_STEP|WIZARD|navigateNext|navigatePrevious" src 2>/dev/null \
| sed 's/^/  /'


# -------- 5) Silent failures --------
section "5) STATISCHE HEURISTIEK: silent failures"

log "[5A] try/catch zonder rethrow:"
grep -RIn --exclude-dir=node_modules --include="*.ts*" "try" src/ 2>/dev/null | grep -v "throw" | sed 's/^/  /' || true

log "\n[5B] return null/undefined in render- en orchestratorpaden:"
grep -RIn --exclude-dir=node_modules --include="*.ts*" -E "return\s+null|return\s+undefined" src/ui src/app 2>/dev/null \
| sed 's/^/  /' || true


# -------- 6) Snelle simulatiehint --------
section "6) MANUELE SIM: unknown ID injecteren in tests"

cat <<'EOF_SIM'
# Snelle Jest sim (maak bestand en run): src/ui/screens/Wizard/__tests__/WizardController.fallback.test.tsx
# ----------------------------------------------------------------------------
# import { render } from '@testing-library/react';
# import { FormStateProvider } from '@ui/providers/FormStateProvider';
# import { createMockState } from '@test-utils/factories/stateFactory';
# import { WizardController } from '../WizardController';
# test('valt terug op geldige pagina bij onbekende currentPageId', () => {
#   const faulty = createMockState({ currentPageId: '___UNKNOWN_FAULTY___' as any });
#   const { getByText } = render(
#     <FormStateProvider initialState={faulty}><WizardController/></FormStateProvider>
#   );
#   // Expect: default/fallback titel of eerste sectie zichtbaar
#   // bv: expect(getByText(/Huishouden/i)).toBeInTheDocument();
# });
# ----------------------------------------------------------------------------
EOF_SIM

# -------- Einde + paths --------
section "7) EINDE — Artefacten"
log "Workspace: $WORKDIR"
log "Sets: "
log "  - UI-config IDs       → $UI_IDS"
log "  - State literal IDs   → $STATE_IDS"
log "  - NavigationManager   → $NAV_IDS"
log "  - ConfigRegistry keys → $REG_IDS (indien aanwezig)"