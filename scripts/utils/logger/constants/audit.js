module.exports = {
    // === DEDUP ===
    DEDUP_START: "🔍 Start Deduplicatie scan...",
    DEDUP_REPORT_MOVE: "📦 Verplaatsen van deduplicatie rapporten naar base...",
    DEDUP_OK: "✅ Deduplicatie succesvol afgerond.",
    DEDUP_SKIP: "⚠️ Dedup script niet gevonden of doelmap ontbreekt (skip)",

    // === PHOENIX-CHECK (AUDIT) ===
    AUDIT_START: "🛡️ Start Audit (phoenix-check)...",
    AUDIT_NOT_FOUND: "❌ FOUT: phoenix-check.sh niet gevonden!",
    AUDIT_SUMMARY_FAIL: "❌ Fout: Functie show_summary niet geladen uit reports.sh",
    AUDIT_STAT_HOUSEHOLD: "ℹ️  Statistiek: Huishoudens met > 5 adults krijgen speciale status.",
    
    // === LOCK LOGICA ===
    LOCK_STALE: "⚠️  Oude lock gevonden (>30 min). Opruimen en opnieuw starten…",
    LOCK_ACTIVE: "❌ Phoenix audit is al bezig sinds:",
    LOCK_PID: (pid) => `ℹ️  PID: ${pid}`,

    // === ORCHESTRATOR & CLEANUP ===
    STEP_START: (name) => `--- ${name} ---`,
    STEP_SKIP: (cmd) => `[DRY-RUN] Overslaan: ${cmd}`,
    STEP_FAIL: (name) => `Fout tijdens ${name}`,
    CLEANUP_RUNNING: "Rapporten opschonen (behoud laatste 5)...",
    CLEANUP_DONE: "Systeem opgeschoond.",
    CLEANUP_FAIL: "Opschonen mislukt of map is leeg.",
    
    // === GUARD DOG ===
    GUARD_CHECK: "🐕 Guard Dog: Checking file sizes...",
    GUARD_PASS: (file, size) => `✅ PASS: ${file} (${size} KB)`,
    GUARD_FAIL: (file, size, max) => `❌ FAIL: ${file} is te groot (${size} KB). Limiet is ${max} KB.`,
    GUARD_CRITICAL: "🚨 COMMIT AFGEKEURD: Los de bloating op voordat je commit.",
    GUARD_SAFE: "🦴 Alles veilig: geen verdachte wijzigingen gevonden.",
    
    // === EXTRA GUARD DOG KEYS ===
    PRESET_CHECK: "🧪 Controleren van Babel presets...",
    ERR_BABEL_PRESET: "❌ CRITICAl: 'metro-react-native-babel-preset' ontbreekt in package.json!",
    REMEDY_BABEL: "💡 Actie: Draai 'npm install --save-dev metro-react-native-babel-preset'",

    // Voorbeeld voor log_val2
    FILE_INFO: (file, size) => `Bestand ${file} is ${size} bytes groot.`,
    
    // === BABEL / JEST ERRORS ===
    ERR_BABEL_PRESET: "❌ Babel Preset missing: 'metro-react-native-babel-preset' niet gevonden.",
    REMEDY_BABEL: "💡 Oplossing: Draai 'npm install --save-dev metro-react-native-babel-preset' en wis de jest cache.",
    
    // === CLEANUP & COMMIT ===
    COMMIT_START: "🧹 Cleanup, prepare & commit",
    CLEAN_ARTIFACTS: "• Cleaning artifacts",
    CLEAN_BAK: "• Removing .bak backups",
    CLEAN_REPORTS: "• Pruning old reports (keep 5)",
    CLEAN_EXPO: "• Clearing Expo cache",
    RUN_CHECKS: "• Running lint/ts checks (non-fatal)",
    CHECK_ISSUE: (type) => `⚠️ ${type} issues (ignored)`,
    GIT_ADD: "• Git add",
    GIT_COMMIT: (msg) => `• Git commit: ${msg}`,
    GIT_COMMIT_NONE: "⚠️ Nothing to commit",
    GIT_TAG: (tag) => `• Create tag: ${tag}`,
    GIT_PUSH: "• Git push",
    COMMIT_DONE: (branch, tag) => `✅ Done. Branch: ${branch}, tag: ${tag}`,
    
    // I DONT KNOW 
    FILE_TOO_LARGE: "Kritiek: bestand is abnormaal groot",
    DRY_RUN_COMPLETE: "Dry-run voltooid: Geen wijzigingen doorgevoerd.",
    CONFIG_BACKUP_SUCCESS: "Configuratie backup succesvol beveiligd",
    ADR_SAFETY_LIMIT: "Sync afgebroken door veiligheidslimieten (ADR-06).",
    CONFIG_BACKUP_SUCCESS: "Configuratie backup succesvol beveiligd",
    CONFIG_BACKUP_FAIL: "Kritieke fout: Configuratie backup mislukt. Operatie afgebroken.",
    // === IMPORTS ===
    IMPORTS_START: "🧩 Phoenix Import Fixer: Aliassen rechttrekken...",
    IMPORTS_CLEAN: "✨ Alle imports zijn al correct geformatteerd.",
    IMPORTS_FIXED: (count) => `🛠️  Succesvol ${count} imports hersteld naar aliassen!`,
  
    // === FINALE & DOCS ===
    FINISH: "Phoenix operatie voltooid.",
    KEYS_INDEX_NAME: "🔑 PHOENIX CONSTANTS INDEX",
    KEYS_INDEX_GEN: (date) => `Gegenereerd op: ${date}`,
    REPORTS_LOCATION: (path) => `📄 Zie rapporten in: ${path}`,
    // Zoek de regel FINISH_TIME en verander hem in:
    FINISH_TIME: (s) => `⏱️  Duur: ${s}s`,
};