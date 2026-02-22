const fs = require('fs');
const path = require('path');

/**
 * Phoenix Alias Validators
 * Detecteert conflicten, overlaps en filesystem issues
 */

class ValidationError {
  constructor(type, message, details = {}) {
    this.type = type;
    this.message = message;
    this.details = details;
    this.severity = details.severity || 'error';
  }
}

/**
 * Controleert of alle alias targets daadwerkelijk bestaan op filesystem
 */
function validateFilesystemTargets(paths, rootDir) {
  const errors = [];
  
  Object.entries(paths).forEach(([alias, targets]) => {
    const targetArray = Array.isArray(targets) ? targets : [targets];
    
    targetArray.forEach((target, idx) => {
      // Verwijder wildcards voor directory check
      const cleanTarget = target.replace(/\/\*$/, '');
      const fullPath = path.resolve(rootDir, cleanTarget);
      
      if (!fs.existsSync(fullPath)) {
        errors.push(new ValidationError(
          'MISSING_TARGET',
          `Alias '${alias}' wijst naar niet-bestaand pad: ${cleanTarget}`,
          {
            alias,
            target: cleanTarget,
            fullPath,
            index: idx,
            severity: 'error'
          }
        ));
      }
    });
  });
  
  return errors;
}

/**
 * Detecteert conflicterende alias mappings (meerdere aliases → zelfde folder)
 */
function validateConflictingPaths(paths) {
  const errors = [];
  const targetMap = new Map(); // target → [aliases]
  
  Object.entries(paths).forEach(([alias, targets]) => {
    const targetArray = Array.isArray(targets) ? targets : [targets];
    
    targetArray.forEach(target => {
      const normalized = target.replace(/\/\*$/, '').replace(/\/$/, '');
      
      if (!targetMap.has(normalized)) {
        targetMap.set(normalized, []);
      }
      targetMap.get(normalized).push(alias);
    });
  });
  
  // Check voor conflicten
  targetMap.forEach((aliases, target) => {
    if (aliases.length > 1) {
      errors.push(new ValidationError(
        'CONFLICTING_ALIASES',
        `Meerdere aliases wijzen naar dezelfde folder: ${target}`,
        {
          target,
          aliases,
          severity: 'warning' // Niet altijd een probleem, maar verdacht
        }
      ));
    }
  });
  
  return errors;
}

/**
 * Detecteert overlappende patterns (bijv. @shared-types/finance vs @shared-types/*)
 * Dit is het KERNPROBLEEM bij de gebruiker
 */
function validateOverlappingPatterns(paths) {
  const errors = [];
  const aliases = Object.keys(paths);
  
  aliases.forEach(alias => {
    // Check of dit een specifiek alias is (eindigt op een naam, niet op /*)
    const isSpecific = !alias.endsWith('/*') && !alias.endsWith('/');
    
    if (isSpecific) {
      // Zoek een bredere glob die dit zou kunnen matchen
      const basePattern = alias.split('/').slice(0, -1).join('/') + '/*';
      
      if (aliases.includes(basePattern)) {
        errors.push(new ValidationError(
          'OVERLAPPING_PATTERN',
          `Alias '${alias}' overlapt met glob '${basePattern}'`,
          {
            specific: alias,
            glob: basePattern,
            specificTarget: paths[alias],
            globTarget: paths[basePattern],
            severity: 'error',
            fix: `Verwijder '${alias}' of '${basePattern}' - kies één strategie`
          }
        ));
      }
    }
  });
  
  return errors;
}

/**
 * Detecteert fallback arrays (bijv. @utils/* → [src/utils/*, src/domain/helpers/*])
 * Dit is GEVAARLIJK omdat TS anders resolved dan Babel/Jest
 */
function validateFallbackArrays(paths) {
  const errors = [];
  
  Object.entries(paths).forEach(([alias, targets]) => {
    if (Array.isArray(targets) && targets.length > 1) {
      errors.push(new ValidationError(
        'FALLBACK_ARRAY',
        `Alias '${alias}' heeft meerdere targets (fallback array)`,
        {
          alias,
          targets,
          severity: 'error',
          fix: `Gebruik één primary target. Maak aparte aliases voor legacy paths.`,
          danger: 'TypeScript zoekt in alle folders, Babel/Jest alleen in de eerste!'
        }
      ));
    }
  });
  
  return errors;
}

/**
 * Detecteert redundante mappings binnen een config
 * Bijv: @shared-types/* EN @shared-types/finance waar finance al gedekt wordt door glob
 */
function validateRedundantMappings(paths) {
  const errors = [];
  const globs = {};
  
  // Verzamel alle glob patterns
  Object.keys(paths).forEach(alias => {
    if (alias.includes('/*')) {
      const basePattern = alias.replace('/*', '');
      globs[basePattern] = alias;
    }
  });
  
  // Check alle niet-glob aliases
  Object.keys(paths).forEach(alias => {
    if (!alias.includes('/*')) {
      // Zoek of er een parent glob is
      Object.keys(globs).forEach(basePattern => {
        if (alias.startsWith(basePattern + '/')) {
          errors.push(new ValidationError(
            'REDUNDANT_MAPPING',
            `Alias '${alias}' is redundant (al gedekt door '${globs[basePattern]}')`,
            {
              redundant: alias,
              coveredBy: globs[basePattern],
              severity: 'warning',
              fix: `Verwijder '${alias}' tenzij je bewust een specifieke override wilt`
            }
          ));
        }
      });
    }
  });
  
  return errors;
}

/**
 * Master validator - draait alle checks
 */
function validateAliases(paths, rootDir) {
  const allErrors = [];
  
  // Run alle validators
  allErrors.push(...validateFilesystemTargets(paths, rootDir));
  allErrors.push(...validateConflictingPaths(paths));
  allErrors.push(...validateOverlappingPatterns(paths));
  allErrors.push(...validateFallbackArrays(paths));
  allErrors.push(...validateRedundantMappings(paths));
  
  // Sorteer: errors eerst, dan warnings
  allErrors.sort((a, b) => {
    if (a.severity === 'error' && b.severity === 'warning') return -1;
    if (a.severity === 'warning' && b.severity === 'error') return 1;
    return 0;
  });
  
  return {
    isValid: allErrors.filter(e => e.severity === 'error').length === 0,
    errors: allErrors.filter(e => e.severity === 'error'),
    warnings: allErrors.filter(e => e.severity === 'warning'),
    all: allErrors
  };
}

/**
 * Format validation results voor console output
 */
function formatValidationReport(result, verbose = false) {
  const lines = [];
  
  if (result.isValid && result.warnings.length === 0) {
    lines.push('✅ Alle alias validaties geslaagd!');
    return lines;
  }
  
  if (result.errors.length > 0) {
    lines.push(`\n❌ ${result.errors.length} KRITIEKE PROBLEMEN gevonden:\n`);
    result.errors.forEach((err, idx) => {
      lines.push(`${idx + 1}. [${err.type}] ${err.message}`);
      if (verbose && err.details.fix) {
        lines.push(`   💡 Fix: ${err.details.fix}`);
      }
      if (verbose && err.details.danger) {
        lines.push(`   ⚠️  ${err.details.danger}`);
      }
    });
  }
  
  if (result.warnings.length > 0) {
    lines.push(`\n⚠️  ${result.warnings.length} waarschuwingen:\n`);
    result.warnings.forEach((warn, idx) => {
      lines.push(`${idx + 1}. [${warn.type}] ${warn.message}`);
      if (verbose && warn.details.fix) {
        lines.push(`   💡 Tip: ${warn.details.fix}`);
      }
    });
  }
  
  return lines;
}

module.exports = {
  validateAliases,
  formatValidationReport,
  ValidationError,
  // Exporteer individuele validators voor testing
  validators: {
    validateFilesystemTargets,
    validateConflictingPaths,
    validateOverlappingPatterns,
    validateFallbackArrays,
    validateRedundantMappings
  }
};