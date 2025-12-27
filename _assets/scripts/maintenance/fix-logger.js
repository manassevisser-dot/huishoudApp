const fs = require('fs');
const path = require('path');

// Het pad naar waar de logger écht staat
const LOGGER_SOURCE = path.join('src', 'services', 'logger');

// Functie om mappen recursief te doorzoeken
function getAllFiles(dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath);
  arrayOfFiles = arrayOfFiles || [];

  files.forEach(function(file) {
    if (fs.statSync(dirPath + '/' + file).isDirectory()) {
      if (file !== 'node_modules' && file !== '.git') {
        arrayOfFiles = getAllFiles(dirPath + '/' + file, arrayOfFiles);
      }
    } else {
      // Check alleen .ts en .tsx bestanden
      if (file.endsWith('.ts') || file.endsWith('.tsx')) {
        arrayOfFiles.push(path.join(dirPath, file));
      }
    }
  });

  return arrayOfFiles;
}

function fixImports() {
  const allFiles = getAllFiles(__dirname);
  let fixedCount = 0;

  allFiles.forEach(filePath => {
    let content = fs.readFileSync(filePath, 'utf8');

    // 1. Check of 'logger.' wordt gebruikt
    if (content.includes('logger.') && !content.includes('class Logger')) {
      
      // 2. Check of hij al geïmporteerd is
      if (!content.includes('import { logger }') && !content.includes('import {logger}')) {
        
        // 3. Bereken het relatieve pad van dit bestand naar de logger
        const dirOfFile = path.dirname(filePath);
        const absLoggerPath = path.join(__dirname, LOGGER_SOURCE);
        
        let relativePath = path.relative(dirOfFile, absLoggerPath);
        
        // Windows backslashes vervangen door forward slashes
        relativePath = relativePath.split(path.sep).join('/');
        
        // Zorg dat het begint met ./ of ../
        if (!relativePath.startsWith('.')) {
          relativePath = './' + relativePath;
        }

        // 4. Voeg de import toe bovenaan
        const importStatement = `import { logger } from '${relativePath}';\n`;
        
        console.log(`✅ Fixed: ${path.basename(filePath)} -> import from '${relativePath}'`);
        
        fs.writeFileSync(filePath, importStatement + content);
        fixedCount++;
      }
    }
  });

  console.log(`\nklaar! ${fixedCount} bestanden gerepareerd.`);
}

fixImports();