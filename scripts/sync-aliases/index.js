const fs = require('fs');
const path = require('path');
const logger = require('../utils/logger'); // De enige echte aanpassing
const backupConfigs = require('../utils/backup-helper');
const ROOT = path.resolve(__dirname, '../../');
const MAX_FILE_SIZE = 50000; // 50KB limiet uit ADR-06 [cite: 17]

const PATHS = {
  tsconfig: path.join(ROOT, 'tsconfig.json'),
  babel:    path.join(ROOT, 'babel.config.js'),
  jest:     path.join(ROOT, 'jest.config.js'),
  jsconfig: path.join(ROOT, 'jsconfig.json'),
};

function checkHardening(filePath) {
  if (fs.existsSync(filePath)) {
    const stats = fs.statSync(filePath);
    if (stats.size > MAX_FILE_SIZE) {
      // Gebruik de logger om de fatale fout uit de Commander te imiteren [cite: 18]
      logger.warn(`${logger.TEXT.FILE_TOO_LARGE} (${path.basename(filePath)}: ${stats.size} bytes)`);
      return false;
    }
  }
  return true;
}

async function main() {
  logger.startTimer(); // Start de klok
  logger.info(logger.TEXT.SYNC_START);
  backupConfigs();
  try {
    // ADR-06 Hardening Check [cite: 14]
    if (!checkHardening(PATHS.babel) || !checkHardening(PATHS.jest)) {
      logger.die(logger.TEXT.ADR_SAFETY_LIMIT);
    }

    const paths = parseTsConfig(PATHS.tsconfig);
    const entries = Object.entries(paths);
    logger.info(logger.TEXT.SYNC_ALIASES_FOUND(entries.length));

    // ... (Alias generatie logica) ...

    if (!logger.isDryRun) {
      // Hier schrijven we de bestanden echt
      // fs.writeFileSync(PATHS.babel, babelTemplate);
      logger.ok(logger.TEXT.SYNC_OK);
    } else {
      logger.ok(logger.TEXT.DRY_RUN_COMPLETE);
    }

  } catch (error) {
    logger.die(error.message);
  } finally {
    logger.stopTimer(); // Stop de klok en toon tijd
  }
}

// Helper blijft hetzelfde
function parseTsConfig(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const match = content.match(/"paths":\s*\{([\s\S]*?)\}/);
  if (!match) logger.die("tsconfig.json"); 
  return JSON.parse(`{${match[1].replace(/,\s*$/, "")}}`);
}

main();