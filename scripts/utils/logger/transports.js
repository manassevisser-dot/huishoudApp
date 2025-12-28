const colors = require('./colors');
function writeStream(level, msg) {
    const isError = level === 'error' || level === 'fatal';
    const stream = isError ? process.stderr : process.stdout;
    stream.write(msg + '\n');
}
module.exports = {
    writeStream,
    info: (msg) => writeStream('info', "ℹ️ " + msg),
    ok: (msg) => writeStream('ok', colors.green + "✅ " + msg + colors.reset),
    warn: (msg) => writeStream('warn', colors.yellow + "⚠️ " + msg + colors.reset),
    error: (msg) => writeStream('error', colors.red + "❌ " + msg + colors.reset),
    die: (msg) => {
        writeStream('fatal', colors.red + msg + colors.reset);
        process.exit(1);
    }
};
