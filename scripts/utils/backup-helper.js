const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const logger = require('./logger');

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
        // Check of bestanden bestaan voordat we backup maken
        const filesToBackup = ['babel.config.js', 'jest.config.ts', 'tsconfig.json', 'package.json'];
        const existingFiles = filesToBackup.filter(f => fs.existsSync(path.join(rootDir, f)));
        
        if (existingFiles.length === 0) {
            logger.warn('Geen config bestanden gevonden om te backuppen (skip)');
            return;
        }
        
        // 1. Maak de backup (alleen van bestaande bestanden)
        const fileList = existingFiles.join(' ');
        execSync(`tar -czf "${fullPath}" -C "${rootDir}" ${fileList}`, { stdio: 'ignore' });
        
        // 2. Retentie: Alleen de 2 nieuwste bewaren
        try {
            execSync(`ls -1t "${backupDir}"/config_backup_*.tar.gz | tail -n +3 | xargs rm -f`, { stdio: 'ignore' });
        } catch (e) {
            // Niet erg als cleanup faalt
        }

        // 3. Succes-log
        logger.ok(`Backup: ${filename}`);
        
    } catch (e) {
        // Backup failure is niet kritiek - waarschuw maar ga door
        logger.warn(`Backup overgeslagen: ${e.message}`);
    }
};

module.exports = backupConfigs;