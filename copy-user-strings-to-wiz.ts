#!/usr/bin/env node
/**
 * Script: collect-user-strings.ts
 * 
 * DOEL: ALLEEN user-facing strings verzamelen in een logbestand
 * ZONDER WizStrings aan te passen. Jij controleert eerst,
 * pas daarna migreren we.
 * 
 * GEBRUIK: npx ts-node collect-user-strings.ts
 */

import * as fs from 'fs';
import * as path from 'path';

const OUTPUT_LOG = 'user_strings_te_migreren.txt';

// Lees alle .ts en .tsx bestanden
const walkSync = (dir: string, filelist: string[] = []) => {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (!fullPath.includes('node_modules') && 
          !fullPath.includes('test-utils') && 
          !fullPath.includes('__mocks__') &&
          !fullPath.includes('backup')) {
        walkSync(fullPath, filelist);
      }
    } else if (file.match(/\.(ts|tsx)$/) && 
               !file.endsWith('.test.ts') && 
               !file.endsWith('.test.tsx') &&
               !file.includes('WizStrings.ts') &&
               !file.includes('validationMessages.ts')) {
      filelist.push(fullPath);
    }
  });
  return filelist;
};

console.log('🔍 Zoeken naar user-facing strings...');
const files = walkSync('src');
const foundStrings: Array<{ file: string; line: number; text: string }> = [];

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');
  
  lines.forEach((line, index) => {
    // Zoek naar strings tussen quotes
    const matches = line.match(/['"`]([^'"`\\]*(?:\\.[^'"`\\]*)*)['"`]/g) || [];
    
    matches.forEach(match => {
      const str = match.slice(1, -1).trim();
      
      // ✅ ALLEEN echte user-facing strings:
      if (
        str.length > 3 &&                 // minimaal 4 karakters
        /[a-zA-Z]/.test(str) &&           // bevat letters
        str.includes(' ') &&              // bevat een spatie (user-facing!)
        !str.startsWith('@') &&           // geen imports
        !str.startsWith('./') &&           // geen relatieve paden
        !str.startsWith('../') &&
        !str.includes('${') &&             // geen template literals
        !str.match(/^[a-z_]+$/) &&         // geen pure snake_case
        !str.match(/^[A-Z_]+$/) &&         // geen SCREAMING_SNAKE
        !str.match(/^[0-9]+$/) &&          // geen getallen
        !str.includes('://') &&             // geen URLs
        !str.includes('->') &&              // geen pijlen
        !str.includes('=>') &&
        !str.includes('keyof') &&           // geen TypeScript keywords
        !str.includes('typeof') &&
        !str.includes('extends') &&
        !str.includes('interface') &&
        !str.match(/^[{}[\]]+$/) &&         // geen brackets
        !str.startsWith('*') &&             // geen JSDoc
        !str.startsWith('//') &&            // geen comments
        !str.match(/^[0-9]+[a-zA-Z]+$/) && // geen codes zoals "600", "px"
        !str.match(/^[#a-f0-9]{6,8}$/i)    // geen hex kleuren
      ) {
        foundStrings.push({
          file: file.replace(/\\/g, '/'),
          line: index + 1,
          text: str
        });
      }
    });
  });
});

// Groepeer per bestand
const byFile: Record<string, typeof foundStrings> = {};
foundStrings.forEach(item => {
  if (!byFile[item.file]) byFile[item.file] = [];
  byFile[item.file].push(item);
});

// Genereer logbestand
let logContent = '# 📋 USER-FACING STRINGS TE MIGREREN\n';
logContent += `# Datum: ${new Date().toISOString()}\n`;
logContent += `# Totaal: ${foundStrings.length}\n`;
logContent += '# ================================================\n\n';

Object.entries(byFile).sort().forEach(([file, items]) => {
  logContent += `\n📁 ${file}\n`;
  logContent += `   ${items.length} strings\n`;
  logContent += `   ${'-'.repeat(50)}\n`;
  
  items.forEach(item => {
    logContent += `   Regel ${item.line.toString().padEnd(4)} : "${item.text}"\n`;
  });
});

// Ook een platte lijst voor makkelijk kopiëren
logContent += '\n\n# 📋 PLAKLIJST (alleen de strings)\n';
logContent += '# ================================================\n\n';
foundStrings.forEach(item => {
  logContent += `"${item.text}"\n`;
});

fs.writeFileSync(OUTPUT_LOG, logContent, 'utf8');

console.log('\n📊 STATISTIEKEN:');
console.log(`   Bestanden met user-facing strings: ${Object.keys(byFile).length}`);
console.log(`   Totaal strings: ${foundStrings.length}`);
console.log(`\n📝 Logbestand: ${OUTPUT_LOG}`);
console.log('\n🎉 GEDAAN! Nu kun je:');
console.log('1. 📂 Controleer user_strings_te_migreren.txt');
console.log('2. 🔍 Bekijk per bestand welke strings er zijn');
console.log('3. ✅ Beslis welke echt naar WizStrings moeten');
console.log('4. 📋 Gebruik de plaklijst voor handmatige migratie');