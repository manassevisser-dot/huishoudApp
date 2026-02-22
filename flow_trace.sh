#!/usr/bin/env bash
# flow_trace.sh — Architecture Flow Tracer voor Project Phoenix
# ══════════════════════════════════════════════════════════════
# Produceert een machineleesbaar overzicht van alle lagen,
# hun imports, exports, en de dataflow daartussen.
# Geen Jest, geen runtime — puur statische analyse.
#
# Usage: bash flow_trace.sh [-o output.txt]

set -u

OUTFILE="flow_trace.txt"
while [[ $# -gt 0 ]]; do
  case "$1" in
    -o|--output) OUTFILE="$2"; shift 2;;
    *) echo "Usage: $(basename "$0") [-o output.txt]"; exit 0;;
  esac
done

sg() { grep "$@" 2>/dev/null || true; }

{
printf "╔══════════════════════════════════════════════════════════════╗\n"
printf "║  PROJECT PHOENIX — ARCHITECTURE FLOW TRACE                 ║\n"
printf "║  Generated: %s                          ║\n" "$(date '+%Y-%m-%d %H:%M')"
printf "╚══════════════════════════════════════════════════════════════╝\n\n"

# ════════════════════════════════════════════════════════════════
# LAAG 1: UI SCREENS — Wat bestaat er, wat accepteert het?
# ════════════════════════════════════════════════════════════════
printf "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n"
printf "LAAG 1: UI SCREENS\n"
printf "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n"
printf "Rol: DOM/presentational. Ontvangt props, rendert UI.\n"
printf "Mag importeren: React, RN, @ui/styles, @domain/constants\n"
printf "Mag NIET importeren: orchestrators, adapters, hooks met side-effects\n\n"

for screen in $(find src/ui/screens -name "*.tsx" ! -name "*.test.*" ! -name "*.snap" | sort); do
  basename=$(basename "$screen" .tsx)
  printf "  ┌─ %s\n" "$screen"

  # Props interface
  props=$(sg -A20 "interface.*Props\|type.*Props" "$screen" | sg "^\s*\(on\|is\|has\|show\)" | sed 's/^/  │  prop: /')
  if [ -n "$props" ]; then
    printf "%s\n" "$props"
  else
    printf "  │  props: (geen interface gevonden)\n"
  fi

  # Imports
  imports=$(sg "^import" "$screen" | sed 's/^/  │  import: /')
  printf "%s\n" "$imports"

  # Hooks gebruikt in component
  hooks=$(sg "use[A-Z][a-zA-Z]*(" "$screen" | sed -E 's/.*\b(use[A-Z][a-zA-Z]*)\(.*/\1/' | sort -u | sed 's/^/  │  hook: /')
  if [ -n "$hooks" ]; then
    printf "%s\n" "$hooks"
  fi

  # dispatch/state directe toegang (violations)
  violations=$(sg "\.dispatch\|state\.data\.\|state\.ui\.\|state\.meta\." "$screen" | sed 's/^/  │  ⚠️ VIOLATION: /')
  if [ -n "$violations" ]; then
    printf "%s\n" "$violations"
  fi

  printf "  └─\n\n"
done

# ════════════════════════════════════════════════════════════════
# LAAG 2: MAIN NAVIGATOR — Bedrading tussen screens en orchestrators
# ════════════════════════════════════════════════════════════════
printf "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n"
printf "LAAG 2: ROUTING (MainNavigator)\n"
printf "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n"
printf "Rol: Verbindt screens met orchestrator-methodes via props.\n\n"

NAV="src/ui/navigation/MainNavigator.tsx"
if [ -f "$NAV" ]; then
  printf "  Bestand: %s\n\n" "$NAV"

  # Alle activeStep cases
  printf "  Routes (activeStep → Screen):\n"
  sg "case \|default:" "$NAV" | sed -E "s/.*case '([^']+)'.*/    '\1'/" | sed "s/.*default.*/    'LANDING' (default)/" | sort -u
  printf "\n"

  # Alle prop-bindings
  printf "  Prop-bindings (Screen.prop → nav.method):\n"
  sg "on[A-Z][a-zA-Z]*=" "$NAV" | sed -E 's/.*\b(on[A-Z][a-zA-Z]*)=\{[^}]*nav\.([a-zA-Z]+)[^}]*\}.*/    \1 → nav.\2()/' | sort -u
  printf "\n"

  # Hooks die navigator gebruikt
  printf "  Hooks:\n"
  sg "use[A-Z][a-zA-Z]*(" "$NAV" | sed -E 's/.*\b(use[A-Z][a-zA-Z]*)\(.*/    \1/' | sort -u
  printf "\n"
else
  printf "  ⚠️ MainNavigator niet gevonden\n\n"
fi

# ════════════════════════════════════════════════════════════════
# LAAG 3: PROVIDERS — Context die UI en Orchestrators verbindt
# ════════════════════════════════════════════════════════════════
printf "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n"
printf "LAAG 3: PROVIDERS & HOOKS\n"
printf "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n"
printf "Rol: Instantieert orchestrators, levert ze via React Context.\n\n"

for provider in $(find src/ui/components/providers src/app/context -name "*.ts" -o -name "*.tsx" 2>/dev/null | sg -v "test\|snap" | sort); do
  printf "  ┌─ %s\n" "$provider"
  sg "^import" "$provider" | sed 's/^/  │  import: /'
  sg "new [A-Z]" "$provider" | sed -E 's/.*\b(new [A-Z][a-zA-Z]*).*/  │  creates: \1/'
  sg "export" "$provider" | sg "function\|const" | sed -E 's/.*\b(use[A-Z][a-zA-Z]*|[A-Z][a-zA-Z]*Provider).*/  │  exports: \1/' | sort -u
  printf "  └─\n\n"
done

# ════════════════════════════════════════════════════════════════
# LAAG 4: MASTER ORCHESTRATOR — Façade
# ════════════════════════════════════════════════════════════════
printf "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n"
printf "LAAG 4: MASTER ORCHESTRATOR (façade)\n"
printf "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n"
printf "Rol: Coördineert sub-orchestrators. Enige entry-point voor UI.\n\n"

MASTER="src/app/orchestrators/MasterOrchestrator.ts"
if [ -f "$MASTER" ]; then
  printf "  Public API:\n"
  sg "public " "$MASTER" | sed -E 's/.*public (readonly )?([a-zA-Z]+).*/    \2/' | sort -u
  printf "\n"

  printf "  Sub-orchestrators (via clusters):\n"
  sg "readonly.*:" "$MASTER" | sg "I[A-Z]" | sed -E 's/.*: (I[A-Z][a-zA-Z]*).*/    \1/' | sort -u
  printf "\n"

  printf "  Imports:\n"
  sg "^import" "$MASTER" | sed 's/^/    /'
  printf "\n"
fi

# ════════════════════════════════════════════════════════════════
# LAAG 4b: MASTER API CONTRACT
# ════════════════════════════════════════════════════════════════
API="src/app/types/MasterOrchestratorAPI.ts"
if [ -f "$API" ]; then
  printf "  Contract (MasterOrchestratorAPI):\n"
  sg -E "^\s+\w+.*:" "$API" | sg -v "import\|//" | sed 's/^/    /'
  printf "\n"
fi

# ════════════════════════════════════════════════════════════════
# LAAG 5: SUB-ORCHESTRATORS — Specifieke use-cases
# ════════════════════════════════════════════════════════════════
printf "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n"
printf "LAAG 5: SUB-ORCHESTRATORS\n"
printf "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n"
printf "Rol: Implementeren interfaces. Bevatten use-case logica.\n\n"

for orch in $(find src/app/orchestrators -maxdepth 1 -name "*.ts" ! -name "*.test.*" ! -name "MasterOrchestrator.ts" | sort); do
  basename=$(basename "$orch" .ts)
  printf "  ┌─ %s\n" "$basename"

  # Implements
  impl=$(sg "implements" "$orch" | sed -E 's/.*implements (I[A-Z][a-zA-Z]*).*/  │  implements: \1/')
  if [ -n "$impl" ]; then
    printf "%s\n" "$impl"
  fi

  # Public methods
  sg "public " "$orch" | sed -E 's/.*public (readonly )?(async )?([a-zA-Z]+).*/  │  method: \3/' | sort -u

  # Domain imports
  sg "from.*@domain\|from.*domain/" "$orch" | sed 's/^/  │  domain-dep: /'

  # Adapter imports
  sg "from.*@adapter\|from.*adapter/" "$orch" | sed 's/^/  │  adapter-dep: /'

  printf "  └─\n\n"
done

# ════════════════════════════════════════════════════════════════
# LAAG 5b: MANAGERS (sub-orchestrator implementaties)
# ════════════════════════════════════════════════════════════════
printf "  --- Managers ---\n\n"
for mgr in $(find src/app/orchestrators/managers -name "*.ts" ! -name "*.test.*" 2>/dev/null | sort); do
  basename=$(basename "$mgr" .ts)
  printf "  ┌─ %s\n" "$basename"
  sg "implements" "$mgr" | sed -E 's/.*implements (I[A-Z][a-zA-Z]*).*/  │  implements: \1/'
  sg "public " "$mgr" | sed -E 's/.*public (readonly )?(async )?([a-zA-Z]+).*/  │  method: \3/' | sort -u
  printf "  └─\n\n"
done

# ════════════════════════════════════════════════════════════════
# LAAG 5c: INTERFACES
# ════════════════════════════════════════════════════════════════
printf "  --- Interfaces ---\n\n"
for iface in $(find src/app/orchestrators/interfaces -name "*.ts" 2>/dev/null | sort); do
  basename=$(basename "$iface" .ts)
  printf "  ┌─ %s\n" "$basename"
  sg -E "^\s+\w+.*:" "$iface" | sg -v "import\|//" | sed 's/^/  │  /'
  printf "  └─\n\n"
done

# ════════════════════════════════════════════════════════════════
# LAAG 6: DOMAIN — Pure business logica
# ════════════════════════════════════════════════════════════════
printf "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n"
printf "LAAG 6: DOMAIN (pure business logic)\n"
printf "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n"
printf "Rol: Regels, berekeningen, types, tokens. Geen IO, geen RN.\n\n"

printf "  Subdirectories:\n"
for dir in src/domain/*/; do
  [ -d "$dir" ] || continue
  dirname=$(basename "$dir")
  count=$(find "$dir" -name "*.ts" ! -name "*.test.*" ! -name "*.snap" | wc -l | tr -d ' ')
  printf "    %-20s %s bestanden\n" "$dirname/" "$count"
done
printf "\n"

printf "  Exports per module:\n"
for f in $(find src/domain -name "*.ts" ! -name "*.test.*" ! -name "*.snap" ! -path "*/styles/*" ! -path "*/__*" | sort); do
  exports=$(sg "^export " "$f" | wc -l | tr -d ' ')
  if [ "$exports" -gt 0 ]; then
    printf "    %-50s %s exports\n" "$f" "$exports"
  fi
done
printf "\n"

# Purity check
printf "  Purity violations (imports die niet mogen):\n"
violations_ui=$(sg -rn "@ui\|from.*ui/" src/domain/ --include="*.ts" --include="*.tsx" | sg -v "__tests__\|\.test\.")
violations_rn=$(sg -rn "react-native" src/domain/ --include="*.ts" --include="*.tsx" | sg -v "__tests__\|\.test\.")
violations_app=$(sg -rn "@app\|from.*app/" src/domain/ --include="*.ts" --include="*.tsx" | sg -v "__tests__\|\.test\.")

if [ -z "$violations_ui" ] && [ -z "$violations_rn" ] && [ -z "$violations_app" ]; then
  printf "    ✅ Domain is puur (geen @ui, geen react-native, geen @app)\n"
else
  [ -n "$violations_ui" ] && printf "%s\n" "$violations_ui" | sed 's/^/    ❌ @ui: /'
  [ -n "$violations_rn" ] && printf "%s\n" "$violations_rn" | sed 's/^/    ❌ RN: /'
  [ -n "$violations_app" ] && printf "%s\n" "$violations_app" | sed 's/^/    ❌ @app: /'
fi
printf "\n"

# ════════════════════════════════════════════════════════════════
# LAAG 7: ADAPTERS — IO boundary
# ════════════════════════════════════════════════════════════════
printf "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n"
printf "LAAG 7: ADAPTERS (IO boundary)\n"
printf "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n"
printf "Rol: Alle IO (logging, storage, file-access, validation).\n\n"

for adapter in $(find src/adapters -name "*.ts" ! -name "*.test.*" ! -name "*.snap" | sort); do
  basename=$(basename "$adapter" .ts)
  printf "  ┌─ %s\n" "$basename"
  sg "^export " "$adapter" | sed -E 's/.*export (class |function |const |interface |type |async function )([a-zA-Z]+).*/  │  exports: \2/' | sort -u
  sg "from.*@domain\|from.*domain/" "$adapter" | sed 's/^/  │  domain-dep: /'
  printf "  └─\n\n"
done

# ════════════════════════════════════════════════════════════════
# LAAG 8: STATE — Reducer en initial state
# ════════════════════════════════════════════════════════════════
printf "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n"
printf "LAAG 8: STATE (formReducer + initialFormState)\n"
printf "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n"
printf "Rol: Immutable state container. Alleen FormStateOrchestrator dispatcht.\n\n"

REDUCER="src/app/state/formReducer.ts"
if [ -f "$REDUCER" ]; then
  printf "  Action types:\n"
  sg "case '" "$REDUCER" | sed -E "s/.*case '([^']+)'.*/    \1/" | sort -u
  printf "\n"

  printf "  Wie dispatcht (buiten tests):\n"
  sg -rn "\.dispatch(" src/ --include="*.ts" --include="*.tsx" | sg -v "__tests__\|\.test\.\|node_modules" | sed 's/^/    /'
  printf "\n"
fi

# ════════════════════════════════════════════════════════════════
# FLOW SAMENVATTING — De complete keten
# ════════════════════════════════════════════════════════════════
printf "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n"
printf "FLOW SAMENVATTING\n"
printf "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n"

cat << 'EOF'
  USER ACTION (tap button)
       │
       ▼
  ┌─────────────────────────────────────────────────┐
  │ UI SCREEN (dom)                                 │
  │ Roept prop-callback aan: onStartWizard()        │
  └──────────────────────┬──────────────────────────┘
                         │
                         ▼
  ┌─────────────────────────────────────────────────┐
  │ MAIN NAVIGATOR (bedrading)                      │
  │ Bindt callback aan orchestrator:                │
  │   onStartWizard={() => nav.startWizard()}       │
  └──────────────────────┬──────────────────────────┘
                         │
                         ▼
  ┌─────────────────────────────────────────────────┐
  │ MASTER ORCHESTRATOR (façade)                    │
  │ Delegeert naar sub-orchestrator:                │
  │   this.app.navigation.startWizard()             │
  └──────────────────────┬──────────────────────────┘
                         │
                         ▼
  ┌─────────────────────────────────────────────────┐
  │ NAVIGATION ORCHESTRATOR (use-case)              │
  │ Bevat logica:                                   │
  │   dispatch SET_STEP + SET_CURRENT_PAGE_ID       │
  │   Raadpleegt NavigationManager voor pageId      │
  └──────────────────────┬──────────────────────────┘
                         │
                         ▼
  ┌─────────────────────────────────────────────────┐
  │ FORM STATE ORCHESTRATOR (state boundary)        │
  │ dispatch() → formReducer                        │
  └──────────────────────┬──────────────────────────┘
                         │
                         ▼
  ┌─────────────────────────────────────────────────┐
  │ FORM REDUCER (pure function)                    │
  │ Produceert nieuwe state                         │
  └──────────────────────┬──────────────────────────┘
                         │
                         ▼
  ┌─────────────────────────────────────────────────┐
  │ REACT CONTEXT (FormStateProvider)               │
  │ Nieuwe state triggert re-render                 │
  └──────────────────────┬──────────────────────────┘
                         │
                         ▼
  ┌─────────────────────────────────────────────────┐
  │ MAIN NAVIGATOR                                  │
  │ switch(state.activeStep) → nieuw scherm         │
  └──────────────────────┬──────────────────────────┘
                         │
                         ▼
  ┌─────────────────────────────────────────────────┐
  │ UI SCREEN (dom)                                 │
  │ Rendert met nieuwe props                        │
  └─────────────────────────────────────────────────┘

  DATA FLOW (CSV voorbeeld):

  CsvUploadScreen.onPickFile()
       │
       ▼
  MainNavigator: csvText = await pickAndReadCsvFile()   ← ADAPTER
       │
       ▼
  master.handleCsvImport(csvText)                       ← MASTER
       │
       ▼
  domain.data.processCsvImport({csvText, state})        ← DOMAIN
       │
       ▼
  logger.info('CSV_IMPORT_SUCCESS', {count})            ← ADAPTER
       │
       ▼
  fso.updateField('transactions', result.transactions)  ← STATE
       │
       ▼
  domain.business.prepareFinancialViewModel(state)      ← DOMAIN
       │
       ▼
  fso.dispatch({type:'UPDATE_VIEWMODEL', payload})      ← STATE
       │
       ▼
  React re-render → DashboardScreen toont resultaat     ← UI
EOF

printf "\n"

# ════════════════════════════════════════════════════════════════
# ORPHANS & DEAD CODE
# ════════════════════════════════════════════════════════════════
printf "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n"
printf "ORPHAN DETECTIE\n"
printf "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n"

printf "  Screens niet gerouteerd in MainNavigator:\n"
for screen in $(find src/ui/screens -name "*.tsx" ! -name "*.test.*" ! -name "*.snap" | sort); do
  component=$(basename "$screen" .tsx)
  if [ -f "$NAV" ]; then
    found=$(sg "$component" "$NAV")
    if [ -z "$found" ]; then
      printf "    ⚠️ %s\n" "$screen"
    fi
  fi
done
printf "\n"

printf "  Orchestrators niet geïmporteerd door Master of providers:\n"
for orch in $(find src/app/orchestrators -maxdepth 1 -name "*.ts" ! -name "*.test.*" | sort); do
  stem=$(basename "$orch" .ts)
  [ "$stem" = "MasterOrchestrator" ] && continue
  importers=$(sg -rn "from.*$stem\|import.*$stem" src/ --include="*.ts" --include="*.tsx" | sg -v "__tests__\|\.test\.\|$orch:")
  if [ -z "$importers" ]; then
    printf "    ⚠️ %s (geen importers)\n" "$stem"
  fi
done
printf "\n"

} > "$OUTFILE" 2>&1

cat "$OUTFILE"
printf "\n📄 Flow trace geschreven naar: %s\n" "$OUTFILE"