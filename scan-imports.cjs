// scan-imports.cjs
const fs = require('fs');
const path = require('path');
const madge = require('madge');

// Configuratie
const CONFIG = {
  repoPath: './src',
  outputFile: 'mapping.csv',
  extensions: ['ts', 'tsx', 'js', 'jsx'],
  folders: {
    ui: 'ui/',
    adapter: 'adapters/',
    domain: 'domain/'
  }
};

/**
 * Classificeer een bestand op basis van zijn pad
 */
function classifyFile(filePath) {
  if (filePath.startsWith(CONFIG.folders.ui)) return 'UI';
  if (filePath.startsWith(CONFIG.folders.adapter)) return 'Adapter';
  if (filePath.startsWith(CONFIG.folders.domain)) return 'Domain';
  return 'Other';
}

/**
 * Analyseer imports en bepaal categorieën
 */
function analyzeImports(file, imports) {
  const importsFromUI = imports.filter(i => i.startsWith(CONFIG.folders.ui)).length;
  const importsFromAdapter = imports.filter(i => i.startsWith(CONFIG.folders.adapter)).length;
  const importsFromDomain = imports.filter(i => i.startsWith(CONFIG.folders.domain)).length;
  
  const fileType = classifyFile(file);
  const isDomain = fileType === 'Domain' ? 'YES' : 'NO';
  
  // Kandidaat voor domain/types:
  // - Is een domeinbestand
  // - Wordt door zowel UI als Adapter geïmporteerd
  const isCandidate = isDomain === 'YES' && importsFromUI > 0 && importsFromAdapter > 0 ? 'YES' : 'NO';
  
  // Detecteer potentiële architecture violations
  const hasViolation = detectArchitectureViolations(file, imports);

  return {
    file,
    fileType,
    importsFromUI,
    importsFromAdapter,
    importsFromDomain,
    totalImports: imports.length,
    isDomain,
    isCandidate,
    hasViolation
  };
}

/**
 * Detecteer architecture violations
 * Bijvoorbeeld: Domain die UI importeert
 */
function detectArchitectureViolations(file, imports) {
  const fileType = classifyFile(file);
  
  // Domain mag geen UI importeren
  if (fileType === 'Domain' && imports.some(i => i.startsWith(CONFIG.folders.ui))) {
    return 'Domain->UI';
  }
  
  // Domain mag geen Adapter importeren
  if (fileType === 'Domain' && imports.some(i => i.startsWith(CONFIG.folders.adapter))) {
    return 'Domain->Adapter';
  }
  
  return 'NONE';
}

/**
 * Genereer statistieken
 */
function generateStats(analyses) {
  const stats = {
    totalFiles: analyses.length,
    byType: {},
    candidates: analyses.filter(a => a.isCandidate === 'YES').length,
    violations: analyses.filter(a => a.hasViolation !== 'NONE').length
  };
  
  analyses.forEach(a => {
    stats.byType[a.fileType] = (stats.byType[a.fileType] || 0) + 1;
  });
  
  return stats;
}

/**
 * Print statistieken naar console
 */
function printStats(stats) {
  console.log('\n📊 Statistieken:');
  console.log('─'.repeat(50));
  console.log(`Totaal bestanden: ${stats.totalFiles}`);
  console.log('\nVerdeling per type:');
  Object.entries(stats.byType).forEach(([type, count]) => {
    console.log(`  ${type}: ${count}`);
  });
  console.log(`\n✨ Kandidaten voor domain/types: ${stats.candidates}`);
  console.log(`⚠️  Architecture violations: ${stats.violations}`);
  console.log('─'.repeat(50));
}

/**
 * Schrijf resultaten naar CSV
 */
function writeCSV(analyses, outputPath) {
  const headers = [
    'File',
    'Type',
    'Imports_UI',
    'Imports_Adapter',
    'Imports_Domain',
    'Total_Imports',
    'Is_Domain',
    'Candidate_DomainTypes',
    'Architecture_Violation'
  ];
  
  const rows = [headers];
  
  analyses.forEach(a => {
    rows.push([
      a.file,
      a.fileType,
      a.importsFromUI,
      a.importsFromAdapter,
      a.importsFromDomain,
      a.totalImports,
      a.isDomain,
      a.isCandidate,
      a.hasViolation
    ]);
  });
  
  const csvContent = rows.map(r => r.join(',')).join('\n');
  fs.writeFileSync(outputPath, csvContent, 'utf-8');
}

/**
 * Hoofdfunctie
 */
async function generateMapping() {
  try {
    console.log('🔍 Scanning repository...');
    console.log(`📁 Pad: ${CONFIG.repoPath}`);
    console.log(`📝 Extensies: ${CONFIG.extensions.join(', ')}`);
    
    // Controleer of de repo path bestaat
    if (!fs.existsSync(CONFIG.repoPath)) {
      throw new Error(`Pad niet gevonden: ${CONFIG.repoPath}`);
    }
    
    // Genereer dependency graph
    const result = await madge(CONFIG.repoPath, { 
      extensions: CONFIG.extensions,
      fileExtensions: CONFIG.extensions
    });
    
    const graph = result.obj();
    const fileCount = Object.keys(graph).length;
    
    console.log(`✓ ${fileCount} bestanden gevonden`);
    
    // Analyseer alle bestanden
    const analyses = Object.entries(graph).map(([file, imports]) => 
      analyzeImports(file, imports)
    );
    
    // Sorteer resultaten (kandidaten eerst, dan violations, dan alfabetisch)
    analyses.sort((a, b) => {
      if (a.isCandidate !== b.isCandidate) {
        return a.isCandidate === 'YES' ? -1 : 1;
      }
      if (a.hasViolation !== b.hasViolation) {
        return a.hasViolation !== 'NONE' ? -1 : 1;
      }
      return a.file.localeCompare(b.file);
    });
    
    // Schrijf CSV
    writeCSV(analyses, CONFIG.outputFile);
    
    // Toon statistieken
    const stats = generateStats(analyses);
    printStats(stats);
    
    console.log(`\n✅ ${CONFIG.outputFile} succesvol gegenereerd!`);
    
    // Toon enkele voorbeelden van kandidaten
    const candidates = analyses.filter(a => a.isCandidate === 'YES');
    if (candidates.length > 0) {
      console.log('\n🎯 Top kandidaten voor domain/types:');
      candidates.slice(0, 5).forEach(c => {
        console.log(`  • ${c.file} (${c.totalImports} imports)`);
      });
      if (candidates.length > 5) {
        console.log(`  ... en ${candidates.length - 5} meer`);
      }
    }
    
    // Toon violations
    const violations = analyses.filter(a => a.hasViolation !== 'NONE');
    if (violations.length > 0) {
      console.log('\n⚠️  Architecture violations gevonden:');
      violations.slice(0, 5).forEach(v => {
        console.log(`  • ${v.file} (${v.hasViolation})`);
      });
      if (violations.length > 5) {
        console.log(`  ... en ${violations.length - 5} meer`);
      }
    }
    
  } catch (err) {
    console.error('\n❌ Fout tijdens genereren:');
    console.error(err.message);
    if (err.stack) {
      console.error('\nStack trace:');
      console.error(err.stack);
    }
    process.exit(1);
  }
}

// Run script
generateMapping();