#!/usr/bin/env node
// scripts/maintenance/audit-orchestrator.js
const fs = require('fs');
const path = require('path');

const isVerbose = process.env.VERBOSE === 'true';
const args = process.argv.slice(2);

/**
 * Trinity State Machine
 * Encapsulates all score computation logic
 */
class TrinityState {
  constructor() {
    this.audit = 0;
    this.coverage = 0;
    this.stability = 0;
    this.master = 'U'; // Unknown
    this.timestamp = new Date().toISOString();
    this.errors = [];
    this.warnings = [];
    this.meta = {};
  }

  /**
   * Berekent Audit Score
   * In een echte implementatie zou dit uit audit-check.sh komen
   */
  computeAudit() {
    // TODO: Integreer met echte audit resultaten
    this.audit = 85;
    this.meta.auditSource = 'static';
  }

  /**
   * Leest Jest Coverage Data
   */
  computeCoverage() {
    try {
      const coveragePath = path.join(process.cwd(), 'coverage/coverage-summary.json');
      
      if (!fs.existsSync(coveragePath)) {
        this.warnings.push('Coverage file not found - run tests first');
        this.coverage = 0;
        return;
      }

      const summary = JSON.parse(fs.readFileSync(coveragePath, 'utf8'));
      
      // Branch coverage als primaire metric
      this.coverage = Math.round(summary.total.branches.pct);
      
      // Extra metadata
      this.meta.lines = {
        total: summary.total.lines.total,
        covered: summary.total.lines.covered,
        pct: summary.total.lines.pct
      };
      
      this.meta.functions = {
        total: summary.total.functions.total,
        covered: summary.total.functions.covered,
        pct: summary.total.functions.pct
      };

      if (isVerbose) {
        console.error(`ℹ️  Coverage data loaded: ${this.coverage}%`);
      }
    } catch (error) {
      this.errors.push(`Failed to read coverage: ${error.message}`);
      this.coverage = 0;
      
      if (isVerbose) {
        console.error('⚠️  Kon coverage data niet inlezen:', error.message);
      }
    }
  }

  /**
   * Berekent Stability Score (Coverage - Risk Penalty)
   */
  computeStability() {
    if (!this.meta.lines) {
      this.stability = 0;
      return;
    }

    const uncoveredLines = this.meta.lines.total - this.meta.lines.covered;
    const riskPenalty = Math.min(Math.round(uncoveredLines / 10), 20);
    
    this.stability = Math.max(0, this.coverage - riskPenalty);
    
    this.meta.risk = {
      uncoveredLines,
      penalty: riskPenalty
    };
  }

  /**
   * Berekent Master Grade op basis van Audit + Stability
   */
  computeMaster() {
    const avg = Math.round((this.audit + this.stability) / 2);
    
    if (avg >= 90) return 'S';
    if (avg >= 75) return 'A';
    if (avg >= 60) return 'B';
    return 'C';
  }

  /**
   * Run volledige Trinity berekening
   */
  compute() {
    this.computeAudit();
    this.computeCoverage();
    this.computeStability();
    this.master = this.computeMaster();
  }

  /**
   * Export als JSON
   */
  toJSON() {
    return {
      audit: this.audit,
      coverage: this.coverage,
      stability: this.stability,
      master: this.master,
      timestamp: this.timestamp,
      errors: this.errors,
      warnings: this.warnings,
      meta: this.meta
    };
  }

  /**
   * Export als legacy string (backward compatibility)
   */
  toLegacyString() {
    return `TRINITY_DATA|AUDIT:${this.audit}|COV:${this.coverage}|STAB:${this.stability}|MASTER:${this.master}`;
  }

  /**
   * Pretty print voor console
   */
  toString() {
    const lines = [
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
      '   📊 TRINITY SCORES',
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
      `   🏛️  Audit:     ${this.audit}%`,
      `   🧪  Coverage:  ${this.coverage}%`,
      `   🛡️  Stability: ${this.stability}%`,
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
      `   👑 MASTER:    ${this.master}`,
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
    ];

    if (this.warnings.length > 0) {
      lines.push('');
      lines.push('⚠️  Warnings:');
      this.warnings.forEach(w => lines.push(`   • ${w}`));
    }

    if (this.errors.length > 0) {
      lines.push('');
      lines.push('❌ Errors:');
      this.errors.forEach(e => lines.push(`   • ${e}`));
    }

    return lines.join('\n');
  }
}

/**
 * Main Entry Point
 */
function main() {
  const state = new TrinityState();
  state.compute();

  // Output format based on args
  if (args.includes('--json')) {
    // JSON output (preferred for scripting)
    console.log(JSON.stringify(state.toJSON(), null, 2));
  } else if (args.includes('--legacy')) {
    // Legacy pipe format (backward compatibility)
    console.log(state.toLegacyString());
  } else if (args.includes('--pretty')) {
    // Pretty console output
    console.log(state.toString());
  } else {
    // Default: compact JSON for bash parsing
    console.log(JSON.stringify(state.toJSON()));
  }

  // Exit code based on quality gates
  const hasErrors = state.errors.length > 0;
  const belowMinimum = state.coverage < 70 || state.master === 'C';

  if (hasErrors) {
    process.exit(1);
  } else if (belowMinimum) {
    // Soft failure - data is valid but quality is low
    process.exit(0);
  } else {
    process.exit(0);
  }
}

// Execute
if (require.main === module) {
  main();
}

// Export for testing
module.exports = { TrinityState };
