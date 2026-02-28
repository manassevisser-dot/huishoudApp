#!/usr/bin/env node

// Script: collect_log_strings.js
// Usage: node collect_log_strings.js [directory] [output_file]
// Default directory: ./src

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuratie
const searchDir = process.argv[2] 
  ? path.resolve(process.argv[2]) 
  : path.resolve(process.cwd(), 'src');

const outputFile = process.argv[3] || 'log_strings.txt';

// Controleer of directory bestaat
if (!fs.existsSync(searchDir)) {
  console.error(`❌ Directory bestaat niet: ${searchDir}`);
  process.exit(1);
}

const excludePatterns = [
  'node_modules',
  'wizstrings',
  'test',
  'tests',
  '*.test.ts',
  '*.test.tsx',
  '*.spec.ts',
  '*.spec.tsx',
  '*.wiz.ts',
  '__mocks__',
  'test-utils'
];

// Regex voor strings tussen quotes
const stringRegex = /(["'`])(?:(?=(\\?))\2.)*?\1/g;

// Log-specifieke patronen
const logPatterns = [
  /console\.(log|warn|error|info|debug)\(/,
  /AuditLogger\.(log|warn|error|info)/,
  /Logger\./,
  /\.log\(/,
  /logEvent/,
  /Error:?\s+/,
  /Warning:?\s+/,
  /^[A-Z][A-Z0-9_]*$/, // CONSTANT_CASE (voor log levels)
  /FATAL|ERROR|WARN|INFO|DEBUG/i
];

// Resultaat container
const results = new Map();

console.log(`🔍 Verzamelen van log teksten uit: ${searchDir}`);
console.log(`📝 Output: ${outputFile}`);
console.log('================================================');

// Bouw find commando
const findCmd = `find "${searchDir}" -type f \\( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" \\) ` +
  excludePatterns.map(p => `! -path "*/${p}/*" ! -name "${p}"`).join(' ');

try {
  const files = execSync(findCmd, { encoding: 'utf8' })
    .split('\n')
    .filter(f => f && fs.statSync(f).size > 0);

  console.log(`📄 ${files.length} bestanden gevonden om te analyseren...`);

  files.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    const lines = content.split('\n');
    const fileStrings = [];
    
    lines.forEach((line, index) => {
      // Skip imports en requires
      if (line.includes('import ') || line.includes('require(')) return;
      
      // Check of dit een log-gerelateerde regel is
      const isLogLine = logPatterns.some(pattern => pattern.test(line));
      if (!isLogLine) return;
      
      // Extract strings uit deze regel
      const matches = line.match(stringRegex) || [];
      
      matches.forEach(match => {
        // Clean de string (verwijder quotes)
        const clean = match.slice(1, -1);
        
        // Filter criteria voor log teksten:
        if (
          clean.length > 2 && // minimaal 3 karakters
          !clean.startsWith('@') && // geen imports
          !clean.startsWith('./') && // geen relative imports
          !clean.startsWith('../') && // geen relative imports
          !clean.match(/^[A-Z][A-Z0-9_]+$/) && // geen CONSTANT_CASE (behalve log levels)
          !clean.match(/^[a-z]+$/) && // geen enkele woorden zoals 'data', 'state'
          !['string', 'number', 'boolean', 'object', 'function', 'undefined', 'null'].includes(clean) && // geen type names
          !clean.includes('${') // skip template literals met variabelen
        ) {
          fileStrings.push({
            text: clean,
            line: index + 1,
            context: line.trim()
          });
        }
      });
    });
    
    if (fileStrings.length > 0) {
      results.set(file, fileStrings);
    }
  });

  // Write output
  let output = [];
  output.push('# Log Teksten Report');
  output.push(`# Gegenereerd: ${new Date().toISOString()}`);
  output.push(`# Directory: ${searchDir}`);
  output.push(`# Totaal bestanden geanalyseerd: ${files.length}`);
  output.push('# ================================================\n');

  let totalFiles = 0;
  let totalStrings = 0;

  // Sorteer bestanden op pad
  const sortedResults = new Map([...results.entries()].sort());

  for (const [file, strings] of sortedResults) {
    totalFiles++;
    totalStrings += strings.length;
    
    const relPath = path.relative(process.cwd(), file);
    
    output.push('================================================');
    output.push(`📁 BESTAND: ${relPath}`);
    output.push('================================================');
    
    strings.forEach(s => {
      output.push(`  Regel ${s.line}: ${s.text}`);
      output.push(`    → ${s.context}`);
      output.push('');
    });
    
    output.push(`🔢 Totaal: ${strings.length} log teksten\n`);
  }

  output.push('================================================');
  output.push(`📊 SAMENVATTING:`);
  output.push(`   Geanalyseerde bestanden: ${files.length}`);
  output.push(`   Bestanden met log teksten: ${totalFiles}`);
  output.push(`   Totaal log teksten: ${totalStrings}`);
  output.push(`   Gemiddeld per bestand: ${(totalStrings / totalFiles).toFixed(1)}`);

  fs.writeFileSync(outputFile, output.join('\n'));
  
  console.log('================================================');
  console.log(`✅ Klaar! Log teksten opgeslagen in: ${outputFile}`);
  console.log(`📊 Bestanden met log teksten: ${totalFiles}`);
  console.log(`📊 Totaal log teksten: ${totalStrings}`);

} catch (error) {
  console.error('❌ Fout:', error.message);
  if (error.stderr) console.error('📎 Details:', error.stderr.toString());
  process.exit(1);
}