#!/usr/bin/env bash
set -eo pipefail


TARGETS=("jest.config.js|50" "babel.config.js|50" "tsconfig.json|100" "package.json|200")
MAX_FAIL=0

log_info "GUARD_CHECK"

# --- Stap 1: File Size Checks ---
for entry in "${TARGETS[@]}"; do
  IFS="|" read -r FILE MAX_KB <<< "$entry"
  if [ -f "$FILE" ]; then
    SIZE_BYTES=$(date -r "$FILE" +%s 2>/dev/null || stat -c%s "$FILE" 2>/dev/null || stat -f%z "$FILE")
    SIZE_KB=$((SIZE_BYTES / 1024))
    if [ "$SIZE_KB" -gt "$MAX_KB" ]; then
      log_val3 "error" "GUARD_FAIL" "$FILE" "$SIZE_KB" "$MAX_KB"
      MAX_FAIL=1
    else
      log_val2 "ok" "GUARD_PASS" "$FILE" "$SIZE_KB"
    fi
  fi
done

# --- Stap 2: Preset Check & Auto-fix ---
log_info "PRESET_CHECK"
if ! grep -q "metro-react-native-babel-preset" package.json; then
    log_err "ERR_BABEL_PRESET"
    log_info "REMEDY_BABEL"
    
    # Phoenix-stijl: Probeer het zelf op te lossen
    if npm install --save-dev metro-react-native-babel-preset; then
        log_ok "DEDUP_OK" # Misbruik even een 'success' key of maak een nieuwe
        MAX_FAIL=0
    else
        MAX_FAIL=1
    fi
fi

# --- Stap 3: Finale ---
if [ "$MAX_FAIL" -eq 1 ]; then
  log_err "GUARD_CRITICAL"
  exit 1
fi

log_ok "GUARD_SAFE"
exit 0
=====
