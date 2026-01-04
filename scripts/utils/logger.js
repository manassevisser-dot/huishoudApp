const chalk = require('chalk');

const logger = {
    info: (msg) => console.log(chalk.blue('ℹ️  ') + msg),
    ok: (msg) => console.log(chalk.green('✅ ') + msg),
    warn: (msg) => console.log(chalk.yellow('⚠️  ') + msg),
    error: (msg) => console.error(chalk.red('❌ ') + msg),
    val: (key, val) => console.log(chalk.blue('📊 ') + chalk.bold(key) + ': ' + val),
    TEXT: {
        FINISH_TIME: (d) => `Duur: ${d}s`
    }
};

module.exports = logger;
