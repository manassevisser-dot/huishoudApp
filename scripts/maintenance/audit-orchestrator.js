const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const logger = require('../utils/logger');

function generateKeysFile() {
    const allKeys = Object.keys(logger.TEXT).sort();
    
    // Header & Subheader uit de constants
    const header = logger.TEXT.KEYS_INDEX_NAME;
    const date = new Date().toLocaleString();
    const subHeader = logger.TEXT.KEYS_INDEX_GEN(date);
    
    // Maak een lijst: KEY -> Waarde (of [Function])
    const keyMap = allKeys.map(k => {
        const val = logger.TEXT[k];
        const displayVal = typeof val === 'function' ? '[Dynamische Functie]' : val;
        return `${k.padEnd(30)} | ${displayVal}`;
    });

    const content = `${header}\n${subHeader}\n${'-'.repeat(60)}\n${keyMap.join('\n')}`;
    fs.writeFileSync('keys.txt', content);
}

async function runStep(name, command) {
    logger.info(logger.TEXT.STEP_START(name));
    if (logger.isDryRun) {
        logger.ok(logger.TEXT.STEP_SKIP(command));
        return true;
    }
    try {
        execSync(command, { stdio: 'inherit' });
        return true;
    } catch (error) {
        logger.error(logger.TEXT.STEP_FAIL(name));
        return false;
    }
}

async function cleanupReports() {
    const reportDir = path.resolve(__dirname, '../../reports');
    if (!fs.existsSync(reportDir)) return;

    logger.info(logger.TEXT.CLEANUP_RUNNING);
    try {
        execSync('ls -t reports | tail -n +6 | xargs -I {} rm -rf reports/{} 2>/dev/null || true');
        logger.ok(logger.TEXT.CLEANUP_DONE);
    } catch (e) {
        logger.warn(logger.TEXT.CLEANUP_FAIL);
    }
}

async function main() {
    logger.startTimer();
    const REPORT_BASE = `reports/${new Date().toISOString().replace(/[:T]/g, '-').slice(0, 16)}`;

    // 1. Taken uitvoeren
    await runStep("Sanity Check", "node scripts/sync-aliases/index.js " + process.argv.slice(2).join(' '));
    await runStep("Deduplicatie", "bash scripts/maintenance/phoenix_dedup.sh src");
    await runStep("Project Audit", "bash scripts/maintenance/phoenix-check.sh");

    // 2. Opschonen
    await cleanupReports();

    // 3. Documentatie (De Keys indexeren)
    generateKeysFile(); 

    // 4. Afsluiten
    logger.info(logger.TEXT.FINISH);
    logger.report(REPORT_BASE); 
    logger.stopTimer();
}

main();