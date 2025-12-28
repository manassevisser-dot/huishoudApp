const transports = require('./transports');
const sync = require('./constants/sync');
const audit = require('./constants/audit'); // NIEUW
const generic = require('./constants/generic');
const path = require('path');

// --- DE TERMALINK- HELPER (buiten het object voor intern gebruik) ---
const terminalLink = (text, filePath) => {
    const OSC = '\u001B]8;;';
    const ST = '\u001B\\';
    const url = `file://${path.resolve(filePath)}`;
    return `${OSC}${url}${ST}${text}${OSC}${ST}`;
};

const logger = {
    TEXT: { ...generic, ...sync, ...audit },
    
    isVerbose: process.argv.includes('--verbose') || process.argv.includes('-v'),
    isDryRun: process.argv.includes('--dry-run'),
    
    _startTime: null,
    startTimer: () => { logger._startTime = Date.now(); },
    stopTimer: () => {
        const duration = ((Date.now() - logger._startTime) / 1000).toFixed(2);
        transports.writeStream('info', "\x1b[2m⏱️  Duur: " + duration + "s\x1b[0m");
    },

    info: (key) => transports.info(logger.TEXT[key] || key),
    ok: (key) => transports.ok(logger.TEXT[key] || key),
    warn: (key) => transports.warn(logger.TEXT[key] || key),
    error: (key) => transports.error(logger.TEXT[key] || key),
    /**
     * NIEUW: Speciaal voor rapporten met klikbare link
     * Gebruikt transports.ok voor de consistente Phoenix-styling
     */
    report: (reportPath) => {
        // 1. Maak de onzichtbare klikbare link van het pad
        const link = terminalLink(reportPath, reportPath);
        
        // 2. Haal de tekst op uit je constants. 
        // Omdat REPORTS_LOCATION een functie is, geven we de 'link' mee als argument.
        const message = logger.TEXT.REPORTS_LOCATION 
            ? logger.TEXT.REPORTS_LOCATION(link) 
            : `📄 Zie rapporten in: ${link}`;

        // 3. Verstuur naar de transport (zonder extra ok-icoon, want die zit al in je string)
        transports.ok(message);
    
    },
    verbose: (msg) => { 
        if (logger.isVerbose) transports.writeStream('verbose', "\x1b[2m📣 " + msg + "\x1b[0m"); 
    },
    
    die: (msgKey) => {
        const msg = logger.TEXT[msgKey] || msgKey;
        transports.die(logger.TEXT.FATAL ? logger.TEXT.FATAL(msg) : msg);
    }
};

module.exports = logger;
