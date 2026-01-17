const chalk = require('chalk');

// Check direct of we in dry-run mode draaien
const isDryRun = process.argv.includes('--dry-run');

const logger = {
    // Properties
    isDryRun: isDryRun,

    // Methods
    info: (msg) => console.log(chalk.blue('ℹ️  ') + msg),
    ok: (msg) => console.log(chalk.green('✅ ') + msg),
    warn: (msg) => console.log(chalk.yellow('⚠️  ') + msg),
    error: (msg) => console.error(chalk.red('❌ ') + msg),
    
    // Mooie output voor key: value
    val: (key, val) => console.log(chalk.blue('📊 ') + chalk.bold(key) + ': ' + val),

    // Fatale error helper (optioneel, maar handig)
    die: (msg) => {
        console.error(chalk.bgRed.white.bold(' FATAAL ') + ' ' + chalk.red(msg));
        process.exit(1);
    },

    // Teksten (zodat je index.js niet crasht op ontbrekende keys)
    TEXT: {
        SYNC_START: '🚀 Start synchronisatie aliassen...',
        SYNC_OK: '✨ Synchronisatie succesvol voltooid.',
        DRY_RUN_COMPLETE: '🏁 Dry run voltooid (geen wijzigingen).',
        ADR_SAFETY_LIMIT: 'Beveiligingsfout: Bestand overschrijdt ADR limiet (50KB).',
        FILE_TOO_LARGE: 'Bestand is te groot',
        
        // Dynamische tekst functie
        SYNC_ALIASES_FOUND: (count) => `Gevonden aliassen in tsconfig: ${count}`,
        FINISH_TIME: (d) => `Duur: ${d}s`
    }
};

module.exports = logger;