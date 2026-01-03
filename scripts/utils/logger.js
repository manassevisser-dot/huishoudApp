#!/usr/bin/env node
const path = require('path');
const transports = require('./transports');
const generic = require('./constants/generic');
const sync = require('./constants/sync');
const audit = require('./constants/audit');

const EXIT_CODES = { SUCCESS:0, LOCK_HELD:10, CONFIG_ERROR:20, VALIDATION_ERROR:30, DEPENDENCY_ERROR:40, UNKNOWN_ERROR:99 };

// Terminal link helper (clickable in some terminals)
const terminalLink = (text, filePath) => {
  const OSC = '\u001B]8;;'; const ST = '\u001B\\';
  const url = `file://${path.resolve(filePath)}`;
  return `${OSC}${url}${ST}${text}${OSC}${ST}`;
};

const logger = {
  TEXT: { ...generic, ...sync, ...audit },
  EXIT_CODES,
  isVerbose: process.argv.includes('--verbose') || process.argv.includes('-v'),
  isDryRun:  process.argv.includes('--dry-run'),
  isQuiet:   process.argv.includes('--quiet') || !!process.env.QUIET,
  isCI:      !!process.env.CI,
  _startTime: null, _timers: new Map(),

  startTimer: (name='default') => { logger._timers.set(name, Date.now()); if (name==='default') logger._startTime = Date.now(); },
  stopTimer:  (name='default') => {
    const start = logger._timers.get(name) ?? logger._startTime;
    if (!start) { logger.warn('No timer started'); return 0; }
    const duration = ((Date.now()-start)/1000).toFixed(2);
    if (!logger.isQuiet) transports.writeStream('info', `\x1b[2m⏱️ Duur: ${duration}s\x1b[0m`);
    logger._timers.delete(name); if (name==='default') logger._startTime = null; return parseFloat(duration);
  },

  info:  (key) => { if (logger.isQuiet) return; transports.info(logger._resolveText(key)); },
  ok:    (key) => { if (logger.isQuiet) return; transports.ok(logger._resolveText(key)); },
  warn:  (key) => transports.warn(logger._resolveText(key)),
  error: (key) => transports.error(logger._resolveText(key)),

  verbose: (msg) => { if (logger.isVerbose && !logger.isQuiet) transports.writeStream('verbose', `\x1b[2m🔍 ${msg}\x1b[0m`); },
  debug:   (msg) => { if (process.env.DEBUG) transports.writeStream('debug', `\x1b[90m🐛 ${msg}\x1b[0m`); },

  report: (reportPath) => { if (logger.isQuiet) return; const link = terminalLink(reportPath, reportPath);
    const message = logger.TEXT.REPORTS_LOCATION ? logger.TEXT.REPORTS_LOCATION(link) : `📄 Zie rapporten in: ${link}`; transports.ok(message); },

  die: (msgKey, code=EXIT_CODES.UNKNOWN_ERROR) => { const msg = logger._resolveText(msgKey); const fatal = logger.TEXT.FATAL ? logger.TEXT.FATAL(msg) : msg; transports.die(fatal, code); },

  progress: (current, total, label='') => {
    if (logger.isQuiet) return;
    const percent = Math.round((current/total)*100);
    const bar = '█'.repeat(Math.floor(percent/2)) + '░'.repeat(50 - Math.floor(percent/2));
    process.stdout.write(`\r${label} [${bar}] ${percent}% (${current}/${total})`);
    if (current===total) process.stdout.write('\n');
  },

  spinner: (message) => {
    if (logger.isQuiet) return { stop: () => {} };
    const frames = ['⠋','⠙','⠹','⠸','⠼','⠴','⠦','⠧','⠇','⠏']; let i=0;
    const interval = setInterval(()=>{ process.stdout.write(`\r${frames[i]} ${message}`); i=(i+1)%frames.length; }, 80);
    return { stop: (final='') => { clearInterval(interval); process.stdout.write(`\r${final}\n`); } };
  },

  _resolveText: (key) => { const text = logger.TEXT[key]; if (!text) return key; return typeof text === 'function' ? text() : text; },
  getConfig: () => ({ verbose: logger.isVerbose, dryRun: logger.isDryRun, quiet: logger.isQuiet, ci: logger.isCI }),
};
module.exports = logger;

// CLI test mode
if (require.main === module) {
  console.log('🧪 Logger Test Mode\n'); logger.startTimer(); logger.info('AUDIT_START'); logger.ok('DEDUP_OK'); logger.warn('LOCK_STALE'); logger.error('LOCK_ACTIVE');
  const sp = logger.spinner('Processing...'); setTimeout(()=>{ sp.stop('✅ Done!'); logger.stopTimer(); }, 800);
}
