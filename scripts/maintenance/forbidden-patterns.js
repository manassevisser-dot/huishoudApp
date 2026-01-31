#!/usr/bin/env node
/**
 * Phoenix Forbidden Patterns Validator
 * Voorkomt dat "domme AI helpers" rotzooi introduceren
 * 
 * Checks:
 * 1. Vitest (verboden - we gebruiken Jest)
 * 2. HTML tags (verboden - React Native gebruikt View/Text)
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// === CONFIG ===
const SCAN_DIRS = ['src'];
const EXCLUDE_DIRS = ['node_modules', '.git', 'coverage', 'dist', 'build'];

const FORBIDDEN_PATTERNS = {
  vitest: {
    name: 'Vitest',
    reason: 'We gebruiken Jest, niet Vitest',
    patterns: [
      /import.*from\s+['"]vitest['"]/,
      /require\(['"]vitest['"]\)/,
      /vitest\.config/,
      /@vitest\//,
      /describe\.skip/,  // Vitest-specifiek
    ],
    fileTypes: ['.ts', '.tsx', '.js', '.jsx', '.json']
  },
  
  htmlTags: {
    name: 'HTML Tags',
    reason: 'React Native app - gebruik View/Text/TouchableOpacity',
    patterns: [
      /<div[\s>]/,
      /<span[\s>]/,
      /<button[\s>]/,
      /<input[\s>]/,
      /<form[\s>]/,
      /<a[\s>]/,
      /<p[\s>]/,
      /<h[1-6][\s>]/,
      /<ul[\s>]/,
      /<li[\s>]/,
      /<table[\s>]/,
    ],
    fileTypes: ['.tsx', '.jsx'],
    excludeFiles: ['*.test.tsx', '*.test.jsx', '*.stories.tsx'] // Tests mogen HTML hebben
  }
};

// === HELPERS ===

function shouldScanFile(filepath, fileTypes, excludeFiles = []) {
  const ext = path.extname(filepath);
  if (!fileTypes.includes(ext)) return false;
  
  const basename = path.basename(filepath);
  return !excludeFiles.some(pattern => {
    const regex = new RegExp(pattern.replace('*', '.*'));
    return regex.test(basename);
  });
}

function scanFile(filepath, patterns) {
  try {
    const content = fs.readFileSync(filepath, 'utf8');
    const violations = [];
    
    patterns.forEach((pattern, idx) => {
      const matches = content.match(new RegExp(pattern, 'g'));
      if (matches) {
        // Find line numbers
        const lines = content.split('\n');
        lines.forEach((line, lineNum) => {
          if (pattern.test(line)) {
            violations.push({
              line: lineNum + 1,
              content: line.trim(),
              pattern: pattern.source
            });
          }
        });
      }
    });
    
    return violations;
  } catch (e) {
    return [];
  }
}

function getAllFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filepath = path.join(dir, file);
    const stat = fs.statSync(filepath);
    
    if (stat.isDirectory()) {
      if (!EXCLUDE_DIRS.includes(file)) {
        getAllFiles(filepath, fileList);
      }
    } else {
      fileList.push(filepath);
    }
  });
  
  return fileList;
}

// === MAIN ===

function main() {
  console.log('🔍 Phoenix Forbidden Patterns Scan\n');
  
  const rootDir = process.cwd();
  const results = {};
  let totalViolations = 0;
  
  // Scan each pattern type
  Object.entries(FORBIDDEN_PATTERNS).forEach(([key, config]) => {
    console.log(`📋 Checking for: ${config.name}`);
    console.log(`   Reason: ${config.reason}\n`);
    
    results[key] = [];
    
    SCAN_DIRS.forEach(scanDir => {
      const fullPath = path.join(rootDir, scanDir);
      if (!fs.existsSync(fullPath)) return;
      
      const allFiles = getAllFiles(fullPath);
      
      allFiles.forEach(filepath => {
        if (!shouldScanFile(filepath, config.fileTypes, config.excludeFiles)) {
          return;
        }
        
        const violations = scanFile(filepath, config.patterns);
        
        if (violations.length > 0) {
          results[key].push({
            file: path.relative(rootDir, filepath),
            violations
          });
          totalViolations += violations.length;
        }
      });
    });
    
    if (results[key].length === 0) {
      console.log(`   ✅ Clean!\n`);
    } else {
      console.log(`   ❌ Found ${results[key].length} file(s) with violations\n`);
    }
  });
  
  // Report
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  if (totalViolations === 0) {
    console.log('✅ NO FORBIDDEN PATTERNS FOUND!\n');
    console.log('Codebase is clean - geen domme AI rotzooi! 🎉\n');
    process.exit(0);
  }
  
  console.log(`❌ FOUND ${totalViolations} VIOLATIONS!\n`);
  
  // Detailed report
  Object.entries(results).forEach(([key, files]) => {
    if (files.length === 0) return;
    
    const config = FORBIDDEN_PATTERNS[key];
    console.log(`\n🚨 ${config.name.toUpperCase()}`);
    console.log(`Reason: ${config.reason}\n`);
    
    files.forEach(({ file, violations }) => {
      console.log(`📄 ${file}`);
      violations.forEach(v => {
        console.log(`   Line ${v.line}: ${v.content.substring(0, 80)}${v.content.length > 80 ? '...' : ''}`);
      });
      console.log('');
    });
  });
  
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('\n💡 Quick fixes:\n');
  
  if (results.vitest.length > 0) {
    console.log('Vitest → Jest:');
    console.log('  - Remove vitest from package.json');
    console.log('  - Replace "import { describe } from \'vitest\'" with Jest');
    console.log('  - Use npm test (Jest) instead\n');
  }
  
  if (results.htmlTags.length > 0) {
    console.log('HTML → React Native:');
    console.log('  - <div> → <View>');
    console.log('  - <span> → <Text>');
    console.log('  - <button> → <TouchableOpacity> of <Pressable>');
    console.log('  - <input> → <TextInput>');
    console.log('  - <a> → <TouchableOpacity> met onPress\n');
  }
  
  console.log('Run this command to fix your code, then try again.\n');
  
  process.exit(1);
}

// === RUN ===
if (require.main === module) {
  main();
}

module.exports = { FORBIDDEN_PATTERNS, scanFile };