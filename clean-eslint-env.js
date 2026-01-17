#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const SRC_DIR = path.join(__dirname, 'src');

function walk(dir) {
  const files = [];
  for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, f.name);
    if (f.isDirectory()) {
      files.push(...walk(fullPath));
    } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
      files.push(fullPath);
    }
  }
  return files;
}

const tsFiles = walk(SRC_DIR);

for (const file of tsFiles) {
  let content = fs.readFileSync(file, 'utf-8');
  const original = content;
  // Verwijder alle /* eslint-env ... */ comments
  content = content.replace(/\/\* eslint-env [^*]*\*\//g, '');
  if (content !== original) {
    fs.writeFileSync(file, content, 'utf-8');
    console.log(`✔ ${file} opgeschoond`);
  }
}

console.log('✅ Alle eslint-env comments verwijderd!');
