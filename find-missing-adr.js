#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const searchDir = path.resolve(process.cwd(), 'src');
const outputFile = 'logs_zonder_adr.txt';

const loggerMethods = ['emergency', 'alert', 'critical', 'error', 'warning', 'notice', 'info', 'debug', 'log'];

// Vind alle .ts en .tsx bestanden (exclusief test-utils, __mocks__, etc.)
const files = execSync(`find ${searchDir} -type f \\( -name "*.ts" -o -name "*.tsx" \\)`, { encoding: 'utf8' })
  .split('\n')
  .filter(f => f && !f.includes('node_modules') && !f.includes('test-utils') && !f.includes('__mocks__'));

const results = [];

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');
  lines.forEach((line, idx) => {
    for (const method of loggerMethods) {
      const regex = new RegExp(`Logger\\.${method}\\s*\\(`, 'g');
      let match;
      while ((match = regex.exec(line)) !== null) {
        // Simpele check: staat 'adr:' op dezelfde regel?
        const hasAdr = line.includes('adr:');
        results.push({
          file,
          line: idx + 1,
          method,
          hasAdr,
          snippet: line.trim()
        });
      }
    }
  });
});

const missingAdr = results.filter(r => !r.hasAdr);

let output = '# Logger calls zonder ADR referentie\n';
output += `# Totaal: ${missingAdr.length}\n`;
output += '# Bestand:regel:methode: snippet\n';
missingAdr.forEach(r => {
  output += `${r.file}:${r.line}:${r.method}: ${r.snippet}\n`;
});

fs.writeFileSync(outputFile, output);
console.log(`✅ Gevonden: ${missingAdr.length} logger calls zonder ADR. Zie ${outputFile}`);