#!/usr/bin/env node
/**
 * Phoenix Marker Checker
 * Checkt of @alias-start / @alias-end markers aanwezig zijn
 */

const fs = require('fs');
const path = require('path');

const files = {
  babel: path.resolve(__dirname, '../../babel.config.js'),
  jest: path.resolve(__dirname, '../../jest.config.ts'),
  jsconfig: path.resolve(__dirname, '../../jsconfig.json')
};

const START_MARKER = '// @alias-start';
const END_MARKER = '// @alias-end';

console.log('🔍 Phoenix Marker Check\n');

let allGood = true;

Object.entries(files).forEach(([name, filepath]) => {
  if (!fs.existsSync(filepath)) {
    console.log(`⚠️  ${name}: Bestand niet gevonden (optioneel voor jsconfig)`);
    if (name !== 'jsconfig') allGood = false;
    return;
  }
  
  const content = fs.readFileSync(filepath, 'utf8');
  const hasStart = content.includes(START_MARKER);
  const hasEnd = content.includes(END_MARKER);
  
  if (hasStart && hasEnd) {
    console.log(`✅ ${name}: Markers gevonden`);
  } else if (!hasStart && !hasEnd) {
    console.log(`❌ ${name}: GEEN markers gevonden`);
    allGood = false;
  } else {
    console.log(`⚠️  ${name}: Incomplete markers (start: ${hasStart}, end: ${hasEnd})`);
    allGood = false;
  }
});

console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

if (allGood) {
  console.log('✅ Alle markers aanwezig! Je kunt sync draaien.\n');
  process.exit(0);
} else {
  console.log('❌ Markers ontbreken!\n');
  console.log('Voeg deze toe aan je config bestanden:\n');
  
  console.log('=== babel.config.js ===');
  console.log(`alias: {
  ${START_MARKER}
  '@app': './src/app',
  '@domain': './src/domain',
  // ... rest van aliases ...
  ${END_MARKER}
}\n`);
  
  console.log('=== jest.config.ts ===');
  console.log(`moduleNameMapper: {
  ${START_MARKER}
  '^@app/(.*)$': '<rootDir>/src/app/$1',
  // ... rest van aliases ...
  ${END_MARKER}
}\n`);
  
  process.exit(1);
}