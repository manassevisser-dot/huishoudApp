#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

// 1. Logger & Config
// Let op: logger exporteert { info, ok, warn, error, val, TEXT }
const logger = require('../../utils/logger'); 
const config = require('./config');
const backupConfigs = require('../../utils/backup-helper');

// 2. Importeer Handlers
const babelHandler = require('./handlers/babel');
const jestHandler = require('./handlers/jest');
const jsonHandler = require('./handlers/json'); // Voor jsconfig.json

const ROOT = config.paths.root;
const MAX_FILE_SIZE = 50000; // 50KB limiet

const PATHS = {
  tsconfig: config.paths.tsconfig,
  babel:    config.paths.babel,
  jest:     config.paths.jest,
  jsconfig: config.paths.jsconfig,
};

// --- Helper Functies ---

function checkHardening(filePath) {
  if (fs.existsSync(filePath)) {
    const stats = fs.statSync(filePath);
    if (stats.size > MAX_FILE_SIZE) {
      logger.warn(`⚠️  Bestand te groot: ${path.basename(filePath)} (${stats.size} bytes)`);
      return false;
    }
  }
  return true;
}

function parseTsConfig(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    // Regex om 'paths' object te vinden, zelfs met comments
    const match = content.match(/"paths":\s*\{([\s\S]*?)\}/);
    if (!match) throw new Error("Geen 'paths' gevonden in tsconfig.json");
    
    // Hacky JSON parse van het paths blok (let op trailing commas)
    const jsonString = `{${match[1].replace(/,\s*$/, "")}}`;
    return JSON.parse(jsonString);
  } catch (err) {
    logger.error(`Fout bij lezen tsconfig: ${err.message}`);
    process.exit(1);
  }
}

// --- Main ---

async function main() {
  const startTime = Date.now(); // Native timer start
  
  logger.info('🚀 Start synchronisatie aliassen...');
  
  if (config.flags.dryRun) {
    logger.warn('🔸 DRY RUN: Geen wijzigingen worden opgeslagen.');
  }

  // Backup maken
  backupConfigs();

  try {
    // 1. Hardening Check
    if (!checkHardening(PATHS.babel) || !checkHardening(PATHS.jest)) {
      logger.error('❌ Beveiligingsfout: Bestand(en) te groot. Stop.');
      process.exit(1);
    }

    // 2. Aliassen lezen
    const paths = parseTsConfig(PATHS.tsconfig);
    const entries = Object.entries(paths);
    logger.info(`ℹ️  Gevonden aliassen in tsconfig: ${entries.length}`);

    // 3. Handlers Uitvoeren
    // We lezen de bestanden, passen ze aan in het geheugen
    
    // --- BABEL ---
    if (fs.existsSync(PATHS.babel)) {
      const babelContent = fs.readFileSync(PATHS.babel, 'utf8');
      const newBabel = babelHandler(babelContent, paths, config.markers.babel); // Let op: je snippet noemde updateBabel, ik neem aan dat dit de export is
      if (newBabel) {
         if (!config.flags.dryRun) fs.writeFileSync(PATHS.babel, newBabel);
         logger.ok('✅ babel.config.js bijgewerkt');
      } else {
         logger.warn('⚠️  Babel markers niet gevonden');
      }
    }

    // --- JEST ---
    if (fs.existsSync(PATHS.jest)) {
      const jestContent = fs.readFileSync(PATHS.jest, 'utf8');
      const newJest = jestHandler(jestContent, paths, config.markers.jest);
      if (newJest) {
         if (!config.flags.dryRun) fs.writeFileSync(PATHS.jest, newJest);
         logger.ok('✅ jest.config.js bijgewerkt');
      } else {
         logger.warn('⚠️  Jest markers niet gevonden');
      }
    }

    // --- JSCONFIG (Optioneel) ---
    if (fs.existsSync(PATHS.jsconfig)) {
      const jsonContent = fs.readFileSync(PATHS.jsconfig, 'utf8');
      const newJson = jsonHandler(jsonContent, paths, config.markers.jsconfig);
      if (newJson) {
         if (!config.flags.dryRun) fs.writeFileSync(PATHS.jsconfig, newJson);
         logger.ok('✅ jsconfig.json bijgewerkt');
      }
    }

    // 4. Afronding
    if (!config.flags.dryRun) {
      logger.ok('✨ Synchronisatie succesvol voltooid.');
    } else {
      logger.ok('🏁 Dry run voltooid (geen wijzigingen).');
    }

  } catch (error) {
    logger.error(`❌ Fataal: ${error.message}`);
    process.exit(1);
  } finally {
    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);
    logger.info(`⏱️  Tijd: ${duration}s`);
  }
}

main();