const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const logger = require('./logger'); // Als backup-helper en logger in dezelfde map (utils) staan.

/**
 * Phoenix Gold Backup Helper
 * Beveiligt de cockpit-configuraties vóór elke grote operatie.
 */
const backupConfigs = () => {
    const rootDir = path.resolve(__dirname, '../../');
    const backupDir = path.join(rootDir, 'backups');
    
    if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/[:T]/g, '-').split('.')[0];
    const filename = `config_backup_${timestamp}.tar.gz`;
    const fullPath = path.join(backupDir, filename);

    try {
        // 1. Maak de backup
        execSync(`tar -czf "${fullPath}" -C "${rootDir}" babel.config.js jest.config.js tsconfig.json package.json 2>/dev/null`);
        
        // 2. Retentie: Alleen de 2 nieuwste bewaren
        execSync(`ls -1t "${backupDir}"/config_backup_*.tar.gz | tail -n +3 | xargs rm -f 2>/dev/null || true`);

        // 3. Succes-log (Geen magic strings!)
        logger.ok(`${logger.TEXT.CONFIG_BACKUP_SUCCESS}: ${filename}`);
        
    } catch (e) {
        // 4. Kritieke failure (Geen magic strings!)
        logger.fail(logger.TEXT.CONFIG_BACKUP_FAIL);
        process.exit(1);
    }
};

module.exports = backupConfigs;