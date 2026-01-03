module.exports = {
  FATAL: (msg) => `\n🚨 FATALE FOUT: ${msg}`,
  HELP:  `\n📋 Phoenix Commander\nGebruik --dry-run voor simulatie.\n`,
  FINISH: "Phoenix operatie voltooid.",
  REPORTS_LOCATION: (p) => `📄 Zie rapporten in: ${p}`,
  FINISH_TIME: (s) => `⏱️ Duur: ${s}s`,
  KEYS_INDEX_NAME: "🔑 PHOENIX CONSTANTS INDEX",
  KEYS_INDEX_GEN: (d) => `Gegenereerd op: ${d}`,
  FILE_TOO_LARGE: "Kritiek: bestand is abnormaal groot",
};
