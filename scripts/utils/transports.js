const colors = {
  reset: "\x1b[0m", red: "\x1b[31m", green: "\x1b[32m",
  yellow: "\x1b[33m", dim: "\x1b[2m"
};
function writeStream(level, msg) {
  const isError = level === 'error' || level === 'fatal';
  const stream = isError ? process.stderr : process.stdout;
  stream.write(msg + '\n');
}
module.exports = {
  writeStream,
  info:  (msg) => writeStream('info',  `ℹ️  ${msg}`),
  ok:    (msg) => writeStream('ok',    `${colors.green}✅ ${msg}${colors.reset}`),
  warn:  (msg) => writeStream('warn',  `${colors.yellow}⚠️  ${msg}${colors.reset}`),
  error: (msg) => writeStream('error', `${colors.red}❌ ${msg}${colors.reset}`),
  die:   (msg, code=99) => { writeStream('fatal', colors.red + msg + colors.reset); process.exit(code); }
};
