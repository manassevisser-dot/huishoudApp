#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const mappingFile = 'adr-mapping.csv';
const backupDir = './backup-logs';

if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true });
}

// Mapping van bestandsnaam naar relatief pad (zonder src/ ervoor, maar met src/)
const filenameToPath = {
  'validateAtBoundary.ts': 'src/adapters/validation/validateAtBoundary.ts',
  'ImportOrchestrator.ts': 'src/app/orchestrators/ImportOrchestrator.ts',
  'DataManager.ts': 'src/app/orchestrators/managers/DataManager.ts',
  'csvUploadWorkflow.ts': 'src/app/workflows/csvUploadWorkflow.ts',
  'SettingsWorkflow.ts': 'src/app/workflows/SettingsWorkflow.ts',
  'DailyTransactionWorkflow.ts': 'src/app/workflows/DailyTransactionWorkflow.ts',
  'PersistenceAdapter.ts': 'src/adapters/system/PersistenceAdapter.ts',
  'stateful.ts': 'src/adapters/transaction/stateful.ts',
  'NavigationOrchestrator.ts': 'src/app/orchestrators/NavigationOrchestrator.ts',
  'ValidationOrchestrator.ts': 'src/app/orchestrators/ValidationOrchestrator.ts',
  'ResetWorkflow.ts': 'src/app/workflows/ResetWorkflow.ts',
  'transactionService.ts': 'src/services/transactionService.ts',
  'VisibilityOrchestrator.ts': 'src/app/orchestrators/VisibilityOrchestrator.ts',
  'storageShim.ts': 'src/services/storageShim.ts',
};

const entries = [];

fs.createReadStream(mappingFile)
  .pipe(csv())
  .on('data', (row) => {
    const fileLine = row['Bestand:regel'];
    const [fileName, lineStr] = fileLine.split(':');
    const line = parseInt(lineStr, 10);
    
    // Bepaal het volledige pad
    let fullFilePath;
    if (fileName.startsWith('src/')) {
      fullFilePath = fileName;
    } else {
      // Zoek in mapping
      if (filenameToPath[fileName]) {
        fullFilePath = filenameToPath[fileName];
      } else {
        console.warn(`Geen mapping voor bestand ${fileName}, gebruik ongewijzigd pad.`);
        fullFilePath = fileName; // fallback
      }
    }
    
    entries.push({
      file: fullFilePath,
      line: line,
      event: row['Event naam'],
      adr: row['ADR(s)'].split(',').map(s => s.trim()),
      cluster: row['Cluster'],
      cleanCode: row['Clean Code'],
      remark: row['Opmerking']
    });
  })
  .on('end', () => {
    console.log(`Gevonden ${entries.length} entries. Start met patchen...`);

    const files = {};
    entries.forEach(entry => {
      if (!files[entry.file]) files[entry.file] = [];
      files[entry.file].push(entry);
    });

    Object.keys(files).forEach(filePath => {
      const fullPath = path.resolve(process.cwd(), filePath);
      if (!fs.existsSync(fullPath)) {
        console.warn(`Bestand niet gevonden: ${fullPath}`);
        return;
      }

      const backupPath = path.join(backupDir, path.basename(filePath) + '.bak');
      fs.copyFileSync(fullPath, backupPath);

      let content = fs.readFileSync(fullPath, 'utf8');
      let lines = content.split('\n');
      let modified = false;

      const fileEntries = files[filePath].sort((a, b) => b.line - a.line);

      fileEntries.forEach(entry => {
        const lineIndex = entry.line - 1;
        if (lineIndex >= lines.length) {
          console.warn(`Regel ${entry.line} bestaat niet in ${filePath}`);
          return;
        }

        let line = lines[lineIndex];
        const eventRegex = new RegExp(`(Logger\\.\\w+)\\s*\\(\\s*['"]${escapeRegex(entry.event)}['"]`);
        if (!eventRegex.test(line)) {
          console.warn(`Event '${entry.event}' niet gevonden op regel ${entry.line} in ${filePath}`);
          return;
        }

        const afterEvent = line.substring(line.indexOf(entry.event) + entry.event.length + 2);
        const hasOptions = /,\s*\{/.test(afterEvent);
        const adrString = JSON.stringify(entry.adr.length === 1 ? entry.adr[0] : entry.adr);

        if (hasOptions) {
          const objStart = line.indexOf('{', line.indexOf(entry.event) + entry.event.length);
          if (objStart !== -1) {
            let braceCount = 0;
            let objEnd = objStart;
            for (let i = objStart; i < line.length; i++) {
              if (line[i] === '{') braceCount++;
              else if (line[i] === '}') braceCount--;
              if (braceCount === 0) {
                objEnd = i;
                break;
              }
            }
            if (objEnd > objStart) {
              const objStr = line.substring(objStart, objEnd + 1);
              let newObj;
              if (objStr.trim() === '{}') {
                newObj = `{ adr: ${adrString} }`;
              } else {
                newObj = objStr.replace('{', `{ adr: ${adrString}, `);
              }
              line = line.substring(0, objStart) + newObj + line.substring(objEnd + 1);
            }
          }
        } else {
          const lastParen = line.lastIndexOf(')');
          if (lastParen !== -1 && (line.indexOf(');', lastParen) === lastParen || line.indexOf(')', lastParen) === lastParen)) {
            line = line.substring(0, lastParen) + `, { adr: ${adrString} }` + line.substring(lastParen);
          } else {
            console.warn(`Kon sluithaak niet vinden in regel ${entry.line} voor ${entry.event}`);
          }
        }

        lines[lineIndex] = line;
        modified = true;
      });

      if (modified) {
        fs.writeFileSync(fullPath, lines.join('\n'), 'utf8');
        console.log(`✅ ${filePath} aangepast. Backup: ${backupPath}`);
      } else {
        console.log(`⏭️ ${filePath} geen wijzigingen.`);
      }
    });

    console.log('Klaar! Vergeet niet de handmatige fixes uit te voeren:');
    console.log('1. Verwijder spurious logs in stateful.ts (regels 85-86)');
    console.log('2. Hernoem event in transactionService.ts:120 naar feature.undo_not_implemented');
  });

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}