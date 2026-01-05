/* eslint-env node, browser */
const isDev = true; 
const isTest = false;

const LoggerInstance = {
  info: (m: string, d?: any) => { if (isDev && !isTest) console.log(m, d ?? ''); },
  error: (m: string, e?: any) => { if (!isTest) console.error(m, e ?? ''); },
  warn: (m: string, d?: any) => { if (isDev && !isTest) console.warn(m, d); },
  // Fix: Maak msg optioneel of geef het een default waarde
  log: (level: string, msg: string = "", ...args: any[]) => {
    if (isDev && !isTest) console.log(`[AUDIT-${level}]`, msg, ...args);
  },
};

export const logger = LoggerInstance;
export const Logger = LoggerInstance;
export const AuditLogger = LoggerInstance;
export default LoggerInstance;