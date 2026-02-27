const fs = require('fs');
const path = require('path');

const DOCS_DIR = 'docs';
const READMES_DEST = path.join(DOCS_DIR, 'readmes');

// 1. Verzamel en kopieer de bestanden (gebaseerd op jouw eerste script)
function collectAndCopy(dir, relativePath = '') {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let files = [];

  entries.forEach(entry => {
    const fullPath = path.join(dir, entry.name);
    const relPath = path.join(relativePath, entry.name);

    if (entry.isDirectory() && !['node_modules', '.git'].includes(entry.name)) {
      files = [...files, ...collectAndCopy(fullPath, relPath)];
    } else if (entry.name.toLowerCase() === 'readme.md') {
      const dest = path.join(READMES_DEST, relativePath, 'README.md');
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      fs.copyFileSync(fullPath, dest);
      files.push({ src: fullPath, dest: dest.replace(/\\/g, '/') }); // Normaliseer slashes voor web
    }
  });
  return files;
}

// 2. Hoofdprogramma
function main() {
  console.log('🚀 Verzamelen van READMEs...');
  const files = collectAndCopy('src');
  
  // Genereer de Navigatie (jouw tweede script idee)
  const navTree = generateNavTree(files);
  const mkDocsConfig = generateMkDocsConfig(navTree);
  
  fs.writeFileSync('mkdocs.yml', mkDocsConfig);
  console.log('✓ mkdocs.yml gegenereerd met', files.length, 'modules.');
}

// ... voeg hier je generateNavTree en generateMkDocsConfig functies toe uit optie 2 ...
function generateNavTree(files) {
  // Genereer een navigation tree voor mkdocs/vitepress
  const tree = {};
  files.forEach(({ dest }) => {
    const parts = dest.replace('docs/readmes/', '').split(path.sep);
    let current = tree;
    parts.forEach((part, i) => {
      if (i === parts.length - 1) {
        current[part] = dest;
      } else {
        current[part] = current[part] || {};
        current = current[part];
      }
    });
  });
  return tree;
}

function generateMkDocsConfig(tree) {
  return `site_name: HuishoudApp Docs
theme:
  name: material
  features:
    - navigation.tabs
    - navigation.sections
nav:
  - Home: index.md
  - API Reference: api/
  - Modules:
${Object.entries(tree).map(([key, value]) => `    - ${key}: ${value}`).join('\n')}
  - Architecture: architecture/`;
}
main();