#!/usr/bin/env node
/**
 * Phoenix Quinn Envelope Adapter
 * Wraps Phoenix validator outputs in standardized Quinn Envelope (Q-ENV-1.0)
 * 
 * Usage:
 *   node scripts/phoenix/quinn-adapter.js
 *   
 * Output:
 *   - Console: Human-readable report
 *   - File: phoenix-gate-a-report.json (Quinn Envelope format)
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const crypto = require('crypto');

// === CONFIG ===
const OUTPUT_DIR = path.join(__dirname, '../../reports');
const ENVELOPE_VERSION = 'Q-ENV-1.0';
const GATE = 'A';
const PRODUCING_ROLE = 'Phoenix';

// === VALIDATORS ===
const VALIDATORS = {
  alias_consistency: {
    name: 'Alias Consistency',
    command: 'npm run sync:check -- --strict',
    adr: 'ADR-12',
    blocking: true,
    weight: 20
  },
  forbidden_patterns: {
    name: 'Forbidden Patterns',
    command: 'node scripts/maintenance/forbidden-patterns.js',
    adr: ['ADR-04', 'ADR-11'],
    blocking: true,
    weight: 25
  },
  eslint_compliance: {
    name: 'ESLint Compliance',
    command: 'npm run lint',
    adr: ['ADR-01', 'ADR-02', 'ADR-05', 'ADR-12'],
    blocking: true,
    weight: 25
  }
};

// === HELPERS ===

function generateArtifactId() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
  return `PHOENIX-GATE-A-${timestamp}`;
}

function generateTokenId(verdict) {
  const hash = crypto.createHash('sha256')
    .update(`${verdict}-${Date.now()}`)
    .digest('hex')
    .substring(0, 8);
  return `TOKEN-ID-PHOENIX-VERDICT-${verdict}-${hash}`;
}

function runValidator(validator) {
  const startTime = Date.now();
  
  try {
    execSync(validator.command, { 
      stdio: 'pipe',
      encoding: 'utf8'
    });
    
    return {
      validator: validator.name,
      adr: validator.adr,
      verdict: 'PASS',
      blocking: validator.blocking,
      weight: validator.weight,
      execution_time_ms: Date.now() - startTime,
      message: `✅ ${validator.name} passed`
    };
  } catch (error) {
    const output = error.stdout || error.stderr || error.message;
    
    return {
      validator: validator.name,
      adr: validator.adr,
      verdict: 'FAIL',
      blocking: validator.blocking,
      weight: validator.weight,
      execution_time_ms: Date.now() - startTime,
      message: `❌ ${validator.name} failed`,
      details: output.substring(0, 500) // First 500 chars
    };
  }
}

function calculateVerdict(results) {
  // Check for blocking failures
  const blockingFailures = results.filter(r => r.blocking && r.verdict === 'FAIL');
  
  if (blockingFailures.length > 0) {
    return {
      status: 'STOP',
      gate_a_passed: false,
      blocking_issues: blockingFailures.map(r => `${r.validator}: ${r.message}`),
      advisory_warnings: []
    };
  }
  
  // All blocking checks passed
  const nonBlockingWarnings = results.filter(r => !r.blocking && r.verdict === 'FAIL');
  
  if (nonBlockingWarnings.length > 0) {
    return {
      status: 'CONDITIONAL',
      gate_a_passed: true,
      blocking_issues: [],
      advisory_warnings: nonBlockingWarnings.map(r => `${r.validator}: ${r.message}`)
    };
  }
  
  return {
    status: 'GO',
    gate_a_passed: true,
    blocking_issues: [],
    advisory_warnings: []
  };
}

function extractAdrViolations(results) {
  const violations = [];
  
  results.forEach(result => {
    if (result.verdict === 'FAIL') {
      const adrs = Array.isArray(result.adr) ? result.adr : [result.adr];
      adrs.forEach(adr => {
        violations.push({
          adr_id: adr,
          validator: result.validator,
          severity: result.blocking ? 'BLOCKING' : 'WARNING',
          message: result.message
        });
      });
    }
  });
  
  return violations;
}

function createQuinnEnvelope(results, verdict, artifactId, tokenId) {
  const totalExecutionTime = results.reduce((sum, r) => sum + r.execution_time_ms, 0);
  const adrViolations = extractAdrViolations(results);
  
  const adrChecked = [...new Set(
    results.flatMap(r => Array.isArray(r.adr) ? r.adr : [r.adr])
  )].sort();
  
  return {
    Envelope_Version: ENVELOPE_VERSION,
    Artifact_ID: artifactId,
    Gate: GATE,
    Producing_Role: PRODUCING_ROLE,
    Status: 'PENDING',
    Token_ID: tokenId,
    Payload: {
      phoenix_report: {
        metadata: {
          role: 'Phoenix - Automated Code Quality Guardian',
          version: 'GEN4.0.0',
          gate: GATE,
          execution_time_ms: totalExecutionTime,
          timestamp: new Date().toISOString()
        },
        validators: results.reduce((acc, r) => {
          acc[r.validator.toLowerCase().replace(/\s+/g, '_')] = {
            verdict: r.verdict,
            adr: r.adr,
            blocking: r.blocking,
            weight: r.weight,
            execution_time_ms: r.execution_time_ms,
            message: r.message,
            details: r.details
          };
          return acc;
        }, {}),
        adr_coverage: {
          checked: adrChecked,
          violations: adrViolations,
          warnings: adrViolations.filter(v => v.severity === 'WARNING')
        },
        verdict: verdict
      }
    },
    Router_Metadata: {
      Previous_Gate: '0',
      Locked: false,
      Human_GO: 'NOT_REQUIRED_FOR_GATE_A',
      Timestamp: new Date().toISOString()
    }
  };
}

function printReport(envelope) {
  const report = envelope.Payload.phoenix_report;
  
  console.log('\n🦅 Phoenix Gate A - Code Quality Check\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  // Validators
  console.log('📋 Validator Results:\n');
  Object.entries(report.validators).forEach(([key, result]) => {
    const icon = result.verdict === 'PASS' ? '✅' : '❌';
    const blocking = result.blocking ? '[BLOCKING]' : '[ADVISORY]';
    console.log(`${icon} ${result.message} ${blocking}`);
    if (result.details) {
      console.log(`   Details: ${result.details.substring(0, 100)}...`);
    }
  });
  
  console.log('');
  
  // ADR Violations
  if (report.adr_coverage.violations.length > 0) {
    console.log('🚨 ADR Violations:\n');
    report.adr_coverage.violations.forEach(v => {
      console.log(`   ${v.severity === 'BLOCKING' ? '🔴' : '🟡'} ${v.adr_id}: ${v.message}`);
    });
    console.log('');
  }
  
  // Verdict
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  const verdictIcon = {
    'GO': '✅',
    'CONDITIONAL': '⚠️ ',
    'STOP': '❌'
  }[report.verdict.status];
  
  console.log(`${verdictIcon} Verdict: ${report.verdict.status}\n`);
  
  if (report.verdict.blocking_issues.length > 0) {
    console.log('Blocking Issues:');
    report.verdict.blocking_issues.forEach(issue => {
      console.log(`  - ${issue}`);
    });
    console.log('');
  }
  
  if (report.verdict.advisory_warnings.length > 0) {
    console.log('Advisory Warnings:');
    report.verdict.advisory_warnings.forEach(warning => {
      console.log(`  - ${warning}`);
    });
    console.log('');
  }
  
  console.log(`⏱️  Execution Time: ${report.metadata.execution_time_ms}ms`);
  console.log(`📄 Report: ${OUTPUT_DIR}/phoenix-gate-a-report.json`);
  console.log('');
}

// === MAIN ===

async function main() {
  console.log('🦅 Phoenix Quinn Envelope Adapter - Starting...\n');
  
  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
  
  // Run validators
  const results = [];
  
  for (const [key, validator] of Object.entries(VALIDATORS)) {
    console.log(`Running: ${validator.name}...`);
    const result = runValidator(validator);
    results.push(result);
  }
  
  // Calculate verdict
  const verdict = calculateVerdict(results);
  
  // Generate envelope
  const artifactId = generateArtifactId();
  const tokenId = generateTokenId(verdict.status);
  const envelope = createQuinnEnvelope(results, verdict, artifactId, tokenId);
  
  // Save report
  const reportPath = path.join(OUTPUT_DIR, 'phoenix-gate-a-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(envelope, null, 2));
  
  // Print human-readable report
  printReport(envelope);
  
  // Exit code
  const exitCode = verdict.status === 'STOP' ? 1 : 0;
  
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  if (verdict.status === 'STOP') {
    console.log('❌ Gate A: STOP - Fix blocking issues before proceeding\n');
  } else if (verdict.status === 'CONDITIONAL') {
    console.log('⚠️  Gate A: CONDITIONAL - Proceed with caution\n');
  } else {
    console.log('✅ Gate A: GO - All checks passed!\n');
  }
  
  process.exit(exitCode);
}

// === RUN ===
if (require.main === module) {
  main().catch(error => {
    console.error('❌ Fatal error:', error.message);
    process.exit(1);
  });
}

module.exports = { createQuinnEnvelope, runValidator, calculateVerdict };
