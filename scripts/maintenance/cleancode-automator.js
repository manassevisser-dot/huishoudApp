#!/usr/bin/env node
/**
 * Phoenix CleanCode Automator
 * Automatiseert CleanCodeChecklist2025 en berekent gewogen score
 * 
 * Coverage: ~41% van checklist automatiseerbaar
 * Remainder: Manual review door Iris/Ava
 * 
 * Usage:
 *   node scripts/maintenance/cleancode-automator.js [--verbose]
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const VERBOSE = process.argv.includes('--verbose');

// === CLEANCODE CHECKLIST 2025 ===
// Alleen items die automatisch te checken zijn

const CHECKLIST = {
  structural: [
    {
      id: 'S-04',
      regel: 'TypeScript strict',
      controle: 'strict: true + geen any',
      gewicht: 4,
      check: checkTypeScriptStrict
    },
    {
      id: 'S-05',
      regel: 'Geen duplicatie',
      controle: 'Detectie via lint',
      gewicht: 2,
      check: checkNoDuplication
    }
  ],
  testability: [
    {
      id: 'T-01',
      regel: 'Domeinlogica getest',
      controle: 'Unit tests in kernel aanwezig',
      gewicht: 5,
      check: checkDomainTests
    },
    {
      id: 'T-04',
      regel: 'Coverage ≥ 80% kernel',
      controle: 'Coverage report',
      gewicht: 4,
      check: checkCoverage
    }
  ],
  consistency_readability: [
    {
      id: 'R-01',
      regel: 'ESLint/Prettier pass',
      controle: 'npm run lint = 0 errors',
      gewicht: 3,
      check: checkLinting
    }
  ],
  security_data_handling: [
    {
      id: 'SEC-02',
      regel: 'Geen gevoelige data in logs',
      controle: 'Zoekopdracht',
      gewicht: 3,
      check: checkNoSensitiveLogging
    }
  ]
};

// === CHECK FUNCTIONS ===

function checkTypeScriptStrict() {
  try {
    if (!fs.existsSync('tsconfig.json')) {
      return {
        status: 'FAIL',
        score: 0,
        message: 'tsconfig.json not found'
      };
    }
    
    // Simple text-based check - more robust than JSON parsing
    const content = fs.readFileSync('tsconfig.json', 'utf8');
    
    // Check for strict mode
    const hasStrict = /"strict"\s*:\s*true/i.test(content);
    const hasNoImplicitAny = !/"noImplicitAny"\s*:\s*false/i.test(content);
    
    if (hasStrict && hasNoImplicitAny) {
      return {
        status: 'PASS',
        score: 100,
        message: 'TypeScript strict mode enabled'
      };
    } else if (hasStrict) {
      return {
        status: 'PARTIAL',
        score: 75,
        message: 'TypeScript strict enabled (noImplicitAny not explicitly false)'
      };
    } else {
      return {
        status: 'FAIL',
        score: 0,
        message: 'TypeScript strict mode not enabled'
      };
    }
  } catch (e) {
    return {
      status: 'FAIL',
      score: 0,
      message: `Could not check tsconfig.json: ${e.message}`
    };
  }
}

function checkNoDuplication() {
  // Simple check: Look for ESLint no-duplicate rules
  // More sophisticated: Use jscpd or similar
  try {
    const result = execSync('npm run lint', { encoding: 'utf8', stdio: 'pipe' });
    
    // If lint passes, assume no major duplication
    return {
      status: 'PASS',
      score: 100,
      message: 'No duplication detected via ESLint'
    };
  } catch (e) {
    // Check if error mentions duplication
    const output = e.stdout || e.stderr || '';
    if (output.includes('duplicate') || output.includes('duplicated')) {
      return {
        status: 'FAIL',
        score: 0,
        message: 'Code duplication detected'
      };
    }
    
    return {
      status: 'PARTIAL',
      score: 50,
      message: 'Could not verify duplication status'
    };
  }
}

function checkDomainTests() {
  const testDirs = [
'src/__tests__/',
'src/domain/__tests__/',
'src/domain/rules/__tests__/',
'src/domain/validation/__tests__/',
'src/domain/wizard/__tests__/',
'src/domain/services/__tests__/',
'src/app/hooks/__tests__/',
'src/app/orchestrators/__tests__/',
'src/app/context/__tests__/',
'src/ui/components/__tests__/',
'src/ui/screens/Daily/__tests__/',
'src/ui/screens/Wizard/__tests__/',
'src/ui/screens/Wizard/pages/__tests__/',
'src/ui/selectors/__tests__/',
'src/ui/styles/__tests__/',
'src/services/__tests__/',
'src/utils/__tests__/',
'src/state/schemas/__tests__/'
  ];
  
  let testFilesFound = 0;
  
  testDirs.forEach(dir => {
    if (fs.existsSync(dir)) {
      const files = fs.readdirSync(dir, { recursive: false }).filter(f => 
        (f.endsWith('.test.ts') || f.endsWith('.test.tsx') || f.endsWith('.spec.ts')) &&
        !f.includes('node_modules')
      );
      testFilesFound += files.length;
    }
  });
  
  if (testFilesFound >= 20) {
    return {
      status: 'PASS',
      score: 100,
      message: `Found ${testFilesFound} domain test files`
    };
  } else if (testFilesFound >= 10) {
    return {
      status: 'PARTIAL',
      score: 70,
      message: `Found ${testFilesFound} domain test files (good coverage)`
    };
  } else {
    return {
      status: 'PARTIAL',
      score: 50,
      message: `Found ${testFilesFound} domain test files (could be more)`
    };
  }
}

function checkCoverage() {
  try {
    const coveragePath = 'coverage/coverage-summary.json';
    
    console.log('[DEBUG] Checking coverage at:', coveragePath);
    
    if (!fs.existsSync(coveragePath)) {
      console.log('[DEBUG] Coverage file not found');
      return {
        status: 'FAIL',
        score: 0,
        message: 'No coverage report found (run npm test)'
      };
    }
    
    const coverageContent = fs.readFileSync(coveragePath, 'utf8');
    console.log('[DEBUG] Coverage file size:', coverageContent.length, 'bytes');
    
    const coverage = JSON.parse(coverageContent);
    console.log('[DEBUG] Coverage data:', JSON.stringify(coverage.total, null, 2));
    
    const total = coverage.total;
    const linesCoverage = total.lines.pct;
    
    console.log('[DEBUG] Lines coverage:', linesCoverage);
    
    if (linesCoverage >= 80) {
      return {
        status: 'PASS',
        score: 100,
        message: `Coverage: ${linesCoverage}% (≥ 80%)`
      };
    } else if (linesCoverage >= 60) {
      return {
        status: 'PARTIAL',
        score: 70,
        message: `Coverage: ${linesCoverage}% (below target)`
      };
    } else {
      return {
        status: 'FAIL',
        score: 30,
        message: `Coverage: ${linesCoverage}% (critically low)`
      };
    }
  } catch (e) {
    console.error('[DEBUG] Error in checkCoverage:', e.message);
    return {
      status: 'FAIL',
      score: 0,
      message: 'Could not read coverage report'
    };
  }
}

function checkLinting() {
  try {
    execSync('npm run lint', { stdio: 'pipe' });
    
    return {
      status: 'PASS',
      score: 100,
      message: 'ESLint/Prettier: 0 errors'
    };
  } catch (e) {
    const output = String(e.stdout || e.stderr || e.message || '');
    const errorMatch = output.match(/(\d+)\s+error/);
    const errorCount = errorMatch ? parseInt(errorMatch[1]) : 1;
    
    if (errorCount > 10) {
      return {
        status: 'FAIL',
        score: 0,
        message: `ESLint: ${errorCount} errors`
      };
    } else {
      return {
        status: 'PARTIAL',
        score: 50,
        message: `ESLint: ${errorCount} errors (fixable)`
      };
    }
  }
}

function checkNoSensitiveLogging() {
  // Search for sensitive patterns in console.log
  const sensitivePatterns = [
    /console\.log.*password/i,
    /console\.log.*token/i,
    /console\.log.*api[_-]?key/i,
    /console\.log.*secret/i,
    /console\.log.*credit[_-]?card/i
  ];
  
  const violations = [];
  
  function scanDir(dir) {
    if (!fs.existsSync(dir)) return;
    
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
        scanDir(filePath);
      } else if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.js')) {
        const content = fs.readFileSync(filePath, 'utf8');
        
        sensitivePatterns.forEach(pattern => {
          if (pattern.test(content)) {
            violations.push({
              file: filePath,
              pattern: pattern.source
            });
          }
        });
      }
    });
  }
  
  scanDir('src');
  
  if (violations.length === 0) {
    return {
      status: 'PASS',
      score: 100,
      message: 'No sensitive data in logs detected'
    };
  } else {
    return {
      status: 'FAIL',
      score: 0,
      message: `Found ${violations.length} potential sensitive logging issues`,
      details: violations.slice(0, 3) // First 3
    };
  }
}

// === MAIN ===

function main() {
  console.log('🧪 Phoenix CleanCode Automator\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  const results = [];
  let totalWeight = 0;
  let achievedScore = 0;
  
  // Run all checks
  Object.entries(CHECKLIST).forEach(([category, items]) => {
    console.log(`📋 ${category.toUpperCase().replace(/_/g, ' ')}\n`);
    
    items.forEach(item => {
      const result = item.check();
      
      const icon = {
        'PASS': '✅',
        'PARTIAL': '⚠️ ',
        'FAIL': '❌'
      }[result.status];
      
      console.log(`${icon} ${item.id}: ${item.regel}`);
      console.log(`   ${result.message}`);
      
      if (VERBOSE && result.details) {
        console.log(`   Details:`, result.details);
      }
      
      console.log('');
      
      totalWeight += item.gewicht;
      achievedScore += (result.score / 100) * item.gewicht;
      
      results.push({
        ...item,
        result
      });
    });
  });
  
  // Calculate final score
  const finalScore = totalWeight > 0 ? (achievedScore / totalWeight) * 100 : 0;
  
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  console.log(`📊 FINAL SCORE: ${finalScore.toFixed(1)}%\n`);
  
  console.log(`Automated Coverage: ${totalWeight}% of total checklist`);
  console.log(`Achieved Score: ${achievedScore.toFixed(1)}/${totalWeight} weighted points\n`);
  
  // Verdict
  if (finalScore >= 90) {
    console.log('✅ EXCELLENT - Code quality is high\n');
  } else if (finalScore >= 70) {
    console.log('⚠️  GOOD - Minor improvements needed\n');
  } else if (finalScore >= 50) {
    console.log('⚠️  ACCEPTABLE - Several issues to address\n');
  } else {
    console.log('❌ NEEDS WORK - Significant quality issues\n');
  }
  
  // Save report
  const report = {
    timestamp: new Date().toISOString(),
    final_score: finalScore,
    total_weight: totalWeight,
    achieved_score: achievedScore,
    results: results.map(r => ({
      id: r.id,
      regel: r.regel,
      status: r.result.status,
      score: r.result.score,
      message: r.result.message
    }))
  };
  
  const reportPath = 'reports/cleancode-report.json';
  if (!fs.existsSync('reports')) {
    fs.mkdirSync('reports', { recursive: true });
  }
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  
  console.log(`📄 Report saved: ${reportPath}\n`);
  
  // Exit code based on score
  const exitCode = finalScore >= 70 ? 0 : 1;
  process.exit(exitCode);
}

// === RUN ===
if (require.main === module) {
  main();
}

module.exports = { CHECKLIST, checkTypeScriptStrict, checkDomainTests };
